const http = require('http');
const cron = require('node-cron');
const config = require('./config');
const currency = require('./modules/currency');

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

  if (req.url === '/rates') {
    const saved = currency.loadSavedRates();
    res.end(JSON.stringify(saved || { error: 'no data' }));
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

// --- Запуск ---
async function main() {
  console.log(`[AP-Agent] Запуск v${VERSION}`);
  console.log(`[AP-Agent] Timezone: ${process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone}`);

  // Сразу получить курсы при старте
  const result = await runUpdate();
  if (result) {
    lastUpdate = new Date().toISOString();
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
