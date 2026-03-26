const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../config');
const parsers = require('./parsers');
const sony = require('./parsers/sony');
const pricing = require('./pricing');
const notifier = require('./notifier');
const rawg = require('./parsers/rawg');

const PREFIX = '[SiteWriter]';

// ── Config ──────────────────────────────────────────────────────────────

const SW_CONFIG = config.siteWriter || {};
const REPO_ROOT = SW_CONFIG.repoRoot || '/var/www/activeplay-store';
const DEALS_FILE = SW_CONFIG.dealsFile || 'src/data/deals.ts';
const MIN_DISCOUNT = SW_CONFIG.minDiscountPct || 10;
const PREORDERS_FILE = 'src/data/preorders.ts';
const PREORDERS_JSON_FILE = path.join(__dirname, '..', 'data', 'preorders.json');
const ENABLED = SW_CONFIG.enabled !== false;

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

    const genre = game.rawgGenre || '';
    const description = game.rawgDescription || '';

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


// ── Export ───────────────────────────────────────────────────────────────

module.exports = {
  generateAndWrite,
  generateDealsTs,
  generatePreorders,
};
