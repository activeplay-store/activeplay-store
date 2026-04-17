// agent/src/modules/news/db.js
// SQLite-база для памяти между циклами, дедупа и аналитики

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', '..', 'data', 'news.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('busy_timeout = 5000');
    initSchema();
  }
  return db;
}

function initSchema() {
  const d = getDb();

  d.exec(`
    CREATE TABLE IF NOT EXISTS news_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_normalized TEXT NOT NULL,
      title_full TEXT NOT NULL,
      source_id TEXT,
      source_name TEXT,
      url TEXT,
      score REAL DEFAULT 0,
      score_breakdown TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','published','skipped','ignored')),
      cycle_id TEXT,
      fetched_at TEXT DEFAULT (datetime('now')),
      published_at TEXT,
      pub_date TEXT,
      reddit_score INTEGER DEFAULT 0,
      description_length INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_title_norm ON news_items(title_normalized);
    CREATE INDEX IF NOT EXISTS idx_fetched ON news_items(fetched_at);
    CREATE INDEX IF NOT EXISTS idx_status ON news_items(status);
    CREATE INDEX IF NOT EXISTS idx_source ON news_items(source_id);
    CREATE INDEX IF NOT EXISTS idx_cycle ON news_items(cycle_id);
  `);

  console.log('[DB] SQLite ready:', DB_PATH);
}

// === ДЕДУП ===

// Проверяет, была ли новость за последние N часов (по нормализованному заголовку)
function wasSeenRecently(titleNormalized, hoursBack = 48) {
  const d = getDb();
  const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  const row = d.prepare(`
    SELECT id, status FROM news_items
    WHERE title_normalized = ? AND fetched_at > ?
    LIMIT 1
  `).get(titleNormalized, cutoff);
  return row || null;
}

// Пакетная проверка — эффективнее для больших массивов
function filterSeenArticles(articles, hoursBack = 48) {
  const d = getDb();
  const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

  const stmt = d.prepare(`
    SELECT title_normalized FROM news_items
    WHERE fetched_at > ?
  `);
  const seenRows = stmt.all(cutoff);
  const seenSet = new Set(seenRows.map(r => r.title_normalized));

  const fresh = [];
  const dupes = [];
  for (const a of articles) {
    if (seenSet.has(a._titleNormalized)) {
      dupes.push(a);
    } else {
      fresh.push(a);
    }
  }

  if (dupes.length > 0) {
    console.log(`[DB] Дедуп: ${dupes.length} повторов отброшено, ${fresh.length} новых`);
  }
  return fresh;
}

// === ЗАПИСЬ ===

// Сохранить батч новостей после скоринга
function saveArticles(articles, cycleId) {
  const d = getDb();
  const stmt = d.prepare(`
    INSERT INTO news_items
      (title_normalized, title_full, source_id, source_name, url, score, score_breakdown,
       status, cycle_id, pub_date, reddit_score, description_length)
    VALUES
      (@titleNorm, @titleFull, @sourceId, @sourceName, @url, @score, @breakdown,
       @status, @cycleId, @pubDate, @redditScore, @descLen)
  `);

  const insert = d.transaction((items) => {
    for (const a of items) {
      stmt.run({
        titleNorm: a._titleNormalized || '',
        titleFull: a.title || '',
        sourceId: a.sourceId || '',
        sourceName: a.sourceName || '',
        url: a.link || '',
        score: a.score || 0,
        breakdown: JSON.stringify(a._scoreBreakdown || {}),
        status: 'pending',
        cycleId: cycleId,
        pubDate: a.pubDate || '',
        redditScore: a.redditScore || 0,
        descLen: (a.description || '').length,
      });
    }
  });

  insert(articles);
  console.log(`[DB] Сохранено ${articles.length} статей (cycle: ${cycleId})`);
}

// Обновить статус (published / skipped / ignored)
function updateStatus(titleNormalized, status) {
  const d = getDb();
  const extra = status === 'published' ? `, published_at = datetime('now')` : '';
  d.prepare(`
    UPDATE news_items SET status = ? ${extra}
    WHERE title_normalized = ?
    AND id = (SELECT MAX(id) FROM news_items WHERE title_normalized = ?)
  `).run(status, titleNormalized, titleNormalized);
}

// Пометить всё неопубликованное из цикла как ignored
function markCycleIgnored(cycleId) {
  const d = getDb();
  d.prepare(`
    UPDATE news_items SET status = 'ignored'
    WHERE cycle_id = ? AND status = 'pending'
  `).run(cycleId);
}

// === АНАЛИТИКА ===

// Статистика по источникам за N дней
function sourceStats(days = 7) {
  const d = getDb();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  return d.prepare(`
    SELECT
      source_name,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      ROUND(AVG(score), 1) as avg_score,
      MAX(score) as max_score
    FROM news_items
    WHERE fetched_at > ?
    GROUP BY source_name
    ORDER BY published DESC, avg_score DESC
  `).all(cutoff);
}

// Топ-10 последнего цикла с breakdown
function lastCycleTop(limit = 10) {
  const d = getDb();
  return d.prepare(`
    SELECT title_full, source_name, score, score_breakdown, status
    FROM news_items
    WHERE cycle_id = (SELECT MAX(cycle_id) FROM news_items)
    ORDER BY score DESC
    LIMIT ?
  `).all(limit);
}

// Очистка старых записей (>30 дней)
function cleanup(daysKeep = 30) {
  const d = getDb();
  const cutoff = new Date(Date.now() - daysKeep * 24 * 60 * 60 * 1000).toISOString();
  const result = d.prepare(`DELETE FROM news_items WHERE fetched_at < ?`).run(cutoff);
  if (result.changes > 0) {
    console.log(`[DB] Cleanup: удалено ${result.changes} записей старше ${daysKeep} дней`);
  }
}

module.exports = {
  getDb,
  wasSeenRecently,
  filterSeenArticles,
  saveArticles,
  updateStatus,
  markCycleIgnored,
  sourceStats,
  lastCycleTop,
  cleanup,
};
