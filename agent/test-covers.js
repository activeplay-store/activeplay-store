/**
 * Quick test: fetches portrait covers for 5 games from games.json.
 * Run: node test-covers.js
 */
const path = require('path');
const fs = require('fs');
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

  const allGames = data.games || [];
  const candidates = allGames.filter(g =>
    g.prices?.TR?.editions?.[0]?.productId && !g.portraitUrl
  );
  const testGames = candidates.slice(0, 5);

  console.log(`\nTest: portrait covers for ${testGames.length} games\n`);
  testGames.forEach(g =>
    console.log(`  - ${g.name} (${g.prices.TR.editions[0].productId})`)
  );
  console.log('');

  const start = Date.now();
  const found = await sony.fetchPortraitCovers(testGames, 'TR');
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`\n=== Result: ${found}/${testGames.length} portraits found in ${elapsed}s ===\n`);
  for (const g of testGames) {
    const ok = g.portraitUrl ? 'OK  ' : 'MISS';
    console.log(`[${ok}] ${g.name}`);
    if (g.portraitUrl) console.log(`       portrait: ${g.portraitUrl}`);
    if (g.conceptId)  console.log(`       conceptId: ${g.conceptId}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
