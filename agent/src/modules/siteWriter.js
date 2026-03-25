const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../config');
const parsers = require('./parsers');

const PREFIX = '[SiteWriter]';

// ── Config ──────────────────────────────────────────────────────────────

const SW_CONFIG = config.siteWriter || {};
const REPO_ROOT = SW_CONFIG.repoRoot || '/var/www/activeplay-store';
const DEALS_FILE = SW_CONFIG.dealsFile || 'src/data/deals.ts';
const MIN_DISCOUNT = SW_CONFIG.minDiscountPct || 10;
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
  const name = cleanName(game.name);
  const platforms = parsePlatforms(game.platform);
  const coverUrl = game.platprices?.coverArt || game.platprices?.img || game.coverUrl || '';
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
  };
}

// ── Generate TypeScript string ──────────────────────────────────────────

function generateDealsTs(games) {
  const deals = [];
  for (const game of games) {
    const deal = mapGameToDeal(game);
    if (deal) deals.push(deal);
  }

  const trCount = deals.filter(d => d.prices.TR).length;
  const uaCount = deals.filter(d => d.prices.UA).length;
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

  out += `export const dealsData: DealGame[] = [\n`;

  for (const deal of deals) {
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

// ── Export ───────────────────────────────────────────────────────────────

module.exports = {
  generateAndWrite,
  generateDealsTs,
};
