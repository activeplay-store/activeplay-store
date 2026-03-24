const cheerio = require('cheerio');
const config = require('../../config');

/**
 * Загрузить HTML-страницу
 */
async function fetchPage(url) {
  for (let attempt = 0; attempt <= config.parsers.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': config.parsers.userAgent,
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        console.log(`[Парсер] PSDeals 429 — ждём 30с (попытка ${attempt + 1})`);
        await sleep(30000);
        continue;
      }
      if (response.status === 503) {
        console.log(`[Парсер] PSDeals 503 — ждём 10с (попытка ${attempt + 1})`);
        await sleep(10000);
        continue;
      }
      if (response.status === 403) {
        console.log('[Парсер] ⚠️ PSDeals 403 — возможно IP заблокирован');
        return null;
      }
      if (!response.ok) {
        console.log(`[Парсер] PSDeals HTTP ${response.status} для ${url}`);
        return null;
      }

      return await response.text();
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`[Парсер] PSDeals таймаут: ${url} (попытка ${attempt + 1})`);
      } else {
        console.log(`[Парсер] PSDeals ошибка: ${err.message} (попытка ${attempt + 1})`);
      }
    }
  }
  return null;
}

/**
 * Парсить цену из текста
 */
function parsePrice(text) {
  if (!text) return null;
  let cleaned = text.replace(/[₺$€\s]/g, '').trim();
  if (!cleaned) return null;

  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(/\./g, '');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Парсить карточку игры PSDeals
 * PSDeals возвращает 403 при curl — парсер может не работать без браузера
 * Структура: .game-collection-item или подобное (нужна реальная разведка)
 */
function parseGameCard($, card, regionCode) {
  try {
    const $card = $(card);

    // Ссылка
    const $link = $card.find('a[href*="/gamecard/"]').first();
    if (!$link.length) return null;
    const href = $link.attr('href') || '';

    // Slug из URL: /store/turkey/gamecard/game-slug
    const slugMatch = href.match(/\/gamecard\/(.+?)(?:\?|$)/);
    const slug = slugMatch ? slugMatch[1] : null;
    if (!slug) return null;

    // Название
    const name = $card.find('.game-collection-item-title, h3, .title').first().text().trim();
    if (!name) return null;

    // Цены
    const $prices = $card.find('.game-collection-item-price, .price');
    const priceText = $prices.first().text().trim();
    const basePrice = parsePrice(priceText);

    // Скидочная цена
    const $oldPrice = $card.find('.old-price, .original-price, del, s').first();
    const oldPriceVal = parsePrice($oldPrice.text());

    let finalBase = basePrice;
    let salePrice = null;
    if (oldPriceVal && basePrice && oldPriceVal > basePrice) {
      finalBase = oldPriceVal;
      salePrice = basePrice;
    }

    // Обложка
    const coverUrl = $card.find('img[src*="playstation.com"]').attr('src') ||
                     $card.find('img[data-src*="playstation.com"]').attr('data-src') || null;

    // Скидка
    let discountPct = 0;
    const discountText = $card.find('.discount, .badge').first().text().trim();
    const discountMatch = discountText.match(/(\d+)%/);
    if (discountMatch) discountPct = parseInt(discountMatch[1]);

    if (!finalBase) return null;

    return {
      id: slug,
      name,
      conceptId: null,
      prices: {
        [regionCode]: {
          editions: [{
            name: 'Standard',
            basePrice: finalBase,
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
      platform: 'PS5',
      releaseDate: null,
      status: 'released',
      metacritic: null,
      sources: {
        psprices: null,
        psdeals: { price: finalBase, fetchedAt: new Date().toISOString() },
        sony: null
      },
      discrepancy: false,
      discrepancyDetails: null,
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      priceChangedAt: null
    };
  } catch (err) {
    console.log(`[Парсер] PSDeals: ошибка парсинга карточки: ${err.message}`);
    return null;
  }
}

/**
 * Парсить скидки для региона
 */
async function fetchDeals(regionCode) {
  const region = config.parsers.regions[regionCode];
  if (!region) return [];

  const url = `https://psdeals.net/${region.psdeals}?sort=discount`;
  const html = await fetchPage(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const games = [];

  // Пробуем разные селекторы — структура PSDeals может отличаться
  const selectors = ['.game-collection-item', '.game-card', '[data-game-id]', '.product-card'];
  let cards = $([]);
  for (const sel of selectors) {
    cards = $(sel);
    if (cards.length > 0) break;
  }

  if (cards.length === 0) {
    console.log('[Парсер] ❌ PSDeals: не найден селектор карточек');
    return [];
  }

  cards.each((_, card) => {
    const game = parseGameCard($, card, regionCode);
    if (game) games.push(game);
  });

  return games;
}

/**
 * Получить цену конкретной игры
 */
async function fetchGamePrice(regionCode, gameSlug) {
  const region = config.parsers.regions[regionCode];
  if (!region) return null;

  const url = `https://psdeals.net/${region.psdeals}/gamecard/${gameSlug}`;
  const html = await fetchPage(url);
  if (!html) return null;

  const $ = cheerio.load(html);

  // Название
  const name = $('h1').first().text().trim();
  if (!name) return null;

  // Цена — ищем основной элемент с ценой
  const priceText = $('.game-buy .price, .current-price, .sale-price').first().text().trim();
  const basePrice = parsePrice(priceText);
  if (!basePrice) return null;

  return {
    id: gameSlug,
    name,
    conceptId: null,
    prices: {
      [regionCode]: {
        editions: [{
          name: 'Standard',
          basePrice,
          salePrice: null,
          plusPrice: null,
          discountPct: 0,
          saleEndDate: null,
          clientPrice: null,
          clientSalePrice: null
        }]
      }
    },
    coverUrl: null,
    platform: 'PS5',
    releaseDate: null,
    status: 'released',
    metacritic: null,
    sources: {
      psprices: null,
      psdeals: { price: basePrice, fetchedAt: new Date().toISOString() },
      sony: null
    },
    discrepancy: false,
    discrepancyDetails: null,
    firstSeen: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChangedAt: null
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchDeals,
  fetchGamePrice,
  name: 'psdeals'
};
