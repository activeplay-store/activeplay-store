const config = require('../../config');

const LOCALE_MAP = {
  TR: 'tr-TR',
  UA: 'uk-UA',
  IN: 'en-IN'
};

function isConfigured() {
  return !!(config.parsers.sony.hashes.categoryGridRetrieve &&
            config.parsers.sony.hashes.productRetrieveForCtasWithPrice);
}

/**
 * Выполнить GraphQL-запрос к Sony
 */
async function sonyGraphQL(operationName, variables, regionCode) {
  const locale = LOCALE_MAP[regionCode] || 'tr-TR';
  const hash = config.parsers.sony.hashes[operationName];

  if (!hash) {
    console.log(`[Sony] ⚠️ Нет sha256 хеша для операции: ${operationName}`);
    return null;
  }

  const params = new URLSearchParams({
    operationName,
    variables: JSON.stringify(variables),
    extensions: JSON.stringify({
      persistedQuery: { version: 1, sha256Hash: hash }
    })
  });

  const url = `${config.parsers.sony.endpoint}?${params}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': config.parsers.userAgent,
      'Content-Type': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'x-psn-store-locale-override': locale,
      'x-apollo-operation-name': operationName
    },
    signal: AbortSignal.timeout(config.parsers.requestTimeout)
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 403) {
      console.log('[Sony] ⚠️ 403 Forbidden — возможно обновились sha256 хеши');
    } else if (status === 400) {
      console.log('[Sony] ⚠️ 400 Bad Request — проверить хеши и заголовки');
    } else {
      console.log(`[Sony] ⚠️ HTTP ${status}`);
    }
    return null;
  }

  const data = await response.json();

  if (data.errors) {
    console.log(`[Sony] ⚠️ GraphQL ошибка: ${data.errors[0]?.message}`);
    return null;
  }

  return data;
}

/**
 * Получить список игр из категории с пагинацией
 */
async function fetchCategory(regionCode, categoryId, maxPages = 10) {
  const allProducts = [];
  let offset = 0;
  const size = config.parsers.sony.pageSize || 24;

  for (let page = 0; page < maxPages; page++) {
    console.log(`[Sony] ${regionCode} категория стр.${page + 1} (offset=${offset})...`);

    const data = await sonyGraphQL('categoryGridRetrieve', {
      id: categoryId,
      pageArgs: { size, offset },
      sortBy: null,
      filterBy: [],
      facetOptions: []
    }, regionCode);

    if (!data?.data?.categoryGridRetrieve?.products) break;

    const products = data.data.categoryGridRetrieve.products;
    if (products.length === 0) break;

    allProducts.push(...products);

    const totalCount = data.data.categoryGridRetrieve.totalCount;
    offset += size;
    if (offset >= totalCount) break;

    await sleep(config.parsers.politenessDelay);
  }

  return allProducts;
}

/**
 * Преобразовать продукт Sony в формат ParsedGame
 */
function sonyProductToGame(product, regionCode) {
  const price = product.price || {};

  const basePrice = parsePrice(price.basePrice);
  const salePrice = price.discountedPrice ? parsePrice(price.discountedPrice) : null;
  const discountPct = price.discountText
    ? parseInt(price.discountText.replace(/[^0-9]/g, ''))
    : 0;

  const editionName = detectEditionName(product.name);
  const coverUrl = findCover(product.media || product.personalizedMeta?.media || []);
  const slug = slugify(product.name);

  return {
    id: slug,
    name: cleanName(product.name),
    conceptId: product.id,
    prices: {
      [regionCode]: {
        editions: [{
          name: editionName,
          basePrice,
          salePrice,
          plusPrice: null,
          discountPct,
          saleEndDate: null,
          clientPrice: null,
          clientSalePrice: null
        }]
      }
    },
    coverUrl,
    platform: (product.platforms || []).join(' & ') || 'PS5',
    releaseDate: null,
    status: 'released',
    metacritic: null,
    sources: {
      sony: {
        price: salePrice || basePrice,
        fetchedAt: new Date().toISOString()
      }
    },
    discrepancy: false,
    discrepancyDetails: null,
    firstSeen: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChangedAt: null
  };
}

/**
 * Получить цену конкретной игры по productId
 */
async function fetchGamePrice(regionCode, productId) {
  const data = await sonyGraphQL('productRetrieveForCtasWithPrice', {
    productId
  }, regionCode);

  if (!data?.data?.productRetrieve) return null;

  const product = data.data.productRetrieve;
  const cta = product.webctas?.[0];
  if (!cta?.price) return null;

  const price = cta.price;
  const basePrice = price.basePriceValue ? Math.round(price.basePriceValue / 100) : parsePrice(price.basePrice);
  const salePrice = price.discountedValue ? Math.round(price.discountedValue / 100) : null;
  const discountPct = price.discountText ? parseInt(price.discountText.replace(/[^0-9]/g, '')) : 0;
  const saleEndDate = price.endTime ? new Date(parseInt(price.endTime)).toISOString() : null;

  const editionName = detectEditionName(product.name || product.invariantName);
  const coverUrl = findCover(product.media || []);
  const slug = slugify(product.invariantName || product.name);

  return {
    id: slug,
    name: cleanName(product.invariantName || product.name),
    conceptId: product.id,
    prices: {
      [regionCode]: {
        editions: [{
          name: editionName,
          basePrice,
          salePrice,
          plusPrice: null,
          discountPct,
          saleEndDate,
          clientPrice: null,
          clientSalePrice: null
        }]
      }
    },
    coverUrl,
    platform: 'PS5',
    releaseDate: null,
    status: 'released',
    metacritic: null,
    sources: {
      sony: {
        price: salePrice || basePrice,
        fetchedAt: new Date().toISOString()
      }
    },
    discrepancy: false,
    discrepancyDetails: null,
    firstSeen: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChangedAt: null
  };
}

/**
 * Парсить скидки (deals) для региона
 */
async function fetchDeals(regionCode) {
  const categoryId = config.parsers.sony.categories?.deals?.[regionCode];
  if (!categoryId) {
    console.log(`[Sony] ⚠️ Нет ID категории deals для ${regionCode}`);
    return [];
  }

  const products = await fetchCategory(regionCode, categoryId);
  return products.map(p => sonyProductToGame(p, regionCode));
}

/**
 * Парсить предзаказы для региона
 */
async function fetchPreorders(regionCode) {
  const categoryId = config.parsers.sony.categories?.preorders?.[regionCode];
  if (!categoryId) {
    console.log(`[Sony] ⚠️ Нет ID категории preorders для ${regionCode}`);
    return [];
  }

  const products = await fetchCategory(regionCode, categoryId);
  return products.map(p => {
    const game = sonyProductToGame(p, regionCode);
    game.status = 'preorder';
    return game;
  });
}

// === УТИЛИТЫ ===

function parsePrice(priceStr) {
  if (!priceStr) return null;
  // "3.849,00 TL" → 3849, "524,75 TL" → 525
  const cleaned = priceStr
    .replace(/[A-Za-z₺\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const value = parseFloat(cleaned);
  return isNaN(value) ? null : Math.round(value);
}

function detectEditionName(name) {
  if (!name) return 'Standard';
  const lower = name.toLowerCase();
  if (lower.includes('digital deluxe')) return 'Digital Deluxe';
  if (lower.includes('deluxe')) return 'Deluxe';
  if (lower.includes('ultimate')) return 'Ultimate';
  if (lower.includes('gold')) return 'Gold';
  if (lower.includes('premium')) return 'Premium';
  if (lower.includes('collector')) return 'Collector';
  return 'Standard';
}

function cleanName(name) {
  if (!name) return '';
  return name
    .replace(/\s*(Digital\s+)?Deluxe\s*(Edition|Sürüm|Видання)?/gi, '')
    .replace(/\s*Ultimate\s*Edition/gi, '')
    .replace(/\s*Gold\s*Edition/gi, '')
    .replace(/\s*Premium\s*Edition/gi, '')
    .replace(/\s*Standard\s*Edition/gi, '')
    .replace(/™/g, '')
    .replace(/®/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(name) {
  if (!name) return 'unknown';
  return name
    .toLowerCase()
    .replace(/™|®/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function findCover(media) {
  if (!media || !media.length) return null;
  const priority = ['GAMEHUB_COVER_ART', 'PORTRAIT_BANNER', 'MASTER', 'EDITION_KEY_ART'];
  for (const role of priority) {
    const found = media.find(m => m.role === role && m.type === 'IMAGE');
    if (found) return found.url;
  }
  const any = media.find(m => m.type === 'IMAGE');
  return any?.url || null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === ЭКСПОРТ ===

module.exports = {
  fetchDeals,
  fetchPreorders,
  fetchGamePrice,
  fetchCategory,
  isConfigured,
  name: 'sony'
};
