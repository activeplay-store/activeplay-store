const fs = require('fs');
const path = require('path');

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

  // Только сайт
  bot.action(/^news_site_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['site']);
  });

  // Только Telegram
  bot.action(/^news_tg_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['telegram']);
  });

  // Telegram + сайт
  bot.action(/^news_tg_site_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['telegram', 'site']);
  });

  // Сайт + VK
  bot.action(/^news_site_vk_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['site', 'vk']);
  });

  // Везде
  bot.action(/^news_all_(.+)$/, async (ctx) => {
    await handlePublish(ctx, ctx.match[1], ['telegram', 'vk', 'site']);
  });

  // ===== ВРЕМЯ =====

  // Сейчас
  bot.action(/^news_now_(.+)$/, async (ctx) => {
    const articleId = ctx.match[1];
    await executePublish(bot, articleId);
    await ctx.editMessageText('✅ Опубликовано!');
    await ctx.answerCbQuery('Опубликовано');
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

// Выполнить публикацию
async function executePublish(bot, articleId) {
  const pending = loadPending();
  const article = pending.find(a => a.id === articleId);
  if (!article) return;

  const targets = article.targets || ['site'];
  const { getNewsImage } = require('./imageGen');
  const { writeToSite, deployToSite, publishToTelegram, publishToVK } = require('./publisher');

  // Получить/сгенерить картинку
  if (!article.imageUrl) {
    article.imageUrl = await getNewsImage(article);
  }

  // Публикация по целям
  if (targets.includes('site')) {
    writeToSite([article]);
    deployToSite();
  }
  if (targets.includes('telegram')) {
    await publishToTelegram(bot, article);
  }
  if (targets.includes('vk')) {
    await publishToVK(article);
  }

  // Убрать из pending
  savePending(pending.filter(a => a.id !== articleId));
}

module.exports = { setupApprovalHandlers, sendPreview, executePublish, loadPending, savePending, loadQueue, saveQueue };
