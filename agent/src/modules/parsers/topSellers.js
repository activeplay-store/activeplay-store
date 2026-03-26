/**
 * TopSellers Parser — парсит топ-продаж PS5 из PlayStation Blog.
 *
 * PlayStation Blog публикует топ-20 PS5 каждый месяц (~8-10 числа):
 * https://blog.playstation.com/tag/top-downloads/
 */

const config = require('../../config');

const PREFIX = '[TopSellers]';

const BLOG_TAG_URL = 'https://blog.playstation.com/tag/top-downloads/';

const MONTH_NAMES_RU = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

const MONTH_NAMES_EN_TO_RU = {
  'january': 'январь', 'february': 'февраль', 'march': 'март',
  'april': 'апрель', 'may': 'май', 'june': 'июнь',
  'july': 'июль', 'august': 'август', 'september': 'сентябрь',
  'october': 'октябрь', 'november': 'ноябрь', 'december': 'декабрь',
};

/**
 * Fetch the latest top-sellers post from PlayStation Blog.
 * Returns { month, year, games: string[] } or null if nothing new.
 */
async function fetchLatestPost(lastKnownMonth) {
  console.log(PREFIX + ' Проверяем PlayStation Blog...');

  try {
    // Use WordPress REST API for cleaner parsing
    const apiUrl = 'https://blog.playstation.com/wp-json/wp/v2/posts?tags=3408&per_page=5&_fields=id,title,date,link,content';
    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': config.parsers?.userAgent || 'ActivePlay-Agent/1.0' },
    });

    if (!res.ok) {
      // Fallback: try fetching the tag page directly
      console.log(PREFIX + ' WP API failed (' + res.status + '), trying HTML fallback...');
      return await fetchFromHtml(lastKnownMonth);
    }

    const posts = await res.json();
    if (!posts || posts.length === 0) {
      console.log(PREFIX + ' Нет постов с тегом top-downloads');
      return null;
    }

    // Find the most recent "top downloads" or "most downloaded" post
    const topPost = posts.find(p => {
      const title = (p.title?.rendered || '').toLowerCase();
      return title.includes('top') && (title.includes('download') || title.includes('played') || title.includes('selling'));
    });

    if (!topPost) {
      console.log(PREFIX + ' Нет подходящего поста в последних 5');
      return null;
    }

    // Extract month and year from title
    const title = topPost.title.rendered;
    const { month, year } = extractMonthYear(title, topPost.date);

    // Check if this is a new month vs what we already have
    if (lastKnownMonth && month === lastKnownMonth.month && year === lastKnownMonth.year) {
      console.log(PREFIX + ' Тот же месяц (' + month + ' ' + year + '), пропускаем');
      return null;
    }

    // Extract game list from content
    const games = extractGamesFromHtml(topPost.content?.rendered || '');
    if (games.length === 0) {
      console.log(PREFIX + ' Не удалось извлечь игры из поста');
      return null;
    }

    console.log(PREFIX + ' Найден пост: ' + title);
    console.log(PREFIX + ' Игр: ' + games.length + ' — ' + games.slice(0, 5).join(', ') + '...');

    return { month, year, games, postUrl: topPost.link };
  } catch (err) {
    console.error(PREFIX + ' Ошибка: ' + err.message);
    return null;
  }
}

/**
 * Fallback: fetch tag page HTML and parse it.
 */
async function fetchFromHtml(lastKnownMonth) {
  try {
    const res = await fetch(BLOG_TAG_URL, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': config.parsers?.userAgent || 'ActivePlay-Agent/1.0' },
    });
    if (!res.ok) return null;

    const html = await res.text();

    // Find the first article link
    const linkMatch = html.match(/href="(https:\/\/blog\.playstation\.com\/\d{4}\/\d{2}\/\d{2}\/[^"]*(?:top|download|most-played)[^"]*)"/i);
    if (!linkMatch) return null;

    const postUrl = linkMatch[1];
    const postRes = await fetch(postUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': config.parsers?.userAgent || 'ActivePlay-Agent/1.0' },
    });
    if (!postRes.ok) return null;

    const postHtml = await postRes.text();

    // Extract title
    const titleMatch = postHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const { month, year } = extractMonthYear(title, '');

    if (lastKnownMonth && month === lastKnownMonth.month && year === lastKnownMonth.year) {
      return null;
    }

    const games = extractGamesFromHtml(postHtml);
    if (games.length === 0) return null;

    return { month, year, games, postUrl };
  } catch {
    return null;
  }
}

/**
 * Extract month and year from a post title like
 * "PlayStation Store — January 2026's Top Downloads"
 */
function extractMonthYear(title, dateStr) {
  const lower = title.toLowerCase();

  for (const [en, ru] of Object.entries(MONTH_NAMES_EN_TO_RU)) {
    if (lower.includes(en)) {
      const yearMatch = title.match(/20\d{2}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
      return { month: ru, year };
    }
  }

  // Fallback: use post date — assume top-sellers is for the PREVIOUS month
  if (dateStr) {
    const d = new Date(dateStr);
    // Post published in month X is typically about month X-1
    d.setMonth(d.getMonth() - 1);
    return { month: MONTH_NAMES_RU[d.getMonth()], year: d.getFullYear() };
  }

  return { month: 'неизвестно', year: new Date().getFullYear() };
}

/**
 * Extract game names from HTML content.
 * PS Blog typically uses <ol> or <h3> numbered lists.
 */
function extractGamesFromHtml(html) {
  const games = [];

  // Strategy 1: Ordered list items <li>
  const liMatches = html.matchAll(/<li[^>]*>\s*(?:<[^>]+>)*\s*([^<]+)/gi);
  for (const m of liMatches) {
    const name = m[1].trim().replace(/^\d+[\.\)]\s*/, '');
    if (name.length > 2 && name.length < 100 && !name.includes('http')) {
      games.push(name);
    }
  }

  if (games.length >= 5) return games.slice(0, 20);

  // Strategy 2: Numbered paragraphs or headings
  const numberedMatches = html.matchAll(/(?:<p|<h[234])[^>]*>\s*(?:<[^>]+>)*\s*(\d{1,2})[\.\)]\s*(?:<[^>]+>)*\s*([^<]+)/gi);
  const numbered = [];
  for (const m of numberedMatches) {
    const name = m[2].trim();
    if (name.length > 2 && name.length < 100) {
      numbered.push(name);
    }
  }

  if (numbered.length >= 5) return numbered.slice(0, 20);

  // Strategy 3: Bold items in paragraphs
  const boldMatches = html.matchAll(/<(?:strong|b)>([^<]+)<\/(?:strong|b)>/gi);
  const bold = [];
  for (const m of boldMatches) {
    const name = m[1].trim();
    if (name.length > 3 && name.length < 80 && !/^\d+$/.test(name)) {
      bold.push(name);
    }
  }

  return bold.length >= 5 ? bold.slice(0, 20) : games;
}

module.exports = { fetchLatestPost, extractMonthYear, extractGamesFromHtml, MONTH_NAMES_RU };
