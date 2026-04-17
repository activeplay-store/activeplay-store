const fs = require('fs');
const path = require('path');
const { fetchAll } = require('./parser');
const { rankNews } = require('./scorer');
const { saveArticles, cleanup } = require('./db');
const { translateAndRewrite } = require('./translator');
const { sendPreview, savePending: savePendingToFile, loadQueue, saveQueue, executePublish } = require('./approval');
const { runPipeline } = require('./pipeline');

const RESERVE_FILE = path.join(__dirname, '../../../data/reserve-news.json');

const STEP_LABELS = {
  enrich: '🔍 Обогащение фактами',
  generate: '✍️ Генерация текста (4 абзаца)',
  headline: '📰 Проверка заголовка',
  factcheck: '✅ Фактчек',
  image: '🖼 Картинка',
  done: '✓ Готово',
};

function renderProgress(titles, statuses) {
  const lines = ['\u23f3 Обработка ' + titles.length + ' новостей параллельно:', ''];
  for (let i = 0; i < titles.length; i++) {
    const title = (titles[i] || '').slice(0, 40);
    const status = statuses[i] === 'error' ? '❌ Ошибка' : (STEP_LABELS[statuses[i]] || '⏳ Ожидание');
    lines.push(`${i + 1}. ${title}${title.length >= 40 ? '...' : ''} — ${status}`);
  }
  return lines.join('\n');
}

/**
 * Цикл новостей: парсинг → топ-5 → параллельный полный pipeline(skipPublish) → превью.
 * options.chatId / options.messageId — если переданы, обновляем это сообщение прогрессом.
 * Без options — тихий режим (cron).
 */
async function runNewsCycle(bot, options = {}) {
  console.log('[NEWS] === Starting news cycle ===');

  // 1. Парсим
  const rawNews = await fetchAll();
  console.log(`[NEWS] ${rawNews.length} fresh articles`);
  if (rawNews.length === 0) return;

  // 2. Топ-10 с diversity (max 2 из одного источника), предлагаем 5, остальные — запас
  const top = rankNews(rawNews, 10, 2);
  console.log(`[NEWS] Top 10 scored`);

  // Сохранить топ-10 в SQLite для дедупа и аналитики
  try { saveArticles(top, rawNews._cycleId || new Date().toISOString()); }
  catch (e) { console.error('[NEWS] DB save:', e.message); }
  try { cleanup(30); } catch {}

  // 3. Переводим первые 5 (Step 1 — перевод + базовый rewrite)
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
    // Пауза между запросами к OpenAI
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`[NEWS] ${translated.length} translated, running full pipeline in parallel`);

  // 4. Прогресс-стейт + debounce на editMessageText
  const titles = translated.map(a => a.site?.title || a.title || '(без заголовка)');
  const statuses = new Array(translated.length).fill('enrich');
  const { chatId, messageId } = options;

  let pendingUpdate = false;
  function scheduleRender() {
    if (!chatId || !messageId || !bot) return;
    if (pendingUpdate) return;
    pendingUpdate = true;
    setTimeout(() => {
      bot.telegram.editMessageText(chatId, messageId, undefined, renderProgress(titles, statuses))
        .catch(() => {});
      pendingUpdate = false;
    }, 2000);
  }

  function updateProgress(i, step) {
    statuses[i] = step;
    scheduleRender();
  }

  // 5. Параллельно прогнать полный pipeline с skipPublish:true
  const results = await Promise.all(translated.map((article, i) =>
    runPipeline(article, [], bot, {
      skipPublish: true,
      onStep: (step) => updateProgress(i, step),
    }).then(
      (prepared) => ({ ok: true, article: prepared }),
      (err) => {
        console.error(`[NEWS] Pipeline failed for "${titles[i]}": ${err.message}`);
        statuses[i] = 'error';
        scheduleRender();
        return { ok: false, error: err.message };
      }
    )
  ));

  const prepared = results.filter(r => r.ok).map(r => r.article);
  console.log(`[NEWS] ${prepared.length}/${translated.length} articles prepared, sending previews`);

  // Финальный рендер прогресса (без debounce, чтобы гарантированно показать «Готово»)
  if (chatId && messageId && bot) {
    bot.telegram.editMessageText(chatId, messageId, undefined, renderProgress(titles, statuses))
      .catch(() => {});
  }

  // 6. Сохранить в pending ГОТОВЫЕ статьи (1:1 финальный продукт)
  savePendingToFile(prepared);

  // 7. Отправить превью Сергею
  for (const article of prepared) {
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
