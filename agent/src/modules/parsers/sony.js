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

// =====================
// ГРУППИРОВКА ПО ИГРЕ
// =====================

/**
 * Группировать листинги из categoryGrid по очищенному названию игры
 */
function groupByGame(rawProducts, regionCode) {
  const gameMap = new Map();

  for (const product of rawProducts) {
    const gameName = cleanName(product.name);
    const editionName = detectEditionName(product.name);
    const price = product.price || {};

    const basePrice = parsePrice(price.basePrice);
    const salePrice = price.discountedPrice ? parsePrice(price.discountedPrice) : null;
    const discountPct = price.discountText
      ? parseInt(price.discountText.replace(/[^0-9]/g, ''))
      : 0;

    const editionData = {
      name: editionName,
      productId: product.id,
      basePrice,
      salePrice,
      plusPrice: null,
      discountPct,
      saleEndDate: null,
      clientPrice: null,
      clientSalePrice: null,
      clientPlusPrice: null
    };

    if (gameMap.has(gameName)) {
      const existing = gameMap.get(gameName);
      const exists = existing.prices[regionCode].editions.find(e => e.name === editionName);
      if (!exists) {
        existing.prices[regionCode].editions.push(editionData);
      }
    } else {
      const coverUrl = findCover(product.media || product.personalizedMeta?.media || []);
      const slug = slugify(gameName);

      gameMap.set(gameName, {
        id: slug,
        name: gameName,
        conceptId: product.concept?.id || null,
        prices: {
          [regionCode]: {
            editions: [editionData]
          }
        },
        coverUrl,
        platform: (product.platforms || []).join(' & ') || 'PS5',
        releaseDate: null,
        status: 'released',
        metacritic: null,
        sources: {
          sony: { price: salePrice || basePrice, fetchedAt: new Date().toISOString() }
        },
        discrepancy: false,
        discrepancyDetails: null,
        bestPrice: null,
        firstSeen: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        priceChangedAt: null
      });
    }
  }

  return Array.from(gameMap.values());
}

// =====================
// ОБОГАЩЕНИЕ ДАННЫМИ (ПРОХОД 2)
// =====================

/**
 * Обогатить издание данными из productRetrieveForCtasWithPrice
 */
function enrichEditionWithDetails(edition, webctas) {
  for (const cta of webctas) {
    if (!cta.price) continue;

    const price = cta.price;
    const isPsPlus = (price.serviceBranding || []).includes('PS_PLUS');

    if (isPsPlus) {
      const plusValue = price.discountedValue
        ? Math.round(price.discountedValue / 100)
        : parsePrice(price.discountedPrice);
      edition.plusPrice = plusValue;
    } else {
      if (price.basePriceValue) {
        edition.basePrice = Math.round(price.basePriceValue / 100);
      }
      if (price.discountedValue) {
        edition.salePrice = Math.round(price.discountedValue / 100);
      }
      if (price.discountText) {
        edition.discountPct = parseInt(price.discountText.replace(/[^0-9]/g, '')) || 0;
      }
      if (price.endTime) {
        edition.saleEndDate = new Date(parseInt(price.endTime)).toISOString();
      }
    }
  }
}

/**
 * Вычислить лучшую (минимальную) цену по всем изданиям
 */
function calculateBestPrice(game, regionCode) {
  const editions = game.prices[regionCode]?.editions || [];
  if (editions.length === 0) return null;

  let best = null;

  for (const edition of editions) {
    const candidates = [
      { amount: edition.plusPrice, type: 'ps_plus' },
      { amount: edition.salePrice, type: 'sale' },
      { amount: edition.basePrice, type: 'regular' }
    ].filter(c => c.amount && c.amount > 0);

    for (const candidate of candidates) {
      if (!best || candidate.amount < best.amount) {
        best = {
          amount: candidate.amount,
          clientPrice: null,
          editionName: edition.name,
          type: candidate.type,
          discountPct: edition.discountPct,
          basePrice: edition.basePrice,
          endDate: edition.saleEndDate
        };
      }
    }
  }

  return best;
}

// =====================
// ОСНОВНЫЕ ФУНКЦИИ
// =====================

/**
 * Парсить скидки (deals) для региона — двухпроходный
 */
async function fetchDeals(regionCode) {
  const categoryId = config.parsers.sony.categories?.deals?.[regionCode];
  if (!categoryId) {
    console.log(`[Sony] ⚠️ Нет ID категории deals для ${regionCode}`);
    return [];
  }

  // ПРОХОД 1: массовый сбор из categoryGrid
  console.log(`[Sony] Проход 1: массовый сбор ${regionCode}...`);
  const rawProducts = await fetchCategory(regionCode, categoryId);
  console.log(`[Sony] Проход 1: ${rawProducts.length} листингов`);

  // Группировка по игре
  const grouped = groupByGame(rawProducts, regionCode);
  console.log(`[Sony] Уникальных игр: ${grouped.length}`);

  // ПРОХОД 2: дозапрос деталей для PS Plus цен
  console.log(`[Sony] Проход 2: дозапрос PS Plus цен...`);
  let enriched = 0;
  for (const game of grouped) {
    for (const edition of game.prices[regionCode].editions) {
      if (!edition.productId) continue;

      try {
        await sleep(1000);
        const details = await sonyGraphQL('productRetrieveForCtasWithPrice', {
          productId: edition.productId
        }, regionCode);

        if (details?.data?.productRetrieve?.webctas) {
          enrichEditionWithDetails(edition, details.data.productRetrieve.webctas);
          enriched++;
        }
      } catch (err) {
        console.log(`[Sony] ⚠️ Дозапрос ${edition.productId}: ${err.message}`);
      }
    }

    game.bestPrice = calculateBestPrice(game, regionCode);
  }

  console.log(`[Sony] Проход 2: обогащено ${enriched} изданий`);
  return grouped;
}

/**
 * Парсить предзаказы для региона — двухпроходный
 */
async function fetchPreorders(regionCode) {
  const categoryId = config.parsers.sony.categories?.preorders?.[regionCode];
  if (!categoryId) {
    console.log(`[Sony] ⚠️ Нет ID категории preorders для ${regionCode}`);
    return [];
  }

  console.log(`[Sony] Проход 1: предзаказы ${regionCode}...`);
  const rawProducts = await fetchCategory(regionCode, categoryId);
  console.log(`[Sony] Проход 1: ${rawProducts.length} листингов`);

  const grouped = groupByGame(rawProducts, regionCode);
  console.log(`[Sony] Уникальных предзаказов: ${grouped.length}`);

  // Проход 2 для предзаказов тоже — могут быть PS Plus скидки
  console.log(`[Sony] Проход 2: дозапрос деталей предзаказов...`);
  let enriched = 0;
  for (const game of grouped) {
    game.status = 'preorder';
    for (const edition of game.prices[regionCode].editions) {
      if (!edition.productId) continue;

      try {
        await sleep(1000);
        const details = await sonyGraphQL('productRetrieveForCtasWithPrice', {
          productId: edition.productId
        }, regionCode);

        if (details?.data?.productRetrieve?.webctas) {
          enrichEditionWithDetails(edition, details.data.productRetrieve.webctas);
          enriched++;
        }
      } catch (err) {
        console.log(`[Sony] ⚠️ Дозапрос ${edition.productId}: ${err.message}`);
      }
    }

    game.bestPrice = calculateBestPrice(game, regionCode);
  }

  console.log(`[Sony] Проход 2: обогащено ${enriched} изданий`);
  return grouped;
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
  const webctas = product.webctas || [];
  if (webctas.length === 0) return null;

  const editionName = detectEditionName(product.name || product.invariantName);
  const coverUrl = findCover(product.media || []);
  const slug = slugify(product.invariantName || product.name);

  const edition = {
    name: editionName,
    productId: product.id,
    basePrice: null,
    salePrice: null,
    plusPrice: null,
    discountPct: 0,
    saleEndDate: null,
    clientPrice: null,
    clientSalePrice: null,
    clientPlusPrice: null
  };

  enrichEditionWithDetails(edition, webctas);

  const game = {
    id: slug,
    name: cleanName(product.invariantName || product.name),
    conceptId: product.id,
    prices: {
      [regionCode]: {
        editions: [edition]
      }
    },
    coverUrl,
    platform: 'PS5',
    releaseDate: null,
    status: 'released',
    metacritic: null,
    sources: {
      sony: {
        price: edition.salePrice || edition.basePrice,
        fetchedAt: new Date().toISOString()
      }
    },
    discrepancy: false,
    discrepancyDetails: null,
    bestPrice: null,
    firstSeen: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChangedAt: null
  };

  game.bestPrice = calculateBestPrice(game, regionCode);
  return game;
}

// === УТИЛИТЫ ===

function parsePrice(priceStr) {
  if (!priceStr) return null;
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
  if (lower.includes('toty')) return 'TOTY';
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
    .replace(/\s*TOTY\s*Edition/gi, '')
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
