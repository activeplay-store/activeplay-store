/**
 * Update portrait covers in games.json without full re-parse.
 * Uses 3-step cascade: productRetrieve → concept page → og:image
 * Run: node update-covers-only.js
 * Duration: ~6-10 min for 730 games
 */
const fs = require('fs');
const path = require('path');
const sony = require('./src/modules/parsers/sony');

const gamesPath = path.join(__dirname, 'data', 'games.json');

async function main() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
  } catch (err) {
    console.error('Cannot read games.json:', err.message);
    process.exit(1);
  }

  const games = data.games || [];
  const before = games.filter(g => g.portraitUrl).length;
  console.log(`Covers update: ${games.length} games, ${before} already have portrait\n`);

  if (before === games.length) {
    console.log('All games already have portrait covers');
    return;
  }

  const found = await sony.fetchPortraitCovers(games, 'TR', { logProgress: true });

  // Save
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(gamesPath, JSON.stringify(data, null, 2), 'utf8');

  const after = games.filter(g => g.portraitUrl).length;
  console.log(`\ngames.json saved: ${before} -> ${after} portraits (+${found} new)`);
}

main().catch(err => { console.error(err); process.exit(1); });
