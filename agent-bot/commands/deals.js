const { getGames } = require('../utils/agentData');

const BADGE = { green: '🟢', yellow: '🟡', red: '🔴' };

function getBadge(pct) {
  if (pct >= 65) return BADGE.red;
  if (pct >= 40) return BADGE.yellow;
  if (pct >= 20) return BADGE.green;
  return '';
}

const JUNK_WORDS = [
  'avatar', 'theme', 'costume', 'outfit', 'skin',
  'currency', 'coin', 'point', 'token',
  'add-on', 'wallpaper', 'emote'
];

function isJunk(name) {
  const lower = (name || '').toLowerCase();
  return JUNK_WORDS.some(w => lower.includes(w));
}

function getDiscountScore(pct) {
  if (pct >= 65) return 10;
  if (pct >= 40) return 7;
  if (pct >= 20) return 4;
  return 1;
}

function getSavingScore(saving) {
  if (saving >= 7000) return 10;
  if (saving >= 4000) return 7;
  if (saving >= 2000) return 5;
  return 3;
}

function getBestPriceForRegion(game, region) {
  const editions = game.prices?.[region]?.editions || [];
  let best = null;
  for (const ed of editions) {
    const candidates = [
      ed.clientPlusPrice ? { clientPrice: ed.clientPlusPrice, amount: ed.plusPrice, type: 'ps_plus', discountPct: 0, editionName: ed.name, endDate: ed.endDate } : null,
      ed.clientSalePrice ? { clientPrice: ed.clientSalePrice, amount: ed.salePrice, type: 'sale', discountPct: ed.discountPct, editionName: ed.name, endDate: ed.endDate } : null,
      ed.clientPrice ? { clientPrice: ed.clientPrice, amount: ed.basePrice, type: 'regular', discountPct: 0, editionName: ed.name, endDate: ed.endDate } : null,
    ].filter(Boolean);
    for (const c of candidates) {
      if (!best || c.clientPrice < best.clientPrice) best = c;
    }
  }
  return best;
}

async function handle(ctx, text) {
  const data = getGames();
  if (!data || !data.games) {
    return ctx.reply('⚠️ Данные парсера не найдены.');
  }

  let arg = (text || '').replace(/^\/скидки\s*/i, '').replace(/^скидк\S*\s*/i, '').trim();

  // Определить регион
  let region = 'TR';
  if (/^(UA|украин)/i.test(arg)) {
    region = 'UA';
    arg = arg.replace(/^(UA|украин\S*)\s*/i, '').trim();
  } else if (/^(TR|турц)/i.test(arg)) {
    region = 'TR';
    arg = arg.replace(/^(TR|турц\S*)\s*/i, '').trim();
  }

  const currency = region === 'TR' ? 'TRY' : 'UAH';
  const flag = region === 'TR' ? '🇹🇷' : '🇺🇦';
  const regionName = region === 'TR' ? 'Турция' : 'Украина';

  // Фильтры
  let minBase = 300;
  let minPct = 0;
  let minMc = 0;
  let showAll = false;
  let limit = 40;

  if (arg === 'всё' || arg === 'все' || arg === 'all') {
    minBase = 0; showAll = true; limit = 50;
  } else if (arg.startsWith('mc') || arg.startsWith('мк')) {
    minMc = parseInt(arg.replace(/\D/g, '')) || 80;
  } else if (/^\d+$/.test(arg)) {
    const num = parseInt(arg);
    if (num <= 100) minPct = num;
    else minBase = num;
  }

  const deals = [];

  for (const game of data.games) {
    if (isJunk(game.name) || isJunk(game.id)) continue;
    if (minMc > 0 && (!game.metacritic || game.metacritic < minMc)) continue;

    // Цены ЭТОГО региона
    const editions = game.prices?.[region]?.editions || [];
    if (editions.length === 0) continue;

    const baseEdition = editions.find(e => e.basePrice) || editions[0];
    if (!baseEdition || !baseEdition.basePrice) continue;
    if (baseEdition.basePrice < minBase) continue;

    const baseClientPrice = baseEdition.baseClientPrice || baseEdition.clientPrice;
    if (!baseClientPrice) continue;

    // Лучшая цена в ЭТОМ регионе
    const bp = getBestPriceForRegion(game, region);
    if (!bp || !bp.clientPrice) continue;

    const saving = baseClientPrice - bp.clientPrice;
    if (saving < 100 && !showAll) continue;

    const realPct = Math.round((saving / baseClientPrice) * 100);
    if (realPct < 10) continue;
    if (minPct > 0 && realPct < minPct) continue;

    const hype = game.hypeScore || 3;
    const fresh = game.freshness || 5;
    const discScore = getDiscountScore(realPct);
    const savScore = getSavingScore(saving);
    const totalScore = (hype * 0.40) + (discScore * 0.30) + (savScore * 0.20) + (fresh * 0.10);

    deals.push({
      name: game.name,
      bestPrice: bp.clientPrice,
      basePrice: baseClientPrice,
      saving,
      realPct,
      type: bp.type,
      editionName: bp.editionName || 'Standard',
      endDate: bp.endDate || baseEdition.endDate,
      baseLocal: baseEdition.basePrice,
      bestLocal: bp.amount,
      metacritic: game.metacritic,
      score: totalScore
    });
  }

  deals.sort((a, b) => b.score - a.score);
  const top = deals.slice(0, limit);

  if (top.length === 0) {
    return ctx.reply(`🏷 Скидок ${flag} ${regionName} по заданным критериям не найдено.`);
  }

  const lines = top.map((d, i) => {
    const badge = getBadge(d.realPct);
    const plusMark = d.type === 'ps_plus' ? ' 🟡PS+' : '';
    const mcStr = d.metacritic ? ` | MC: ${d.metacritic}` : '';
    const endStr = d.endDate ? `\n   До ${new Date(d.endDate).toLocaleDateString('ru-RU')}` : '';
    return `${i + 1}. ${d.name} — ${d.editionName}${plusMark}\n   ${badge} ${d.bestPrice} руб. вместо ${d.basePrice} руб. (-${d.realPct}%, экономия ${d.saving} руб.)${mcStr} | ${d.score.toFixed(1)}${endStr}`;
  });

  const header = showAll
    ? `🏷 Все скидки PS Store ${flag} ${regionName}`
    : `🏷 Топ скидки PS Store ${flag} ${regionName}`;
  const footer = `\n\nВсего: ${deals.length} игр со скидкой\nРегион: /скидки TR, /скидки UA\nФильтры: /скидки всё, /скидки 50, /скидки mc80`;

  const chunkSize = 10;
  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize);
    let msg = (i === 0) ? header + '\n\n' : '';
    msg += chunk.join('\n\n');
    if (i + chunkSize >= lines.length) msg += footer;
    await ctx.reply(msg);
  }
}

module.exports = { handle };
