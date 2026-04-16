const fs = require('fs');
const path = require('path');
const locks = require('../utils/locks');

const PENDING_FILE = path.join(__dirname, '../../../data/pending-news.json');
const QUEUE_FILE = path.join(__dirname, '../../../data/news-queue.json');

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
    savePending(pending.filter(a => a.id !== articleId));
    await ctx.editMessageText('❌ Отклонено');
    await ctx.answerCbQuery('Отклонено');
  });

  // ===== ПРЕДЛОЖИТЬ ДРУГУЮ =====
  bot.action(/^news_next_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    // Убрать текущую из pending
    const pending = loadPending();
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
  ].join('\n');

  await bot.telegram.sendMessage(ADMIN_ID, preview, {
    reply_markup: {
      inline_keyboard: [
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

// Выполнить публикацию через пайплайн v2
async function executePublish(bot, articleId) {
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

  const targets = article.targets || ['site'];

  // Запустить пайплайн v2
  const { runPipeline } = require('./pipeline');
  await runPipeline(article, targets, bot);

  // Убрать из pending (если статья была оттуда)
  if (source === 'pending') {
    savePending(pending.filter(a => a.id !== articleId));
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


module.exports = { setupApprovalHandlers, sendPreview, executePublish, loadPending, savePending, loadQueue, saveQueue, showRepublishMenu, setupRepublishHandlers };
