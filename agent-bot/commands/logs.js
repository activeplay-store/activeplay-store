const { readJSON } = require('../utils/agentData');

const LOG_MAP = {
  'курсы': 'rates-log.json',
  'курс': 'rates-log.json',
  'цены': 'prices-log.json',
  'цена': 'prices-log.json',
  'публикации': 'publish-log.json',
  'публикация': 'publish-log.json'
};

function fmtDate(ts) {
  if (!ts) return '??';
  return new Date(ts).toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}

function formatRateEntry(entry) {
  const parts = [];
  if (entry.TRY) parts.push(`TRY: ${entry.TRY.internal}`);
  if (entry.UAH) parts.push(`UAH: ${entry.UAH.internal}`);
  if (entry.INR) parts.push(`INR: ${entry.INR.internal}`);
  return `${fmtDate(entry.timestamp)} — ${parts.join(', ')}`;
}

function formatPriceEntry(entry) {
  const games = entry.gamesCount || '?';
  const src = entry.source || '?';
  return `${fmtDate(entry.timestamp)} — ${games} игр, источник: ${src}`;
}

function formatGenericEntry(entry) {
  return `${fmtDate(entry.timestamp || entry.date)} — ${entry.text || JSON.stringify(entry).substring(0, 80)}`;
}

async function handle(ctx, text) {
  const args = text
    .replace(/^\/лог\s*/i, '')
    .replace(/^лог[а-я]*\s*/i, '')
    .replace(/^log\s*/i, '')
    .replace(/^истори[а-яё]*\s*/i, '')
    .trim()
    .toLowerCase();

  if (!args) {
    return ctx.reply(
`📋 Логи

Доступные:
  /лог курсы — история курсов
  /лог цены — история парсинга цен
  /лог публикации — история публикаций`
    );
  }

  const filename = LOG_MAP[args];
  if (!filename) {
    return ctx.reply(`⚠️ Неизвестный лог: "${args}"\nДоступные: курсы, цены, публикации`);
  }

  const data = readJSON(filename);

  // Поддержка и массива, и объекта с .entries
  const entries = Array.isArray(data) ? data : (data?.entries || []);
  if (!entries || entries.length === 0) {
    return ctx.reply('📋 Лог пока пуст.');
  }

  const last20 = entries.slice(-20);
  const lines = [`📋 Лог: ${args} (последние ${last20.length})\n`];

  const isRates = filename === 'rates-log.json';
  const isPrices = filename === 'prices-log.json';

  for (const entry of last20) {
    if (isRates) lines.push(formatRateEntry(entry));
    else if (isPrices) lines.push(formatPriceEntry(entry));
    else lines.push(formatGenericEntry(entry));
  }

  return ctx.reply(lines.join('\n'));
}

module.exports = { handle };
