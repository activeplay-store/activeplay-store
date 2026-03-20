import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// Load .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
    }
  }
}

const API_KEY = process.env.RAWG_API_KEY;
if (!API_KEY) {
  console.error('❌ RAWG_API_KEY not found in .env.local');
  process.exit(1);
}

const COVERS_DIR = path.resolve(__dirname, '..', 'public', 'images', 'covers');

const GAMES_TO_FETCH = [
  // ========== ХИТЫ КАТАЛОГА (10) ==========
  { slug: 'god-of-war-ragnarok', file: 'god-of-war-ragnarok.jpg', title: 'God of War Ragnarök' },
  { slug: 'marvels-spider-man-2', file: 'spider-man-2.jpg', title: "Marvel's Spider-Man 2" },
  { slug: 'ghost-of-tsushima', file: 'ghost-of-tsushima.jpg', title: "Ghost of Tsushima Director's Cut" },
  { slug: 'the-last-of-us-part-i', file: 'the-last-of-us-part-1.jpg', title: 'The Last of Us Part I' },
  { slug: 'horizon-forbidden-west', file: 'horizon-forbidden-west.jpg', title: 'Horizon Forbidden West' },
  { slug: 'hogwarts-legacy', file: 'hogwarts-legacy.jpg', title: 'Hogwarts Legacy' },
  { slug: 'silent-hill-2', file: 'silent-hill-2.jpg', title: 'Silent Hill 2' },
  { slug: 'cyberpunk-2077', file: 'cyberpunk-2077.jpg', title: 'Cyberpunk 2077' },
  { slug: 'mortal-kombat-1-2', file: 'mortal-kombat-1.jpg', title: 'Mortal Kombat 1' },
  { slug: 'returnal', file: 'returnal.jpg', title: 'Returnal' },
  // ========== НОВИНКИ МАРТА 2026 (15) ==========
  { slug: 'astroneer', file: 'astroneer.jpg', title: 'Astroneer' },
  { slug: 'blasphemous-2', file: 'blasphemous-2.jpg', title: 'Blasphemous II' },
  { slug: 'echoes-of-the-end', file: 'echoes-of-the-end.jpg', title: 'Echoes of the End: Enhanced Edition' },
  { slug: 'madden-nfl-26', file: 'madden-nfl-26.jpg', title: 'Madden NFL 26' },
  { slug: 'metal-eden', file: 'metal-eden.jpg', title: 'Metal Eden' },
  { slug: 'monster-hunter-stories', file: 'monster-hunter-stories.jpg', title: 'Monster Hunter Stories' },
  { slug: 'monster-hunter-stories-2-wings-of-ruin', file: 'monster-hunter-stories-2.jpg', title: 'Monster Hunter Stories 2: Wings of Ruin' },
  { slug: 'neva', file: 'neva.jpg', title: 'Neva' },
  { slug: 'persona-5-royal', file: 'persona-5-royal.jpg', title: 'Persona 5 Royal' },
  { slug: 'rugby-25', file: 'rugby-25.jpg', title: 'Rugby 25' },
  { slug: 'season-a-letter-to-the-future', file: 'season.jpg', title: 'Season: A Letter to the Future' },
  { slug: 'test-drive-unlimited-solar-crown', file: 'test-drive-solar-crown.jpg', title: 'Test Drive Unlimited: Solar Crown' },
  { slug: 'the-lord-of-the-rings-return-to-moria', file: 'lotr-return-to-moria.jpg', title: 'The Lord of the Rings: Return to Moria' },
  { slug: 'venba', file: 'venba.jpg', title: 'Venba' },
  { slug: 'warhammer-40000-space-marine-2', file: 'space-marine-2.jpg', title: 'Warhammer 40,000: Space Marine 2' },
  // ========== DELUXE — ХИТЫ КЛАССИКИ (15) ==========
  { slug: 'tekken-2', file: 'tekken-2.jpg', title: 'Tekken 2' },
  { slug: 'syphon-filter', file: 'syphon-filter.jpg', title: 'Syphon Filter' },
  { slug: 'jak-and-daxter-the-precursor-legacy', file: 'jak-and-daxter.jpg', title: 'Jak and Daxter: The Precursor Legacy' },
  { slug: 'ratchet-clank', file: 'ratchet-clank-classic.jpg', title: 'Ratchet & Clank (Classic)' },
  { slug: 'dino-crisis', file: 'dino-crisis.jpg', title: 'Dino Crisis' },
  { slug: 'ridge-racer-2', file: 'ridge-racer.jpg', title: 'Ridge Racer' },
  { slug: 'ape-escape', file: 'ape-escape.jpg', title: 'Ape Escape' },
  { slug: 'wild-arms', file: 'wild-arms.jpg', title: 'Wild Arms' },
  { slug: 'medievil', file: 'medievil.jpg', title: 'MediEvil' },
  { slug: 'twisted-metal', file: 'twisted-metal.jpg', title: 'Twisted Metal' },
  { slug: 'dark-cloud', file: 'dark-cloud.jpg', title: 'Dark Cloud' },
  { slug: 'dark-chronicle', file: 'dark-chronicle.jpg', title: 'Dark Chronicle' },
  { slug: 'ico', file: 'ico.jpg', title: 'ICO' },
  { slug: 'legend-of-dragoon', file: 'legend-of-dragoon.jpg', title: 'The Legend of Dragoon' },
  { slug: 'tomba', file: 'tomba.jpg', title: 'Tomba!' },
  // ========== DELUXE — ПРОБНЫЕ ВЕРСИИ (10) ==========
  { slug: 'dying-light-2', file: 'dying-light-2.jpg', title: 'Dying Light 2 Stay Human' },
  { slug: 'gotham-knights', file: 'gotham-knights.jpg', title: 'Gotham Knights' },
  { slug: 'sifu', file: 'sifu.jpg', title: 'Sifu' },
  { slug: 'atomic-heart', file: 'atomic-heart.jpg', title: 'Atomic Heart' },
  { slug: 'a-plague-tale-requiem', file: 'plague-tale-requiem.jpg', title: 'A Plague Tale: Requiem' },
  { slug: 'rollerdrome', file: 'rollerdrome.jpg', title: 'Rollerdrome' },
  { slug: 'marvels-midnight-suns', file: 'midnight-suns.jpg', title: "Marvel's Midnight Suns" },
  // ========== ESSENTIAL — МАРТ 2026 (4) ==========
  { slug: 'monster-hunter-rise', file: 'monster-hunter-rise.jpg', title: 'Monster Hunter Rise' },
  { slug: 'pga-tour-2k23', file: 'pga-tour-2k25.jpg', title: 'PGA Tour 2K25' },
  { slug: 'slime-rancher-2', file: 'slime-rancher-2.jpg', title: 'Slime Rancher 2' },
  { slug: 'the-elder-scrolls-online', file: 'elder-scrolls-online.jpg', title: 'The Elder Scrolls Online: Tamriel Unlimited' },
  // ========== ПРЕДЗАКАЗЫ (6) ==========
  { slug: 'directive-8020', file: 'directive-8020.jpg', title: 'Directive 8020' },
  { slug: 'pragmata', file: 'pragmata.jpg', title: 'Pragmata' },
  { slug: 'diablo-iv', file: 'diablo-4-loh.jpg', title: 'Diablo IV: Lord of Hatred' },
  { slug: 'saros', file: 'saros.jpg', title: 'SAROS' },
  { slug: 'lego-batman', file: 'lego-batman.jpg', title: 'LEGO Batman: Legacy of the Dark Knight' },
  { slug: 'james-bond-007', file: '007-first-light.jpg', title: '007 First Light' },
  // ========== ТОП ПРОДАЖ (10) ==========
  { slug: 'resident-evil-4-2', file: 'resident-evil-requiem.jpg', title: 'Resident Evil 4' },
  { slug: 'ea-sports-fc-25', file: 'ea-fc-26.jpg', title: 'EA SPORTS FC 26' },
  { slug: 'ea-sports-ufc-5', file: 'ufc-5.jpg', title: 'EA Sports UFC 5' },
  { slug: 'grand-theft-auto-v', file: 'gta-v.jpg', title: 'Grand Theft Auto V' },
  { slug: 'minecraft', file: 'minecraft.jpg', title: 'Minecraft' },
  { slug: 'it-takes-two', file: 'it-takes-two.jpg', title: 'It Takes Two' },
  { slug: 'arc-raiders', file: 'arc-raiders.jpg', title: 'ARC Raiders' },
  { slug: 'reanimal', file: 'reanimal.jpg', title: 'REANIMAL' },
  { slug: 'forza-horizon-5', file: 'forza-horizon-5.jpg', title: 'Forza Horizon 5' },
  { slug: 'call-of-duty-black-ops-cold-war', file: 'cod-blops-7.jpg', title: 'Call of Duty: Black Ops 7' },
];

// Dynamically add trials from catalog-trials.json
const trialsPath = path.resolve(__dirname, '..', 'src', 'data', 'catalog-trials.json');
if (fs.existsSync(trialsPath)) {
  const trialsData = JSON.parse(fs.readFileSync(trialsPath, 'utf-8'));
  const existingFiles = new Set(GAMES_TO_FETCH.map((g) => g.file));
  for (const game of trialsData.games) {
    const slug = game.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const file = slug + '.jpg';
    if (!existingFiles.has(file)) {
      GAMES_TO_FETCH.push({ slug, file, title: game.title });
      existingFiles.add(file);
    }
  }
}

function fetchJson(url: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJson(res.headers.location!).then(resolve, reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 404) return reject(new Error('404'));
        try { resolve(JSON.parse(data)); } catch { reject(new Error('Invalid JSON')); }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const getter = url.startsWith('https') ? https : http;
    getter.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location!, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function getImageUrl(slug: string, title: string): Promise<string | null> {
  // Try by slug first
  try {
    const data = await fetchJson(`https://api.rawg.io/api/games/${slug}?key=${API_KEY}`);
    if (data.background_image) return data.background_image as string;
  } catch (err) {
    if ((err as Error).message !== '404') {
      console.warn(`  ⚠️  Error fetching slug "${slug}": ${(err as Error).message}`);
    }
  }

  // Fallback: search by title
  console.warn(`  ⚠️  Slug "${slug}" not found, searching by title...`);
  try {
    const data = await fetchJson(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(title)}&page_size=1`
    );
    const results = data.results as Array<Record<string, unknown>>;
    if (results && results.length > 0 && results[0].background_image) {
      return results[0].background_image as string;
    }
  } catch (err) {
    console.warn(`  ⚠️  Search failed for "${title}": ${(err as Error).message}`);
  }

  return null;
}

async function main() {
  console.log(`📦 Fetching ${GAMES_TO_FETCH.length} game covers...\n`);

  if (!fs.existsSync(COVERS_DIR)) {
    fs.mkdirSync(COVERS_DIR, { recursive: true });
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const game of GAMES_TO_FETCH) {
    const dest = path.join(COVERS_DIR, game.file);

    if (fs.existsSync(dest)) {
      console.log(`⏭️  ${game.title} — already exists`);
      skipped++;
      continue;
    }

    const imageUrl = await getImageUrl(game.slug, game.title);
    if (!imageUrl) {
      console.log(`❌ ${game.title} — no image found`);
      failed++;
      await sleep(200);
      continue;
    }

    try {
      await downloadFile(imageUrl, dest);
      console.log(`✅ ${game.title} → ${game.file}`);
      downloaded++;
    } catch (err) {
      console.log(`❌ ${game.title} — download failed: ${(err as Error).message}`);
      failed++;
    }

    await sleep(200);
  }

  console.log(`\n📊 Done: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
}

main();
