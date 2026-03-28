const { transcribe } = require('./whisper');
const { executeCommand } = require('./commander');
const { execSync } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function handleVoice(ctx, bot) {
  const chatId = ctx.from.id;
  if (String(chatId) !== process.env.ADMIN_CHAT_ID) return;

  await ctx.reply('🎙 Распознаю...');

  // Скачать аудио
  const fileId = ctx.message.voice?.file_id || ctx.message.audio?.file_id;
  if (!fileId) return ctx.reply('Не могу прочитать аудио');

  const file = await bot.telegram.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

  const tmpDir = '/tmp/activeplay-voice';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const audioPath = path.join(tmpDir, `${Date.now()}.ogg`);

  // Скачать файл
  const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  fs.writeFileSync(audioPath, Buffer.from(response.data));

  // Распознать
  const text = await transcribe(audioPath);
  try { fs.unlinkSync(audioPath); } catch (_) {}

  if (!text) return ctx.reply('Не удалось распознать речь');
  await ctx.reply(`📝 ${text}`);

  // Выполнить команду
  const command = await executeCommand(text);
  if (!command) return ctx.reply('Не понял команду. Попробуй иначе.');

  // Маршрутизация
  switch (command.action) {
    case 'edit_news':
      await handleEditNews(ctx, command);
      break;
    case 'publish':
      await handlePublish(ctx, command);
      break;
    case 'query':
      await handleQuery(ctx, command);
      break;
    case 'control':
      await handleControl(ctx, command);
      break;
    case 'news':
      if (command.command === 'fetch') {
        const { runNewsCycle } = require('../news');
        await runNewsCycle(bot);
      }
      break;
    default:
      await ctx.reply('Не понял команду: ' + JSON.stringify(command));
  }
}

async function handleEditNews(ctx, command) {
  await ctx.reply(`✏️ Редактирование: ${command.field} → ${command.value}\n(Функция в разработке — пока правь через /news)`);
}

async function handleQuery(ctx, command) {
  switch (command.type) {
    case 'rates': {
      const rates = JSON.parse(fs.readFileSync('/var/www/activeplay-store/agent/data/rates.json', 'utf-8'));
      await ctx.reply(`💱 Курсы:\nTRY: ${rates.TRY?.internal || '?'}\nUAH: ${rates.UAH?.internal || '?'}\nINR: ${rates.INR?.internal || '?'}`);
      break;
    }
    case 'status': {
      const status = execSync('pm2 jlist', { encoding: 'utf-8' });
      const procs = JSON.parse(status);
      const lines = procs.map(p => `${p.name}: ${p.pm2_env.status}`).join('\n');
      await ctx.reply(`📊 PM2:\n${lines}`);
      break;
    }
    default:
      await ctx.reply(`🔍 Запрос: ${command.query || command.type}`);
  }
}

async function handleControl(ctx, command) {
  if (command.command === 'status') {
    const status = execSync('pm2 jlist', { encoding: 'utf-8' });
    const procs = JSON.parse(status);
    const lines = procs.map(p => `${p.name}: ${p.pm2_env.status}`).join('\n');
    await ctx.reply(`📊 ${lines}`);
  }
}

async function handlePublish(ctx, command) {
  await ctx.reply(`📢 Публикация в: ${command.targets?.join(', ')}\n(Используй кнопки под новостью для публикации)`);
}

module.exports = { handleVoice };
