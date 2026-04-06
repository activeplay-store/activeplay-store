const { transcribe } = require('./whisper');
const { parseCommand, applyEdit } = require('./commander');
const { loadPending, savePending } = require('../news/approval');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Найти последнюю pending-новость (для голосовых команд)
function getLatestPending() {
  const pending = loadPending();
  if (!pending.length) return null;
  return pending[pending.length - 1];
}

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
  await ctx.reply(`📝 Распознано: ${text}`);

  // Разобрать команду
  const command = await parseCommand(text);
  if (!command) return ctx.reply('Не понял команду. Попробуй иначе.');

  // Маршрутизация
  switch (command.action) {
    case 'edit_news':
      await handleEditNews(ctx, bot, command);
      break;
    case 'publish':
      await ctx.reply(`📢 Используй кнопки под новостью для публикации`);
      break;
    case 'query':
      await handleQuery(ctx, command);
      break;
    case 'control':
    case 'news':
      if (command.command === 'fetch' || command.action === 'news') {
        const { runNewsCycle } = require('../news');
        await ctx.reply('🔄 Запускаю сбор новостей...');
        await runNewsCycle(bot);
      }
      break;
    default:
      await ctx.reply('Не понял команду. Попробуй: "поменяй первый абзац — ...", "измени заголовок на ..."');
  }
}

async function handleEditNews(ctx, bot, command) {
  const article = getLatestPending();
  if (!article) {
    return ctx.reply('❌ Нет новостей в ожидании редактирования');
  }

  const field = command.field || 'content';
  const instruction = command.instruction || command.value || '';

  if (!instruction) {
    return ctx.reply('❌ Не понял, что именно нужно изменить');
  }

  // Определяем что редактируем
  let oldText;
  if (field === 'title') {
    oldText = article.site?.title || article.title;
  } else {
    oldText = article.site?.text || '';
  }

  // Применить редактирование через AI
  let newText;
  if (field === 'title') {
    newText = await applyEdit(oldText, 'content', instruction);
  } else {
    newText = await applyEdit(oldText, field, instruction);
  }

  if (!newText) {
    return ctx.reply('❌ Не удалось сгенерировать редактирование');
  }

  // Показать превью изменений
  const fieldLabel = field === 'title' ? 'заголовок' :
    field === 'first_paragraph' || field === 'paragraph_1' ? 'первый абзац' :
    field === 'last_paragraph' ? 'последний абзац' :
    field.startsWith('paragraph_') ? `абзац ${field.split('_')[1]}` :
    'текст';

  // Для отображения: показать только изменённую часть (если абзац)
  let oldDisplay = oldText;
  let newDisplay = newText;

  // Обрезать для отображения в Telegram
  if (oldDisplay.length > 500) oldDisplay = oldDisplay.substring(0, 497) + '...';
  if (newDisplay.length > 500) newDisplay = newDisplay.substring(0, 497) + '...';

  const previewMsg = `📝 Изменить ${fieldLabel} в превью?\n\nБыло:\n${oldDisplay}\n\nСтало:\n${newDisplay}`;

  // Сохранить предлагаемое изменение для кнопки "Применить"
  const editId = `edit_${Date.now()}`;
  const editsFile = path.join(__dirname, '../../../data/pending-edits.json');
  let edits = {};
  try { edits = JSON.parse(fs.readFileSync(editsFile, 'utf-8')); } catch (_) {}
  edits[editId] = {
    articleId: article.id,
    field,
    newTitle: field === 'title' ? newText : null,
    newText: field !== 'title' ? newText : null,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(editsFile, JSON.stringify(edits, null, 2));

  await ctx.reply(previewMsg, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Применить', callback_data: `edit_apply_${editId}` },
          { text: '❌ Отменить', callback_data: `edit_cancel_${editId}` },
        ],
        [
          { text: '🔄 Другой вариант', callback_data: `edit_retry_${editId}` },
        ],
      ],
    },
  });
}

function setupEditHandlers(bot) {
  const editsFile = path.join(__dirname, '../../../data/pending-edits.json');

  function loadEdits() {
    try { return JSON.parse(fs.readFileSync(editsFile, 'utf-8')); } catch { return {}; }
  }
  function saveEdits(data) {
    fs.writeFileSync(editsFile, JSON.stringify(data, null, 2));
  }

  // Применить редактирование
  bot.action(/^edit_apply_(.+)$/, async (ctx) => {
    const editId = ctx.match[1];
    const edits = loadEdits();
    const edit = edits[editId];

    if (!edit) {
      await ctx.editMessageText('❌ Редактирование не найдено (устарело)');
      return ctx.answerCbQuery('Не найдено');
    }

    const pending = loadPending();
    const article = pending.find(a => a.id === edit.articleId);

    if (!article) {
      await ctx.editMessageText('❌ Новость не найдена в ожидании');
      return ctx.answerCbQuery('Не найдена');
    }

    // Применить изменения
    if (edit.field === 'title' && edit.newTitle) {
      if (!article.site) article.site = {};
      article.site.title = edit.newTitle;
    } else if (edit.newText) {
      if (!article.site) article.site = {};
      article.site.text = edit.newText;
    }

    // Пометить как вручную отредактированную (pipeline не перезапишет)
    article.manuallyEdited = true;

    savePending(pending);

    // Убрать из pending-edits
    delete edits[editId];
    saveEdits(edits);

    await ctx.editMessageText('✅ Изменения применены! Текст обновлён.\n\nТеперь выберите куда опубликовать (кнопки выше).');
    await ctx.answerCbQuery('Применено');

    // Отправить обновлённое превью
    const { sendPreview } = require('../news/approval');
    await sendPreview(bot, article);
  });

  // Отменить редактирование
  bot.action(/^edit_cancel_(.+)$/, async (ctx) => {
    const editId = ctx.match[1];
    const edits = loadEdits();
    delete edits[editId];
    saveEdits(edits);

    await ctx.editMessageText('❌ Редактирование отменено');
    await ctx.answerCbQuery('Отменено');
  });

  // Повторить с новым вариантом
  bot.action(/^edit_retry_(.+)$/, async (ctx) => {
    const editId = ctx.match[1];
    const edits = loadEdits();
    const edit = edits[editId];

    if (!edit) {
      await ctx.editMessageText('❌ Редактирование не найдено');
      return ctx.answerCbQuery('Не найдено');
    }

    await ctx.editMessageText('🔄 Генерирую другой вариант...');
    await ctx.answerCbQuery('Генерирую...');

    // Получить оригинальный текст
    const pending = loadPending();
    const article = pending.find(a => a.id === edit.articleId);
    if (!article) return;

    const oldText = edit.field === 'title'
      ? (article.site?.title || '')
      : (article.site?.text || '');

    const newText = await applyEdit(oldText, edit.field, edit.instruction || 'переписать');

    if (!newText) {
      await ctx.reply('❌ Не удалось сгенерировать новый вариант');
      return;
    }

    // Обновить edit
    if (edit.field === 'title') {
      edit.newTitle = newText;
    } else {
      edit.newText = newText;
    }
    edits[editId] = edit;
    saveEdits(edits);

    let display = newText;
    if (display.length > 500) display = display.substring(0, 497) + '...';

    await ctx.reply(`📝 Новый вариант:\n\n${display}`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Применить', callback_data: `edit_apply_${editId}` },
            { text: '❌ Отменить', callback_data: `edit_cancel_${editId}` },
          ],
          [
            { text: '🔄 Ещё вариант', callback_data: `edit_retry_${editId}` },
          ],
        ],
      },
    });
  });
}

async function handleQuery(ctx, command) {
  switch (command.type) {
    case 'rates': {
      try {
        const rates = JSON.parse(fs.readFileSync('/var/www/activeplay-store/agent/data/rates.json', 'utf-8'));
        await ctx.reply(`💱 Курсы:\nTRY: ${rates.TRY?.internal || '?'}\nUAH: ${rates.UAH?.internal || '?'}`);
      } catch {
        await ctx.reply('❌ Не удалось прочитать курсы');
      }
      break;
    }
    default:
      await ctx.reply(`🔍 Запрос: ${command.query || command.type}`);
  }
}

module.exports = { handleVoice, setupEditHandlers };
