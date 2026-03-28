const RssParser = require('rss-parser');
const sources = require('./sources');

const rss = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
});

// Дедупликация по заголовку (нормализованному)
function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchSource(source) {
  try {
    const feed = await rss.parseURL(source.url);
    const articles = (feed.items || []).slice(0, 15).map(item => ({
      title: (item.title || '').trim(),
      description: (item.contentSnippet || item.content || item.summary || '').substring(0, 2000),
      link: item.link || '',
      image: extractImage(item),
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      sourceName: source.name,
      sourceWeight: source.weight || 1,
      sourceCategory: source.category || 'media',
      lang: source.lang || 'en',
    }));
    console.log(`[NEWS] ${source.name}: ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.error(`[NEWS] ${source.name} error: ${err.message}`);
    return [];
  }
}

function extractImage(item) {
  // Попытаться извлечь картинку из разных полей RSS
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item['media:content'] && item['media:content'].$) return item['media:content'].$.url;
  if (item['media:thumbnail'] && item['media:thumbnail'].$) return item['media:thumbnail'].$.url;

  // Fallback: из HTML контента
  const html = item.content || item['content:encoded'] || '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

async function fetchAll() {
  const allArticles = [];
  const seen = new Set();

  // Параллельный фетч всех источников
  const results = await Promise.allSettled(
    sources.map(s => fetchSource(s))
  );

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const article of result.value) {
      const key = normalizeTitle(article.title);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      // Только свежие (не старше 24 часов)
      const ageHours = (Date.now() - article.pubDate.getTime()) / (1000 * 60 * 60);
      if (ageHours > 24) continue;

      allArticles.push(article);
    }
  }

  console.log(`[NEWS] Total unique articles (24h): ${allArticles.length}`);
  return allArticles;
}

module.exports = { fetchAll, fetchSource };
