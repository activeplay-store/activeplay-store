const fs = require('fs');
const path = require('path');
const locks = require('../utils/locks');
const { updateStatus } = require('./db');
const { chatCompletion, generateImage } = require('../utils/aiClient');

const PENDING_FILE = path.join(__dirname, '../../../data/pending-news.json');
const QUEUE_FILE = path.join(__dirname, '../../../data/news-queue.json');

// ═══ STATE: временное хранилище для вариантов правки ═══
// titleVariantsState: articleId → [v1, v2, v3] (3 варианта заголовка)
const titleVariantsState = new Map();
// editCmdState: chatId → articleId (ожидаем текстовую команду от этого chatId)
const editCmdState = new Map();

function getEditCmdState() {
  return editCmdState;
}

function loadPending() {
  try { return JSON.parse(fs.readFileSync(PENDING_FILE, 'utf-8')); } catch { return []; }
}
function savePending(data) {
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2));
}
function loadQueue() {
  try { return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8')); } catch { return []; }
}
function saveQueue(data) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
}

function setupApprovalHandlers(bot) {
  // ===== ПУБЛИКАЦИЯ =====
  // ВАЖНО: длинные префиксы ПЕРЕД короткими, иначе news_site_(.+) перехватит news_site_vk_xxx

  // Telegram + сайт (ПЕРЕД news_tg_)
  bot.action(/^news_tg_site_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['telegram', 'site']);
  });

  // Сайт + VK (ПЕРЕД news_site_)
  bot.action(/^news_site_vk_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['site', 'vk']);
  });

  // Только сайт (negative lookahead чтобы не ловить news_site_vk_)
  bot.action(/^news_site_(?!vk_)(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['site']);
  });

  // Только Telegram (negative lookahead чтобы не ловить news_tg_site_)
  bot.action(/^news_tg_(?!site_)(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['telegram']);
  });

  // Везде
  bot.action(/^news_all_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['telegram', 'vk', 'site']);
  });

  // ===== ВРЕМЯ =====

  // Сейчас
  bot.action(/^news_now_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    await ctx.editMessageText('⏳ Запускаю пайплайн...');
    await ctx.answerCbQuery('Запуск пайплайна');
    try {
      await executePublish(bot, articleId);
    } catch (err) {
      // Ошибка уже отправлена в чат через pipeline.js
      console.error(`[NEWS] Publish error for ${articleId}:`, err.message);
    }
  });

  // Через 30 мин / 1 час / 2 часа / 3 часа
  bot.action(/^news_delay_(\d+)_(.+)$/, async (ctx) => {
    const delayMin = parseInt(ctx.match[1]);
    const articleId = ctx.match[2];

    // Добавить в очередь с таймером
    const queue = loadQueue();
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (!article) return ctx.answerCbQuery('Не найдена');

    article.publishAt = new Date(Date.now() + delayMin * 60000).toISOString();
    queue.push(article);
    saveQueue(queue);

    // Убрать из pending
    savePending(pending.filter(a => a.id !== articleId));

    await ctx.editMessageText(`⏰ Запланировано через ${delayMin} мин — ${article.site?.title || article.title}`);
    await ctx.answerCbQuery(`Через ${delayMin} мин`);
  });

  // ===== ОТКЛОНИТЬ =====
  bot.action(/^news_reject_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (article?._titleNormalized) {
      try { updateStatus(article._titleNormalized, 'skipped'); } catch {}
    }
    savePending(pending.filter(a => a.id !== articleId));
    await ctx.editMessageText('❌ Отклонено');
    await ctx.answerCbQuery('Отклонено');
  });

  // ===== ПРЕДЛОЖИТЬ ДРУГУЮ =====
  bot.action(/^news_next_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    // Убрать текущую из pending
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (article?._titleNormalized) {
      try { updateStatus(article._titleNormalized, 'skipped'); } catch {}
    }
    savePending(pending.filter(a => a.id !== articleId));

    // Взять следующую из reserve-news.json
    const { getNextCandidate } = require('./index');
    const next = await getNextCandidate();
    if (next) {
      await sendPreview(bot, next);
      await ctx.answerCbQuery('Новая новость загружена');
    } else {
      await ctx.answerCbQuery('Больше нет кандидатов');
    }
    await ctx.editMessageText('🔄 Заменена на другую');
  });

  // ===== ПРАВКИ =====

  // Заголовок: сгенерировать 3 варианта и показать на выбор
  bot.action(/^news_edit_title_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (!article) return ctx.answerCbQuery('Не найдена');

    await ctx.answerCbQuery('Генерирую 3 варианта...');
    try {
      const variants = await generateTitleVariants(article);
      if (!variants || variants.length < 3) {
        return ctx.reply('❌ Не удалось сгенерировать варианты заголовка');
      }
      titleVariantsState.set(articleId, variants);

      const buttons = variants.map((v, i) => ([{
        text: `${i + 1}. ${(v || '').slice(0, 60)}`,
        callback_data: `news_title_pick_${articleId}_${i}`,
      }]));
      buttons.push([{ text: '← Оставить текущий', callback_data: `news_back_${articleId}` }]);

      await ctx.reply('✏️ Выберите вариант заголовка:', {
        reply_markup: { inline_keyboard: buttons },
      });
    } catch (err) {
      console.error('[NEWS] edit_title error:', err.message);
      await ctx.reply(`❌ Ошибка: ${err.message.slice(0, 150)}`);
    }
  });

  // Применить выбранный вариант заголовка
  bot.action(/^news_title_pick_(.+)_(\d+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    const idx = parseInt(ctx.match[2], 10);
    const variants = titleVariantsState.get(articleId);
    if (!variants || !variants[idx]) {
      await ctx.answerCbQuery('Варианты устарели');
      try { await ctx.deleteMessage(); } catch {}
      return;
    }

    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (!article) return ctx.answerCbQuery('Не найдена');

    if (!article.site) article.site = {};
    article.site.title = variants[idx];
    if (article.telegram) article.telegram.title = variants[idx];
    if (article.vk) article.vk.title = variants[idx];
    savePending(pending);
    titleVariantsState.delete(articleId);

    await ctx.answerCbQuery('Заголовок обновлён');
    try { await ctx.deleteMessage(); } catch {}
    await sendPreview(bot, article);
  });

  // Отмена выбора заголовка — просто убрать меню вариантов
  bot.action(/^news_back_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    titleVariantsState.delete(articleId);
    try { await ctx.deleteMessage(); } catch {}
    await ctx.answerCbQuery('Оставлен текущий');
  });

  // Картинка: перегенерировать (с лимитом 3)
  bot.action(/^news_edit_image_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (!article) return ctx.answerCbQuery('Не найдена');

    article._imageRegenCount = (article._imageRegenCount || 0) + 1;
    if (article._imageRegenCount > 3) {
      return ctx.answerCbQuery('Лимит перегенераций исчерпан (3/3)');
    }

    await ctx.answerCbQuery(`Регенерирую картинку (${article._imageRegenCount}/3)...`);
    try {
      const { getNewsImage } = require('./imageGen');
      let newUrl = await getNewsImage(article, { skipCache: true });
      if (!newUrl) {
        // Fallback DALL-E по заголовку
        const prompt = `Gaming news illustration, 16:9, modern digital art, NO TEXT, topic: ${article.site?.title || article.title}`;
        newUrl = await generateImage(prompt);
      }
      if (!newUrl) {
        return ctx.reply('❌ Не удалось получить новую картинку');
      }
      article.imageUrl = newUrl;
      savePending(pending);
      await resendPreview(bot, ctx, article);
    } catch (err) {
      console.error('[NEWS] edit_image error:', err.message);
      await ctx.reply(`❌ Ошибка картинки: ${err.message.slice(0, 150)}`);
    }
  });

  // Переписать текст: прогнать Step 3 с повышенной temperature
  bot.action(/^news_edit_text_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (!article) return ctx.answerCbQuery('Не найдена');

    await ctx.answerCbQuery('Переписываю текст (temp 0.85)...');
    try {
      const { generateFullArticle, countParagraphs } = require('./translator');
      const { factCheckArticle } = require('./factCheck');
      const result = await generateFullArticle(article, article.enrichedContext || '', { temperature: 0.85 });
      if (!result?.site?.text) {
        return ctx.reply('❌ Не удалось переписать текст');
      }
      const pars = countParagraphs(result.site.text);
      if (pars < 4 || result.site.text.length < 1000) {
        return ctx.reply(`❌ Новая версия не прошла guard (${pars} абзацев, ${result.site.text.length} знаков)`);
      }

      article.site.text = result.site.text;
      if (result.site.title) article.site.title = result.site.title;
      if (result.telegram?.text) article.telegram = result.telegram;
      if (result.vk?.text) article.vk = result.vk;

      // Прогнать через factCheck guard
      const fc = await factCheckArticle(article);
      if (fc?.hasErrors && fc.correctedText) {
        const p2 = countParagraphs(fc.correctedText);
        if (p2 >= 4 && fc.correctedText.length >= 1000) {
          article.site.text = fc.correctedText;
          if (fc.correctedTitle) article.site.title = fc.correctedTitle;
          article.factCheckNotes = fc.errors;
        }
      }

      savePending(pending);
      await resendPreview(bot, ctx, article);
    } catch (err) {
      console.error('[NEWS] edit_text error:', err.message);
      await ctx.reply(`❌ Ошибка: ${err.message.slice(0, 150)}`);
    }
  });

  // Свободная команда: войти в режим ожидания текста
  bot.action(/^news_edit_cmd_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    const chatId = ctx.chat.id;
    const pending = loadPending();
    if (!pending.find(a => a.id === articleId)) return ctx.answerCbQuery('Не найдена');

    editCmdState.set(chatId, articleId);
    await ctx.answerCbQuery('Жду команду');
    await ctx.reply(
      '💬 Напиши что поправить. Например:\n' +
      '• «убери предложение про Sony»\n' +
      '• «поменяй дату на 22 апреля»\n' +
      '• «сделай заголовок короче»'
    );
  });

  // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

  async function handlePublish(ctx, articleId, targets) {
    const pending = loadPending();
    const article = pending.find(a => a.id === articleId);
    if (!article) return ctx.answerCbQuery('Не найдена');

    // Сохранить куда публиковать
    article.targets = targets;
    savePending(pending);

    // Спросить КОГДА
    const targetLabel = targets.join(' + ');
    const safeTitle = (article.site?.title || article.title || '').replace(/[*_`\[\]]/g, '');
    await ctx.editMessageText(
      `📰 ${safeTitle}\n\n📢 Куда: ${targetLabel}\n\n⏰ Когда публикуем?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '⚡ Сейчас', callback_data: `news_now_${articleId}` },
              { text: '⏰ 30 мин', callback_data: `news_delay_30_${articleId}` },
            ],
            [
              { text: '⏰ 1 час', callback_data: `news_delay_60_${articleId}` },
              { text: '⏰ 2 часа', callback_data: `news_delay_120_${articleId}` },
            ],
            [
              { text: '⏰ 3 часа', callback_data: `news_delay_180_${articleId}` },
            ],
          ],
        },
      }
    );
    await ctx.answerCbQuery(targetLabel);
  }
}

// Отправить превью одной новости
async function sendPreview(bot, article) {
  const ADMIN_ID = process.env.ADMIN_CHAT_ID;
  const cat = article.category || 'Новость';

  const title = (article.site?.title || article.title || '').replace(/[*_`\[\]]/g, '');
  const text = (article.site?.text || article.text || '').replace(/[*_`\[\]]/g, '');
  const tags = (article.site?.tags || article.tags || []).map(t => '#' + t.replace(/[*_`\[\]]/g, '')).join(' ');

  const factNote = Array.isArray(article.factCheckNotes) && article.factCheckNotes.length > 0
    ? `⚠️ Факт-чек: ${article.factCheckNotes.length} исправлений`
    : null;

  const preview = [
    `📰 ${cat.toUpperCase()}`,
    '',
    title,
    '',
    text,
    '',
    `🏷 ${tags}`,
    `📡 ${article.sourceName} | Score: ${article.score}`,
    `🔗 ${article.link}`,
    article.image ? '🖼 Картинка: есть' : '🖼 Картинка: будет сгенерирована',
    ...(factNote ? [factNote] : []),
  ].join('\n');

  await bot.telegram.sendMessage(ADMIN_ID, preview, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✏️ Заголовок', callback_data: `news_edit_title_${article.id}` },
          { text: '🖼 Картинка', callback_data: `news_edit_image_${article.id}` },
        ],
        [
          { text: '📝 Переписать текст', callback_data: `news_edit_text_${article.id}` },
          { text: '💬 Команда', callback_data: `news_edit_cmd_${article.id}` },
        ],
        [
          { text: '🌐 Сайт', callback_data: `news_site_${article.id}` },
          { text: '📱 TG', callback_data: `news_tg_${article.id}` },
        ],
        [
          { text: '📱🌐 TG+Сайт', callback_data: `news_tg_site_${article.id}` },
          { text: '🌐📘 Сайт+VK', callback_data: `news_site_vk_${article.id}` },
        ],
        [
          { text: '📢 Везде', callback_data: `news_all_${article.id}` },
        ],
        [
          { text: '❌ Отклонить', callback_data: `news_reject_${article.id}` },
          { text: '🔄 Другую', callback_data: `news_next_${article.id}` },
        ],
      ],
    },
  });
}

// Общая функция переотправки превью после правки (удаляет старое, шлёт новое)
async function resendPreview(bot, ctx, article) {
  try { await ctx.deleteMessage(); } catch {}
  await sendPreview(bot, article);
}

// Прямая публикация без повторного прогона pipeline.
// Ожидает, что статья уже полностью подготовлена (runPipeline skipPublish:true прогоняется в runNewsCycle).
async function executePublish(bot, articleId, explicitTargets = null) {
  const ADMIN_ID = process.env.ADMIN_CHAT_ID;

  // Ищем статью в pending ИЛИ в queue (для отложенных публикаций)
  const pending = loadPending();
  let article = pending.find(a => a.id === articleId);
  let source = 'pending';

  if (!article) {
    const queue = loadQueue();
    article = queue.find(a => a.id === articleId);
    source = 'queue';
    if (article) {
      // Убрать из queue
      saveQueue(queue.filter(a => a.id !== articleId));
    }
  }

  if (!article) {
    console.error(`[NEWS] executePublish: article ${articleId} not found in pending or queue`);
    return;
  }

  const targets = explicitTargets || article.targets || ['site'];
  const startTime = Date.now();

  try {
    const { writeToSite, deployToSite, publishToTelegram, publishToVK } = require('./publisher');
    const { cleanHeadline } = require('./translator');

    if (targets.includes('site')) {
      if (article.site?.title) article.site.title = cleanHeadline(article.site.title);
      if (article.title) article.title = cleanHeadline(article.title);
      writeToSite([article]);
      deployToSite();
    }
    if (targets.includes('telegram') && bot) {
      await publishToTelegram(bot, article);
    }
    if (targets.includes('vk')) {
      await publishToVK(article);
    }

    // Пометить как published в БД
    if (article._titleNormalized) {
      try { updateStatus(article._titleNormalized, 'published'); } catch {}
    }

    // Убрать из pending (если статья была оттуда)
    if (source === 'pending') {
      savePending(pending.filter(a => a.id !== articleId));
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`[NEWS] Published in ${elapsed}s: ${article.site?.title || article.title}`);

    if (bot && ADMIN_ID) {
      await bot.telegram.sendMessage(ADMIN_ID,
        `\u2705 Опубликовано (${elapsed}с): ${article.site?.title || article.title}\n` +
        `\ud83d\udce2 ${targets.join(' + ')}\n` +
        `\ud83d\udd17 https://activeplay.games/news/${article.slug}`
      ).catch(() => {});
    }
  } catch (err) {
    console.error(`[NEWS] executePublish error: ${err.message}`);
    if (bot && ADMIN_ID) {
      await bot.telegram.sendMessage(ADMIN_ID,
        `\u274c Ошибка публикации: ${err.message}\n\ud83d\udcf0 ${article.site?.title || article.title}`
      ).catch(() => {});
    }
    throw err;
  }
}


// ===== REPUBLISH: publish existing site news to VK/TG =====

const SITE_ROOT_PATH = process.env.SITE_ROOT || '/var/www/activeplay-store';

function readSiteNews() {
  const newsFile = path.join(SITE_ROOT_PATH, 'src/data/news.json');
  try {
    const data = JSON.parse(fs.readFileSync(newsFile, 'utf-8'));
    return data
      .filter(a => a.category !== 'guide')
      .map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        text: a.content || '',
        imageUrl: a.coverUrl || '',
        coverUrl: a.coverUrl || '',
        tags: a.tags || [],
      }));
  } catch (err) {
    console.error('[NEWS] readSiteNews error:', err.message);
    return [];
  }
}

async function showRepublishMenu(bot, ctx) {
  const articles = readSiteNews().slice(0, 5);
  if (!articles.length) return ctx.reply('No news on site');
  const buttons = articles.map(a => ([{
    text: a.title.length > 50 ? a.title.slice(0, 47) + '...' : a.title,
    callback_data: `repub_pick_${a.slug.slice(0, 40)}`,
  }]));
  await ctx.reply('\ud83d\udcf0 \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u043e\u0432\u043e\u0441\u0442\u044c \u0434\u043b\u044f \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438:', {
    reply_markup: { inline_keyboard: buttons },
  });
}

function setupRepublishHandlers(bot) {
  bot.action(/^repub_pick_(.+)$/, async (ctx) => {
    const slug = ctx.match[1];
    await ctx.editMessageText('\ud83d\udce2 \u041a\u0443\u0434\u0430 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c?', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '\ud83d\udcd8 VK', callback_data: `repub_vk_${slug}` },
            { text: '\ud83d\udcf1 TG', callback_data: `repub_tg_${slug}` },
          ],
          [
            { text: '\ud83d\udcd8\ud83d\udcf1 VK+TG', callback_data: `repub_all_${slug}` },
          ],
        ],
      },
    });
    await ctx.answerCbQuery();
  });

  bot.action(/^repub_vk_(.+)$/, async (ctx) => {
    await doRepublish(bot, ctx, ctx.match[1], ['vk']);
  });
  bot.action(/^repub_tg_(.+)$/, async (ctx) => {
    await doRepublish(bot, ctx, ctx.match[1], ['telegram']);
  });
  bot.action(/^repub_all_(.+)$/, async (ctx) => {
    await doRepublish(bot, ctx, ctx.match[1], ['vk', 'telegram']);
  });
}

async function doRepublish(bot, ctx, slug, targets) {
  const articles = readSiteNews();
  const article = articles.find(a => a.slug.startsWith(slug));
  if (!article) {
    await ctx.editMessageText('\u274c \u0421\u0442\u0430\u0442\u044c\u044f \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430');
    return ctx.answerCbQuery('\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430');
  }
  const { publishToTelegram, publishToVK } = require('./publisher');
  const results = [];
  if (targets.includes('vk')) { await publishToVK(article); results.push('VK'); }
  if (targets.includes('telegram')) { await publishToTelegram(bot, article); results.push('TG'); }
  await ctx.editMessageText(`\u2705 \u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043e \u0432 ${results.join(' + ')}: ${article.title}`);
  await ctx.answerCbQuery('\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043e');
}


// ═══ AI ХЕЛПЕРЫ ДЛЯ ПРАВОК ═══

// 3 варианта заголовка на выбор
async function generateTitleVariants(article) {
  const currentTitle = article.site?.title || article.title || '';
  const text = article.site?.text || article.text || '';
  const system = 'Дай 3 разных варианта заголовка для этой статьи. Разные стили: нейтральный информационный / с цифрой или датой / интригующий но без кликбейта. Правила: на русском, до 80 символов, кавычки «ёлочки», без КАПСА и восклицательных. Верни СТРОГО JSON массив из 3 строк (без backticks, без markdown).';
  const user = `Заголовок текущий: ${currentTitle}\n\nТекст: ${(text || '').slice(0, 3000)}`;

  const response = await chatCompletion([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { model: 'gpt-4o', temperature: 0.8, maxTokens: 400 });

  const match = response.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const arr = JSON.parse(match[0]);
    if (!Array.isArray(arr)) return null;
    return arr.map(s => String(s || '').trim()).filter(Boolean).slice(0, 3);
  } catch {
    return null;
  }
}

/**
 * Обработка свободной команды пользователя: редактор точечно правит текст/заголовок.
 * Вызывается из bot.on('text') когда chatId есть в editCmdState.
 * Возвращает true при успехе, false при ошибке.
 */
async function handleEditCommand(bot, ctx, articleId, userText) {
  const pending = loadPending();
  const article = pending.find(a => a.id === articleId);
  if (!article) {
    await ctx.reply('❌ Новость не найдена в pending');
    return false;
  }

  await ctx.reply('✍️ Применяю правку...');
  try {
    const system = 'Ты редактор новости. Пользователь дал команду на правку текста. Примени её точечно, сохрани структуру 4 абзаца через \\n\\n, сохрани факты. Если команда касается заголовка — поправь заголовок. Верни СТРОГО JSON (без backticks): { "title": "...", "text": "..." }.';
    const user =
      `ТЕКУЩИЙ ЗАГОЛОВОК: ${article.site?.title || ''}\n` +
      `ТЕКУЩИЙ ТЕКСТ: ${article.site?.text || ''}\n\n` +
      `КОМАНДА: ${userText}`;

    const response = await chatCompletion([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { model: 'gpt-4o', temperature: 0.5, maxTokens: 3000 });

    const match = response.match(/\{[\s\S]*\}/);
    if (!match) {
      await ctx.reply('❌ Не удалось распарсить ответ редактора');
      return false;
    }
    const parsed = JSON.parse(match[0]);
    if (!parsed.title && !parsed.text) {
      await ctx.reply('❌ Редактор не вернул ни title, ни text');
      return false;
    }

    const { countParagraphs } = require('./translator');
    const { factCheckArticle } = require('./factCheck');

    const oldText = article.site?.text || '';
    if (!article.site) article.site = {};
    if (parsed.title) article.site.title = parsed.title;
    if (parsed.text) article.site.text = parsed.text;

    // Guard: если текст менялся — проверяем абзацы/длину + фактчек
    if (parsed.text && parsed.text !== oldText) {
      const pars = countParagraphs(parsed.text);
      if (pars < 4 || parsed.text.length < 1000) {
        await ctx.reply(`⚠️ Новый текст не прошёл guard (${pars} абзацев, ${parsed.text.length} знаков). Возвращаю старый.`);
        article.site.text = oldText;
      } else {
        const fc = await factCheckArticle(article);
        if (fc?.hasErrors && fc.correctedText) {
          const p2 = countParagraphs(fc.correctedText);
          if (p2 >= 4 && fc.correctedText.length >= 1000) {
            article.site.text = fc.correctedText;
            if (fc.correctedTitle) article.site.title = fc.correctedTitle;
            article.factCheckNotes = fc.errors;
          }
        }
      }
    }

    savePending(pending);
    await sendPreview(bot, article);
    return true;
  } catch (err) {
    console.error('[NEWS] handleEditCommand error:', err.message);
    await ctx.reply(`❌ Ошибка правки: ${err.message.slice(0, 200)}`);
    return false;
  }
}

module.exports = {
  setupApprovalHandlers,
  sendPreview,
  executePublish,
  loadPending,
  savePending,
  loadQueue,
  saveQueue,
  showRepublishMenu,
  setupRepublishHandlers,
  getEditCmdState,
  handleEditCommand,
};
