/**
 * Second pass: fetch portrait covers for games that still don't have one,
 * using UA region productIds and locale.
 */
const fs = require('fs');
const path = require('path');
const sony = require('./src/modules/parsers/sony');

const gamesPath = path.join(__dirname, 'data', 'games.json');

async function main() {
  const data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
  const games = data.games || [];
  const before = games.filter(g => g.portraitUrl).length;
  const needPortrait = games.filter(g => !g.portraitUrl);
  console.log('Total:', games.length, '| With portrait:', before, '| Without:', needPortrait.length);

  if (needPortrait.length === 0) {
    console.log('All games already have portrait covers!');
    return;
  }

  // Pass with UA region
  console.log('\n=== Pass: UA region ===');
  const foundUA = await sony.fetchPortraitCovers(games, 'UA', { logProgress: true });

  // Check remaining
  const stillMissing = games.filter(g => !g.portraitUrl);
  console.log('\nStill missing portrait:', stillMissing.length);

  // If any still missing, try TR (for UA-only games that might have conceptId resolvable via TR)
  if (stillMissing.length > 0) {
    console.log('\n=== Pass: TR fallback ===');
    const foundTR = await sony.fetchPortraitCovers(games, 'TR', { logProgress: true });
  }

  // Save
  const after = games.filter(g => g.portraitUrl).length;
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(gamesPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('\nResult:', before, '->', after, 'portraits (+' + (after - before) + ' new)');
}

main().catch(err => { console.error(err); process.exit(1); });
