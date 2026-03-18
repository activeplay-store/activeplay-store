import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { load } from 'cheerio';

const URL = 'https://www.pushsquare.com/guides/all-ps-plus-games-available-now?tier=ps-plus-extra&status=all';
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'catalog-extra.json');

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location!).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

interface CatalogGame {
  title: string;
  platform: string[];
}

async function main() {
  console.log('📦 Fetching PS Plus Extra catalog from PushSquare...\n');

  let html: string;
  try {
    html = await fetchHtml(URL);
  } catch (err) {
    console.error(`❌ Failed to fetch page: ${(err as Error).message}`);
    process.exit(1);
  }

  const $ = load(html);
  const games: CatalogGame[] = [];

  // PushSquare uses a table with game titles and platform info
  // Try multiple selectors to find game entries
  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 2) return;

    const title = $(cells[0]).text().trim();
    if (!title) return;

    const platformText = $(cells[1]).text().trim().toUpperCase();
    const platform: string[] = [];
    if (platformText.includes('PS5')) platform.push('PS5');
    if (platformText.includes('PS4')) platform.push('PS4');
    if (platform.length === 0) platform.push('PS5'); // default

    games.push({ title, platform });
  });

  // Fallback: try list items if no table found
  if (games.length === 0) {
    $('li').each((_, el) => {
      const text = $(el).text().trim();
      // Look for patterns like "Game Title (PS5)" or "Game Title (PS4, PS5)"
      const match = text.match(/^(.+?)\s*\(([^)]*PS[45][^)]*)\)\s*$/);
      if (match) {
        const title = match[1].trim();
        const platformText = match[2].toUpperCase();
        const platform: string[] = [];
        if (platformText.includes('PS5')) platform.push('PS5');
        if (platformText.includes('PS4')) platform.push('PS4');
        if (platform.length === 0) platform.push('PS5');
        games.push({ title, platform });
      }
    });
  }

  if (games.length === 0) {
    console.error('❌ No games found in HTML. Page structure may have changed.');
    console.error('   Keeping existing catalog-extra.json unchanged.');
    process.exit(1);
  }

  // Sort alphabetically
  games.sort((a, b) => a.title.localeCompare(b.title, 'en'));

  // Remove duplicates
  const seen = new Set<string>();
  const unique = games.filter((g) => {
    const key = g.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const today = new Date().toISOString().split('T')[0];
  const catalog = {
    lastUpdated: today,
    totalGames: unique.length,
    games: unique,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(`✅ Каталог обновлён: ${unique.length} игр`);
  console.log(`   Сохранено в: ${OUTPUT}`);
}

main();
