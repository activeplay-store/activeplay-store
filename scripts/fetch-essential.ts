import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { load } from 'cheerio';

const URL = 'https://www.pushsquare.com/guides/all-ps-plus-games-available-now?tier=ps-plus-essential';
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'essential-monthly.json');

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

interface EssentialGame {
  title: string;
  platform: string[];
}

async function main() {
  console.log('📦 Fetching PS Plus Essential monthly games from PushSquare...\n');

  let html: string;
  try {
    html = await fetchHtml(URL);
  } catch (err) {
    console.error(`❌ Failed to fetch page: ${(err as Error).message}`);
    process.exit(1);
  }

  const $ = load(html);
  const games: EssentialGame[] = [];

  // Parse table rows
  $('table tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 2) return;

    const title = $(cells[0]).text().trim();
    if (!title) return;

    const platformText = $(cells[1]).text().trim().toUpperCase();
    const platform: string[] = [];
    if (platformText.includes('PS5')) platform.push('PS5');
    if (platformText.includes('PS4')) platform.push('PS4');
    if (platform.length === 0) platform.push('PS5');

    games.push({ title, platform });
  });

  // Try to extract "available until" date from page text
  let availableUntil = '';
  const pageText = $('body').text();
  const dateMatch = pageText.match(/available\s+until\s+(\w+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i);
  if (dateMatch) {
    availableUntil = dateMatch[1];
  }

  // Determine month from current date or page content
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const now = new Date();
  const month = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  if (games.length === 0) {
    console.error('❌ No games found. Page structure may have changed.');
    console.error('   Keeping existing essential-monthly.json unchanged.');
    process.exit(1);
  }

  const result = {
    month,
    availableUntil: availableUntil || 'TBD',
    games,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + '\n', 'utf-8');
  console.log(`✅ Essential обновлён: ${games.length} игр (${month})`);
  if (availableUntil) {
    console.log(`   Доступны до: ${availableUntil}`);
  }
  console.log(`   Сохранено в: ${OUTPUT}`);
}

main();
