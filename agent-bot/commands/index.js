const help = require('./help');
const rates = require('./rates');
const status = require('./status');
const price = require('./price');
const settings = require('./settings');
const coeff = require('./coeff');
const mode = require('./mode');
const logs = require('./logs');
const deals = require('./deals');
const hotReleases = require('./hotReleases');
const preorders = require('./preorders');
const topSellers = require('./topSellers');
const parsing = require('./parsing');
const catalog = require('./catalog');
const news = require('./news');

async function route(ctx, text) {
  const lower = text.toLowerCase().trim();

  // /парсинг
  if (lower.startsWith('/парсинг') || lower.includes('парсинг') || lower.includes('запусти парс')) {
    return parsing.handle(ctx, text);
  }

  // /news — запустить цикл сбора новостей
  if (lower.startsWith('/news') || lower.startsWith('/новости') || lower.includes('запусти новост') || lower.includes('собери новост')) {
    return news.handle(ctx);
  }

  if (lower.startsWith('/помощь') || lower.startsWith('/help') || lower.startsWith('/start') || lower.includes('помощь')) {
    return help.handle(ctx);
  }

  if (lower.startsWith('/коэфф') || lower.includes('коэфф') || lower.includes('coefficient')) {
    return coeff.handle(ctx, text);
  }

  if (lower.startsWith('/режим') || lower.startsWith('/mode') || lower.includes('режим')) {
    return mode.handle(ctx, text);
  }

  if (lower.startsWith('/каталог') || lower.includes('каталог')) {
    return catalog.handle(ctx, text);
  }

  if (lower.startsWith('/лог') || lower.startsWith('/log') || lower.includes('истори')) {
    return logs.handle(ctx, text);
  }

  if (lower.startsWith('/скидки') || lower.includes('скидк')) {
    return deals.handle(ctx, text);
  }

  if (lower.startsWith('/предзаказ') || lower.includes('предзаказ')) {
    return preorders.handle(ctx);
  }

  if (lower.startsWith('/новинки') || lower.includes('новинк') || lower.includes('горяч')) {
    return hotReleases.handle(ctx);
  }

  if (lower.startsWith('/топ') || lower.includes('бестселлер') || lower.includes('продаваем')) {
    return topSellers.handle(ctx, text);
  }

  if (lower.startsWith('/курс') || lower.includes('курс')) {
    return rates.handle(ctx);
  }

  if (lower.startsWith('/статус') || lower.startsWith('/status') || lower.includes('статус')) {
    return status.handle(ctx);
  }

  if (lower.startsWith('/цена') || lower.includes('цена') || lower.includes('price') || lower.includes('сколько стоит')) {
    return price.handle(ctx, text);
  }

  if (lower.startsWith('/settings') || lower.includes('настройк')) {
    return settings.handle(ctx);
  }

  if (lower.startsWith('/id')) {
    return ctx.reply(`🆔 Твой Telegram ID: ${ctx.from.id}`);
  }

  await ctx.reply('❓ Не понял команду. /помощь — список команд.');
}

module.exports = { route };
