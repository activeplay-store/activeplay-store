const config = require('../../config');

const RAWG_KEY = config.parsers.rawg?.apiKey || 'd9ca3380009e448e8fb356b3837cafa2';
const BASE_URL = config.parsers.rawg?.endpoint || 'https://api.rawg.io/api';

async function searchGame(gameName) {
  try {
    const cleanName = gameName
      .replace(/\s*\+\s*.*/g, '')
      .replace(/\s*Sürüm\S*/gi, '')
      .replace(/\s*Lüks\s*/gi, '')
      .replace(/\s*Paketleri\s*/gi, '')
      .replace(/\s*Dijital\S*/gi, '')
      .replace(/\s*Nihai\s*/gi, '')
      .replace(/\s*Koleksiyon\S*/gi, '')
      .replace(/\s*Sezon\s*Kart\S*/gi, '')
      .replace(/PS[45] & PS[45]/gi, '')
      .replace(/PS[45]/gi, '')
      .replace(/\s*(Digital\s+)?Deluxe/gi, '')
      .replace(/\s*Ultimate\s*Edition/gi, '')
      .replace(/\s*Standard\s*Edition/gi, '')
      .replace(/\s*GOTY/gi, '')
      .replace(/\s*Game of the Year/gi, '')
      .replace(/\s*TOTY\s*Edition/gi, '')
      .replace(/™|®/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanName || cleanName.length < 3) return null;

    const params = new URLSearchParams({
      key: RAWG_KEY,
      search: cleanName,
      page_size: '3',
      platforms: '187,18',
      search_precise: 'true'
    });

    const response = await fetch(`${BASE_URL}/games?${params}`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('[RAWG] ⚠️ Rate limit — пауза');
      }
      return null;
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];

    return {
      metacritic: result.metacritic || null,
      ratingsCount: result.ratings_count || 0,
      released: result.released || null,
      genres: (result.genres || []).map(g => g.name),
      rating: result.rating || null,
      slug: result.slug
    };
  } catch (err) {
    console.log(`[RAWG] ⚠️ ${gameName}: ${err.message}`);
    return null;
  }
}

async function fetchGameDetails(slug) {
  try {
    const params = new URLSearchParams({ key: RAWG_KEY });
    const response = await fetch(`${BASE_URL}/games/${slug}?${params}`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': config.parsers.userAgent }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      description: data.description_raw || null,
      genres: (data.genres || []).map(g => g.name),
      metacritic: data.metacritic || null,
    };
  } catch (err) {
    console.log(`[RAWG] ⚠️ details ${slug}: ${err.message}`);
    return null;
  }
}

function calculateHypeScore(ratingsCount, metacritic) {
  let hype = 1;
  if (ratingsCount >= 5000) hype = 10;
  else if (ratingsCount >= 2000) hype = 7;
  else if (ratingsCount >= 500) hype = 5;
  else if (ratingsCount >= 100) hype = 3;

  if (metacritic && metacritic >= 90) hype = Math.max(hype, 10);
  else if (metacritic && metacritic >= 85) hype = Math.max(hype, 7);

  return hype;
}

function calculateFreshness(releasedDate) {
  if (!releasedDate) return 5;

  const released = new Date(releasedDate);
  const now = new Date();
  const monthsAgo = (now - released) / (1000 * 60 * 60 * 24 * 30);

  if (monthsAgo <= 12) return 10;
  if (monthsAgo <= 24) return 7;
  if (monthsAgo <= 48) return 5;
  return 3;
}

const BRAND_HYPE = [
  { score: 10, patterns: ['god of war', 'spider-man', 'spider man', 'last of us', 'gta', 'grand theft auto', 'silent hill', 'final fantasy', 'death stranding', "baldur's gate", 'baldurs gate', 'ea sports fc', 'fifa', 'red dead', 'cyberpunk', 'witcher', 'elden ring'] },
  { score: 7, patterns: ['resident evil', "assassin's creed", 'assassins creed', 'tekken', 'need for speed', 'far cry', 'kingdom come', 'hogwarts', 'star wars', 'uncharted', 'horizon', 'sekiro', 'like a dragon', 'yakuza', 'persona', 'ufc', 'mortal kombat'] },
  { score: 5, patterns: ['devil may cry', 'gran turismo', 'sonic', "demon's souls", 'demons souls', 'dragon age', 'destiny', 'batman', 'astro bot', 'hitman', 'the crew', 'mount blade', 'mount & blade'] },
];

function brandFallback(name) {
  const lower = (name || '').toLowerCase();
  for (const tier of BRAND_HYPE) {
    for (const pattern of tier.patterns) {
      if (lower.includes(pattern)) {
        return { hypeScore: tier.score };
      }
    }
  }
  return { hypeScore: 3 };
}

module.exports = { searchGame, fetchGameDetails, calculateHypeScore, calculateFreshness, brandFallback };
