const fs = require('fs');
const path = require('path');
const notifier = require('./notifier');

const PREFIX = '[Каталог]';
const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'catalogs');

const CATALOG_UUIDS = {
  gameCatalog: '3a7006fe-e26f-49fe-87e5-4473d7ed0fb2',  // Extra
  classics: '8056ad23-7f30-485c-a628-b99f9d5aec5d',      // Deluxe Classics
};

let SW_CONFIG = {};
try { SW_CONFIG = require('../config').siteWriter || {}; } catch {}
const REPO_ROOT = SW_CONFIG.repoRoot || '/var/www/activeplay-store';
const SITE_CATALOG_MAP = {
  extra: 'catalog-extra.json',
  classics: 'catalog-classics.json',
  trials: 'catalog-trials.json',
  eaplay: 'catalog-eaplay.json',
};

// ── Helpers ─────────────────────────────────────────────────────────────

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadCatalog(name) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return { updatedAt: null, month: null, games: [] };
  }
}

function toSiteCatalog(data) {
  const lastUpdated = (data.updatedAt || new Date().toISOString()).split('T')[0];
  const games = (data.games || [])
    .map(g => ({
      title: g.name || g.title || '',
      platform: Array.isArray(g.platforms) ? g.platforms : (Array.isArray(g.platform) ? g.platform : ['PS5']),
    }))
    .filter(g => g.title)
    .sort((a, b) => a.title.localeCompare(b.title, 'en'));
  return { lastUpdated, totalGames: games.length, games };
}

function syncToSite(name, data) {
  const fileName = SITE_CATALOG_MAP[name];
  if (!fileName) return;
  const siteDataPath = path.join(REPO_ROOT, 'src', 'data', fileName);
  try {
    const transformed = toSiteCatalog(data);
    fs.writeFileSync(siteDataPath, JSON.stringify(transformed, null, 2) + '\n', 'utf8');
    console.log(`${PREFIX} Sync → site: ${fileName} (${transformed.totalGames} игр, ${transformed.lastUpdated})`);
  } catch (err) {
    console.error(`${PREFIX} Sync → site failed for ${name}: ${err.message}`);
  }
}

function saveCatalog(name, data) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`${PREFIX} ${name} сохранён: ${data.games.length} игр`);
  syncToSite(name, data);
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Essential ───────────────────────────────────────────────────────────

async function checkEssential() {
  const current = loadCatalog('essential');
  const currentMonth = getCurrentMonth();

  if (current.month === currentMonth && current.games.length > 0) {
    console.log(`${PREFIX} Essential — актуален (${currentMonth}, ${current.games.length} игр)`);
    return { changed: false };
  }

  // Если месяц не совпадает — каталог устарел, шлём алерт
  console.log(`${PREFIX} Essential — устарел! Текущий: ${current.month}, ожидается: ${currentMonth}`);
  notifier.sendAlert('catalog_update', `⚠️ Essential каталог устарел!\nМесяц в файле: ${current.month}\nТекущий месяц: ${currentMonth}\nОбновите каталог вручную или дождитесь новости.`);
  return { changed: false, stale: true };
}

/**
 * Update Essential catalog from a published news article.
 * Called by news pipeline when PS Plus Essential monthly games article is detected.
 * @param {Array<{name: string, platforms: string[]}>} games — game list from article
 */
async function updateEssentialFromNews(games) {
  if (!games || games.length === 0) {
    console.log(`${PREFIX} Essential updateFromNews — пустой список игр`);
    return { changed: false };
  }

  const current = loadCatalog('essential');
  const newGames = games.map(g => ({
    id: slugify(g.name),
    name: g.name,
    platforms: g.platforms || ['PS5'],
  }));

  const currentIds = new Set(current.games.map(g => g.id));
  const newIds = new Set(newGames.map(g => g.id));
  const added = newGames.filter(g => !currentIds.has(g.id));
  const removed = current.games.filter(g => !newIds.has(g.id));

  if (added.length === 0 && removed.length === 0) {
    console.log(`${PREFIX} Essential — без изменений (из новости)`);
    return { changed: false };
  }

  saveCatalog('essential', {
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: newGames,
  });

  const addedNames = added.map(g => g.name).join(', ');
  const removedNames = removed.map(g => g.name).join(', ');
  let msg = '📦 Essential обновлён из новости!';
  if (addedNames) msg += `\n➕ ${addedNames}`;
  if (removedNames) msg += `\n➖ ${removedNames}`;
  notifier.sendAlert('catalog_update', msg);

  console.log(`${PREFIX} Essential обновлён: ${newGames.length} игр`);

  // Обновить psplus.ts на сайте
  try {
    const siteWriter = require('./siteWriter');
    const result = await siteWriter.generateEssentialShowcase();
    if (result.pushed) {
      console.log(`${PREFIX} Essential showcase обновлён на сайте`);
    }
  } catch (err) {
    console.error(`${PREFIX} Essential showcase ошибка: ${err.message}`);
  }

  return { changed: true, added, removed };
}

// ── Extra ───────────────────────────────────────────────────────────────

async function checkExtra() {
  const sony = require('./parsers/sony');
  const current = loadCatalog('extra');

  console.log(`${PREFIX} Extra — парсинг каталога...`);
  const freshGames = await sony.fetchCategoryGames(CATALOG_UUIDS.gameCatalog, 'TR');
  console.log(`${PREFIX} Extra — получено ${freshGames?.length || 0} игр`);

  if (!freshGames || freshGames.length < 100) {
    const count = freshGames?.length || 0;
    console.error(`${PREFIX} Extra: Sony вернула ${count} игр (ожидается 400+), не обновляю.`);
    try {
      await notifier.sendAlert('catalog_suspicious',
        `⚠️ Extra: Sony вернула ${count} игр (ожидается 400+). Старые данные сохранены.`);
    } catch {}
    return { changed: false, skipped: true, reason: 'too_few_games', count };
  }

  const currentIds = new Set(current.games.map(g => g.id));
  const freshIds = new Set(freshGames.map(g => g.id));

  const added = freshGames.filter(g => !currentIds.has(g.id));
  const removed = current.games.filter(g => !freshIds.has(g.id));

  if (added.length === 0 && removed.length === 0) {
    console.log(`${PREFIX} Extra — без изменений`);
    return { changed: false };
  }

  let msg = `📦 Extra обновлён!\n➕ ${added.length} игр добавлено\n➖ ${removed.length} игр удалено`;
  if (added.length > 0) {
    msg += `\n\nНовые: ${added.slice(0, 10).map(g => g.name).join(', ')}${added.length > 10 ? '...' : ''}`;
  }
  notifier.sendAlert('catalog_update', msg);

  const merged = [
    ...current.games.filter(g => freshIds.has(g.id)),
    ...added.map(g => ({ ...g, addedAt: today() })),
  ];

  saveCatalog('extra', {
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: merged,
  });

  return { changed: true, added, removed };
}

// ── Deluxe Classics ─────────────────────────────────────────────────────

async function checkClassics() {
  const sony = require('./parsers/sony');
  const current = loadCatalog('classics');

  console.log(`${PREFIX} Classics — парсинг каталога...`);
  const freshGames = await sony.fetchCategoryGames(CATALOG_UUIDS.classics, 'TR');
  console.log(`${PREFIX} Classics — получено ${freshGames?.length || 0} игр`);

  if (!freshGames || freshGames.length < 100) {
    const count = freshGames?.length || 0;
    console.error(`${PREFIX} Classics: Sony вернула ${count} игр (ожидается 400+), не обновляю.`);
    try {
      await notifier.sendAlert('catalog_suspicious',
        `⚠️ Classics: Sony вернула ${count} игр (ожидается 400+). Старые данные сохранены.`);
    } catch {}
    return { changed: false, skipped: true, reason: 'too_few_games', count };
  }

  const currentIds = new Set(current.games.map(g => g.id));
  const freshIds = new Set(freshGames.map(g => g.id));

  const added = freshGames.filter(g => !currentIds.has(g.id));
  const removed = current.games.filter(g => !freshIds.has(g.id));

  if (added.length === 0 && removed.length === 0) {
    console.log(`${PREFIX} Classics — без изменений`);
    return { changed: false };
  }

  let msg = `📦 Deluxe Classics обновлён!\n➕ ${added.length} игр\n➖ ${removed.length} игр`;
  if (added.length > 0) {
    msg += `\n\nНовые: ${added.map(g => g.name).join(', ')}`;
  }
  notifier.sendAlert('catalog_update', msg);

  saveCatalog('classics', {
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: [
      ...current.games.filter(g => freshIds.has(g.id)),
      ...added.map(g => ({ ...g, addedAt: today() })),
    ],
  });

  return { changed: true, added, removed };
}

// ── Stubs ───────────────────────────────────────────────────────────────

async function checkTrials() {
  // Sony categoryGridRetrieve rejects "game-trials" (Invalid args); no UUID
  // maps to the Trials category. List is curated manually via src/data/
  // catalog-trials.json — do not overwrite.
  console.log(`${PREFIX} Game Trials: источник не подключён, данные не обновляю`);
  return { changed: false, notImplemented: true };
}

async function checkEAPlay() {
  // EA Play does not expose a public categoryGrid UUID reachable from
  // fetchCategoryGames. src/data/catalog-eaplay.json stays manual.
  console.log(`${PREFIX} EA Play: источник не подключён, данные не обновляю`);
  return { changed: false, notImplemented: true };
}

// ── Check all ───────────────────────────────────────────────────────────

async function checkAllExtra() {
  const results = {};
  results.extra = await checkExtra();
  results.classics = await checkClassics();
  results.trials = await checkTrials();
  results.eaplay = await checkEAPlay();
  return results;
}

// ── Export ───────────────────────────────────────────────────────────────

module.exports = {
  checkEssential,
  updateEssentialFromNews,
  checkExtra,
  checkClassics,
  checkTrials,
  checkEAPlay,
  checkAllExtra,
  loadCatalog,
  saveCatalog,
};
