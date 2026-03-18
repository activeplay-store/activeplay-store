import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { load } from 'cheerio';

const URL = 'https://www.allkeyshop.com/blog/every-ps-plus-game-trial-available-and-how-much-time-you-get-subscriptions-news-n/';
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'catalog-trials.json');

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) return fetchHtml(res.headers.location!).then(resolve, reject);
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('📦 Fetching PS Plus game trials catalog...\n');
  let html: string;
  try { html = await fetchHtml(URL); } catch (err) { console.error(`❌ ${(err as Error).message}`); process.exit(1); }

  const $ = load(html);
  const games: { title: string; hours: number }[] = [];

  // Try table format
  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 2) return;
    const title = $(cells[0]).text().trim();
    const hoursText = $(cells[1]).text().trim();
    if (!title) return;
    const hoursMatch = hoursText.match(/(\d+)/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 5;
    games.push({ title, hours });
  });

  // Fallback: try list items with hour patterns
  if (games.length === 0) {
    $('li, p').each((_, el) => {
      const text = $(el).text().trim();
      const match = text.match(/^(.+?)\s*[-–—]\s*(\d+)\s*hours?/i);
      if (match) {
        games.push({ title: match[1].trim(), hours: parseInt(match[2]) });
      }
    });
  }

  if (games.length === 0) {
    console.error('❌ No trials found. Keeping existing file.');
    process.exit(1);
  }

  const seen = new Set<string>();
  const unique = games.filter((g) => { const k = g.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => a.title.localeCompare(b.title, 'en'));

  const catalog = { lastUpdated: new Date().toISOString().split('T')[0], totalGames: unique.length, source: 'allkeyshop.com', games: unique };
  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(`✅ Пробные версии: ${unique.length} игр → ${OUTPUT}`);
}

main();
