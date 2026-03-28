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

// === Fulltext fetch для коротких описаний ===
async function fetchFulltext(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ActivePlayBot/1.0)' },
      timeout: 8000,
      maxRedirects: 3,
    });
    const $ = cheerio.load(data);
    // Убрать скрипты, стили, навигацию
    $('script, style, nav, header, footer, aside, .ad, .sidebar, .comments').remove();
    // Искать основной контент по приоритету селекторов
    const selectors = ['article', '.post-content', '.entry-content', '.article-body', '.story-body', 'main'];
    for (const sel of selectors) {
      const content = $(sel).text().trim();
      if (content && content.length > 200) {
        return content.replace(/\s+/g, ' ').substring(0, 1500);
      }
    }
    // Fallback: body text
    const body = $('body').text().trim().replace(/\s+/g, ' ');
    return body.length > 200 ? body.substring(0, 1500) : '';
  } catch {
    return '';
  }
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
  const stats = { ok: 0, blocked: 0, dead: 0, timeout: 0, nitterDown: 0 };

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

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const source = batch[j];

      if (result.status !== 'fulfilled' || result.value.length === 0) {
        if (source.type === 'nitter') { stats.nitterDown++; continue; }
        // Определяем тип ошибки из логов
        const errMsg = result.reason?.message || '';
        if (errMsg.includes('403')) stats.blocked++;
        else if (errMsg.includes('404')) stats.dead++;
        else if (errMsg.includes('timeout') || errMsg.includes('ETIMEDOUT')) stats.timeout++;
        else if (result.value?.length === 0) stats.dead++;
        continue;
      }

      stats.ok++;
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

  // Статистика источников
  console.log(`[NEWS] Sources: ${stats.ok} OK, ${stats.blocked} blocked (403), ${stats.dead} dead (404), ${stats.timeout} timeout, ${stats.nitterDown} Nitter down`);

  // Fulltext enrichment для статей с коротким описанием
  const shortArticles = allArticles.filter(a => (a.description || '').length < 200 && a.link);
  if (shortArticles.length > 0) {
    console.log(`[NEWS] Fetching fulltext for ${shortArticles.length} short articles...`);
    const fulltextBatchSize = 5;
    for (let i = 0; i < shortArticles.length; i += fulltextBatchSize) {
      const batch = shortArticles.slice(i, i + fulltextBatchSize);
      const texts = await Promise.all(batch.map(a => fetchFulltext(a.link)));
      for (let j = 0; j < batch.length; j++) {
        if (texts[j] && texts[j].length > batch[j].description.length) {
          batch[j].description = texts[j];
        }
      }
    }
    const enriched = shortArticles.filter(a => (a.description || '').length >= 200).length;
    console.log(`[NEWS] Fulltext: ${enriched}/${shortArticles.length} enriched`);
  }

  console.log(`[NEWS] Total unique articles (24h): ${allArticles.length}`);
  return allArticles;
}

module.exports = { fetchAll, fetchRSS, fetchReddit, fetchNitter, fetchTelegram };
