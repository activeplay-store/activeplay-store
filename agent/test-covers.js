/**
 * Quick test: fetches Sony API for 5 games and shows which covers were found.
 * Run: node agent/test-covers.js
 */
const path = require('path');
const fs = require('fs');
const sony = require('./src/modules/parsers/sony');

const gamesPath = path.join(__dirname, 'data', 'games.json');
let testGames = [];

try {
  const data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
  const allGames = data.games || data;
  testGames = allGames.filter(g => g.coverUrl || g.id).slice(0, 5);
} catch (err) {
  console.error('Cannot read games.json:', err.message);
  process.exit(1);
}

async function test() {
  console.log('🧪 Тест вертикальных обложек — 5 игр\n');

  for (const game of testGames) {
    console.log(`📦 ${game.name}`);
    console.log(`   ID: ${game.id}`);
    console.log(`   Current coverUrl:    ${game.coverUrl ? game.coverUrl.substring(0, 80) + '...' : '❌ нет'}`);
    console.log(`   Current portraitUrl: ${game.portraitUrl ? game.portraitUrl.substring(0, 80) + '...' : '❌ нет'}`);

    // Try fetching portrait via product details API
    const regionCode = 'TR';
    const productId = game.prices?.[regionCode]?.editions?.[0]?.productId
      || game.prices?.UA?.editions?.[0]?.productId;

    if (!productId) {
      console.log('   ⚠️ Нет productId — пропуск');
      console.log('');
      continue;
    }

    try {
      const { sonyGraphQL } = require('./src/modules/parsers/sony');

      // This won't work — sonyGraphQL isn't exported. Instead use fetchPortraitCovers for a single game.
      const found = await sony.fetchPortraitCovers([game], regionCode);

      console.log(`   After fetch:`);
      console.log(`   portraitUrl: ${game.portraitUrl ? '✅ ' + game.portraitUrl.substring(0, 80) + '...' : '❌ нет'}`);
    } catch (err) {
      console.log(`   ⚠️ Ошибка: ${err.message}`);
    }

    console.log('');
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('✅ Тест завершён');
}

test().catch(console.error);
