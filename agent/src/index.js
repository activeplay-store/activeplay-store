const http = require('http');
const cron = require('node-cron');
const config = require('./config');
const currency = require('./modules/currency');
const pricing = require('./modules/pricing');

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

  // Cron: каждый день в 09:00 МСК
  cron.schedule(config.cronSchedule, async () => {
    console.log('[AP-Agent] Cron: обновление курсов...');
    const result = await runUpdate();
    if (result) {
      lastUpdate = new Date().toISOString();
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
