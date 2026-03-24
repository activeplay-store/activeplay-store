const http = require('http');
const cron = require('node-cron');
const config = require('./config');
const currency = require('./modules/currency');
const pricing = require('./modules/pricing');
const parsers = require('./modules/parsers');
const sony = require('./modules/parsers/sony');
const psprices = require('./modules/parsers/psprices');
const notifier = require('./modules/notifier');
const logger = require('./modules/logger');

const VERSION = '1.0.0';
const PORT = 3900;

function formatRatesLog(rates) {
  return config.currencies
    .filter(code => rates[code])
    .map(code => `${code}: ${rates[code].internal}`)
    .join(' | ');
}

function formatChangesLog(changes) {
  return changes
    .map(c => `${c.code} ${c.from} → ${c.to} (${c.diff >= 0 ? '+' : ''}${c.diff})`)
    .join(', ');
}

function getNextCronTime(cronExpr) {
  // Простой расчёт следующего запуска для лога
  const parts = cronExpr.split(' ');
  const minute = parts[0];
  const hour = parts[1];
  if (hour === '*/3') return `каждые 3ч в :${minute} мин`;
  return `${hour}:${minute} МСК`;
}

async function runUpdate() {
  try {
    const result = await currency.fetchAndSave();

    if (result.rates) {
      console.log(`[Курсы] ${formatRatesLog(result.rates)} | Источник: ${result.source || 'cache'}`);
    }

    if (result.changed && result.changes.length > 0) {
      console.log(`[Курсы] ⚠️ Изменение: ${formatChangesLog(result.changes)}`);
    }

    return result;
  } catch (err) {
    console.log(`[Курсы] ❌ Ошибка: ${err.message}`);
    return null;
  }
}

// --- HTTP health-check сервер ---
let lastUpdate = null;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url && req.url.startsWith('/price')) {
    const params = new URL(req.url, 'http://localhost').searchParams;
    const amount = parseFloat(params.get('amount'));
    const region = (params.get('region') || 'TR').toUpperCase();

    if (!amount || isNaN(amount)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'amount is required' }));
      return;
    }

    try {
      const result = pricing.calculatePrice(amount, region);
      res.end(JSON.stringify(result));
    } catch (err) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.url === '/anchors') {
    const anchors = { TR: pricing.getAnchors('TR'), UA: pricing.getAnchors('UA') };
    res.end(JSON.stringify(anchors));
    return;
  }

  if (req.url === '/rates') {
    const saved = currency.loadSavedRates();
    res.end(JSON.stringify(saved || { error: 'no data' }));
    return;
  }

  if (req.url === '/games' || req.url === '/games/') {
    const data = parsers.loadGames();
    res.end(JSON.stringify(data));
    return;
  }

  if (req.url && req.url.startsWith('/games/')) {
    const gameId = req.url.replace('/games/', '');
    const data = parsers.loadGames();
    const game = (data.games || []).find(g => g.id === gameId);
    res.end(JSON.stringify(game || { error: 'not found' }));
    return;
  }

  if (req.url === '/parse') {
    res.end(JSON.stringify({ status: 'started' }));
    parsers.runFullParse().catch(err => console.log(`[Парсер] ❌ ${err.message}`));
    return;
  }

  if (req.url === '/parse/preorders') {
    res.end(JSON.stringify({ status: 'started' }));
    (async () => {
      try {
        let trPre = sony.isConfigured() ? await sony.fetchPreorders('TR') : [];
        let uaPre = sony.isConfigured() ? await sony.fetchPreorders('UA') : [];
        if (trPre.length === 0) trPre = await psprices.fetchPreorders('TR').catch(() => []);
        if (uaPre.length === 0) uaPre = await psprices.fetchPreorders('UA').catch(() => []);
        console.log(`[Парсер] Предзаказы: TR ${trPre.length}, UA ${uaPre.length}`);
      } catch (err) {
        console.log(`[Парсер] ❌ Предзаказы: ${err.message}`);
      }
    })();
    return;
  }

  // GET / — health check (fallback)
  res.end(JSON.stringify({
    status: 'ok',
    version: VERSION,
    uptime: process.uptime(),
    lastUpdate
  }));
});

// --- Запуск ---
async function main() {
  console.log(`[AP-Agent] Запуск v${VERSION}`);
  console.log(`[AP-Agent] Timezone: ${process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone}`);

  // Сразу получить курсы при старте
  const result = await runUpdate();
  if (result) {
    lastUpdate = new Date().toISOString();
  }

  // Инициализация модуля цен
  const anchorsInfo = pricing.loadAnchors();
  const trCount = anchorsInfo.TR ? anchorsInfo.TR.anchors.length : 0;
  const uaCount = anchorsInfo.UA ? anchorsInfo.UA.anchors.length : 0;
  console.log(`[Цены] Якорные точки загружены: TR (${trCount} точек), UA (${uaCount} точек)`);

  // Тестовый расчёт
  try {
    const test = pricing.calculatePrice(2999, 'TR');
    console.log(`[Цены] ✅ Тест: 2999 TRY → ${test.clientPrice}₽ (маржа ${test.marginPct}%)`);
  } catch (err) {
    console.log(`[Цены] ❌ Ошибка тестового расчёта: ${err.message}`);
  }

  // Модуль 3: парсер цен
  console.log('[AP-Agent] Модуль 3: парсер цен');
  const nextParse = getNextCronTime(config.parsers.cronSchedule);
  console.log(`[Парсер] Готов. Следующий запуск: ${nextParse}`);

  // Cron: каждый день в 09:00 МСК — курсы
  cron.schedule(config.cronSchedule, async () => {
    console.log('[AP-Agent] Cron: обновление курсов...');
    const result = await runUpdate();
    if (result) {
      lastUpdate = new Date().toISOString();
    }
  }, {
    timezone: 'Europe/Moscow'
  });

  // Cron: каждые 3 часа — парсинг цен
  cron.schedule(config.parsers.cronSchedule, async () => {
    console.log('[AP-Agent] Cron: парсинг цен...');
    try {
      const oldData = parsers.loadGames();
      const { summary, result } = await parsers.runFullParse();

      // Логирование
      logger.logPrice({
        gamesCount: result.games.length,
        dealsCount: result.games.filter(g => Object.values(g.prices).some(r => r.editions?.some(e => e.salePrice))).length,
        source: 'sony'
      });

      // Алерт: парсинг завершён
      notifier.sendAlert('parse_complete',
        `Парсинг завершён: ${result.games.length} игр`,
        { gamesCount: result.games.length }
      );

      if (oldData.games && oldData.games.length > 0) {
        const changes = parsers.detectChanges(result.games, oldData.games);
        if (changes.newDeals.length > 0) {
          console.log(`[Парсер] 🆕 Новые скидки: ${changes.newDeals.map(d => `${d.game} -${d.discountPct}%`).join(', ')}`);
          notifier.sendAlert('new_deals',
            `Новые скидки: ${changes.newDeals.map(d => `${d.game} -${d.discountPct}%`).join(', ')}`,
            { deals: changes.newDeals }
          );
        }
        if (changes.newPreorders.length > 0) {
          console.log(`[Парсер] 🆕 Новые предзаказы: ${changes.newPreorders.map(g => g.name).join(', ')}`);
          notifier.sendAlert('new_preorders',
            `Новые предзаказы: ${changes.newPreorders.map(g => g.name).join(', ')}`,
            { preorders: changes.newPreorders.map(g => g.name) }
          );
        }
        if (changes.priceChanges.length > 0) {
          console.log(`[Парсер] 💰 Изменения цен: ${changes.priceChanges.map(c => `${c.game} ${c.oldPrice}→${c.newPrice}`).join(', ')}`);
        }
      }
    } catch (err) {
      console.log(`[Парсер] ❌ Ошибка полного цикла: ${err.message}`);
    }
  }, {
    timezone: 'Europe/Moscow'
  });

  // Cron: предзаказы (1, 8, 15, 22, 29 числа, 10:00 МСК)
  cron.schedule(config.parsers.preordersCronSchedule, async () => {
    console.log('[AP-Agent] Cron: проверка предзаказов...');
    try {
      const oldData = parsers.loadGames();
      // Sony — основной, PSPrices — фоллбэк
      let trPre = sony.isConfigured() ? await sony.fetchPreorders('TR') : [];
      let uaPre = sony.isConfigured() ? await sony.fetchPreorders('UA') : [];
      if (trPre.length === 0) trPre = await psprices.fetchPreorders('TR').catch(() => []);
      if (uaPre.length === 0) uaPre = await psprices.fetchPreorders('UA').catch(() => []);
      const allPre = [...trPre, ...uaPre];
      console.log(`[Парсер] Предзаказы: TR ${trPre.length}, UA ${uaPre.length}`);

      if (oldData.games && oldData.games.length > 0) {
        const changes = parsers.detectChanges(allPre, oldData.games);
        if (changes.newPreorders.length > 0) {
          console.log(`[Парсер] 🆕 Новые предзаказы: ${changes.newPreorders.map(g => g.name).join(', ')}`);
        }
      }
    } catch (err) {
      console.log(`[Парсер] ❌ Предзаказы: ${err.message}`);
    }
  }, {
    timezone: 'Europe/Moscow'
  });

  server.listen(PORT, () => {
    console.log(`[AP-Agent] Health-check: http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error(`[AP-Agent] Критическая ошибка: ${err.message}`);
  process.exit(1);
});
