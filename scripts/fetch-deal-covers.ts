import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const RAWG_KEY = 'd9ca3380009e448e8fb356b3837cafa2';

const games: { slug: string; filename: string }[] = [
  // Red zone
  { slug: 'assassins-creed-valhalla', filename: 'ac-valhalla.jpg' },
  { slug: 'demons-souls', filename: 'demons-souls.jpg' },
  { slug: 'mortal-kombat-11', filename: 'mortal-kombat-11.jpg' },
  { slug: 'borderlands-3', filename: 'borderlands-3.jpg' },
  { slug: 'sekiro-shadows-die-twice', filename: 'sekiro.jpg' },
  { slug: 'tekken-8', filename: 'tekken-8.jpg' },
  { slug: 'red-dead-redemption-2', filename: 'rdr2.jpg' },
  { slug: 'maneater', filename: 'maneater.jpg' },
  { slug: 'far-cry-6', filename: 'far-cry-6.jpg' },
  { slug: 'watch-dogs-legion', filename: 'watch-dogs-legion.jpg' },
  { slug: 'immortals-fenyx-rising', filename: 'immortals-fenyx-rising.jpg' },
  { slug: 'sackboy-a-big-adventure', filename: 'sackboy.jpg' },
  // Yellow zone
  { slug: 'god-of-war-ragnarok-2', filename: 'god-of-war-ragnarok.jpg' },
  { slug: 'star-wars-jedi-survivor', filename: 'star-wars-jedi-survivor.jpg' },
  { slug: 'hogwarts-legacy', filename: 'hogwarts-legacy.jpg' },
  { slug: 'final-fantasy-xvi', filename: 'ff16.jpg' },
  { slug: 'marvels-spider-man-2', filename: 'spider-man-2.jpg' },
  { slug: 'cyberpunk-2077', filename: 'cyberpunk-2077.jpg' },
  { slug: 'dragons-dogma-2', filename: 'dragons-dogma-2.jpg' },
  { slug: 'returnal', filename: 'returnal.jpg' },
  { slug: 'lies-of-p', filename: 'lies-of-p.jpg' },
  { slug: 'ufc-5', filename: 'ufc-5.jpg' },
  { slug: 'horizon-forbidden-west', filename: 'horizon-forbidden-west.jpg' },
  { slug: 'death-stranding-2-on-the-beach', filename: 'death-stranding-2.jpg' },
  { slug: 'ratchet-clank-rift-apart', filename: 'ratchet-clank.jpg' },
  { slug: 'uncharted-legacy-of-thieves-collection', filename: 'uncharted-legacy.jpg' },
  { slug: 'resident-evil-village', filename: 're-village.jpg' },
  { slug: 'it-takes-two', filename: 'it-takes-two.jpg' },
  { slug: 'ghost-of-tsushima', filename: 'ghost-of-tsushima.jpg' },
  { slug: 'diablo-iv', filename: 'diablo-4.jpg' },
  { slug: 'gran-turismo-7', filename: 'gran-turismo-7.jpg' },
  { slug: 'stellar-blade', filename: 'stellar-blade.jpg' },
  // Green zone
  { slug: 'silent-hill-2', filename: 'silent-hill-2.jpg' },
  { slug: 'like-a-dragon-infinite-wealth', filename: 'like-a-dragon.jpg' },
  { slug: 'astro-bot-2', filename: 'astro-bot.jpg' },
  { slug: 'elden-ring', filename: 'elden-ring.jpg' },
  { slug: 'indiana-jones-and-the-great-circle', filename: 'indiana-jones.jpg' },
  { slug: 'the-last-of-us-part-i-remake', filename: 'tlou-part-1.jpg' },
  { slug: 'kingdom-come-deliverance-ii', filename: 'kingdom-come-2.jpg' },
  { slug: 'assassins-creed-shadows', filename: 'ac-shadows.jpg' },
  { slug: 'marvels-spider-man-remastered', filename: 'spider-man-remastered.jpg' },
  { slug: 'the-witcher-3-wild-hunt', filename: 'witcher-3.jpg' },
  { slug: 'baldurs-gate-3', filename: 'baldurs-gate-3.jpg' },
  { slug: 'metal-gear-solid-v-the-phantom-pain', filename: 'mgs-v.jpg' },
  { slug: 'bloodborne', filename: 'bloodborne.jpg' },
  { slug: 'persona-5-royal', filename: 'persona-5-royal.jpg' },
  { slug: 'doom-eternal', filename: 'doom-eternal.jpg' },
  { slug: 'control', filename: 'control-ultimate.jpg' },
  // Fresh zone
  { slug: 'clair-obscur-expedition-33', filename: 'clair-obscur.jpg' },
  { slug: 'crimson-desert', filename: 'crimson-desert.jpg' },
  { slug: 'monster-hunter-wilds', filename: 'monster-hunter-wilds.jpg' },
  { slug: 'nioh-2', filename: 'nioh-3.jpg' },
  { slug: 'doom-the-dark-ages', filename: 'doom-dark-ages.jpg' },
  { slug: 'battlefield-2042', filename: 'battlefield-6.jpg' },
];

const outDir = path.join(process.cwd(), 'public', 'images', 'covers', 'deals');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return downloadFile(response.headers.location!, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function main() {
  for (const game of games) {
    const dest = path.join(outDir, game.filename);
    if (fs.existsSync(dest)) {
      const stat = fs.statSync(dest);
      if (stat.size > 10000) {
        console.log(`SKIP ${game.filename} (exists, ${(stat.size/1024).toFixed(0)}KB)`);
        continue;
      }
    }
    try {
      const res = await fetch(`https://api.rawg.io/api/games/${game.slug}?key=${RAWG_KEY}`);
      const data = await res.json();
      if (data.background_image) {
        console.log(`Downloading ${game.filename}...`);
        await downloadFile(data.background_image, dest);
        console.log(`OK ${game.filename}`);
      } else {
        console.log(`NO IMAGE for ${game.slug}`);
      }
      await new Promise(r => setTimeout(r, 250));
    } catch (e: any) {
      console.error(`ERROR ${game.slug}:`, e.message);
    }
  }
  console.log('Done!');
}

main();
