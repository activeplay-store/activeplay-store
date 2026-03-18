import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { load } from 'cheerio';

const URL = 'https://www.pushsquare.com/guides/all-ps-plus-games-available-now?tier=ps-plus-premium&status=all';
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'catalog-classics.json');

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
  console.log('📦 Fetching PS Plus Premium/Deluxe classics catalog...\n');
  let html: string;
  try { html = await fetchHtml(URL); } catch (err) { console.error(`❌ ${(err as Error).message}`); process.exit(1); }

  const $ = load(html);
  const games: { title: string; platform: string[] }[] = [];

  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 2) return;
    const title = $(cells[0]).text().trim();
    if (!title) return;
    const pt = $(cells[1]).text().trim().toUpperCase();
    const platform: string[] = [];
    if (pt.includes('PS1') || pt.includes('PSX')) platform.push('PS1');
    if (pt.includes('PS2')) platform.push('PS2');
    if (pt.includes('PS3')) platform.push('PS3');
    if (pt.includes('PSP')) platform.push('PSP');
    if (pt.includes('PS5')) platform.push('PS5');
    if (pt.includes('PS4')) platform.push('PS4');
    if (platform.length === 0) platform.push('PS1');
    games.push({ title, platform });
  });

  if (games.length === 0) { console.error('❌ No games found.'); process.exit(1); }

  const seen = new Set<string>();
  const unique = games.filter((g) => { const k = g.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => a.title.localeCompare(b.title, 'en'));

  const catalog = { lastUpdated: new Date().toISOString().split('T')[0], totalGames: unique.length, games: unique };
  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(`✅ Каталог классики: ${unique.length} игр → ${OUTPUT}`);
}

main();
