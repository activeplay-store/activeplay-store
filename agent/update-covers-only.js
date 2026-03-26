/**
 * Update portrait covers in games.json without full re-parse.
 * Uses Sony product details API to find PORTRAIT_BANNER images.
 * Run: node agent/update-covers-only.js
 * Duration: ~6 min for 730 games (400ms delay each)
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
  const withoutPortrait = games.filter(g => !g.portraitUrl);
  console.log(`📸 Обновление обложек: ${withoutPortrait.length} из ${games.length} без portrait\n`);

  if (withoutPortrait.length === 0) {
    console.log('✅ Все игры уже имеют вертикальные обложки');
    return;
  }

  const found = await sony.fetchPortraitCovers(games, 'TR');

  // Save
  fs.writeFileSync(gamesPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n💾 games.json сохранён`);
  console.log(`✅ Найдено ${found} вертикальных обложек`);
  console.log(`\nСледующий шаг: node -e 'require("./src/modules/siteWriter").generateAndWrite().then(console.log)'`);
}

main().catch(console.error);
