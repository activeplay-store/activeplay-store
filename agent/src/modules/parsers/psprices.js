const cheerio = require('cheerio');
const config = require('../../config');

/**
 * Загрузить HTML-страницу с retry при 429/503
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
        console.log(`[Парсер] PSPrices 429 — ждём 30с (попытка ${attempt + 1})`);
        await sleep(30000);
        continue;
      }
      if (response.status === 503) {
        console.log(`[Парсер] PSPrices 503 — ждём 10с (попытка ${attempt + 1})`);
        await sleep(10000);
        continue;
      }
      if (response.status === 403) {
        console.log('[Парсер] ⚠️ PSPrices 403 — возможно IP заблокирован');
        return null;
      }
      if (!response.ok) {
        console.log(`[Парсер] PSPrices HTTP ${response.status} для ${url}`);
        return null;
      }

      return await response.text();
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`[Парсер] PSPrices таймаут: ${url} (попытка ${attempt + 1})`);
      } else {
        console.log(`[Парсер] PSPrices ошибка: ${err.message} (попытка ${attempt + 1})`);
      }
    }
  }
  return null;
}

/**
 * Парсить турецкую цену из текста: "2.999" → 2999, "593,10" → 593.10, "28,75" → 28.75
 */
function parsePrice(text) {
  if (!text) return null;
  // Убрать символ валюты и пробелы
  let cleaned = text.replace(/[₺$€\s]/g, '').trim();
  if (!cleaned) return null;

  // Турецкий формат: точка — разделитель тысяч, запятая — десятичный
  // "2.999" → "2999", "1.079" → "1079", "593,10" → "593.10"
  if (cleaned.includes(',')) {
    // Есть десятичная часть
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // Нет десятичной — точка = разделитель тысяч
    cleaned = cleaned.replace(/\./g, '');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Извлечь slug из URL: "/region-tr/game/2355379/screamer" → "screamer"
 */
function extractSlug(href) {
  if (!href) return null;
  const match = href.match(/\/game\/\d+\/(.+?)(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Извлечь game ID из URL: "/region-tr/game/2355379/screamer" → "2355379"
 */
function extractGameId(href) {
  if (!href) return null;
  const match = href.match(/\/game\/(\d+)\//);
  return match ? match[1] : null;
}

/**
 * Парсить один game-fragment блок в ParsedGame
 */
function parseGameCard($, card, regionCode) {
  try {
    const $card = $(card);

    // Ссылка и slug
    const $link = $card.find('a[href*="/game/"]').first();
    const href = $link.attr('href');
    if (!href) return null;

    const slug = extractSlug(href);
    const gameId = extractGameId(href);
    if (!slug) return null;

    // Название — h3, убрать вложенный img (флаг)
    const $title = $card.find('h3').first();
    const name = $title.clone().children('img').remove().end().text().trim();
    if (!name) return null;

    // Обложка
    const $cover = $card.find('img.relative.z-10[src*="playstation.com"], img.relative.z-10[src*="s-microsoft.com"]').first();
    let coverUrl = $cover.attr('src') || null;
    if (coverUrl && coverUrl.startsWith('//')) coverUrl = 'https:' + coverUrl;

    // Платформа
    const $platformImg = $card.find('.card-wrapper span:first-child img[alt]').first();
    const platform = $platformImg.attr('alt') || 'PS5';
    const platformShort = platform.includes('5') ? 'PS5' : platform.includes('4') ? 'PS4' : platform;

    // Скидка (−80%)
    let discountPct = 0;
    const $discountBadge = $card.find('span.bg-red-700, span.bg-red-600').first();
    if ($discountBadge.length) {
      const discountText = $discountBadge.text().trim();
      const discountMatch = discountText.match(/[−-](\d+)%/);
      if (discountMatch) discountPct = parseInt(discountMatch[1]);
    }

    // Цены
    // Основная цена: span.text-xl.font-bold span.font-bold
    const $priceContainer = $card.find('.flex.gap-1\\.5.items-baseline');
    const $mainPrice = $priceContainer.find('span.text-xl.font-bold span.font-bold').first();
    const baseOrSalePrice = parsePrice($mainPrice.text());

    // Старая цена (зачёркнутая)
    const $oldPrice = $priceContainer.find('.old-price-strike').first();
    const oldPriceVal = parsePrice($oldPrice.text());

    // PS+ / Game Pass цена
    const $plusPrice = $priceContainer.find('span.text-premium-600, span.text-premium, span.text-green-700, span.text-green-400').first();
    let plusPrice = null;
    if ($plusPrice.length) {
      const plusText = $plusPrice.clone().children('span').remove().end().text().trim();
      plusPrice = parsePrice(plusText);
    }

    // Определить basePrice и salePrice
    let basePrice, salePrice;
    if (oldPriceVal && baseOrSalePrice) {
      // Есть зачёркнутая цена — значит текущая = скидочная
      basePrice = oldPriceVal;
      salePrice = baseOrSalePrice;
    } else {
      basePrice = baseOrSalePrice;
      salePrice = null;
    }

    if (!basePrice) return null;

    // Дата окончания скидки (until ...)
    let saleEndDate = null;
    const $schedule = $priceContainer.find('span.material-symbols-outlined').filter(function() {
      return $(this).text().trim() === 'schedule';
    });
    if ($schedule.length) {
      const dateText = $schedule.parent().text().replace('schedule', '').trim();
      const untilMatch = dateText.match(/until\s+(.+)/i);
      if (untilMatch) {
        const dateStr = untilMatch[1].trim();
        // Try parsing "03/26/2026" format
        const dateMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (dateMatch) {
          saleEndDate = `${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2]}T23:59:59Z`;
        }
      }
    }

    // Дата выхода (calendar_month)
    let releaseDate = null;
    const $calendar = $card.find('span.material-symbols-outlined').filter(function() {
      return $(this).text().trim() === 'calendar_month';
    });
    if ($calendar.length) {
      const relText = $calendar.parent().text().replace('calendar_month', '').trim();
      // "26 Mar · 1d 19h" → parse "26 Mar"
      const relMatch = relText.match(/(\d{1,2})\s+(\w{3})/);
      if (relMatch) {
        const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                         Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
        const m = months[relMatch[2]];
        if (m) {
          const year = new Date().getFullYear();
          releaseDate = `${year}-${m}-${relMatch[1].padStart(2, '0')}`;
        }
      }
    }

    return {
      id: slug,
      name,
      conceptId: null,
      prices: {
        [regionCode]: {
          editions: [{
            name: 'Standard',
            basePrice,
            salePrice,
            plusPrice,
            discountPct,
            saleEndDate,
            clientPrice: null,
            clientSalePrice: null
          }]
        }
      },
      coverUrl,
      platform: platformShort,
      releaseDate,
      status: 'released',
      metacritic: null,
      sources: {
        psprices: { price: basePrice, fetchedAt: new Date().toISOString() },
        psdeals: null,
        sony: null
      },
      discrepancy: false,
      discrepancyDetails: null,
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      priceChangedAt: null
    };
  } catch (err) {
    console.log(`[Парсер] PSPrices: ошибка парсинга карточки: ${err.message}`);
    return null;
  }
}

/**
 * Парсить коллекцию (deals, upcoming-releases) с пагинацией
 */
async function parseCollection(regionCode, collectionType) {
  const region = config.parsers.regions[regionCode];
  if (!region) return [];

  const games = [];
  const maxPages = 10;

  for (let page = 1; page <= maxPages; page++) {
    const url = `https://psprices.com/${region.psprices}/collection/${collectionType}?page=${page}`;
    console.log(`[Парсер] PSPrices ${regionCode} ${collectionType} стр.${page}...`);

    const html = await fetchPage(url);
    if (!html) break;

    const $ = cheerio.load(html);
    const cards = $('.game-fragment');

    if (cards.length === 0) {
      console.log(`[Парсер] PSPrices: 0 карточек на стр.${page}, стоп`);
      break;
    }

    cards.each((_, card) => {
      const game = parseGameCard($, card, regionCode);
      if (game) games.push(game);
    });

    console.log(`[Парсер] PSPrices стр.${page}: ${cards.length} карточек, ${games.length} игр`);

    // Проверить есть ли следующая страница
    const hasNext = $('link[rel="next"]').length > 0 ||
                    $(`a[href*="page=${page + 1}"]`).length > 0;
    if (!hasNext) break;

    // Вежливая пауза
    await sleep(config.parsers.politenessDelay);
  }

  return games;
}

/**
 * Парсить страницу конкретной игры
 */
async function parseGamePage(regionCode, gameSlug) {
  const region = config.parsers.regions[regionCode];
  if (!region) return null;

  // gameSlug может быть числовым ID или полным path "12345/slug-name"
  const url = `https://psprices.com/${region.psprices}/game/${gameSlug}`;
  const html = await fetchPage(url);
  if (!html) return null;

  const $ = cheerio.load(html);
  const cards = $('.game-fragment');
  if (cards.length > 0) {
    return parseGameCard($, cards.first(), regionCode);
  }

  return null;
}

/**
 * Парсить предзаказы для региона
 */
async function fetchPreorders(regionCode) {
  const games = await parseCollection(regionCode, 'upcoming-releases');
  for (const game of games) {
    game.status = 'preorder';
  }
  return games;
}

/**
 * Парсить скидки для региона
 */
async function fetchDeals(regionCode) {
  return await parseCollection(regionCode, 'deals-with-subscription');
}

/**
 * Получить цену конкретной игры
 */
async function fetchGamePrice(regionCode, gameSlug) {
  return await parseGamePage(regionCode, gameSlug);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  fetchPreorders,
  fetchDeals,
  fetchGamePrice,
  name: 'psprices'
};
