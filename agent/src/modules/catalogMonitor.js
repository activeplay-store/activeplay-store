const fs = require('fs');
const path = require('path');
const notifier = require('./notifier');

const PREFIX = '[Каталог]';
const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'catalogs');

const CATALOG_UUIDS = {
  gameCatalog: '3a7006fe-e26f-49fe-87e5-4473d7ed0fb2',  // Extra
  classics: '8056ad23-7f30-485c-a628-b99f9d5aec5d',      // Deluxe Classics
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

function saveCatalog(name, data) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`${PREFIX} ${name} сохранён: ${data.games.length} игр`);
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ── Essential ───────────────────────────────────────────────────────────

async function parseEssentialSource() {
  // For now: reads from essential.json (updated via bot or manually)
  // Future: auto-parse pushsquare.com/guides/all-ps-plus-games
  return loadCatalog('essential').games || [];
}

async function checkEssential() {
  const current = loadCatalog('essential');
  const fresh = await parseEssentialSource();

  const added = fresh.filter(g => !current.games.find(c => c.id === g.id));
  const removed = current.games.filter(g => !fresh.find(f => f.id === g.id));

  if (added.length === 0 && removed.length === 0) {
    console.log(`${PREFIX} Essential — без изменений`);
    return { changed: false };
  }

  const addedNames = added.map(g => g.name).join(', ');
  const removedNames = removed.map(g => g.name).join(', ');

  let msg = '📦 Essential обновлён!';
  if (addedNames) msg += `\n➕ ${addedNames}`;
  if (removedNames) msg += `\n➖ ${removedNames}`;
  notifier.sendAlert('catalog_update', msg);

  saveCatalog('essential', {
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: fresh,
  });

  return { changed: true, added, removed };
}

// ── Extra ───────────────────────────────────────────────────────────────

async function checkExtra() {
  const sony = require('./parsers/sony');
  const current = loadCatalog('extra');

  console.log(`${PREFIX} Extra — парсинг каталога...`);
  const freshGames = await sony.fetchCategoryGames(CATALOG_UUIDS.gameCatalog, 'TR');
  console.log(`${PREFIX} Extra — получено ${freshGames.length} игр`);

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
  console.log(`${PREFIX} Classics — получено ${freshGames.length} игр`);

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
  console.log(`${PREFIX} Game Trials — проверка (заглушка)`);
  return { changed: false };
}

async function checkEAPlay() {
  console.log(`${PREFIX} EA Play — проверка (заглушка)`);
  return { changed: false };
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
  checkExtra,
  checkClassics,
  checkTrials,
  checkEAPlay,
  checkAllExtra,
  loadCatalog,
  saveCatalog,
};
