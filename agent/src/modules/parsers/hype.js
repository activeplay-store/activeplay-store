/**
 * Хайп-парсер: Twitch + YouTube
 * Собирает реальные данные о популярности игры по зрителям стримов и просмотрам трейлеров.
 * Кеширует результаты в agent/data/hype-cache.json (TTL 6 часов).
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');

const PREFIX = '[Hype]';
const CACHE_FILE = path.join(__dirname, '..', '..', 'data', 'hype-cache.json');
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 часов

// ── Cache ───────────────────────────────────────────────────────────────

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

function getCached(gameName) {
  const cache = loadCache();
  const key = gameName.toLowerCase().trim();
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
  return entry.data;
}

function setCache(gameName, data) {
  const cache = loadCache();
  const key = gameName.toLowerCase().trim();
  cache[key] = { timestamp: Date.now(), data };
  saveCache(cache);
}

// ── Twitch ──────────────────────────────────────────────────────────────

let twitchToken = null;
let twitchTokenExpiry = 0;

async function getTwitchToken() {
  if (twitchToken && Date.now() < twitchTokenExpiry) return twitchToken;

  const clientId = config.hype?.twitch?.clientId || process.env.TWITCH_CLIENT_ID;
  const clientSecret = config.hype?.twitch?.clientSecret || process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.log(PREFIX + ' Twitch credentials not configured');
    return null;
  }

  try {
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.log(PREFIX + ' Twitch token error: ' + res.status);
      return null;
    }

    const data = await res.json();
    twitchToken = data.access_token;
    twitchTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return twitchToken;
  } catch (err) {
    console.log(PREFIX + ' Twitch token: ' + err.message);
    return null;
  }
}

async function getTwitchViewers(gameName) {
  const token = await getTwitchToken();
  if (!token) return { viewers: 0, score: 1 };

  const clientId = config.hype?.twitch?.clientId || process.env.TWITCH_CLIENT_ID;

  try {
    // Поиск игры на Twitch
    const gameRes = await fetch(
      'https://api.twitch.tv/helix/games?name=' + encodeURIComponent(gameName),
      {
        headers: { 'Client-ID': clientId, 'Authorization': 'Bearer ' + token },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!gameRes.ok) return { viewers: 0, score: 1 };

    const gameData = await gameRes.json();
    if (!gameData.data || gameData.data.length === 0) return { viewers: 0, score: 1 };

    const gameId = gameData.data[0].id;

    // Получить стримы
    const streamsRes = await fetch(
      'https://api.twitch.tv/helix/streams?game_id=' + gameId + '&first=100',
      {
        headers: { 'Client-ID': clientId, 'Authorization': 'Bearer ' + token },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!streamsRes.ok) return { viewers: 0, score: 1 };

    const streamsData = await streamsRes.json();
    const totalViewers = (streamsData.data || []).reduce((sum, s) => sum + (s.viewer_count || 0), 0);

    return { viewers: totalViewers, score: scoreTwitch(totalViewers) };
  } catch (err) {
    console.log(PREFIX + ' Twitch ' + gameName + ': ' + err.message);
    return { viewers: 0, score: 1 };
  }
}

function scoreTwitch(viewers) {
  if (viewers >= 50000) return 10;
  if (viewers >= 20000) return 8;
  if (viewers >= 5000) return 6;
  if (viewers >= 1000) return 4;
  if (viewers >= 100) return 2;
  return 1;
}

// ── YouTube ─────────────────────────────────────────────────────────────

async function getYoutubeViews(gameName) {
  const apiKey = config.hype?.youtube?.apiKey || process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.log(PREFIX + ' YouTube API key not configured');
    return { views: 0, score: 1 };
  }

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const query = gameName + ' PS5 gameplay';

    // Поиск видео за последнюю неделю
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      publishedAfter: weekAgo,
      maxResults: '10',
      key: apiKey,
    });

    const searchRes = await fetch(
      'https://www.googleapis.com/youtube/v3/search?' + searchParams,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!searchRes.ok) {
      console.log(PREFIX + ' YouTube search error: ' + searchRes.status);
      return { views: 0, score: 1 };
    }

    const searchData = await searchRes.json();
    const videoIds = (searchData.items || [])
      .map(item => item.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) return { views: 0, score: 1 };

    // Получить статистику видео
    const statsParams = new URLSearchParams({
      part: 'statistics',
      id: videoIds.join(','),
      key: apiKey,
    });

    const statsRes = await fetch(
      'https://www.googleapis.com/youtube/v3/videos?' + statsParams,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!statsRes.ok) return { views: 0, score: 1 };

    const statsData = await statsRes.json();
    const totalViews = (statsData.items || []).reduce(
      (sum, v) => sum + parseInt(v.statistics?.viewCount || '0', 10),
      0
    );

    return { views: totalViews, score: scoreYoutube(totalViews) };
  } catch (err) {
    console.log(PREFIX + ' YouTube ' + gameName + ': ' + err.message);
    return { views: 0, score: 1 };
  }
}

function scoreYoutube(views) {
  if (views >= 10000000) return 10;
  if (views >= 5000000) return 8;
  if (views >= 1000000) return 6;
  if (views >= 500000) return 4;
  if (views >= 100000) return 2;
  return 1;
}

// ── Public API ──────────────────────────────────────────────────────────

async function getHypeScore(gameName) {
  // Проверить кеш
  const cached = getCached(gameName);
  if (cached) return cached;

  const [twitch, youtube] = await Promise.all([
    getTwitchViewers(gameName),
    getYoutubeViews(gameName),
  ]);

  const hypeScore = Math.round((twitch.score + youtube.score) / 2);

  const result = {
    twitchViewers: twitch.viewers,
    twitchScore: twitch.score,
    youtubeViews: youtube.views,
    youtubeScore: youtube.score,
    hypeScore,
  };

  setCache(gameName, result);

  console.log(
    PREFIX + ' ' + gameName +
    ': twitch=' + twitch.viewers + '(' + twitch.score + ')' +
    ' yt=' + youtube.views + '(' + youtube.score + ')' +
    ' → hype=' + hypeScore
  );

  return result;
}

/**
 * Получить хайп-скоры для массива игр с задержкой между запросами.
 * @param {string[]} gameNames
 * @param {number} delayMs - задержка между запросами (default 500ms)
 * @returns {Promise<Map<string, object>>} gameName → hypeData
 */
async function getHypeScores(gameNames, delayMs = 500) {
  const results = new Map();

  for (const name of gameNames) {
    const cached = getCached(name);
    if (cached) {
      results.set(name, cached);
      continue;
    }

    const data = await getHypeScore(name);
    results.set(name, data);

    // Задержка только для некешированных
    if (delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  return results;
}

module.exports = { getHypeScore, getHypeScores };
