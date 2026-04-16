const { getGames } = require('../utils/agentData');

async function handle(ctx) {
  const data = getGames();
  if (!data || !data.games) {
    return ctx.reply('⚠️ Данные парсера не найдены.');
  }

  const preorders = data.games.filter(g => g.status === 'preorder');

  if (preorders.length === 0) {
    return ctx.reply('📦 Предзаказов в базе парсера нет.\n\nБлок на сайте управляется вручную.');
  }

  const lines = preorders.slice(0, 15).map((g, i) => {
    const trEd = g.prices?.TR?.editions || [];
    const uaEd = g.prices?.UA?.editions || [];
    let priceStr = '';
    if (trEd.length > 0 && trEd[0].clientPrice) {
      priceStr += `\n   🇹🇷 ${trEd[0].basePrice} TRY → ${trEd[0].clientPrice}₽`;
    }
    if (uaEd.length > 0 && uaEd[0].clientPrice) {
      priceStr += `\n   🇺🇦 ${uaEd[0].basePrice} UAH → ${uaEd[0].clientPrice}₽`;
    }
    if (!priceStr) priceStr = '\n   Цена неизвестна';
    return `${i + 1}. ${g.name}${priceStr}`;
  });

  await ctx.reply(`📦 Предзаказы\n\n${lines.join('\n\n')}`);
}

module.exports = { handle };
