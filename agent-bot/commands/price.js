const { getGames } = require('../utils/agentData');

const REGION_NAMES = { TR: '🇹🇷 Турция', UA: '🇺🇦 Украина', IN: '🇮🇳 Индия' };
const CURRENCY = { TR: 'TRY', UA: 'UAH', IN: 'INR' };

function normalizeSearch(str) {
  return str
    .toLowerCase()
    .replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/ğ/g, 'g')
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-яе0-9\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findGame(games, query) {
  const q = normalizeSearch(query);
  if (!q) return null;
  const words = q.split(' ').filter(w => w.length > 2);

  const bySlug = games.find(g => g.id === q.replace(/\s+/g, '-'));
  if (bySlug) return bySlug;

  const byFull = games.find(g => normalizeSearch(g.name).includes(q));
  if (byFull) return byFull;

  const byWords = games.find(g => {
    const name = normalizeSearch(g.name);
    return words.every(w => name.includes(w));
  });
  if (byWords) return byWords;

  const byAny = games.filter(g => {
    const name = normalizeSearch(g.name);
    return words.filter(w => w.length > 3).some(w => name.includes(w));
  });
  if (byAny.length === 1) return byAny[0];
  if (byAny.length > 1 && byAny.length <= 5) return { multiple: byAny };

  return null;
}

function formatGame(game) {
  let msg = `🎮 ${game.name}`;

  if (game.metacritic) msg += `\n⭐ Metacritic: ${game.metacritic}`;
  if (game.releaseDate) msg += `\n📅 Релиз: ${new Date(game.releaseDate).toLocaleDateString('ru-RU')}`;

  const bp = game.bestPrice;
  if (bp && bp.clientPrice) {
    const label = bp.type === 'ps_plus' ? 'PS Plus' : bp.type === 'sale' ? 'скидка' : 'базовая';
    msg += `\n\n💰 Лучшая цена: ${bp.clientPrice}₽ (${label})`;
    if (bp.endDate) {
      msg += `\n⏰ До: ${new Date(bp.endDate).toLocaleDateString('ru-RU')}`;
    }
  }

  for (const [region, data] of Object.entries(game.prices)) {
    const flag = REGION_NAMES[region] || region;
    const cur = CURRENCY[region] || region;
    msg += `\n\n${flag}:`;

    for (const ed of data.editions) {
      if (!ed.basePrice && !ed.salePrice && !ed.plusPrice) continue;

      msg += `\n  ${ed.name}: ${ed.basePrice || '?'} ${cur}`;
      if (ed.clientPrice) msg += ` → ${ed.clientPrice}₽`;

      if (ed.salePrice && ed.salePrice < ed.basePrice) {
        msg += `\n    📉 Скидка: ${ed.salePrice} ${cur}`;
        if (ed.clientSalePrice) msg += ` → ${ed.clientSalePrice}₽`;
        if (ed.discountPct) msg += ` (-${ed.discountPct}%)`;
      }

      if (ed.plusPrice) {
        msg += `\n    🟡 PS Plus: ${ed.plusPrice} ${cur}`;
        if (ed.clientPlusPrice) msg += ` → ${ed.clientPlusPrice}₽`;
      }
    }
  }

  return msg;
}

async function handle(ctx, text) {
  const gameName = text.replace(/^\/цена\s*/i, '').replace(/^цена\s*/i, '').trim();
  if (!gameName) {
    return ctx.reply('💰 Укажи название игры.\nПример: /цена ghost');
  }

  const data = getGames();
  if (!data || !data.games || data.games.length === 0) {
    return ctx.reply('⚠️ Данные парсера не найдены.');
  }

  const result = findGame(data.games, gameName);

  if (result && result.multiple) {
    const list = result.multiple.map((g, i) => `${i + 1}. ${g.name}`).join('\n');
    return ctx.reply(`🔍 Найдено несколько:\n\n${list}\n\nУточни название.`);
  }

  if (!result) {
    return ctx.reply(`🔍 «${gameName}» не найдена.\n\nПопробуй часть названия на английском: /цена ghost`);
  }

  await ctx.reply(formatGame(result));
}

module.exports = { handle };
