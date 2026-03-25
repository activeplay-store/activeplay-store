const fs = require('fs');
const path = require('path');
const config = require('../../config');

const PREFIX = '[PlatPrices]';
const PP_CONFIG = config.platprices || {};
const API_KEY = PP_CONFIG.apiKey || config.parsers.platprices?.apiKey || '';
const BASE_URL = PP_CONFIG.baseUrl || config.parsers.platprices?.endpoint || 'https://platprices.com/api.php';
const MAX_PER_HOUR = PP_CONFIG.maxPerHour || 480;
const DELAY_MS = PP_CONFIG.delayMs || 800;

// ── Helpers ─────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadGames() {
  try {
    const raw = fs.readFileSync(config.parsers.gamesFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { updatedAt: null, games: [] };
  }
}

function saveGames(data) {
  const dir = path.dirname(config.parsers.gamesFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(config.parsers.gamesFile, JSON.stringify(data, null, 2), 'utf8');
}

// ── API ─────────────────────────────────────────────────────────────────

async function fetchGameInfo(psnid) {
  if (!API_KEY) {
    console.log(`${PREFIX} API ключ не настроен`);
    return null;
  }

  const url = `${BASE_URL}?key=${API_KEY}&psnid=${encodeURIComponent(psnid)}&region=US`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout || 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`${PREFIX} HTTP ${response.status} для ${psnid}`);
      return null;
    }

    const data = await response.json();

    if (data.error !== 0 && data.error !== undefined) {
      return null;
    }

    // Accept if we got at least a name or cover
    if (!data.GameName && !data.CoverArt && !data.Img) {
      return null;
    }

    return {
      gameName: data.GameName || '',
      productName: data.ProductName || '',
      coverArt: data.CoverArt || '',
      img: data.Img || '',
      screenshot1: data.Screenshot1 || '',
      screenshot2: data.Screenshot2 || '',
      screenshot3: data.Screenshot3 || '',
      ppid: String(data.PPID || ''),
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.log(`${PREFIX} Ошибка ${psnid}: ${err.message}`);
    return null;
  }
}

// ── Batch enrichment ────────────────────────────────────────────────────

async function enrichAll() {
  if (!API_KEY) {
    console.log(`${PREFIX} API ключ не настроен — пропуск`);
    return { processed: 0, found: 0, errors: 0, complete: false };
  }

  const data = loadGames();
  const games = data.games || [];

  if (games.length === 0) {
    console.log(`${PREFIX} games.json пуст`);
    return { processed: 0, found: 0, errors: 0, complete: false };
  }

  // Only games without platprices data (or with error that we might retry)
  const needEnrich = games.filter(g => !g.platprices || (!g.platprices.coverArt && !g.platprices.error));

  console.log(`${PREFIX} Нужно обогатить: ${needEnrich.length} из ${games.length}`);

  if (needEnrich.length === 0) {
    console.log(`${PREFIX} Все игры уже обогащены`);
    return { processed: 0, found: 0, errors: 0, complete: true };
  }

  let processed = 0;
  let found = 0;
  let errors = 0;

  for (const game of needEnrich) {
    await sleep(DELAY_MS);

    try {
      const info = await fetchGameInfo(game.id);
      if (info && (info.coverArt || info.img)) {
        game.platprices = info;
        found++;
      } else {
        // Mark as attempted so we don't retry
        game.platprices = { error: true, fetchedAt: new Date().toISOString() };
        errors++;
      }
    } catch (err) {
      console.error(`${PREFIX} Ошибка ${game.name}: ${err.message}`);
      game.platprices = { error: true, fetchedAt: new Date().toISOString() };
      errors++;
    }

    processed++;

    // Save progress every 50 games
    if (processed % 50 === 0) {
      saveGames(data);
      console.log(`${PREFIX} Прогресс: ${processed}/${needEnrich.length} (найдено: ${found}, ошибок: ${errors})`);
    }

    // Rate limit protection
    if (processed >= MAX_PER_HOUR) {
      console.log(`${PREFIX} Пауза: достигнут лимит ${MAX_PER_HOUR} запросов. Продолжить через час.`);
      saveGames(data);
      return { processed, found, errors, complete: false };
    }
  }

  // Final save
  saveGames(data);
  console.log(`${PREFIX} ✅ Готово: ${found} обложек найдено, ${errors} ошибок`);
  return { processed, found, errors, complete: true };
}

// ── Legacy: price fetching (kept for backward compatibility) ─────────

async function fetchGamePrice(regionCode, gameName) {
  const apiKey = API_KEY || config.parsers.platprices.apiKey;
  if (!apiKey) return null;

  const regionMap = { TR: 'tr-tr', UA: 'ru-ua', IN: 'en-in' };
  const region = regionMap[regionCode];
  if (!region) return null;

  try {
    const params = new URLSearchParams({ key: apiKey, name: gameName, region });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

    const response = await fetch(`${BASE_URL}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    clearTimeout(timeout);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.Name) return null;

    const basePrice = parseFloat(data.BasePrice) || null;
    const salePrice = parseFloat(data.SalePrice) || null;
    const plusPrice = parseFloat(data.PlusPrice) || null;
    const discountPct = parseInt(data.DiscountPercentage) || 0;
    if (!basePrice) return null;

    return {
      id: data.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: data.Name,
      conceptId: null,
      prices: {
        [regionCode]: {
          editions: [{
            name: 'Standard', basePrice,
            salePrice: salePrice && salePrice < basePrice ? salePrice : null,
            plusPrice, discountPct, saleEndDate: null,
            clientPrice: null, clientSalePrice: null
          }]
        }
      },
      coverUrl: data.Image || null,
      platform: 'PS5',
      releaseDate: null,
      status: 'released',
      metacritic: parseInt(data.Metacritic) || null,
      sources: { platprices: { price: basePrice, fetchedAt: new Date().toISOString() } },
      discrepancy: false,
      discrepancyDetails: null,
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      priceChangedAt: null
    };
  } catch (err) {
    console.log(`[Парсер] PlatPrices ошибка: ${err.message}`);
    return null;
  }
}

// ── Export ───────────────────────────────────────────────────────────────

module.exports = {
  fetchGameInfo,
  fetchGamePrice,
  enrichAll,
  isConfigured: () => !!API_KEY,
  name: 'platprices'
};
