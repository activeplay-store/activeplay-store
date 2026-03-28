const fs = require('fs');
const path = require('path');
const { fetchAll } = require('./parser');
const { rankNews } = require('./scorer');
const { translateAndRewrite } = require('./translator');
const { sendPreview, savePending: savePendingToFile, loadQueue, saveQueue, executePublish } = require('./approval');

const RESERVE_FILE = path.join(__dirname, '../../../data/reserve-news.json');

async function runNewsCycle(bot) {
  console.log('[NEWS] === Starting news cycle ===');

  // 1. Парсим
  const rawNews = await fetchAll();
  console.log(`[NEWS] ${rawNews.length} fresh articles`);
  if (rawNews.length === 0) return;

  // 2. Топ-10 (берём 10, предлагаем 5, остальные — запас для "Предложить другую")
  const top = rankNews(rawNews, 10);
  console.log(`[NEWS] Top 10 scored`);

  // 3. Переводим первые 5
  const toTranslate = top.slice(0, 5);
  const translated = [];

  for (const article of toTranslate) {
    const result = await translateAndRewrite(article);
    if (result) {
      const enriched = {
        ...article,
        ...result,
        id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      translated.push(enriched);
    }
    // Пауза между запросами к Claude API
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`[NEWS] ${translated.length} translated, sending for approval`);

  // 4. Сохранить в pending
  savePendingToFile(translated);

  // 5. Отправить превью Сергею
  for (const article of translated) {
    await sendPreview(bot, article);
    await new Promise(r => setTimeout(r, 1000));
  }

  // Сохранить запасных (6-10) для "Предложить другую"
  const reserves = top.slice(5, 10);
  fs.writeFileSync(RESERVE_FILE, JSON.stringify(reserves, null, 2));

  console.log('[NEWS] === Cycle complete, awaiting approval ===');
}

// Получить следующего кандидата (для кнопки "Предложить другую")
async function getNextCandidate() {
  try {
    const reserves = JSON.parse(fs.readFileSync(RESERVE_FILE, 'utf-8'));
    if (reserves.length === 0) return null;

    const next = reserves.shift();
    fs.writeFileSync(RESERVE_FILE, JSON.stringify(reserves, null, 2));

    // Перевести
    const result = await translateAndRewrite(next);
    if (!result) return null;

    const enriched = {
      ...next,
      ...result,
      id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    // Добавить в pending
    const { loadPending, savePending } = require('./approval');
    const pending = loadPending();
    pending.push(enriched);
    savePending(pending);

    return enriched;
  } catch {
    return null;
  }
}

// Обработка очереди отложенных публикаций (вызывать каждую минуту)
async function processQueue(bot) {
  const queue = loadQueue();
  if (queue.length === 0) return;

  const now = new Date();
  const ready = queue.filter(a => new Date(a.publishAt) <= now);
  const remaining = queue.filter(a => new Date(a.publishAt) > now);

  for (const article of ready) {
    console.log(`[NEWS] Publishing scheduled: ${article.site?.title || article.title}`);
    await executePublish(bot, article.id);
  }

  if (ready.length > 0) {
    saveQueue(remaining);
  }
}

module.exports = { runNewsCycle, getNextCandidate, processQueue };
