const { getGames } = require('../utils/agentData');

async function handle(ctx, text) {
  const data = getGames();
  if (!data || !data.games) {
    return ctx.reply('⚠️ Данные парсера не найдены.');
  }

  const arg = (text || '').replace(/^\/топ\s*/i, '').trim();
  let region = 'TR';
  if (/^(UA|украин)/i.test(arg)) region = 'UA';

  const currency = region === 'TR' ? 'TRY' : 'UAH';
  const flag = region === 'TR' ? '🇹🇷' : '🇺🇦';

  const top = data.games
    .filter(g => {
      const eds = g.prices?.[region]?.editions || [];
      return eds[0]?.basePrice && eds[0].basePrice >= 1500;
    })
    .sort((a, b) => {
      const aP = a.prices?.[region]?.editions?.[0]?.basePrice || 0;
      const bP = b.prices?.[region]?.editions?.[0]?.basePrice || 0;
      return bP - aP;
    })
    .slice(0, 10);

  if (top.length === 0) {
    return ctx.reply(`🏆 Нет данных для ${flag}.`);
  }

  const lines = top.map((g, i) => {
    const ed = g.prices[region].editions[0];
    let line = `${i + 1}. ${g.name}`;
    line += `\n   ${flag} ${ed.basePrice} ${currency} -> ${ed.clientPrice || '?'} руб.`;
    if (ed.clientSalePrice && ed.clientSalePrice < ed.clientPrice) {
      line += `\n   Скидка: ${ed.salePrice} ${currency} -> ${ed.clientSalePrice} руб.`;
    }
    if (ed.clientPlusPrice) {
      line += `\n   PS Plus: ${ed.plusPrice} ${currency} -> ${ed.clientPlusPrice} руб.`;
    }
    return line;
  });

  await ctx.reply(`🏆 Топ AAA-игры ${flag}\n\n${lines.join('\n\n')}\n\nРегион: /топ TR, /топ UA`);
}

module.exports = { handle };
