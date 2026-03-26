const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../config');
const parsers = require('./parsers');
const sony = require('./parsers/sony');
const pricing = require('./pricing');
const notifier = require('./notifier');
const rawg = require('./parsers/rawg');
const hype = require('./parsers/hype');
const topSellersParser = require('./parsers/topSellers');
const gameDescriptions = require('../data/gameDescriptions');

const PREFIX = '[SiteWriter]';

// ── Config ──────────────────────────────────────────────────────────────

const SW_CONFIG = config.siteWriter || {};
const REPO_ROOT = SW_CONFIG.repoRoot || '/var/www/activeplay-store';
const DEALS_FILE = SW_CONFIG.dealsFile || 'src/data/deals.ts';
const MIN_DISCOUNT = SW_CONFIG.minDiscountPct || 10;
const PREORDERS_FILE = 'src/data/preorders.ts';
const PREORDERS_JSON_FILE = path.join(__dirname, '..', 'data', 'preorders.json');
const ENABLED = SW_CONFIG.enabled !== false;

const HYPE_CONFIG = config.hype || {};
const HOT_RELEASES_FILE = HYPE_CONFIG.hotReleasesFile || 'src/data/hotReleases.ts';
const HOT_RELEASES_COUNT = HYPE_CONFIG.hotReleasesCount || 4;
const NEW_RELEASE_DAYS = HYPE_CONFIG.newReleaseDays || 60;

const TOP_SELLERS_FILE = 'src/data/top-sellers.ts';
const TOP_SELLERS_JSON_FILE = path.join(__dirname, '..', 'data', 'top-sellers.json');
const TOP_SELLERS_COUNT = 10;

// ── Helpers ─────────────────────────────────────────────────────────────

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanName(name) {
  return name
    .replace(/\s*(PS[45]\s*(&|and|ve)?\s*PS[45])\s*/gi, '')
    .replace(/\s*(PS5|PS4)\s*/gi, '')
    .replace(/\s*[-–—]\s*(Türkçe|Turk|Turkey|Ukrainian|India)\s*/gi, '')
    .replace(/\s*(Sürüm|Sürümü|Видання)\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Deep-clean a game name: removes platform junk, broken formatting, edition suffixes for display.
 */
function cleanGameName(name) {
  let n = name;

  // Remove Turkish/Ukrainian platform suffixes: "PS4 ve PS5", "Sürüm", "Видання", "Версія"
  n = n.replace(/\s*(PS[45]\s*(ve|та|&|and|,)\s*PS[45])\s*/gi, '');
  n = n.replace(/\bSürüm\w*\b/gi, '');
  n = n.replace(/\bВидання\b/gi, '');
  n = n.replace(/\bВерсія\b/gi, '');

  // "for PS5" / "для PS5" / "(PlayStation5)" at end
  n = n.replace(/\s+(for|для)\s*(PS[45]|PlayStation\s*[45])?\s*$/gi, '');
  n = n.replace(/\s*\(PlayStation\s*[45]\)\s*/gi, '');

  // Remove platform tags inside name
  n = n.replace(/\s*(PS5|PS4|PlayStation\s*[45])\s*/gi, ' ');

  // Remove Turkish/Ukrainian locale noise
  n = n.replace(/\s*[-–—]\s*(Türkçe|Turk|Turkey|Ukrainian|India)\s*/gi, '');

  // Empty parentheses: "Atomic Heart - ()" → "Atomic Heart"
  n = n.replace(/\s*\(\s*\)\s*/g, '');

  // Trailing dash/colon: "Baldur's Gate 3 -" → "Baldur's Gate 3"
  n = n.replace(/\s*[-–—:]\s*$/, '');

  // "HogwartsVersion" → "Hogwarts Legacy" — stuck suffix like "LegacyVersion"
  n = n.replace(/Version\b/gi, '');

  // "Borderlands4" → "Borderlands 4" (letter stuck to digit)
  n = n.replace(/([a-zA-Zа-яА-ЯёЁ])(\d)/g, '$1 $2');

  // Ukrainian suffixes: "набір 'Два покоління'", "цифрове розширене", stuck "Два покоління'"
  n = n.replace(/\s*[-–—]?\s*набір\s*[''"]?.*?покоління[''"]?\s*/gi, '');
  n = n.replace(/Два\s*покоління[''"]?\s*/gi, '');
  n = n.replace(/\s*[-–—]\s*цифрове\s+розширене\s*/gi, '');
  n = n.replace(/\s*платіжна\s+картка\s*[«»"'].*?[«»"']\s*/gi, '');
  n = n.replace(/\s*,\s*\d+-го\s+року\s*/gi, '');

  // Collapse whitespace
  n = n.replace(/\s{2,}/g, ' ').trim();

  return n;
}

/**
 * Normalize a game name for deduplication — strip edition suffixes to find the "base" game.
 */
function normalizeForDedup(name) {
  let n = cleanGameName(name).toLowerCase();

  // Strip common edition/bundle suffixes
  const editionPatterns = [
    /\s*[-–—:]\s*(cross-gen\s+bundle|digital\s+(deluxe|premium)|deluxe\s+edition|ultimate\s+edition|gold\s+edition|legendary\s+edition|game\s+of\s+the\s+year\s+edition|goty\s+edition|standard\s+edition|premium\s+edition|collector'?s?\s+edition|complete\s+edition|definitive\s+edition|royal\s+edition|enhanced\s+edition)/gi,
    /\s+(cross-gen\s+bundle|digital\s+deluxe|deluxe|ultimate|gold|legendary|standard|premium|collector'?s?|complete|definitive|royal|enhanced)\s+(edition|bundle|collection)\s*/gi,
    /\s+cross-gen\s+bundle\s*/gi,
    /\s+25th\s+anniversary\s*/gi,
    /\s+superstar\s+edition\s*/gi,
    /\s+ultimate\s*(,?\s*\d+[- ]?(го|nd|rd|th)\s*(року|year))?\s*(edition)?\s*/gi,
    /\s+year\s+\d+\s+edition\s*/gi,
    /\s+remastered\s*/gi,
    /\s*[-–—:]\s*saga\s+bundle\s*/gi,
    /\s*[-–—:]\s*expansion\s+pass\s*/gi,
    /\s*\|\s*перепустка.*$/gi,
    /\s+upgrade\s*/gi,
    /\s+ultimate\s+collection\s*/gi,
    /\s+ultimate\s+bundle\s*/gi,
    /\s+complete\s+bundle\s*/gi,
  ];

  for (const pat of editionPatterns) {
    n = n.replace(pat, '');
  }

  // Trailing dash/colon after stripping
  n = n.replace(/\s*[-–—:,]\s*$/, '').trim();

  return n;
}

function parsePlatforms(platformStr) {
  if (!platformStr) return ['PS5'];
  const platforms = [];
  if (/PS5|PlayStation 5/i.test(platformStr)) platforms.push('PS5');
  if (/PS4|PlayStation 4/i.test(platformStr)) platforms.push('PS4');
  return platforms.length > 0 ? platforms : ['PS5'];
}

/**
 * Pick the best edition for a region — the one with highest saving in client rubles.
 */
function pickBestEdition(editions) {
  if (!editions || editions.length === 0) return null;

  let best = null;
  let bestSaving = -Infinity;

  for (const ed of editions) {
    if (!ed.basePrice || !ed.salePrice) continue;
    if (ed.salePrice >= ed.basePrice) continue;

    // Client-price saving (if clientSalePrice available)
    const baseClient = ed.baseClientPrice || ed.clientPrice;
    const saleClient = ed.clientSalePrice || ed.clientPrice;
    if (!baseClient || !saleClient) continue;

    const saving = baseClient - saleClient;
    if (saving > bestSaving) {
      bestSaving = saving;
      best = ed;
    }
  }

  return best;
}

// ── Main mapping ────────────────────────────────────────────────────────

function mapGameToDeal(game) {
  const trEditions = game.prices?.TR?.editions || [];
  const uaEditions = game.prices?.UA?.editions || [];

  const bestTR = pickBestEdition(trEditions);
  const bestUA = pickBestEdition(uaEditions);

  // Must have at least one region with a discount
  if (!bestTR && !bestUA) return null;

  // Calculate discount % from the primary edition
  const primary = bestTR || bestUA;
  const discountPct = Math.round((1 - primary.salePrice / primary.basePrice) * 100);
  if (discountPct < MIN_DISCOUNT) return null;

  const id = game.id || slugify(game.name);
  const name = cleanGameName(cleanName(game.name));
  const platforms = parsePlatforms(game.platform);
  const coverUrl = game.portraitUrl || game.platprices?.coverArt || game.coverUrl || game.platprices?.img || '';
  const releaseDate = game.releaseDate || '';
  const metacritic = game.metacritic || undefined;

  // Build prices
  const prices = {};

  if (bestTR) {
    const baseClient = bestTR.baseClientPrice || bestTR.clientPrice;
    const saleClient = bestTR.clientSalePrice || bestTR.clientPrice;
    if (baseClient && saleClient && saleClient < baseClient) {
      prices.TR = {
        basePriceTRY: bestTR.basePrice,
        salePriceTRY: bestTR.salePrice,
        clientBasePrice: baseClient,
        clientSalePrice: saleClient,
      };
      if (bestTR.isPsPlus && bestTR.plusPrice) {
        prices.TR.psPlusPriceTRY = bestTR.plusPrice;
      }
      if (bestTR.isPsPlus && bestTR.clientPlusPrice) {
        prices.TR.clientPsPlusPrice = bestTR.clientPlusPrice;
      }
    }
  }

  if (bestUA) {
    const baseClient = bestUA.baseClientPrice || bestUA.clientPrice;
    const saleClient = bestUA.clientSalePrice || bestUA.clientPrice;
    if (baseClient && saleClient && saleClient < baseClient) {
      prices.UA = {
        basePriceUAH: bestUA.basePrice,
        salePriceUAH: bestUA.salePrice,
        clientBasePrice: baseClient,
        clientSalePrice: saleClient,
      };
      if (bestUA.isPsPlus && bestUA.plusPrice) {
        prices.UA.psPlusPriceUAH = bestUA.plusPrice;
      }
      if (bestUA.isPsPlus && bestUA.clientPlusPrice) {
        prices.UA.clientPsPlusPrice = bestUA.clientPlusPrice;
      }
    }
  }

  // After filtering, must still have at least one region
  if (!prices.TR && !prices.UA) return null;

  const hasPsPlusPrice = trEditions.some(e => e.isPsPlus && e.plusPrice) ||
                         uaEditions.some(e => e.isPsPlus && e.plusPrice);

  const saleEndDate = primary.saleEndDate || primary.endDate || undefined;
  const conceptId = game.conceptId || undefined;

  return {
    id,
    name,
    platforms,
    coverUrl,
    releaseDate,
    metacritic,
    prices,
    discountPct,
    saleEndDate,
    hasPsPlusPrice: hasPsPlusPrice || undefined,
    _conceptId: conceptId,
  };
}

// ── Generate TypeScript string ──────────────────────────────────────────

/**
 * Deduplicate deals: group by conceptId first, then by normalized name.
 * Keep the edition with the lowest clientSalePrice (cheapest for customer).
 */
function deduplicateDeals(deals) {
  const groups = new Map(); // key → best deal

  for (const deal of deals) {
    // Skip Ukrainian-only names that start with Ukrainian words (duplicates of TR entries)
    if (/^(набір|версія|superstar|Перепустка)/i.test(deal.name)) continue;
    // Skip names that are entirely non-Latin (Ukrainian translations of existing games)
    if (/^[^a-zA-Z0-9]*$/.test(deal.name.replace(/[\s\-–—:.,!?'"«»()]/g, ''))) continue;

    // Primary key: conceptId if available, otherwise normalized name
    const key = deal._conceptId ? `concept:${deal._conceptId}` : `name:${normalizeForDedup(deal.name)}`;

    if (!groups.has(key)) {
      groups.set(key, deal);
      continue;
    }

    const existing = groups.get(key);
    // Pick the cheapest edition (lowest clientSalePrice) for the customer
    const priceNew = Math.min(
      deal.prices.TR?.clientSalePrice ?? Infinity,
      deal.prices.UA?.clientSalePrice ?? Infinity,
    );
    const priceExisting = Math.min(
      existing.prices.TR?.clientSalePrice ?? Infinity,
      existing.prices.UA?.clientSalePrice ?? Infinity,
    );

    if (priceNew < priceExisting) {
      groups.set(key, deal);
    }
  }

  return Array.from(groups.values());
}

/**
 * Detect sale name from game data (sale end dates, tags, etc.)
 */
function detectSaleName(games) {
  // Check current month/season for fallback
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();

  const SALE_MAP = {
    0: `Январская распродажа PS Store ${year}`,
    1: `Февральская распродажа PS Store ${year}`,
    2: `Весенняя распродажа PS Store ${year}`,
    3: `Весенняя распродажа PS Store ${year}`,
    4: `Майская распродажа PS Store ${year}`,
    5: `Летняя распродажа PS Store ${year}`,
    6: `Летняя распродажа PS Store ${year}`,
    7: `Августовская распродажа PS Store ${year}`,
    8: `Осенняя распродажа PS Store ${year}`,
    9: `Хэллоуин-распродажа PS Store ${year}`,
    10: `Чёрная пятница PS Store ${year}`,
    11: `Зимняя распродажа PS Store ${year}`,
  };

  // Try to find sale name from game tags/campaign names
  for (const g of games) {
    const campaign = g.campaign || g.saleName || g.promoName || '';
    if (/spring\s*sale/i.test(campaign)) return `Весенняя распродажа PS Store ${year}`;
    if (/mega\s*march/i.test(campaign)) return `Мега Март PS Store ${year}`;
    if (/summer\s*sale/i.test(campaign)) return `Летняя распродажа PS Store ${year}`;
    if (/black\s*friday/i.test(campaign)) return `Чёрная пятница PS Store ${year}`;
    if (/holiday\s*sale/i.test(campaign)) return `Зимняя распродажа PS Store ${year}`;
    if (/january\s*sale/i.test(campaign)) return `Январская распродажа PS Store ${year}`;
    if (/halloween/i.test(campaign)) return `Хэллоуин-распродажа PS Store ${year}`;
    if (/big\s*in\s*japan/i.test(campaign)) return `Big in Japan — распродажа PS Store ${year}`;
    if (/days\s*of\s*play/i.test(campaign)) return `Days of Play ${year}`;
    if (/double\s*discount/i.test(campaign)) return `Двойные скидки PS Store ${year}`;
  }

  return SALE_MAP[month] || `Распродажа PS Store ${year}`;
}

function generateDealsTs(games) {
  let deals = [];
  for (const game of games) {
    const deal = mapGameToDeal(game);
    if (deal) deals.push(deal);
  }

  const beforeDedup = deals.length;
  deals = deduplicateDeals(deals);
  const afterDedup = deals.length;
  console.log(`${PREFIX} Дедупликация: ${beforeDedup} → ${afterDedup} (убрано ${beforeDedup - afterDedup} дублей)`);

  const saleName = detectSaleName(games);

  const trCount = deals.filter(d => d.prices.TR).length;
  const uaCount = deals.filter(d => d.prices.UA).length;
  const maxDiscount = deals.reduce((max, d) => Math.max(max, d.discountPct), 0);

  // Find most common sale end date
  const endDateCounts = {};
  for (const d of deals) {
    if (d.saleEndDate) endDateCounts[d.saleEndDate] = (endDateCounts[d.saleEndDate] || 0) + 1;
  }
  let endDate = '';
  let endDateMax = 0;
  for (const [date, count] of Object.entries(endDateCounts)) {
    if (count > endDateMax) { endDate = date; endDateMax = count; }
  }

  // Detect English sale name
  const month = new Date().getMonth();
  const EN_MAP = { 0: 'January Sale', 1: 'February Sale', 2: 'Spring Sale', 3: 'Spring Sale', 4: 'May Sale', 5: 'Summer Sale', 6: 'Summer Sale', 7: 'August Sale', 8: 'Autumn Sale', 9: 'Halloween Sale', 10: 'Black Friday', 11: 'Holiday Sale' };
  const saleNameEn = EN_MAP[month] || 'PlayStation Sale';

  const now = new Date().toISOString();

  let out = '';
  out += `// Автоматически сгенерировано AI-агентом ActivePlay\n`;
  out += `// Обновлено: ${now}\n`;
  out += `// Игр со скидкой: ${trCount} (TR), ${uaCount} (UA)\n`;
  out += `// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом\n\n`;

  out += `export interface DealGame {\n`;
  out += `  id: string;\n`;
  out += `  name: string;\n`;
  out += `  platforms: ('PS5' | 'PS4')[];\n`;
  out += `  coverUrl: string;\n`;
  out += `  releaseDate: string;\n`;
  out += `  metacritic?: number;\n`;
  out += `  prices: {\n`;
  out += `    TR?: {\n`;
  out += `      basePriceTRY: number;\n`;
  out += `      salePriceTRY: number;\n`;
  out += `      psPlusPriceTRY?: number;\n`;
  out += `      clientBasePrice: number;\n`;
  out += `      clientSalePrice: number;\n`;
  out += `      clientPsPlusPrice?: number;\n`;
  out += `    };\n`;
  out += `    UA?: {\n`;
  out += `      basePriceUAH: number;\n`;
  out += `      salePriceUAH: number;\n`;
  out += `      psPlusPriceUAH?: number;\n`;
  out += `      clientBasePrice: number;\n`;
  out += `      clientSalePrice: number;\n`;
  out += `      clientPsPlusPrice?: number;\n`;
  out += `    };\n`;
  out += `  };\n`;
  out += `  discountPct: number;\n`;
  out += `  saleEndDate?: string;\n`;
  out += `  hasPsPlusPrice?: boolean;\n`;
  out += `}\n\n`;

  out += `export const saleMeta = {\n`;
  out += `  saleName: ${JSON.stringify(saleName)},\n`;
  out += `  saleNameEn: ${JSON.stringify(saleNameEn)},\n`;
  out += `  maxDiscount: ${maxDiscount},\n`;
  out += `  endDate: ${JSON.stringify(endDate || '')},\n`;
  out += `  gamesCount: { TR: ${trCount}, UA: ${uaCount} },\n`;
  out += `  updatedAt: ${JSON.stringify(now)},\n`;
  out += `  totalGames: ${deals.length},\n`;
  out += `};\n\n`;

  out += `export const dealsData: DealGame[] = [\n`;

  for (const deal of deals) {
    // Don't write internal _conceptId to output
    out += `  {\n`;
    out += `    id: ${JSON.stringify(deal.id)},\n`;
    out += `    name: ${JSON.stringify(deal.name)},\n`;
    out += `    platforms: ${JSON.stringify(deal.platforms)},\n`;
    out += `    coverUrl: ${JSON.stringify(deal.coverUrl)},\n`;
    out += `    releaseDate: ${JSON.stringify(deal.releaseDate)},\n`;
    if (deal.metacritic) {
      out += `    metacritic: ${deal.metacritic},\n`;
    }
    out += `    prices: {\n`;
    if (deal.prices.TR) {
      const tr = deal.prices.TR;
      out += `      TR: { basePriceTRY: ${tr.basePriceTRY}, salePriceTRY: ${tr.salePriceTRY}`;
      if (tr.psPlusPriceTRY) out += `, psPlusPriceTRY: ${tr.psPlusPriceTRY}`;
      out += `, clientBasePrice: ${tr.clientBasePrice}, clientSalePrice: ${tr.clientSalePrice}`;
      if (tr.clientPsPlusPrice) out += `, clientPsPlusPrice: ${tr.clientPsPlusPrice}`;
      out += ` },\n`;
    }
    if (deal.prices.UA) {
      const ua = deal.prices.UA;
      out += `      UA: { basePriceUAH: ${ua.basePriceUAH}, salePriceUAH: ${ua.salePriceUAH}`;
      if (ua.psPlusPriceUAH) out += `, psPlusPriceUAH: ${ua.psPlusPriceUAH}`;
      out += `, clientBasePrice: ${ua.clientBasePrice}, clientSalePrice: ${ua.clientSalePrice}`;
      if (ua.clientPsPlusPrice) out += `, clientPsPlusPrice: ${ua.clientPsPlusPrice}`;
      out += ` },\n`;
    }
    out += `    },\n`;
    out += `    discountPct: ${deal.discountPct},\n`;
    if (deal.saleEndDate) {
      out += `    saleEndDate: ${JSON.stringify(deal.saleEndDate)},\n`;
    }
    if (deal.hasPsPlusPrice) {
      out += `    hasPsPlusPrice: true,\n`;
    }
    out += `  },\n`;
  }

  out += `];\n`;

  return { content: out, count: deals.length, trCount, uaCount };
}

// ── Git operations ──────────────────────────────────────────────────────

function gitPush(gamesCount) {
  try {
    // Check if there are actual changes
    const diff = execSync(`git diff --name-only ${DEALS_FILE}`, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    if (!diff) {
      // Also check staged
      const staged = execSync(`git diff --cached --name-only ${DEALS_FILE}`, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
      if (!staged) {
        console.log(`${PREFIX} Файл не изменился — коммит не нужен`);
        return false;
      }
    }

    execSync(`git add ${DEALS_FILE}`, { cwd: REPO_ROOT });

    const msg = `data: обновление скидок (${gamesCount} игр)`;
    execSync(`git commit -m "${msg}"`, { cwd: REPO_ROOT });
    execSync('git push', { cwd: REPO_ROOT });

    console.log(`${PREFIX} ✅ Git push выполнен`);
    return true;
  } catch (err) {
    console.error(`${PREFIX} ❌ Git push ошибка:`, err.message);
    return false;
  }
}

// ── Main entry point ────────────────────────────────────────────────────

async function generateAndWrite() {
  const data = parsers.loadGames();
  if (!data || !data.games || data.games.length === 0) {
    console.log(`${PREFIX} ⚠️ games.json пуст или не найден`);
    return { written: false, gamesCount: 0, pushed: false };
  }

  console.log(`${PREFIX} Генерация deals.ts из ${data.games.length} игр...`);

  const { content, count, trCount, uaCount } = generateDealsTs(data.games);
  console.log(`${PREFIX} Сгенерировано: ${count} игр (TR: ${trCount}, UA: ${uaCount})`);

  if (!ENABLED) {
    console.log(`${PREFIX} Запись отключена (enabled: false)`);
    return { written: false, gamesCount: count, pushed: false };
  }

  const filePath = path.join(REPO_ROOT, DEALS_FILE);

  // Check if content actually changed
  try {
    const existing = fs.readFileSync(filePath, 'utf8');
    // Compare ignoring the timestamp line
    const stripTimestamp = (s) => s.replace(/\/\/ Обновлено:.*\n/, '');
    if (stripTimestamp(existing) === stripTimestamp(content)) {
      console.log(`${PREFIX} Данные не изменились — пропуск`);
      return { written: false, gamesCount: count, pushed: false };
    }
  } catch {
    // File doesn't exist yet — will create
  }

  // Write file
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`${PREFIX} ✅ Записано: ${filePath}`);

  // Git push
  const pushed = gitPush(count);

  return { written: true, gamesCount: count, pushed };
}


// ── Preorders ────────────────────────────────────────────────────────────

function sleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculatePreorderClientPrices(game, regionCode) {
  const regionPrices = game.prices[regionCode];
  if (!regionPrices?.editions) return;
  for (const edition of regionPrices.editions) {
    if (edition.basePrice) {
      try {
        const result = pricing.calculatePrice(edition.basePrice, regionCode);
        edition.clientPrice = result.clientPrice;
      } catch {}
    }
  }
}

function mergePreorders(trGames, uaGames) {
  const merged = new Map();

  function getKey(game) {
    if (game.conceptId) return 'concept:' + game.conceptId;
    return 'name:' + normalizeForDedup(game.name);
  }

  for (const game of trGames) {
    const key = getKey(game);
    merged.set(key, { ...game });
  }

  for (const game of uaGames) {
    const key = getKey(game);
    if (merged.has(key)) {
      const existing = merged.get(key);
      if (game.prices.UA) existing.prices.UA = game.prices.UA;
      if (!existing.conceptId && game.conceptId) existing.conceptId = game.conceptId;
      if (!existing.portraitUrl && game.portraitUrl) existing.portraitUrl = game.portraitUrl;
    } else {
      merged.set(key, { ...game });
    }
  }

  return Array.from(merged.values());
}

function filterPreorders(games) {
  const MIN_PRICE_TRY = 500;
  const result = [];
  const seen = new Map();

  // FIX 4: Exclude collection bundles with already-released games
  const COLLECTION_EXCLUDE = [
    /age of hatred collection/i,
  ];

  for (const game of games) {
    const nameLower = (game.name || '').toLowerCase();
    if (/add-on|dlc|season pass|expansion pass|upgrade|currency pack|coin|pre-order bundle|free to play/i.test(nameLower)) continue;
    if (/^[^a-zA-Z0-9]*$/.test(game.name.replace(/[\s\-\u2013\u2014:.,!?'\u00AB\u00BB()]/g, ''))) continue;

    // FIX 4: Skip collection bundles
    const cleanedName = cleanGameName(cleanName(game.name));
    if (COLLECTION_EXCLUDE.some(pat => pat.test(cleanedName))) {
      console.log(PREFIX + ' Исключён (collection): ' + cleanedName);
      continue;
    }

    // Extra normalization for preorder dedup — strip edition suffixes
    let normName = normalizeForDedup(game.name);
    // Remove trailing edition-like suffixes: "Essence Edition", "R'lyeh Edition", "Collector's Edition"
    normName = normName.replace(/\s*[-–—:]?\s*(?:essence|r'lyeh|collector'?s?|launch|founder'?s?)\s*(edition)?\s*$/i, '').trim();
    const normKey = game.conceptId ? ('c:' + game.conceptId) : ('n:' + normName);

    if (seen.has(normKey)) {
      const existingIdx = seen.get(normKey);
      const existing = result[existingIdx];
      for (const region of ['TR', 'UA']) {
        if (!game.prices[region]?.editions) continue;
        if (!existing.prices[region]) {
          existing.prices[region] = game.prices[region];
        } else {
          for (const ed of game.prices[region].editions) {
            const exists = existing.prices[region].editions.find(e => e.name === ed.name);
            if (!exists && ed.basePrice) {
              existing.prices[region].editions.push(ed);
            }
          }
        }
      }
      continue;
    }

    const trEditions = game.prices?.TR?.editions || [];
    const standardTR = trEditions.find(e => e.name === 'Standard') || trEditions[0];
    const price = standardTR?.basePrice || 0;
    if (price < MIN_PRICE_TRY) continue;

    seen.set(normKey, result.length);
    result.push(game);
  }

  return result;
}

async function fetchReleaseDateFromConcept(conceptId) {
  if (!conceptId) return null;
  try {
    const locales = ['en-tr', 'en-us'];
    for (const locale of locales) {
      const url = 'https://store.playstation.com/' + locale + '/concept/' + conceptId;
      const response = await fetch(url, {
        headers: { 'User-Agent': config.parsers.userAgent },
        signal: AbortSignal.timeout(12000),
        redirect: 'follow'
      });
      if (!response.ok) continue;
      const html = await response.text();

      const datePatterns = [
        /releaseDate['"]\s*:\s*['"](20\d{2}-\d{2}-\d{2})/,
        /(?:Expected|Available|Release date:?\s*)\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      ];

      for (const pat of datePatterns) {
        const match = html.match(pat);
        if (match) {
          const raw = match[1];
          if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.substring(0, 10);
          if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(raw)) {
            const parts = raw.split('/');
            return parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
          }
        }
      }
    }
  } catch {}
  return null;
}

/**
 * Scrape release date from PS Store product page HTML (Apollo state).
 * Product pages often have releaseDate even when concept pages don't.
 */
async function fetchReleaseDateFromProduct(productId) {
  if (!productId) return null;
  try {
    const url = 'https://store.playstation.com/en-tr/product/' + productId;
    const response = await fetch(url, {
      headers: { 'User-Agent': config.parsers.userAgent },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!response.ok) return null;
    const html = await response.text();

    // "releaseDate":"2026-04-07T15:00:00Z" in Apollo state
    const isoMatch = html.match(/"releaseDate"\s*:\s*"(\d{4}-\d{2}-\d{2})T/);
    if (isoMatch) return isoMatch[1];

    // Broader releaseDate pattern (without T)
    const dateMatch = html.match(/"releaseDate"\s*:\s*"(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) return dateMatch[1];

    // "Available DD/MM/YYYY" text
    const textMatch = html.match(/(?:Available|Expected|Releases?)\s*(?:on\s*)?(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/i);
    if (textMatch) {
      const d = textMatch[3] + '-' + textMatch[2].padStart(2, '0') + '-' + textMatch[1].padStart(2, '0');
      if (!isNaN(new Date(d).getTime())) return d;
    }

    return null;
  } catch {
    return null;
  }
}

function isFutureDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

async function fetchReleaseDates(games) {
  let fromProduct = 0, fromConcept = 0, fromRawg = 0;

  for (const game of games) {
    if (game.releaseDate) continue;

    // 1. Try product pages (most reliable — Apollo state has releaseDate)
    const productIds = [];
    for (const region of ['TR', 'UA']) {
      for (const ed of (game.prices?.[region]?.editions || [])) {
        if (ed.productId && !productIds.includes(ed.productId)) productIds.push(ed.productId);
      }
    }
    for (const pid of productIds) {
      await sleepMs(500);
      const date = await fetchReleaseDateFromProduct(pid);
      if (date && isFutureDate(date)) {
        game.releaseDate = date;
        fromProduct++;
        break;
      }
    }
    if (game.releaseDate) continue;

    // 2. Try concept page
    if (game.conceptId) {
      await sleepMs(300);
      const date = await fetchReleaseDateFromConcept(game.conceptId);
      if (date && isFutureDate(date)) {
        game.releaseDate = date;
        fromConcept++;
        continue;
      }
    }

    // 3. Try RAWG (also grab genre + description)
    await sleepMs(1000);
    try {
      const rawgData = await rawg.searchGame(cleanGameName(cleanName(game.name)));
      if (rawgData?.released && isFutureDate(rawgData.released)) {
        game.releaseDate = rawgData.released;
        fromRawg++;
      }
      if (rawgData?.genres?.length && !game.rawgGenre) {
        game.rawgGenre = rawgData.genres[0];
      }
      // Fetch details for description
      if (rawgData?.slug) {
        await sleepMs(500);
        try {
          const details = await rawg.fetchGameDetails(rawgData.slug);
          if (details?.description) {
            game.rawgDescription = details.description.replace(/\n/g, ' ').slice(0, 60).trim();
          }
          if (details?.genres?.length && !game.rawgGenre) {
            game.rawgGenre = details.genres[0];
          }
        } catch {}
      }
    } catch {}
  }

  console.log(PREFIX + ' Даты: product=' + fromProduct + ', concept=' + fromConcept + ', RAWG=' + fromRawg + ', без даты=' + games.filter(g => !g.releaseDate).length);
}

function loadPreordersJson() {
  try {
    return JSON.parse(fs.readFileSync(PREORDERS_JSON_FILE, 'utf8'));
  } catch {
    return { preorders: [] };
  }
}

function savePreordersJson(games) {
  const data = {
    updatedAt: new Date().toISOString(),
    preorders: games.map(g => ({
      name: cleanGameName(cleanName(g.name)),
      id: g.id,
      conceptId: g.conceptId,
      slug: slugify(g.name),
      platforms: parsePlatforms(g.platform),
      releaseDate: g.releaseDate || null,
      portraitUrl: g.portraitUrl || g.coverUrl || '',
      coverUrl: g.coverUrl || '',
      prices: {
        TR: g.prices.TR ? {
          editions: (g.prices.TR.editions || [])
            .filter(e => e.basePrice)
            .map(e => ({ name: e.name, priceTRY: e.basePrice, clientPrice: e.clientPrice || null }))
        } : undefined,
        UA: g.prices.UA ? {
          editions: (g.prices.UA.editions || [])
            .filter(e => e.basePrice)
            .map(e => ({ name: e.name, priceUAH: e.basePrice, clientPrice: e.clientPrice || null }))
        } : undefined,
      }
    }))
  };

  const dir = path.dirname(PREORDERS_JSON_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PREORDERS_JSON_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(PREFIX + ' preorders.json: ' + data.preorders.length + ' игр');
}

function detectNewPreorders(oldData, newGames) {
  const oldIds = new Set((oldData.preorders || []).map(g => g.conceptId || g.slug || g.id));
  return newGames.filter(g => {
    const key = g.conceptId || g.id;
    return !oldIds.has(key);
  });
}

/**
 * Enrich preorder games with RAWG genre + description (for games that didn't
 * go through the RAWG branch in fetchReleaseDates because they already had a date).
 */
async function enrichWithRawg(games) {
  let enriched = 0;
  for (const game of games) {
    if (game.rawgGenre && game.rawgDescription) continue;
    const name = cleanGameName(cleanName(game.name));
    await sleepMs(1000);
    try {
      const rawgData = await rawg.searchGame(name);
      if (!rawgData) continue;
      if (rawgData.genres?.length && !game.rawgGenre) {
        game.rawgGenre = rawgData.genres[0];
      }
      if (rawgData.slug && !game.rawgDescription) {
        await sleepMs(500);
        try {
          const details = await rawg.fetchGameDetails(rawgData.slug);
          if (details?.description) {
            game.rawgDescription = details.description.replace(/\n/g, ' ').slice(0, 60).trim();
          }
          if (details?.genres?.length && !game.rawgGenre) {
            game.rawgGenre = details.genres[0];
          }
        } catch {}
      }
      if (game.rawgGenre || game.rawgDescription) enriched++;
    } catch {}
  }
  console.log(PREFIX + ' RAWG enrichment: ' + enriched + '/' + games.length);
}

function generatePreordersTs(games) {
  const preorders = [];

  for (const game of games) {
    const name = cleanGameName(cleanName(game.name));
    const slug = game.id || slugify(name);
    const platforms = parsePlatforms(game.platform);
    const coverUrl = game.portraitUrl || game.coverUrl || '';
    const releaseDate = game.releaseDate || null;

    const editions = {};

    if (game.prices.TR) {
      const trEds = (game.prices.TR.editions || [])
        .filter(e => e.clientPrice > 0)
        .map(e => ({ name: e.name, clientPrice: e.clientPrice }));
      // FIX 2: Dedup editions by name — keep cheapest
      const trDeduped = new Map();
      for (const ed of trEds) {
        if (!trDeduped.has(ed.name) || ed.clientPrice < trDeduped.get(ed.name).clientPrice) {
          trDeduped.set(ed.name, ed);
        }
      }
      // FIX 3: Sort editions by clientPrice ascending
      const trSorted = Array.from(trDeduped.values()).sort((a, b) => a.clientPrice - b.clientPrice);
      if (trSorted.length > 0) editions.TR = trSorted;
    }

    if (game.prices.UA) {
      const uaEds = (game.prices.UA.editions || [])
        .filter(e => e.clientPrice > 0)
        .map(e => ({ name: e.name, clientPrice: e.clientPrice }));
      // FIX 2: Dedup editions by name — keep cheapest
      const uaDeduped = new Map();
      for (const ed of uaEds) {
        if (!uaDeduped.has(ed.name) || ed.clientPrice < uaDeduped.get(ed.name).clientPrice) {
          uaDeduped.set(ed.name, ed);
        }
      }
      // FIX 3: Sort editions by clientPrice ascending
      const uaSorted = Array.from(uaDeduped.values()).sort((a, b) => a.clientPrice - b.clientPrice);
      if (uaSorted.length > 0) editions.UA = uaSorted;
    }

    if (!editions.TR && !editions.UA) continue;

    const genre = gameDescriptions.getPreorderGenreOverride(name) || gameDescriptions.getPreorderGenreOverride(game.name) || gameDescriptions.translateGenre(game.rawgGenre) || game.rawgGenre || '';
    const description = gameDescriptions.getDescription(name) || gameDescriptions.getDescription(game.name) || game.rawgDescription || '';

    preorders.push({ id: slug, name, platforms, coverUrl, releaseDate, genre, description, editions });
  }

  preorders.sort((a, b) => {
    if (a.releaseDate && b.releaseDate) return a.releaseDate.localeCompare(b.releaseDate);
    if (a.releaseDate) return -1;
    if (b.releaseDate) return 1;
    return a.name.localeCompare(b.name);
  });

  const now = new Date().toISOString();

  let out = '';
  out += '// \u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u0441\u0433\u0435\u043d\u0435\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043e AI-\u0430\u0433\u0435\u043d\u0442\u043e\u043c ActivePlay\n';
  out += '// Обновлено: ' + now + '\n';
  out += '// Предзаказов: ' + preorders.length + '\n';
  out += '// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом\n\n';

  out += 'export interface PreorderEdition {\n';
  out += '  name: string;\n';
  out += '  clientPrice: number;\n';
  out += '}\n\n';

  out += 'export interface PreorderGame {\n';
  out += '  id: string;\n';
  out += '  name: string;\n';
  out += '  platforms: string[];\n';
  out += '  coverUrl: string;\n';
  out += '  releaseDate: string | null;\n';
  out += '  genre: string;\n';
  out += '  description: string;\n';
  out += '  editions: {\n';
  out += '    TR?: PreorderEdition[];\n';
  out += '    UA?: PreorderEdition[];\n';
  out += '  };\n';
  out += '}\n\n';

  out += 'export const preorderData: PreorderGame[] = [\n';

  for (const p of preorders) {
    out += '  {\n';
    out += '    id: ' + JSON.stringify(p.id) + ',\n';
    out += '    name: ' + JSON.stringify(p.name) + ',\n';
    out += '    platforms: ' + JSON.stringify(p.platforms) + ',\n';
    out += '    coverUrl: ' + JSON.stringify(p.coverUrl) + ',\n';
    out += '    releaseDate: ' + (p.releaseDate ? JSON.stringify(p.releaseDate) : 'null') + ',\n';
    out += '    genre: ' + JSON.stringify(p.genre || '') + ',\n';
    out += '    description: ' + JSON.stringify(p.description || '') + ',\n';
    out += '    editions: {\n';
    if (p.editions.TR) {
      out += '      TR: [\n';
      for (const ed of p.editions.TR) {
        out += '        { name: ' + JSON.stringify(ed.name) + ', clientPrice: ' + ed.clientPrice + ' },\n';
      }
      out += '      ],\n';
    }
    if (p.editions.UA) {
      out += '      UA: [\n';
      for (const ed of p.editions.UA) {
        out += '        { name: ' + JSON.stringify(ed.name) + ', clientPrice: ' + ed.clientPrice + ' },\n';
      }
      out += '      ],\n';
    }
    out += '    },\n';
    out += '  },\n';
  }

  out += '];\n';

  return { content: out, count: preorders.length };
}

function gitPushPreorders(count) {
  try {
    const diff = execSync('git diff --name-only ' + PREORDERS_FILE, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    if (!diff) {
      const staged = execSync('git diff --cached --name-only ' + PREORDERS_FILE, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
      if (!staged) {
        console.log(PREFIX + ' preorders.ts не изменился');
        return false;
      }
    }

    execSync('git add ' + PREORDERS_FILE, { cwd: REPO_ROOT });
    const msg = 'data: обновление предзаказов (' + count + ' игр)';
    execSync('git commit -m "' + msg + '"', { cwd: REPO_ROOT });
    execSync('git push', { cwd: REPO_ROOT });

    console.log(PREFIX + ' ✅ preorders.ts push');
    return true;
  } catch (err) {
    console.error(PREFIX + ' ❌ preorders push: ' + err.message);
    return false;
  }
}

async function generatePreorders() {
  console.log(PREFIX + ' === Генерация предзаказов ===');

  const trGames = await sony.fetchPreorders('TR');
  const uaGames = await sony.fetchPreorders('UA');
  console.log(PREFIX + ' Спарсено: TR=' + trGames.length + ', UA=' + uaGames.length);

  for (const game of trGames) calculatePreorderClientPrices(game, 'TR');
  for (const game of uaGames) calculatePreorderClientPrices(game, 'UA');

  const merged = mergePreorders(trGames, uaGames);
  console.log(PREFIX + ' Объединено: ' + merged.length);

  const filtered = filterPreorders(merged);
  console.log(PREFIX + ' После фильтрации: ' + filtered.length);

  await sony.fetchPortraitCovers(filtered, 'TR');
  await fetchReleaseDates(filtered);
  await enrichWithRawg(filtered);

  const oldData = loadPreordersJson();
  const newOnes = detectNewPreorders(oldData, filtered);
  if (newOnes.length > 0) {
    console.log(PREFIX + ' Новых: ' + newOnes.length);
  }

  savePreordersJson(filtered);

  const { content, count } = generatePreordersTs(filtered);

  if (!ENABLED) {
    console.log(PREFIX + ' Запись отключена');
    return { written: false, count, newCount: newOnes.length };
  }

  const filePath = path.join(REPO_ROOT, PREORDERS_FILE);

  try {
    const existing = fs.readFileSync(filePath, 'utf8');
    const strip = s => s.replace(/\/\/ Обновлено:.*\n/, '');
    if (strip(existing) === strip(content)) {
      console.log(PREFIX + ' preorders.ts не изменился');
      return { written: false, count, newCount: newOnes.length };
    }
  } catch {}

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(PREFIX + ' ✅ ' + filePath + ' (' + count + ' предзаказов)');

  const pushed = gitPushPreorders(count);

  for (const game of newOnes) {
    const trEds = game.prices?.TR?.editions || [];
    const prices = trEds.filter(e => e.basePrice).map(e => e.basePrice);
    const minTRY = prices.length > 0 ? Math.min(...prices) : '?';
    const rDate = game.releaseDate || 'TBD';
    notifier.sendAlert('new_preorder', 'Новый предзаказ: ' + cleanGameName(cleanName(game.name)) + ', от ' + minTRY + ' TL, выход ' + rDate);
  }

  return { written: true, count, pushed, newCount: newOnes.length };
}


// ── Hot Releases (Горящие новинки) ──────────────────────────────────────

/**
 * Формула totalScore для ранжирования новинок:
 *   totalScore = hypeScore * 0.40 + metacriticNorm * 0.30 + freshnessScore * 0.20 + brandScore * 0.10
 *
 * - hypeScore (1-10): из Twitch + YouTube
 * - metacriticNorm (1-10): metacritic / 10 (85 → 8.5)
 * - freshnessScore (1-10): чем свежее, тем выше
 * - brandScore (1-10): из rawg.brandFallback
 */
function calculateTotalScore(hypeData, metacritic, releaseDate, gameName) {
  const hs = hypeData?.hypeScore || 1;
  const mc = metacritic ? Math.min(metacritic / 10, 10) : 5;
  const fresh = rawg.calculateFreshness(releaseDate);
  const brand = rawg.brandFallback(gameName).hypeScore;

  const total = hs * 0.40 + mc * 0.30 + fresh * 0.20 + brand * 0.10;
  return Math.round(total * 10) / 10;
}

function isRecentRelease(releaseDateStr) {
  if (!releaseDateStr) return false;
  const released = new Date(releaseDateStr);
  if (isNaN(released.getTime())) return false;
  const now = new Date();
  const diffDays = (now - released) / (1000 * 60 * 60 * 24);
  // Строго меньше: игра ровно на границе уже не попадает
  return diffDays >= 0 && diffDays < NEW_RELEASE_DAYS;
}

function formatReleaseDateRu(dateStr) {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function generateHotReleasesTs(releases) {
  const now = new Date().toISOString();

  let out = '';
  out += '// Автоматически сгенерировано AI-агентом ActivePlay\n';
  out += '// Обновлено: ' + now + '\n';
  out += '// Горящих новинок: ' + releases.length + '\n';
  out += '// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом\n\n';

  out += 'export interface HotReleaseEdition {\n';
  out += '  name: string;\n';
  out += '  priceRUB: number;\n';
  out += '}\n\n';

  out += 'export interface HotRelease {\n';
  out += '  id: string;\n';
  out += '  title: string;\n';
  out += '  slug: string;\n';
  out += '  description: string;\n';
  out += '  releaseDate: string;\n';
  out += '  metacritic: number;\n';
  out += '  genre: string;\n';
  out += '  platforms: string[];\n';
  out += '  cover: string;\n';
  out += '  hypeScore: number;\n';
  out += '  totalScore: number;\n';
  out += '  editions: {\n';
  out += '    tr: HotReleaseEdition[];\n';
  out += '    ua: HotReleaseEdition[];\n';
  out += '  };\n';
  out += '}\n\n';

  out += 'export const hotReleases: HotRelease[] = [\n';

  for (const r of releases) {
    out += '  {\n';
    out += '    id: ' + JSON.stringify(r.id) + ',\n';
    out += '    title: ' + JSON.stringify(r.title) + ',\n';
    out += '    slug: ' + JSON.stringify(r.slug) + ',\n';
    out += '    description: ' + JSON.stringify(r.description) + ',\n';
    out += '    releaseDate: ' + JSON.stringify(r.releaseDate) + ',\n';
    out += '    metacritic: ' + (r.metacritic || 0) + ',\n';
    out += '    genre: ' + JSON.stringify(r.genre) + ',\n';
    out += '    platforms: ' + JSON.stringify(r.platforms) + ',\n';
    out += '    cover: ' + JSON.stringify(r.cover) + ',\n';
    out += '    hypeScore: ' + r.hypeScore + ',\n';
    out += '    totalScore: ' + r.totalScore + ',\n';
    out += '    editions: {\n';

    out += '      tr: [\n';
    for (const ed of (r.editions.tr || [])) {
      out += '        { name: ' + JSON.stringify(ed.name) + ', priceRUB: ' + ed.priceRUB + ' },\n';
    }
    out += '      ],\n';

    out += '      ua: [\n';
    for (const ed of (r.editions.ua || [])) {
      out += '        { name: ' + JSON.stringify(ed.name) + ', priceRUB: ' + ed.priceRUB + ' },\n';
    }
    out += '      ],\n';

    out += '    },\n';
    out += '  },\n';
  }

  out += '];\n';

  return { content: out, count: releases.length };
}

function gitPushHotReleases(count) {
  try {
    const diff = execSync('git diff --name-only ' + HOT_RELEASES_FILE, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    if (!diff) {
      const staged = execSync('git diff --cached --name-only ' + HOT_RELEASES_FILE, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
      if (!staged) {
        console.log(PREFIX + ' hotReleases.ts не изменился');
        return false;
      }
    }

    execSync('git add ' + HOT_RELEASES_FILE, { cwd: REPO_ROOT });
    const msg = 'data: обновление горящих новинок (' + count + ' игр)';
    execSync('git commit -m "' + msg + '"', { cwd: REPO_ROOT });
    execSync('git push', { cwd: REPO_ROOT });

    console.log(PREFIX + ' ✅ hotReleases.ts push');
    return true;
  } catch (err) {
    console.error(PREFIX + ' ❌ hotReleases push: ' + err.message);
    return false;
  }
}

async function generateHotReleases() {
  if (!HYPE_CONFIG.enabled) {
    console.log(PREFIX + ' Хайп-парсер отключён');
    return { written: false, count: 0 };
  }

  console.log(PREFIX + ' === Генерация горящих новинок ===');

  // 1. Загрузить все игры из games.json
  const gamesData = parsers.loadGames();
  const allGames = gamesData.games || [];

  if (allGames.length === 0) {
    console.log(PREFIX + ' Нет данных в games.json, пропускаем');
    return { written: false, count: 0 };
  }

  // 2. Отфильтровать новинки (вышедшие за последние N дней)
  const recentGames = allGames.filter(g => {
    // Игры с releaseDate в окне
    if (g.releaseDate && isRecentRelease(g.releaseDate)) return true;
    // Игры без скидок (полная цена) — вероятно новинки
    if (!g.bestPrice?.discountPct || g.bestPrice.discountPct === 0) return false;
    return false;
  });

  // Также добавить игры из предзаказов, которые уже вышли
  const preordersData = loadPreordersJson();
  const releasedPreorders = (preordersData.preorders || []).filter(p =>
    p.releaseDate && isRecentRelease(p.releaseDate)
  );

  // Объединить: отдать приоритет games.json, дополнить предзаказами
  const candidates = [...recentGames];
  for (const po of releasedPreorders) {
    const exists = candidates.some(g =>
      (g.conceptId && g.conceptId === po.conceptId) ||
      slugify(cleanGameName(cleanName(g.name))) === po.slug
    );
    if (!exists) {
      candidates.push({
        name: po.name,
        id: po.id,
        conceptId: po.conceptId,
        releaseDate: po.releaseDate,
        coverUrl: po.portraitUrl || po.coverUrl || '',
        prices: po.prices || {},
        platform: (po.platforms || []).join(', '),
      });
    }
  }

  // 2b. Дополнить кандидатами из RAWG (свежие релизы для PS5, которых нет в парсере)
  try {
    const rawgParams = new URLSearchParams({
      key: config.parsers.rawg.apiKey,
      dates: (() => {
        const to = new Date(); const from = new Date();
        from.setDate(from.getDate() - NEW_RELEASE_DAYS);
        return from.toISOString().slice(0,10) + ',' + to.toISOString().slice(0,10);
      })(),
      platforms: '187', // PS5
      ordering: '-released',
      page_size: '20',
    });
    const rawgRes = await fetch(config.parsers.rawg.endpoint + '/games?' + rawgParams, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': config.parsers.userAgent },
    });
    if (rawgRes.ok) {
      const rawgData = await rawgRes.json();
      for (const rg of (rawgData.results || [])) {
        if (!rg.released) continue;
        if (!isRecentRelease(rg.released)) continue;
        const rgSlug = slugify(rg.name);
        const exists = candidates.some(c =>
          slugify(cleanGameName(cleanName(c.name))) === rgSlug
        );
        if (!exists) {
          // Берём обложку из RAWG
          const cover = rg.background_image || '';
          candidates.push({
            name: rg.name,
            id: rgSlug,
            releaseDate: rg.released,
            metacritic: rg.metacritic || null,
            coverUrl: cover,
            prices: {}, // нет цен из парсера — будут добавлены из PS Store позже или вручную
            platform: 'PS5',
            rawgGenres: (rg.genres || []).map(g => g.name),
            fromRawg: true,
          });
        }
      }
    }
  } catch (err) {
    console.log(PREFIX + ' RAWG fallback: ' + err.message);
  }

  console.log(PREFIX + ' Кандидатов (недавние релизы): ' + candidates.length);

  if (candidates.length === 0) {
    console.log(PREFIX + ' Нет недавних релизов');
    return { written: false, count: 0 };
  }

  // 2c. Для кандидатов из RAWG без цен — попробовать найти в Sony PS Store
  for (const game of candidates) {
    if (game.fromRawg && (!game.prices?.TR?.editions?.length)) {
      try {
        await new Promise(r => setTimeout(r, 1500));
        const searchRes = await fetch(
          'https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/TR/en/999/' +
          encodeURIComponent(game.name) + '?suggested_size=3&mode=game',
          { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': config.parsers.userAgent } }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const productIds = (searchData.links || [])
            .filter(l => l.name && l.name.toLowerCase().includes(game.name.toLowerCase().split(' ')[0]))
            .map(l => l.id)
            .filter((v, i, a) => a.indexOf(v) === i);

          for (const pid of productIds.slice(0, 2)) {
            await new Promise(r => setTimeout(r, 500));
            const priceData = await sony.fetchGamePrice('TR', pid);
            if (priceData?.prices?.TR?.editions?.length) {
              // Рассчитать клиентские цены
              for (const ed of priceData.prices.TR.editions) {
                const price = ed.basePrice || ed.salePrice;
                if (price) {
                  try { ed.clientPrice = pricing.calculatePrice(price, 'TR').clientPrice; } catch {}
                }
              }
              game.prices = game.prices || {};
              game.prices.TR = priceData.prices.TR;
              game.coverUrl = game.coverUrl || priceData.portraitUrl || priceData.coverUrl || '';
              console.log(PREFIX + ' Sony цены для ' + game.name + ': ' +
                priceData.prices.TR.editions.map(e => e.name + '=' + e.basePrice + 'TRY→' + e.clientPrice + '₽').join(', '));
              break;
            }
          }
        }

        // Также попробовать UA
        if (!game.prices?.UA?.editions?.length) {
          await new Promise(r => setTimeout(r, 1000));
          const searchResUa = await fetch(
            'https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/UA/en/999/' +
            encodeURIComponent(game.name) + '?suggested_size=3&mode=game',
            { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': config.parsers.userAgent } }
          );
          if (searchResUa.ok) {
            const searchDataUa = await searchResUa.json();
            const productIdsUa = (searchDataUa.links || [])
              .filter(l => l.name && l.name.toLowerCase().includes(game.name.toLowerCase().split(' ')[0]))
              .map(l => l.id)
              .filter((v, i, a) => a.indexOf(v) === i);

            for (const pid of productIdsUa.slice(0, 2)) {
              await new Promise(r => setTimeout(r, 500));
              const priceData = await sony.fetchGamePrice('UA', pid);
              if (priceData?.prices?.UA?.editions?.length) {
                for (const ed of priceData.prices.UA.editions) {
                  const price = ed.basePrice || ed.salePrice;
                  if (price) {
                    try { ed.clientPrice = pricing.calculatePrice(price, 'UA').clientPrice; } catch {}
                  }
                }
                game.prices = game.prices || {};
                game.prices.UA = priceData.prices.UA;
                break;
              }
            }
          }
        }
      } catch (err) {
        console.log(PREFIX + ' Sony lookup ' + game.name + ': ' + err.message);
      }
    }
  }

  // 3. Обогатить данными из RAWG (metacritic, genre)
  const enriched = [];
  for (const game of candidates) {
    const name = cleanGameName(cleanName(game.name));
    if (!name || name.length < 3) continue;

    let metacritic = game.metacritic || null;
    let genres = game.rawgGenres || [];

    // Получить данные из RAWG если нет metacritic
    if (!metacritic) {
      try {
        await new Promise(r => setTimeout(r, 1000));
        const rawgData = await rawg.searchGame(name);
        if (rawgData) {
          metacritic = rawgData.metacritic;
          if (genres.length === 0) genres = rawgData.genres || [];
        }
      } catch {}
    }

    enriched.push({
      ...game,
      cleanName: name,
      metacritic,
      genres,
    });
  }

  // 4. Получить хайп-скоры из Twitch + YouTube
  const gameNames = enriched.map(g => g.cleanName);
  const hypeScores = await hype.getHypeScores(gameNames, 500);

  // 5. Рассчитать totalScore и отсортировать
  const scored = enriched.map(g => {
    const hypeData = hypeScores.get(g.cleanName) || { hypeScore: 1 };
    const totalScore = calculateTotalScore(hypeData, g.metacritic, g.releaseDate, g.cleanName);

    return {
      ...g,
      hypeData,
      totalScore,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  // 6. Взять топ-N
  const topGames = scored.slice(0, HOT_RELEASES_COUNT);

  console.log(PREFIX + ' Топ горящих новинок:');
  for (const g of topGames) {
    console.log(
      PREFIX + '   ' + g.cleanName +
      ' | score=' + g.totalScore +
      ' | hype=' + (g.hypeData?.hypeScore || 0) +
      ' | mc=' + (g.metacritic || '?')
    );
  }

  // 7. Подготовить данные для TS
  const releases = topGames.map(g => {
    const name = g.cleanName;
    const slug = slugify(name);
    const platforms = parsePlatforms(g.platform);
    const cover = g.portraitUrl || g.coverUrl || g.platprices?.coverArt || '/images/covers/' + slug + '.jpg';
    const rawGenre = (g.genres && g.genres.length > 0) ? g.genres[0] : 'Action';
    const genre = gameDescriptions.translateGenre(rawGenre) || rawGenre;

    // Собрать editions по регионам
    const editionsTr = [];
    const editionsUa = [];

    if (g.prices?.TR?.editions) {
      for (const ed of g.prices.TR.editions) {
        const price = ed.clientPrice || ed.clientSalePrice || ed.basePrice;
        if (price) {
          editionsTr.push({ name: ed.name || 'Standard', priceRUB: price });
        }
      }
    }
    if (g.prices?.UA?.editions) {
      for (const ed of g.prices.UA.editions) {
        const price = ed.clientPrice || ed.clientSalePrice || ed.basePrice;
        if (price) {
          editionsUa.push({ name: ed.name || 'Standard', priceRUB: price });
        }
      }
    }

    // Dedup по name, оставить дешевле
    const dedupEds = (eds) => {
      const map = new Map();
      for (const e of eds) {
        if (!map.has(e.name) || e.priceRUB < map.get(e.name).priceRUB) {
          map.set(e.name, e);
        }
      }
      return Array.from(map.values()).sort((a, b) => a.priceRUB - b.priceRUB);
    };

    let trFinal = dedupEds(editionsTr);
    let uaFinal = dedupEds(editionsUa);

    // Фоллбэк: если один регион пуст — копируем из другого
    if (trFinal.length === 0 && uaFinal.length > 0) trFinal = uaFinal;
    if (uaFinal.length === 0 && trFinal.length > 0) uaFinal = trFinal;

    // Нет цен вообще — пропускаем
    if (trFinal.length === 0 && uaFinal.length === 0) return null;

    return {
      id: slug,
      title: name,
      slug,
      description: gameDescriptions.getDescription(name) || gameDescriptions.getDescription(g.name) || '',
      releaseDate: formatReleaseDateRu(g.releaseDate),
      metacritic: g.metacritic || 0,
      genre,
      platforms,
      cover,
      hypeScore: g.hypeData?.hypeScore || 1,
      totalScore: g.totalScore,
      editions: {
        tr: trFinal,
        ua: uaFinal,
      },
    };
  }).filter(Boolean);

  // 8. Сгенерировать TS
  const { content, count } = generateHotReleasesTs(releases);

  if (!ENABLED) {
    console.log(PREFIX + ' Запись отключена');
    return { written: false, count };
  }

  const filePath = path.join(REPO_ROOT, HOT_RELEASES_FILE);

  // Проверить, изменился ли контент
  try {
    const existing = fs.readFileSync(filePath, 'utf8');
    const strip = s => s.replace(/\/\/ Обновлено:.*\n/, '');
    if (strip(existing) === strip(content)) {
      console.log(PREFIX + ' hotReleases.ts не изменился');
      return { written: false, count };
    }
  } catch {}

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(PREFIX + ' ✅ ' + filePath + ' (' + count + ' горящих новинок)');

  const pushed = gitPushHotReleases(count);

  return { written: true, count, pushed };
}


// ── Top Sellers (Топ-продаж) ──────────────────────────────────────────

function loadTopSellersJson() {
  try {
    return JSON.parse(fs.readFileSync(TOP_SELLERS_JSON_FILE, 'utf8'));
  } catch {
    return { month: null, year: null, games: [] };
  }
}

function saveTopSellersJson(data) {
  const dir = path.dirname(TOP_SELLERS_JSON_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TOP_SELLERS_JSON_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function generateTopSellersTs(games, meta) {
  const now = new Date().toISOString();

  let out = '';
  out += '// Автоматически сгенерировано AI-агентом ActivePlay\n';
  out += '// Обновлено: ' + now + '\n';
  out += '// Топ-продаж: ' + games.length + ' игр\n';
  out += '// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом\n\n';

  out += 'export interface TopSellerGame {\n';
  out += '  rank: number;\n';
  out += '  title: string;\n';
  out += '  genre: string;\n';
  out += '  image: string;\n';
  out += '  platform: string;\n';
  out += '  priceTR: number;\n';
  out += '  priceUA: number;\n';
  out += '}\n\n';

  out += 'export interface TopSellers {\n';
  out += '  month: string;\n';
  out += '  region: string;\n';
  out += '  source: string;\n';
  out += '  games: TopSellerGame[];\n';
  out += '}\n\n';

  out += 'export const topSellers: TopSellers = {\n';
  out += '  month: ' + JSON.stringify(meta.month) + ',\n';
  out += '  region: ' + JSON.stringify(meta.region || 'Европа') + ',\n';
  out += '  source: ' + JSON.stringify(meta.source || 'PlayStation Blog') + ',\n';
  out += '  games: [\n';

  for (const g of games) {
    out += '    { rank: ' + g.rank +
      ', title: ' + JSON.stringify(g.title) +
      ', genre: ' + JSON.stringify(g.genre) +
      ', image: ' + JSON.stringify(g.image) +
      ', platform: ' + JSON.stringify(g.platform || 'PS5') +
      ', priceTR: ' + g.priceTR +
      ', priceUA: ' + g.priceUA +
      ' },\n';
  }

  out += '  ],\n';
  out += '};\n';

  return { content: out, count: games.length };
}

function gitPushTopSellers(count) {
  try {
    const diff = execSync('git diff --name-only ' + TOP_SELLERS_FILE, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    if (!diff) {
      const staged = execSync('git diff --cached --name-only ' + TOP_SELLERS_FILE, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
      if (!staged) {
        console.log(PREFIX + ' top-sellers.ts не изменился');
        return false;
      }
    }

    execSync('git add ' + TOP_SELLERS_FILE, { cwd: REPO_ROOT });
    const msg = 'data: обновление топ-продаж (' + count + ' игр)';
    execSync('git commit -m "' + msg + '"', { cwd: REPO_ROOT });
    execSync('git push', { cwd: REPO_ROOT });

    console.log(PREFIX + ' ✅ top-sellers.ts push');
    return true;
  } catch (err) {
    console.error(PREFIX + ' ❌ top-sellers push: ' + err.message);
    return false;
  }
}

/**
 * Generate topSellers.ts from games.json data + optional PlayStation Blog scrape.
 *
 * If gameList is provided (array of { name, rank }), use those directly (manual/first-run mode).
 * Otherwise, try to fetch from PlayStation Blog.
 */
async function generateTopSellers(gameList) {
  console.log(PREFIX + ' === Генерация топ-продаж ===');

  const gamesData = parsers.loadGames();
  const allGames = gamesData.games || [];
  const preordersData = loadPreordersJson();
  const allPreorders = preordersData.preorders || [];

  // Загрузить текущие скидки из deals.ts для актуальных цен
  let dealsData = [];
  try {
    const dealsPath = path.join(REPO_ROOT, DEALS_FILE);
    const dealsContent = fs.readFileSync(dealsPath, 'utf8');
    // Парсим массив dealsData из TS файла
    const dealsMatch = dealsContent.match(/export const dealsData[^=]*=\s*(\[[\s\S]*?\n\];)/);
    if (dealsMatch) {
      // Извлекаем объекты скидок через regex
      const objRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?(?:clientSalePrice:\s*(\d+)[\s\S]*?){1,2}\}/g;
      let m;
      while ((m = objRegex.exec(dealsMatch[1])) !== null) {
        dealsData.push({ id: m[1], name: m[2] });
      }
    }
    // Более надёжный парсинг: просто найти все name + clientSalePrice пары для TR
    dealsData = [];
    const blocks = dealsContent.split(/\n  \{/);
    for (const block of blocks) {
      const nameM = block.match(/name:\s*"([^"]+)"/);
      if (!nameM) continue;
      // Ищем первый clientSalePrice (TR-регион идёт первым)
      const trBlock = block.match(/TR\??\s*:\s*\{([\s\S]*?)\}/);
      const uaBlock = block.match(/UA\??\s*:\s*\{([\s\S]*?)\}/);
      let trSalePrice = 0, uaSalePrice = 0;
      if (trBlock) {
        const sp = trBlock[1].match(/clientSalePrice:\s*(\d+)/);
        if (sp) trSalePrice = parseInt(sp[1]);
      }
      if (uaBlock) {
        const sp = uaBlock[1].match(/clientSalePrice:\s*(\d+)/);
        if (sp) uaSalePrice = parseInt(sp[1]);
      }
      if (trSalePrice > 0 || uaSalePrice > 0) {
        dealsData.push({ name: nameM[1], trSalePrice, uaSalePrice });
      }
    }
    console.log(PREFIX + ' Загружено скидок: ' + dealsData.length);
  } catch (err) {
    console.log(PREFIX + ' Не удалось загрузить deals.ts: ' + err.message);
  }

  let topList;
  let meta;

  if (gameList && gameList.length > 0) {
    // Manual mode: use provided list
    topList = gameList;
    meta = gameList._meta || { month: 'февраль', year: 2026, source: 'PlayStation Blog', region: 'Европа' };
    console.log(PREFIX + ' Ручной режим: ' + topList.length + ' игр');
  } else {
    // Auto mode: fetch from PlayStation Blog
    const lastKnown = loadTopSellersJson();
    const blogData = await topSellersParser.fetchLatestPost(
      lastKnown.month ? { month: lastKnown.month, year: lastKnown.year } : null
    );

    if (!blogData) {
      console.log(PREFIX + ' Нет нового поста, пропускаем');
      return { written: false, count: 0 };
    }

    topList = blogData.games.slice(0, TOP_SELLERS_COUNT).map((name, i) => ({
      name,
      rank: i + 1,
    }));
    meta = {
      month: blogData.month,
      year: blogData.year,
      source: 'PlayStation Blog',
      region: 'Европа',
    };
    console.log(PREFIX + ' Blog: ' + blogData.month + ' ' + blogData.year + ' — ' + topList.length + ' игр');
  }

  // Known cover overrides for games with non-standard filenames
  const COVER_OVERRIDES = {
    'resident-evil-requiem': '/images/covers/Resident-Evil-Requiem.jpg',
    'call-of-duty-black-ops-7': '/images/covers/cod-blops-7.jpg',
    'grand-theft-auto-v': '/images/covers/gta-v.jpg',
    'ea-sports-fc-26': '/images/covers/ea-fc-26.jpg',
  };

  // Resolve each game: find in games.json, fallback to preorders, then RAWG
  const resolved = [];
  for (const entry of topList) {
    const name = entry.name;
    const rank = entry.rank;
    const slug = slugify(name);

    // Search in games.json
    let found = allGames.find(g =>
      slugify(cleanGameName(cleanName(g.name))) === slug ||
      cleanGameName(cleanName(g.name)).toLowerCase() === name.toLowerCase()
    );

    // Search in preorders
    if (!found) {
      const po = allPreorders.find(p =>
        slugify(cleanGameName(cleanName(p.name))) === slug ||
        cleanGameName(cleanName(p.name)).toLowerCase() === name.toLowerCase()
      );
      if (po) {
        found = {
          name: po.name,
          prices: po.prices,
          portraitUrl: po.portraitUrl,
          coverUrl: po.coverUrl,
          rawgGenre: po.rawgGenre,
        };
      }
    }

    // Calculate prices — сначала проверяем скидки (deals), потом обычные цены
    let priceTR = 0;
    let priceUA = 0;

    // Проверить, есть ли игра в текущих скидках
    const deal = dealsData.find(d =>
      d.name.toLowerCase() === name.toLowerCase() ||
      d.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(d.name.toLowerCase())
    );
    if (deal) {
      if (deal.trSalePrice > 0) priceTR = deal.trSalePrice;
      if (deal.uaSalePrice > 0) priceUA = deal.uaSalePrice;
      console.log(PREFIX + '   Скидка найдена: ' + name + ' → TR=' + priceTR + ', UA=' + priceUA);
    }

    // Если скидки нет — обычная цена из games.json
    if (priceTR === 0 && found?.prices?.TR?.editions) {
      const trEds = found.prices.TR.editions.filter(e => e.clientPrice > 0);
      if (trEds.length > 0) {
        priceTR = Math.min(...trEds.map(e => e.clientPrice));
      }
    }
    if (priceUA === 0 && found?.prices?.UA?.editions) {
      const uaEds = found.prices.UA.editions.filter(e => e.clientPrice > 0);
      if (uaEds.length > 0) {
        priceUA = Math.min(...uaEds.map(e => e.clientPrice));
      }
    }

    // Get cover — try Sony portrait first
    let image = '';
    if (found?.portraitUrl) {
      image = found.portraitUrl;
    } else if (found?.coverUrl) {
      image = found.coverUrl;
    }

    // Fallback cover: known overrides, then local file
    if (!image && COVER_OVERRIDES[slug]) {
      image = COVER_OVERRIDES[slug];
    }
    if (!image) {
      image = '/images/covers/' + slug + '.jpg';
    }

    // Genre — приоритет: topSellerGenres → RAWG → fallback
    let genre = gameDescriptions.getTopSellerGenre(name) || '';
    if (!genre && found?.rawgGenre) {
      genre = gameDescriptions.translateGenre(found.rawgGenre) || found.rawgGenre;
    } else if (!genre && found?.genres?.length) {
      genre = gameDescriptions.translateGenre(found.genres[0]) || found.genres[0];
    }

    // Try RAWG if no genre or no price
    if (!genre || (priceTR === 0 && priceUA === 0)) {
      try {
        await new Promise(r => setTimeout(r, 500));
        const rawgData = await rawg.searchGame(name);
        if (rawgData) {
          if (!genre && rawgData.genres?.length) {
            genre = gameDescriptions.translateGenre(rawgData.genres[0]) || rawgData.genres[0];
          }
          if (!image || image.startsWith('/images/')) {
            if (rawgData.slug) {
              try {
                const details = await rawg.fetchGameDetails(rawgData.slug);
                if (details?.background_image) {
                  // Only use if we have no other image
                  if (!image || image.startsWith('/images/')) {
                    image = details.background_image;
                  }
                }
              } catch {}
            }
          }
        }
      } catch {}
    }

    // Apply cover override if still using generic local path
    if (image.startsWith('/images/covers/') && COVER_OVERRIDES[slug]) {
      image = COVER_OVERRIDES[slug];
    }

    // Fallback prices from existing hardcoded data
    if (priceTR === 0) priceTR = entry.priceTR || 0;
    if (priceUA === 0) priceUA = entry.priceUA || 0;
    if (!genre) genre = entry.genre || 'Экшен';
    if ((!image || image.startsWith('/images/')) && entry.image) image = entry.image;

    resolved.push({
      rank,
      title: name,
      genre,
      image,
      platform: 'PS5',
      priceTR,
      priceUA,
    });
  }

  // Save JSON state
  saveTopSellersJson({
    month: meta.month,
    year: meta.year,
    source: meta.source,
    updatedAt: new Date().toISOString(),
    games: resolved,
  });

  // Generate TS
  const monthCapitalized = meta.month.charAt(0).toUpperCase() + meta.month.slice(1);
  const { content, count } = generateTopSellersTs(resolved, {
    month: monthCapitalized + ' ' + meta.year,
    region: meta.region || 'Европа',
    source: meta.source || 'PlayStation Blog',
  });

  if (!ENABLED) {
    console.log(PREFIX + ' Запись отключена');
    return { written: false, count };
  }

  const filePath = path.join(REPO_ROOT, TOP_SELLERS_FILE);

  // Check if content changed
  try {
    const existing = fs.readFileSync(filePath, 'utf8');
    const strip = s => s.replace(/\/\/ Обновлено:.*\n/, '');
    if (strip(existing) === strip(content)) {
      console.log(PREFIX + ' top-sellers.ts не изменился');
      return { written: false, count };
    }
  } catch {}

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(PREFIX + ' ✅ ' + filePath + ' (' + count + ' игр)');

  const pushed = gitPushTopSellers(count);

  return { written: true, count, pushed, month: meta.month, year: meta.year };
}

// ── Export ───────────────────────────────────────────────────────────────

module.exports = {
  generateAndWrite,
  generateDealsTs,
  generatePreorders,
  generateHotReleases,
  generateTopSellers,
};
