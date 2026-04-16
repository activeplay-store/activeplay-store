process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err.stack || err.message);
  try {
    const fs = require('fs');
    fs.appendFileSync(require('path').join(__dirname, '..', 'data', 'crash.log'),
      `[${new Date().toISOString()}] UNCAUGHT: ${err.stack || err.message}\n`);
  } catch(e) {}
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled rejection:', reason);
  try {
    const fs = require('fs');
    fs.appendFileSync(require('path').join(__dirname, '..', 'data', 'crash.log'),
      `[${new Date().toISOString()}] REJECTION: ${reason}\n`);
  } catch(e) {}
});

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const http = require('http');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const config = require('./config');
const currency = require('./modules/currency');
const pricing = require('./modules/pricing');
const parsers = require('./modules/parsers');
const sony = require('./modules/parsers/sony');
const notifier = require('./modules/notifier');
const logger = require('./modules/logger');
const siteWriter = require('./modules/siteWriter');
const catalogMonitor = require('./modules/catalogMonitor');
const { runNewsCycle } = require('./modules/news');
const locks = require('./modules/utils/locks');

async function safeRunNewsCycle(bot) {
  if (locks.newsCycle.isLocked()) {
    console.log('[NEWS] Cycle already running, skipping');
    return;
  }
  await locks.newsCycle.runExclusive(async () => {
    await safeRunNewsCycle(bot);
  });
}
const { handleVoice, setupEditHandlers } = require('./modules/voice/handler');

const VERSION = '1.0.0';

// ── PS Plus Calendar ────────────────────────────────────────────────────

const PS_PLUS_CALENDAR = {
  essential: {
    announce: ['2026-04-01','2026-04-29','2026-05-27','2026-07-01','2026-07-29','2026-08-26','2026-09-30','2026-10-28','2026-11-25','2026-12-30','2027-01-28','2027-02-24'],
    release:  ['2026-04-07','2026-05-05','2026-06-02','2026-07-07','2026-08-04','2026-09-01','2026-10-06','2026-11-03','2026-12-01','2027-01-05','2027-02-02','2027-03-02'],
  },
  extra: {
    announce: ['2026-04-15','2026-05-13','2026-06-10','2026-07-15','2026-08-12','2026-09-09','2026-10-14','2026-11-11','2026-12-09','2027-01-13','2027-02-10','2027-03-10'],
    release:  ['2026-04-21','2026-05-19','2026-06-16','2026-07-21','2026-08-18','2026-09-15','2026-10-20','2026-11-17','2026-12-15','2027-01-19','2027-02-16','2027-03-16'],
  },
};

function getTodayMoscow() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Moscow' });
}
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

  // Обновить preorders.ts на сайте
  try {
    const preorderResult = await siteWriter.generatePreorders();
    if (preorderResult.written) {
      console.log(`[Agent] preorders.ts обновлён: ${preorderResult.count} предзаказов`);
      if (preorderResult.pushed) {
        notifier.sendAlert('site_updated', `📦 Предзаказы обновлены: ${preorderResult.count} игр`);
      }
    }
  } catch (err) {
    console.log(`[Agent] Preorders ошибка: ${err.message}`);
  }

  // Обновить hotReleases.ts (горящие новинки с хайп-скорингом)
  try {
    const hotResult = await siteWriter.generateHotReleases();
    if (hotResult.written) {
      console.log(`[Agent] hotReleases.ts обновлён: ${hotResult.count} новинок`);
      if (hotResult.pushed) {
        notifier.sendAlert('site_updated', `🔥 Горящие новинки обновлены: ${hotResult.count} игр`);
      }
    }
  } catch (err) {
    console.log(`[Agent] HotReleases ошибка: ${err.message}`);
  }

  // Обновить top-sellers.ts (топ-продаж из PlayStation Blog)
  try {
    const topResult = await siteWriter.generateTopSellers();
    if (topResult.written) {
      console.log(`[Agent] top-sellers.ts обновлён: ${topResult.count} игр`);
      if (topResult.pushed) {
        notifier.sendAlert('site_updated', `🏆 Топ-продаж обновлён: ${topResult.month} ${topResult.year}`);
      }
    }
  } catch (err) {
    console.log(`[Agent] TopSellers ошибка: ${err.message}`);
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

// ── Catalog checks ───────────────────────────────────────────────────────

async function checkAnnouncements() {
  const today = getTodayMoscow();

  if (PS_PLUS_CALENDAR.essential.announce.includes(today)) {
    console.log('[Каталог] Сегодня анонс Essential — мониторим...');
    notifier.sendAlert('catalog_announce', '📢 Сегодня день анонса PS Plus Essential!\nМониторим PlayStation Blog и pushsquare...');
  }

  if (PS_PLUS_CALENDAR.extra.announce.includes(today)) {
    console.log('[Каталог] Сегодня анонс Extra/Deluxe — мониторим...');
    notifier.sendAlert('catalog_announce', '📢 Сегодня день анонса PS Plus Extra/Deluxe!\nМониторим PlayStation Blog и pushsquare...');
  }
}

async function checkCatalogRelease() {
  const today = getTodayMoscow();

  if (PS_PLUS_CALENDAR.essential.release.includes(today)) {
    console.log('[Каталог] Сегодня релиз Essential — парсим...');
    try {
      const result = await catalogMonitor.checkEssential();
      if (!result.changed) console.log('[Каталог] Essential — пока без изменений, повтор в 22:00');
    } catch (err) {
      console.error('[Каталог] Essential ошибка:', err.message);
    }
  }

  if (PS_PLUS_CALENDAR.extra.release.includes(today)) {
    console.log('[Каталог] Сегодня релиз Extra/Deluxe — парсим...');
    try {
      const result = await catalogMonitor.checkAllExtra();
      if (!result.extra?.changed && !result.classics?.changed) {
        console.log('[Каталог] Extra/Deluxe — пока без изменений, повтор в 22:00');
      }
    } catch (err) {
      console.error('[Каталог] Extra/Deluxe ошибка:', err.message);
    }
  }
}

async function checkCatalogRetry() {
  const today = getTodayMoscow();

  if (PS_PLUS_CALENDAR.essential.release.includes(today)) {
    const current = catalogMonitor.loadCatalog('essential');
    if (!current.updatedAt || !current.updatedAt.startsWith(today)) {
      console.log('[Каталог] Essential — повторная проверка 22:00...');
      try { await catalogMonitor.checkEssential(); }
      catch (err) { console.error('[Каталог] Essential retry:', err.message); }
    }
  }

  if (PS_PLUS_CALENDAR.extra.release.includes(today)) {
    const current = catalogMonitor.loadCatalog('extra');
    if (!current.updatedAt || !current.updatedAt.startsWith(today)) {
      console.log('[Каталог] Extra — повторная проверка 22:00...');
      try { await catalogMonitor.checkAllExtra(); }
      catch (err) { console.error('[Каталог] Extra retry:', err.message); }
    }
  }
}

// ── HTTP server ──────────────────────────────────────────────────────────

let lastUpdate = null;

function isLocalRequest(req) {
  const ip = req.socket.remoteAddress;
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

function checkAuth(req) {
  if (isLocalRequest(req)) return true;
  const token = req.headers['authorization'];
  return token === `Bearer ${process.env.AGENT_API_TOKEN}`;
}

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
    if (!checkAuth(req)) { res.statusCode = 401; res.end(JSON.stringify({ error: 'Unauthorized' })); return; }
    res.end(JSON.stringify({ status: 'started' }));
    runNightlyParse().catch(err => console.error('[Ручной парсинг]', err.message));
    return;
  }

  if (req.url === '/check-essential') {
    catalogMonitor.checkEssential()
      .then(r => { res.end(JSON.stringify(r)); })
      .catch(err => { res.statusCode = 500; res.end(JSON.stringify({ error: err.message })); });
    return;
  }

  if (req.url === '/check-catalogs') {
    (async () => {
      const essential = await catalogMonitor.checkEssential();
      const allExtra = await catalogMonitor.checkAllExtra();
      return { essential, ...allExtra };
    })()
      .then(r => { res.end(JSON.stringify(r)); })
      .catch(err => { res.statusCode = 500; res.end(JSON.stringify({ error: err.message })); });
    return;
  }

  if (req.url === '/update-rates') {
    if (!checkAuth(req)) { res.statusCode = 401; res.end(JSON.stringify({ error: 'Unauthorized' })); return; }
    res.end(JSON.stringify({ status: 'started' }));
    updateRates().catch(console.error);
    return;
  }

  if (req.url === '/hot-releases') {
    if (!checkAuth(req)) { res.statusCode = 401; res.end(JSON.stringify({ error: 'Unauthorized' })); return; }
    res.end(JSON.stringify({ status: 'started' }));
    siteWriter.generateHotReleases().catch(err => console.error('[HotReleases]', err.message));
    return;
  }

  if (req.url === '/top-sellers') {
    if (!checkAuth(req)) { res.statusCode = 401; res.end(JSON.stringify({ error: 'Unauthorized' })); return; }
    res.end(JSON.stringify({ status: 'started' }));
    siteWriter.generateTopSellers().catch(err => console.error('[TopSellers]', err.message));
    return;
  }

  // POST /publish — приём решений из agent-bot
  if (req.method === 'POST' && req.url === '/publish') {
    if (!checkAuth(req)) { res.statusCode = 401; res.end(JSON.stringify({ error: 'Unauthorized' })); return; }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { id, approved, targets } = JSON.parse(body);
        if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }

        console.log(`[PUBLISH] ${approved ? 'APPROVED' : 'REJECTED'}: ${id}, targets: ${targets || 'default'}`);

        if (approved) {
          const { executePublish } = require('./modules/news/approval');
          await executePublish(null, id, targets);
          res.end(JSON.stringify({ ok: true, action: 'published' }));
        } else {
          const { loadPending, savePending } = require('./modules/news/approval');
          const pending = loadPending();
          savePending(pending.filter(a => a.id !== id));
          res.end(JSON.stringify({ ok: true, action: 'rejected' }));
        }
      } catch (err) {
        console.error('[PUBLISH] Error:', err.message);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
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

  // ── Telegram Bot (для новостей и уведомлений) ──────────────────────────
  let bot = null;
  if (process.env.BOT_TOKEN) {
    bot = new Telegraf(process.env.BOT_TOKEN);

    // NOTE: setupApprovalHandlers удалён — approval handlers только в agent-bot.
    // Обработчики кнопок редактирования (голосовые команды)
    setupEditHandlers(bot);

    // Голосовые сообщения от админа
    bot.on('voice', async (ctx) => {
      try {
        await handleVoice(ctx, bot);
      } catch (err) {
        console.error('[VOICE] Error:', err.message);
        try { await ctx.reply(`❌ Ошибка: ${err.message}`); } catch (_) {}
      }
    });

    // Команда /id — узнать свой chat ID
    bot.command('id', (ctx) => {
      ctx.reply(`Ваш Chat ID: ${ctx.chat.id}`);
    });

    // Команда /news — запустить цикл новостей вручную
    bot.command('news', async (ctx) => {
      if (String(ctx.chat.id) !== String(process.env.ADMIN_CHAT_ID)) return;
      ctx.reply('🔄 Запускаю сбор новостей...');
      try {
        await safeRunNewsCycle(bot);
      } catch (err) {
        ctx.reply(`❌ Ошибка: ${err.message}`);
      }
    });

    // Команда /republish — опубликовать существующую новость в VK/TG
    bot.command('republish', async (ctx) => {
      if (String(ctx.chat.id) !== String(process.env.ADMIN_CHAT_ID)) return;
      const { showRepublishMenu } = require('./modules/news/approval');
      await showRepublishMenu(bot, ctx);
    });

    // NOTE: setupRepublishHandlers удалён — republish handlers только в agent-bot.

    // NOTE: bot.launch() и processQueue удалены — polling и очередь
    // обрабатываются ТОЛЬКО в agent-bot, чтобы избежать двойного polling.
    // Агент использует bot только для отправки сообщений (API-only mode).
    console.log('[Bot] Telegram bot ready (API-only mode, no polling)');
  } else {
    console.log('[Bot] BOT_TOKEN not set — Telegram bot disabled');
  }

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

  // Анонсы каталогов: 18:00 МСК (по календарю)
  cron.schedule('0 18 * * *', async () => {
    try { await checkAnnouncements(); }
    catch (err) { console.error('[Cron] Анонсы:', err.message); }
  }, { timezone: 'Europe/Moscow' });

  // Релиз каталогов: 20:00 МСК (по календарю)
  cron.schedule('0 20 * * *', async () => {
    try {
      await checkAnnouncements();
      await checkCatalogRelease();
    } catch (err) {
      console.error('[Cron] Каталоги 20:00:', err.message);
      notifier.sendAlert('source_down', 'Каталоги 20:00 упали: ' + err.message);
    }
  }, { timezone: 'Europe/Moscow' });

  // Повторная проверка каталогов: 22:00 МСК
  cron.schedule('0 22 * * *', async () => {
    try { await checkCatalogRetry(); }
    catch (err) { console.error('[Cron] Каталоги 22:00:', err.message); }
  }, { timezone: 'Europe/Moscow' });

  // Горящие новинки: 12:00 МСК (дополнительный прогон для свежих хайп-данных)
  cron.schedule('0 12 * * *', async () => {
    console.log('[Cron] Обновление горящих новинок (12:00)...');
    try {
      const result = await siteWriter.generateHotReleases();
      if (result.written) {
        console.log(`[Agent] hotReleases.ts обновлён: ${result.count} новинок`);
      }
    } catch (err) {
      console.error('[Cron] HotReleases:', err.message);
    }
  }, { timezone: 'Europe/Moscow' });

  // Топ-продаж PS5: 06:00 МСК ежедневно (проверяет PlayStation Blog)
  cron.schedule('0 6 * * *', async () => {
    console.log('[Cron] Проверка топ-продаж (06:00)...');
    try {
      const result = await siteWriter.generateTopSellers();
      if (result.written) {
        console.log(`[Agent] top-sellers.ts обновлён: ${result.count} игр (${result.month} ${result.year})`);
        if (result.pushed) {
          notifier.sendAlert('site_updated', `🏆 Топ-продаж обновлён: ${result.month} ${result.year} — ${result.count} игр`);
        }
      }
    } catch (err) {
      console.error('[Cron] TopSellers:', err.message);
    }
  }, { timezone: 'Europe/Moscow' });

  // Новости: каждые 4 часа (8:00, 12:00, 16:00, 20:00 МСК)
  if (bot) {
    cron.schedule('0 8,12,16,20 * * *', async () => {
      console.log('[Cron] Сбор новостей...');
      try {
        await safeRunNewsCycle(bot);
      } catch (err) {
        console.error('[Cron] Новости:', err.message);
      }
    }, { timezone: 'Europe/Moscow' });
  }

  console.log('[AP-Agent] Расписание:');
  console.log('  Парсинг скидок: 3:00 МСК ежедневно');
  console.log('  Курс ЦБ: 10:00 и 17:00 МСК');
  console.log('  Топ-продаж: 6:00 МСК ежедневно');
  console.log('  Горящие новинки: 3:00 и 12:00 МСК');
  console.log('  Новости: 8:00, 12:00, 16:00, 20:00 МСК');
  console.log('  Анонсы каталогов: 18:00 МСК (по календарю)');
  console.log('  Релиз каталогов: 20:00 МСК (по календарю)');
  console.log('  Повтор каталогов: 22:00 МСК');

  server.listen(PORT, () => {
    console.log(`[AP-Agent] Health-check: http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error(`[AP-Agent] Критическая ошибка: ${err.message}`);
  process.exit(1);
});
