require('dotenv').config();

const http = require('http');
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { accessMiddleware, allowedIds } = require('./utils/access');
const { transcribeVoice } = require('./utils/whisper');
const { route } = require('./commands');
const coeff = require('./commands/coeff');
const approve = require('./commands/approve');
const alerts = require('./commands/alerts');

const bot = new Telegraf(process.env.BOT_TOKEN);
const PORT = parseInt(process.env.PORT) || 4000;

// Middleware: проверка доступа
bot.use(accessMiddleware());

// Текстовые команды
bot.command('start', ctx => route(ctx, '/start'));
bot.command('help', ctx => route(ctx, '/help'));
bot.command('id', ctx => ctx.reply(`🆔 Твой Telegram ID: ${ctx.from.id}`));

// Кириллические команды через hears
bot.hears(/^\/помощь/i, ctx => route(ctx, '/помощь'));
bot.hears(/^\/курс/i, ctx => route(ctx, '/курс'));
bot.hears(/^\/статус/i, ctx => route(ctx, '/статус'));
bot.hears(/^\/цена\s*(.*)/i, ctx => route(ctx, ctx.message.text));
bot.hears(/^\/settings/i, ctx => route(ctx, '/settings'));
bot.hears(/^\/коэфф/i, ctx => route(ctx, ctx.message.text));
bot.hears(/^\/режим/i, ctx => route(ctx, ctx.message.text));
bot.hears(/^\/лог/i, ctx => route(ctx, ctx.message.text));
bot.hears(/^\/скидки/i, ctx => route(ctx, ctx.message.text));
bot.hears(/^\/предзаказ/i, ctx => route(ctx, '/предзаказы'));
bot.hears(/^\/новинки/i, ctx => route(ctx, '/новинки'));
bot.hears(/^\/топ/i, ctx => route(ctx, '/топ'));
bot.hears(/^\/парсинг/i, ctx => route(ctx, ctx.message.text));
bot.command('news', ctx => route(ctx, '/news'));
bot.hears(/^\/новости/i, ctx => route(ctx, '/news'));

// Callback queries (inline-кнопки)
bot.on('callback_query', async ctx => {
  const data = ctx.callbackQuery.data;
  try {
    if (data.startsWith('coeff_')) {
      await coeff.handleCallback(ctx, data);
    } else if (data.startsWith('approve_') || data.startsWith('reject_')) {
      await approve.handleCallback(ctx, data);
    }
  } catch (err) {
    console.error(`[Бот] Callback ошибка: ${err.message}`);
  }
  await ctx.answerCbQuery().catch(() => {});
});

// Голосовые сообщения
bot.on(['voice', 'audio'], async ctx => {
  try {
    const fileId = ctx.message.voice?.file_id || ctx.message.audio?.file_id;
    if (!fileId) return;

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer', timeout: 15000 });
    const buffer = Buffer.from(response.data);

    const text = await transcribeVoice(buffer);
    console.log(`[Бот] 🎙 Распознано от ${ctx.from.id}: "${text}"`);

    await ctx.reply(`🎙 Распознано: ${text}`);
    await route(ctx, text);
  } catch (err) {
    console.error(`[Бот] Ошибка голоса: ${err.message}`);
    await ctx.reply('⚠️ Не удалось распознать голосовое сообщение.');
  }
});

// Произвольный текст (не команда)
bot.on('text', ctx => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return;
  return route(ctx, text);
});

// HTTP-сервер: health-check + алерты + одобрение
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST' && req.url === '/alert') {
    return alerts.handleAlert(req, res, bot, allowedIds);
  }

  if (req.method === 'POST' && req.url === '/approve') {
    return approve.handleApprove(req, res, bot, allowedIds);
  }

  // GET / — health check
  res.end(JSON.stringify({
    status: 'ok',
    uptime: process.uptime()
  }));
});

// Запуск
async function main() {
  server.listen(PORT, () => {
    console.log(`[Бот] Health-check: http://localhost:${PORT}`);
  });

  await bot.launch();
  console.log('[Бот] ✅ ActivePlay Agent Bot запущен');
  console.log(`[Бот] Допущены: ${allowedIds.join(', ')}`);
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

main().catch(err => {
  console.error(`[Бот] Критическая ошибка: ${err.message}`);
  process.exit(1);
});
