const path = require('path');
const fs = require('fs');
const sony = require('./sony');
const psprices = require('./psprices');
const psdeals = require('./psdeals');
const platprices = require('./platprices');
const xbox = require('./xbox');
const rawg = require('./rawg');
const pricing = require('../pricing');
const config = require('../../config');

// =====================
// 1. КАСКАДНЫЙ ЗАПРОС ЦЕН PLAYSTATION
// =====================

async function fetchAllDeals(regionCode) {
  const categories = config.parsers.sony.dealCategories?.[regionCode] || [];
  if (categories.length === 0) {
    // Фоллбэк на старый формат
    return sony.fetchDeals(regionCode);
  }

  const allGames = [];
  const seenIds = new Set();

  for (const categoryId of categories) {
    console.log(`[Парсер] ${regionCode} категория ${categoryId.substring(0, 8)}...`);
    try {
      const games = await sony.fetchDeals(regionCode, categoryId);
      for (const game of games) {
        if (!seenIds.has(game.id)) {
          seenIds.add(game.id);
          allGames.push(game);
        } else {
          const existing = allGames.find(g => g.id === game.id);
          if (existing && game.prices?.[regionCode]) {
            const existingEditions = existing.prices[regionCode]?.editions || [];
            const newEditions = game.prices[regionCode]?.editions || [];
            for (const ed of newEditions) {
              if (!existingEditions.find(e => e.productId === ed.productId)) {
                existingEditions.push(ed);
              }
            }
          }
        }
      }
      console.log(`[Парсер] ${regionCode} +${games.length} игр (уникальных: ${allGames.length})`);
    } catch (err) {
      console.error(`[Парсер] ⚠️ ${regionCode} категория ${categoryId.substring(0, 8)}: ${err.message}`);
    }
  }

  return allGames;
}

async function fetchPlayStationPrices(regionCode) {
  let games = [];

  // Шаг 1: Sony GraphQL — все категории скидок
  if (sony.isConfigured()) {
    try {
      console.log(`[Парсер] Sony GraphQL ${regionCode}...`);
      const deals = await fetchAllDeals(regionCode);
      console.log(`[Парсер] ✅ Sony deals ${regionCode}: ${deals.length} игр`);
      games = deals;
    } catch (err) {
      console.log(`[Парсер] ⚠️ Sony ${regionCode}: ${err.message}`);
    }
  }

  // Шаг 2: Если Sony не сработал — фоллбэк на PSPrices
  if (games.length === 0) {
    try {
      console.log(`[Парсер] Фоллбэк: PSPrices ${regionCode}...`);
      const [deals, preorders] = await Promise.all([
        psprices.fetchDeals(regionCode).catch(err => {
          console.log(`[Парсер] ⚠️ PSPrices deals ${regionCode}: ${err.message}`);
          return [];
        }),
        psprices.fetchPreorders(regionCode).catch(err => {
          console.log(`[Парсер] ⚠️ PSPrices preorders ${regionCode}: ${err.message}`);
          return [];
        })
      ]);
      games = mergeGameLists(deals, preorders);
      console.log(`[Парсер] ✅ PSPrices ${regionCode}: ${games.length} игр`);
    } catch (err) {
      console.log(`[Парсер] ⚠️ PSPrices ${regionCode}: ${err.message}`);
    }
  }

  // Шаг 3: Рассчитать цены клиенту через модуль 2
  for (const game of games) {
    calculateClientPrices(game, regionCode);
  }

  return games;
}

// =====================
// 2. ПЕРЕКРЁСТНАЯ ПРОВЕРКА
// =====================

function checkDiscrepancy(game, regionCode) {
  const sources = game.sources;
  const prices = [];

  if (sources.psprices?.price) prices.push({ source: 'PSPrices', price: sources.psprices.price });
  if (sources.psdeals?.price) prices.push({ source: 'PSDeals', price: sources.psdeals.price });
  if (sources.sony?.price) prices.push({ source: 'Sony', price: sources.sony.price });

  if (prices.length < 2) return;

  const max = Math.max(...prices.map(p => p.price));
  const min = Math.min(...prices.map(p => p.price));
  if (min === 0) return;
  const diffPct = ((max - min) / min) * 100;

  if (diffPct > config.parsers.discrepancyThreshold) {
    game.discrepancy = true;
    game.discrepancyDetails = prices
      .map(p => `${p.source}: ${p.price}`)
      .join(', ') + ` (расхождение ${diffPct.toFixed(1)}%)`;

    console.log(`[Парсер] ⚠️ РАСХОЖДЕНИЕ: ${game.name} — ${game.discrepancyDetails}`);
  }
}

// =====================
// 3. РАСЧЁТ ЦЕН КЛИЕНТУ
// =====================

function calculateClientPrices(game, regionCode) {
  const regionPrices = game.prices[regionCode];
  if (!regionPrices?.editions) return;

  for (const edition of regionPrices.editions) {
    if (edition.basePrice) {
      try {
        const result = pricing.calculatePrice(edition.basePrice, regionCode);
        edition.clientPrice = result.clientPrice;
      } catch (err) {
        // Регион не поддерживается в pricing — пропустить
      }
    }
    if (edition.salePrice) {
      try {
        const result = pricing.calculatePrice(edition.salePrice, regionCode);
        edition.clientSalePrice = result.clientPrice;
      } catch (err) {
        // Пропустить
      }
    }
    if (edition.plusPrice) {
      try {
        const result = pricing.calculatePrice(edition.plusPrice, regionCode);
        edition.clientPlusPrice = result.clientPrice;
      } catch (err) {
        // Пропустить
      }
    }
  }

  // Рассчитать bestPrice клиенту
  if (game.bestPrice && game.bestPrice.amount) {
    try {
      const result = pricing.calculatePrice(game.bestPrice.amount, regionCode);
      game.bestPrice.clientPrice = result.clientPrice;
    } catch (err) {
      // Пропустить
    }
  }
}

// =====================
// 4. ОБЪЕДИНЕНИЕ И ДЕДУПЛИКАЦИЯ
// =====================

function mergeGameLists(...lists) {
  const merged = new Map();

  for (const list of lists) {
    for (const game of list) {
      if (merged.has(game.id)) {
        const existing = merged.get(game.id);
        for (const [region, prices] of Object.entries(game.prices)) {
          if (!existing.prices[region]) {
            existing.prices[region] = prices;
          }
        }
        if (game.status === 'preorder') existing.status = 'preorder';
        Object.assign(existing.sources, game.sources);
      } else {
        merged.set(game.id, { ...game });
      }
    }
  }

  return Array.from(merged.values());
}

// =====================
// 5. ПОЛНЫЙ ЦИКЛ ПАРСИНГА
// =====================

async function runFullParse() {
  console.log('[Парсер] Начинаю полный цикл парсинга...');
  const startTime = Date.now();

  const allGames = [];
  const errors = [];

  // PlayStation — по регионам
  for (const regionCode of ['TR', 'UA']) {
    try {
      console.log(`[Парсер] PlayStation ${regionCode}...`);
      const games = await fetchPlayStationPrices(regionCode);
      for (const game of games) {
        const existing = allGames.find(g => g.id === game.id);
        if (existing) {
          Object.assign(existing.prices, game.prices);
          Object.assign(existing.sources, game.sources);
        } else {
          allGames.push(game);
        }
      }
      console.log(`[Парсер] ✅ ${regionCode}: ${games.length} игр`);
    } catch (err) {
      console.log(`[Парсер] ❌ PlayStation ${regionCode}: ${err.message}`);
      errors.push({ region: regionCode, error: err.message });
    }

    await sleep(config.parsers.politenessDelay * 2);
  }

  // Xbox — закомментирован, раскомментировать когда понадобится
  // try {
  //   console.log('[Парсер] Xbox...');
  //   const xboxGames = await xbox.fetchDeals('TR');
  //   console.log(`[Парсер] ✅ Xbox: ${xboxGames.length} игр`);
  // } catch (err) {
  //   console.log(`[Парсер] ❌ Xbox: ${err.message}`);
  //   errors.push({ region: 'Xbox', error: err.message });
  // }

  // RAWG — Metacritic, hype, дата релиза (кешируем)
  console.log('[Парсер] RAWG: Metacritic + hype...');
  const oldData = loadGames();
  const oldGameMap = new Map();
  if (oldData && oldData.games) {
    for (const g of oldData.games) {
      if (g.metacritic || g.ratingsCount) {
        oldGameMap.set(g.id, {
          metacritic: g.metacritic, ratingsCount: g.ratingsCount,
          hypeScore: g.hypeScore, freshness: g.freshness, releaseDate: g.releaseDate
        });
      }
    }
  }

  let rawgEnriched = 0;
  for (const game of allGames) {
    const cached = oldGameMap.get(game.id);
    if (cached && cached.metacritic) {
      game.metacritic = cached.metacritic;
      game.ratingsCount = cached.ratingsCount;
      game.hypeScore = cached.hypeScore;
      game.freshness = cached.freshness;
      if (!game.releaseDate) game.releaseDate = cached.releaseDate;
      continue;
    }

    await sleep(config.parsers.rawg?.rateLimit || 1000);
    const rawgData = await rawg.searchGame(game.name);
    if (rawgData) {
      game.metacritic = rawgData.metacritic;
      game.ratingsCount = rawgData.ratingsCount;
      game.hypeScore = rawg.calculateHypeScore(rawgData.ratingsCount, rawgData.metacritic);
      game.freshness = rawg.calculateFreshness(rawgData.released || game.releaseDate);
      if (!game.releaseDate && rawgData.released) {
        game.releaseDate = rawgData.released;
      }
      rawgEnriched++;
    } else {
      game.hypeScore = game.hypeScore || 3;
      game.freshness = game.freshness || 5;
    }
  }
  console.log(`[Парсер] RAWG: обогащено ${rawgEnriched} игр`);

  // Brand fallback для игр без metacritic
  let brandFallbacks = 0;
  for (const game of allGames) {
    if (!game.metacritic && (!game.hypeScore || game.hypeScore <= 3)) {
      const fb = rawg.brandFallback(game.name);
      if (fb.hypeScore > 3) {
        game.hypeScore = fb.hypeScore;
        brandFallbacks++;
      }
    }
  }
  if (brandFallbacks > 0) console.log(`[Парсер] Brand fallback: ${brandFallbacks} игр`);

  // Сохранить результат
  const result = {
    updatedAt: new Date().toISOString(),
    parseTimeMs: Date.now() - startTime,
    totalGames: allGames.length,
    errors: errors,
    games: allGames
  };

  saveGames(result);

  const summary = {
    games: allGames.length,
    errors: errors.length,
    discrepancies: allGames.filter(g => g.discrepancy).length,
    preorders: allGames.filter(g => g.status === 'preorder').length,
    deals: allGames.filter(g =>
      Object.values(g.prices).some(r =>
        r.editions?.some(e => e.salePrice)
      )
    ).length,
    timeSeconds: ((Date.now() - startTime) / 1000).toFixed(1)
  };

  console.log(`[Парсер] Готово за ${summary.timeSeconds}с: ${summary.games} игр, ${summary.preorders} предзаказов, ${summary.deals} со скидкой, ${summary.discrepancies} расхождений, ${summary.errors} ошибок`);

  return { summary, result };
}

// =====================
// 6. СОХРАНЕНИЕ И ЗАГРУЗКА
// =====================

function saveGames(data) {
  const dir = path.dirname(config.parsers.gamesFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(config.parsers.gamesFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[Парсер] Сохранено в games.json: ${data.totalGames} игр`);
}

function loadGames() {
  try {
    const raw = fs.readFileSync(config.parsers.gamesFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { updatedAt: null, games: [] };
  }
}

// =====================
// 7. ДЕТЕКТ ИЗМЕНЕНИЙ
// =====================

function detectChanges(newGames, oldGames) {
  const changes = {
    newGames: [],
    priceChanges: [],
    newDeals: [],
    endedDeals: [],
    newPreorders: []
  };

  const oldMap = new Map(oldGames.map(g => [g.id, g]));

  for (const game of newGames) {
    const old = oldMap.get(game.id);

    if (!old) {
      changes.newGames.push(game);
      if (game.status === 'preorder') changes.newPreorders.push(game);
      continue;
    }

    for (const [region, prices] of Object.entries(game.prices)) {
      const oldRegion = old.prices[region];
      if (!oldRegion || !prices.editions || !oldRegion.editions) continue;

      for (let i = 0; i < prices.editions.length; i++) {
        const newEd = prices.editions[i];
        const oldEd = oldRegion.editions[i];
        if (!oldEd) continue;

        if (newEd.basePrice !== oldEd.basePrice) {
          changes.priceChanges.push({
            game: game.name, region, edition: newEd.name,
            oldPrice: oldEd.basePrice, newPrice: newEd.basePrice
          });
        }

        if (newEd.salePrice && !oldEd.salePrice) {
          changes.newDeals.push({
            game: game.name, region, edition: newEd.name,
            salePrice: newEd.salePrice, discountPct: newEd.discountPct
          });
        }

        if (!newEd.salePrice && oldEd.salePrice) {
          changes.endedDeals.push({
            game: game.name, region, edition: newEd.name
          });
        }
      }
    }
  }

  return changes;
}

// =====================
// УТИЛИТЫ
// =====================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =====================
// ЭКСПОРТ
// =====================

module.exports = {
  runFullParse,
  fetchPlayStationPrices,
  loadGames,
  detectChanges,

  testSingle: async (parserName, regionCode) => {
    const parsers = { psprices, psdeals, sony, platprices };
    const parser = parsers[parserName];
    if (!parser) return { error: 'Unknown parser' };

    if (parserName === 'sony') {
      return await sony.fetchDeals(regionCode);
    }
    if (parserName === 'psprices') {
      return await psprices.fetchDeals(regionCode);
    }
    if (parserName === 'psdeals') {
      return await psdeals.fetchDeals(regionCode);
    }
    return { error: 'No test for this parser' };
  }
};
