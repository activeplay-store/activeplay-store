const { getRates } = require('../utils/agentData');

const FLAGS = {
  TRY: '🇹🇷',
  UAH: '🇺🇦',
  INR: '🇮🇳'
};

const NAMES = {
  TRY: 'лира',
  UAH: 'гривна',
  INR: 'рупия'
};

async function handle(ctx) {
  const data = getRates();

  if (!data) {
    return ctx.reply('⚠️ rates.json не найден. Модуль курсов ещё не запускался.');
  }

  const lines = ['💱 Курсы валют ActivePlay\n'];

  for (const code of ['TRY', 'UAH', 'INR']) {
    const r = data.rates?.[code];
    if (!r) continue;

    lines.push(`${FLAGS[code]} ${code} (${NAMES[code]}):`);
    lines.push(`   ЦБ РФ: ${r.cbr}₽`);
    lines.push(`   Внутренний: ${r.internal}₽`);
    lines.push('');
  }

  const date = data.updatedAt
    ? new Date(data.updatedAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
    : 'неизвестно';
  lines.push(`🕐 Обновлено: ${date}`);

  await ctx.reply(lines.join('\n'));
}

module.exports = { handle };
