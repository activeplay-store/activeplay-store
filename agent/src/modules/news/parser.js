const RssParser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const sources = require('./sources');

const rssParser = new RssParser({
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

function extractImage(html) {
  if (!html) return '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return imgMatch ? imgMatch[1] : '';
}

function extractImageFromItem(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item['media:content'] && item['media:content'].$) return item['media:content'].$.url;
  if (item['media:thumbnail'] && item['media:thumbnail'].$) return item['media:thumbnail'].$.url;
  const html = item.content || item['content:encoded'] || '';
  return extractImage(html);
}

// === RSS ===
async function fetchRSS(source) {
  try {
    const feed = await rssParser.parseURL(source.url);
    const articles = (feed.items || []).slice(0, 15).map(item => ({
      sourceId: source.id,
      sourceName: source.name,
      sourceWeight: source.weight || 1,
      category: source.category || 'media',
      title: (item.title || '').trim(),
      link: item.link || '',
      description: (item.contentSnippet || item.content || item.summary || '').substring(0, 2000),
      image: extractImageFromItem(item) || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
    }));
    console.log(`[NEWS] ${source.name}: ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.error(`[NEWS] ${source.name} error: ${err.message}`);
    return [];
  }
}

// === Reddit ===
async function fetchReddit(source) {
  try {
    const { data } = await axios.get(source.url, {
      headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
      timeout: 10000,
    });
    const posts = (data.data?.children || []).slice(0, 15);
    return posts
      .filter(p => p.data && !p.data.stickied)
      .map(p => ({
        sourceId: source.id,
        sourceName: source.name,
        sourceWeight: source.weight || 1,
        category: source.category || 'community',
        title: (p.data.title || '').trim(),
        link: p.data.url || `https://reddit.com${p.data.permalink}`,
        description: (p.data.selftext || '').substring(0, 500),
        image: '',
        pubDate: new Date(p.data.created_utc * 1000).toISOString(),
        redditScore: p.data.score || 0,
      }));
  } catch (err) {
    console.error(`[NEWS] ${source.name} error: ${err.message}`);
    return [];
  }
}

// === Nitter (Twitter через Nitter) ===
const NITTER_INSTANCES = [
  'nitter.privacydev.net',
  'nitter.poast.org',
  'nitter.woodland.cafe',
  'nitter.1d4.us',
];

async function fetchNitter(source) {
  for (const instance of NITTER_INSTANCES) {
    try {
      const url = source.url.replace(/nitter\.[^/]+/, instance);
      const feed = await rssParser.parseURL(url);
      return feed.items.slice(0, 10).map(item => ({
        sourceId: source.id,
        sourceName: source.name,
        sourceWeight: source.weight,
        category: source.category,
        title: item.title || item.contentSnippet?.substring(0, 100) || '',
        link: item.link || '',
        description: (item.contentSnippet || item.content || '').substring(0, 500),
        image: extractImage(item.content) || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        isTwitter: true,
      }));
    } catch { continue; }
  }
  console.error(`[NEWS] All Nitter instances failed for ${source.id}`);
  return [];
}

// === Telegram (публичное web-превью) ===
async function fetchTelegram(source) {
  try {
    const { data } = await axios.get(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    });
    const $ = cheerio.load(data);
    const posts = [];
    $('.tgme_widget_message').each((i, el) => {
      const $el = $(el);
      const text = $el.find('.tgme_widget_message_text').text().trim();
      const dateEl = $el.find('.tgme_widget_message_date time');
      const date = dateEl.attr('datetime') || new Date().toISOString();
      const link = $el.find('.tgme_widget_message_date').attr('href') || '';
      if (text && text.length > 20) {
        posts.push({
          sourceId: source.id, sourceName: source.name,
          sourceWeight: source.weight, category: source.category,
          title: text.substring(0, 100), link,
          description: text.substring(0, 500), image: '',
          pubDate: date, isTelegram: true,
        });
      }
    });
    return posts.slice(0, 10);
  } catch (err) {
    console.error(`[NEWS] TG error ${source.id}: ${err.message}`);
    return [];
  }
}

// === Fetch All ===
async function fetchAll() {
  const allArticles = [];
  const seen = new Set();

  // Batch по 10 для параллельного фетча
  const batchSize = 10;
  for (let i = 0; i < sources.length; i += batchSize) {
    const batch = sources.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(s => {
        if (s.type === 'reddit') return fetchReddit(s);
        if (s.type === 'nitter') return fetchNitter(s);
        if (s.type === 'telegram') return fetchTelegram(s);
        return fetchRSS(s);
      })
    );

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      for (const article of result.value) {
        const key = normalizeTitle(article.title);
        if (!key || seen.has(key)) continue;
        seen.add(key);

        // Только свежие (не старше 24 часов)
        const ageHours = (Date.now() - new Date(article.pubDate).getTime()) / (1000 * 60 * 60);
        if (ageHours > 24) continue;

        allArticles.push(article);
      }
    }
  }

  console.log(`[NEWS] Total unique articles (24h): ${allArticles.length}`);
  return allArticles;
}

module.exports = { fetchAll, fetchRSS, fetchReddit, fetchNitter, fetchTelegram };
