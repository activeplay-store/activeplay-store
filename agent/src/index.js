const http = require('http');
const cron = require('node-cron');
const config = require('./config');
const currency = require('./modules/currency');
const pricing = require('./modules/pricing');
const parsers = require('./modules/parsers');
const sony = require('./modules/parsers/sony');
const notifier = require('./modules/notifier');
const logger = require('./modules/logger');
const siteWriter = require('./modules/siteWriter');

const VERSION = '1.0.0';
const PORT = 3900;

// ── Helpers ──────────────────────────────────────────────────────────────

function formatRatesLog(rates) {
  return config.currencies
    .filter(code => rates[code])
    .map(code => `${code}: ${rates[code].internal}`)
    .join(' | ');
}

// ── Rates update ─────────────────────────────────────────────────────────

async function updateRates() {
  try {
    const result = await currency.fetchAndSave();
    if (result.rates) {
      console.log(`[Курсы] ${formatRatesLog(result.rates)} | Источник: ${result.source || 'cache'}`);
    }
    if (result.changed && result.changes.length > 0) {
      console.log(`[Курсы] Изменение: ${result.changes.map(c => `${c.code} ${c.from} -> ${c.to}`).join(', ')}`);
      // Курс изменился — пересчитать deals.ts
      try {
        const writeResult = await siteWriter.generateAndWrite();
        if (writeResult.written) {
          console.log(`[Agent] deals.ts пересчитан после изменения курса: ${writeResult.gamesCount} игр`);
        }
      } catch (err) {
        console.log(`[Agent] SiteWriter после курса: ${err.message}`);
      }
    }
    lastUpdate = new Date().toISOString();
    return result;
  } catch (err) {
    console.log(`[Курсы] Ошибка: ${err.message}`);
    return null;
  }
}

// ── Nightly parse ────────────────────────────────────────────────────────

async function runNightlyParse() {
  const startTime = Date.now();
  console.log('[Парсер] Ночной парсинг запущен...');

  const previousData = parsers.loadGames();
  const { result } = await parsers.runFullParse();

  const duration = Math.round((Date.now() - startTime) / 1000);

  // Detect changes
  const changes = detectChanges(previousData, result.games);

  // Log
  logger.logPrice({
    gamesCount: result.games.length,
    newDeals: changes.newDeals.length,
    expiredDeals: changes.expiredDeals.length,
    newPreorders: changes.newPreorders.length,
    priceChanges: changes.priceChanges.length,
    source: 'sony',
    regions: ['TR', 'UA'],
    duration
  });

  // Alert
  let alertMsg = `Парсинг: ${result.games.length} игр за ${duration}с`;
  if (changes.newDeals.length > 0) alertMsg += `\nНовые скидки: ${changes.newDeals.length}`;
  if (changes.expiredDeals.length > 0) alertMsg += `\nЗакончились: ${changes.expiredDeals.length}`;
  if (changes.newPreorders.length > 0) alertMsg += `\nНовые предзаказы: ${changes.newPreorders.length}`;
  if (changes.priceChanges.length > 0) alertMsg += `\nИзменения цен: ${changes.priceChanges.length}`;
  notifier.sendAlert('parse_complete', alertMsg);

  // Detail alerts
  if (changes.newDeals.length > 0) {
    const top5 = changes.newDeals.slice(0, 5);
    notifier.sendAlert('new_deals', `Новые скидки: ${top5.map(g => g.name).join(', ')}${changes.newDeals.length > 5 ? ` и ещё ${changes.newDeals.length - 5}` : ''}`);
  }
  if (changes.newPreorders.length > 0) {
    notifier.sendAlert('new_preorders', `Новые предзаказы: ${changes.newPreorders.map(g => g.name).join(', ')}`);
  }

  console.log(`[Парсер] Ночной парсинг завершён за ${duration}с: ${result.games.length} игр`);

  // Обновить deals.ts на сайте
  try {
    const writeResult = await siteWriter.generateAndWrite();
    if (writeResult.written) {
      console.log(`[Agent] deals.ts обновлён: ${writeResult.gamesCount} игр`);
      if (writeResult.pushed) {
        notifier.sendAlert('site_updated', `🌐 Сайт обновлён: ${writeResult.gamesCount} игр со скидкой`);
      }
    }
  } catch (err) {
    console.log(`[Agent] SiteWriter ошибка: ${err.message}`);
  }
}

function detectChanges(oldData, newGames) {
  const oldGames = oldData?.games || [];
  const oldIds = new Set(oldGames.map(g => g.id));
  const newIds = new Set((newGames || []).map(g => g.id));

  const newDeals = (newGames || []).filter(g => !oldIds.has(g.id) && g.bestPrice?.discountPct > 0);
  const expiredDeals = oldGames.filter(g => !newIds.has(g.id) && g.bestPrice?.discountPct > 0);
  const newPreorders = (newGames || []).filter(g => !oldIds.has(g.id) && g.status === 'preorder');

  const priceChanges = [];
  for (const ng of (newGames || [])) {
    const og = oldGames.find(g => g.id === ng.id);
    if (og && og.bestPrice && ng.bestPrice && og.bestPrice.clientPrice !== ng.bestPrice.clientPrice) {
      priceChanges.push({ name: ng.name, oldPrice: og.bestPrice.clientPrice, newPrice: ng.bestPrice.clientPrice });
    }
  }

  return { newDeals, expiredDeals, newPreorders, priceChanges };
}

// ── Catalog stubs ────────────────────────────────────────────────────────

async function checkCatalogEssential() {
  console.log('[Каталог] Проверка Essential...');
  notifier.sendAlert('parse_complete', 'Проверка Essential — модуль в разработке');
}

async function checkCatalogsMonthly() {
  console.log('[Каталог] Проверка Extra/Deluxe/Trials/EA Play...');
  notifier.sendAlert('parse_complete', 'Проверка Extra/Deluxe/Trials/EA Play — модуль в разработке');
}

// ── HTTP server ──────────────────────────────────────────────────────────

let lastUpdate = null;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url && req.url.startsWith('/price')) {
    const params = new URL(req.url, 'http://localhost').searchParams;
    const amount = parseFloat(params.get('amount'));
    const region = (params.get('region') || 'TR').toUpperCase();
    if (!amount || isNaN(amount)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'amount is required' })); return; }
    try { res.end(JSON.stringify(pricing.calculatePrice(amount, region))); }
    catch (err) { res.statusCode = 400; res.end(JSON.stringify({ error: err.message })); }
    return;
  }

  if (req.url === '/anchors') {
    res.end(JSON.stringify({ TR: pricing.getAnchors('TR'), UA: pricing.getAnchors('UA') }));
    return;
  }

  if (req.url === '/rates') {
    res.end(JSON.stringify(currency.loadSavedRates() || { error: 'no data' }));
    return;
  }

  if (req.url === '/games' || req.url === '/games/') {
    res.end(JSON.stringify(parsers.loadGames()));
    return;
  }

  if (req.url && req.url.startsWith('/games/')) {
    const gameId = req.url.replace('/games/', '');
    const data = parsers.loadGames();
    res.end(JSON.stringify((data.games || []).find(g => g.id === gameId) || { error: 'not found' }));
    return;
  }

  if (req.url === '/parse') {
    res.end(JSON.stringify({ status: 'started' }));
    runNightlyParse().catch(err => console.error('[Ручной парсинг]', err.message));
    return;
  }

  if (req.url === '/check-essential') {
    res.end(JSON.stringify({ status: 'started' }));
    checkCatalogEssential().catch(console.error);
    return;
  }

  if (req.url === '/check-catalogs') {
    res.end(JSON.stringify({ status: 'started' }));
    checkCatalogsMonthly().catch(console.error);
    return;
  }

  if (req.url === '/update-rates') {
    res.end(JSON.stringify({ status: 'started' }));
    updateRates().catch(console.error);
    return;
  }

  // GET / — health check
  res.end(JSON.stringify({
    status: 'ok',
    version: VERSION,
    uptime: process.uptime(),
    lastUpdate
  }));
});

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[AP-Agent] Запуск v${VERSION}`);
  console.log(`[AP-Agent] Timezone: ${process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone}`);

  // Курсы при старте
  await updateRates();

  // Инициализация модуля цен
  const anchorsInfo = pricing.loadAnchors();
  const trCount = anchorsInfo.TR ? anchorsInfo.TR.anchors.length : 0;
  const uaCount = anchorsInfo.UA ? anchorsInfo.UA.anchors.length : 0;
  console.log(`[Цены] Якорные точки: TR (${trCount}), UA (${uaCount})`);

  try {
    const test = pricing.calculatePrice(2999, 'TR');
    console.log(`[Цены] Тест: 2999 TRY -> ${test.clientPrice} руб. (маржа ${test.marginPct}%)`);
  } catch (err) {
    console.log(`[Цены] Ошибка теста: ${err.message}`);
  }

  // ── Cron расписание ──────────────────────────────────────────────────

  // Ночной парсинг: 3:00 МСК ежедневно
  cron.schedule('0 3 * * *', async () => {
    console.log('[Cron] Ночной парсинг...');
    try { await runNightlyParse(); }
    catch (err) {
      console.error('[Cron] Ночной парсинг:', err.message);
      notifier.sendAlert('source_down', 'Ночной парсинг упал: ' + err.message);
    }
  }, { timezone: 'Europe/Moscow' });

  // Курс ЦБ: 10:00 и 17:00 МСК
  cron.schedule('0 10 * * *', async () => {
    console.log('[Cron] Курс ЦБ (10:00)...');
    await updateRates();
  }, { timezone: 'Europe/Moscow' });

  cron.schedule('0 17 * * *', async () => {
    console.log('[Cron] Курс ЦБ (17:00)...');
    await updateRates();
  }, { timezone: 'Europe/Moscow' });

  // Каталог Essential: 8-го числа 4:00 МСК
  cron.schedule('0 4 8 * *', async () => {
    console.log('[Cron] Каталог Essential...');
    try { await checkCatalogEssential(); }
    catch (err) {
      console.error('[Cron] Essential:', err.message);
      notifier.sendAlert('source_down', 'Essential проверка упала: ' + err.message);
    }
  }, { timezone: 'Europe/Moscow' });

  // Каталоги Extra/Deluxe/Trials/EA Play: 20-го числа 4:00 МСК
  cron.schedule('0 4 20 * *', async () => {
    console.log('[Cron] Каталоги Extra + Deluxe + Trials + EA Play...');
    try { await checkCatalogsMonthly(); }
    catch (err) {
      console.error('[Cron] Каталоги:', err.message);
      notifier.sendAlert('source_down', 'Каталоги проверка упала: ' + err.message);
    }
  }, { timezone: 'Europe/Moscow' });

  console.log('[AP-Agent] Расписание:');
  console.log('  Парсинг скидок: 3:00 МСК ежедневно');
  console.log('  Курс ЦБ: 10:00 и 17:00 МСК');
  console.log('  Essential: 8-го числа 4:00 МСК');
  console.log('  Extra/Deluxe: 20-го числа 4:00 МСК');

  server.listen(PORT, () => {
    console.log(`[AP-Agent] Health-check: http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error(`[AP-Agent] Критическая ошибка: ${err.message}`);
  process.exit(1);
});
