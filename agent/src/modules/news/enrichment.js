const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const RAWG_KEY = process.env.RAWG_API_KEY || 'd9ca3380009e448e8fb356b3837cafa2';
const GAMES_FILE = path.join(__dirname, '../../../data/games.json');

// Gemini с Google Search grounding — ищет доп. факты по теме новости
async function searchGrounding(title, description) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn('[ENRICH] No GEMINI_API_KEY, skipping grounding');
    return '';
  }

  try {
    const response = await axios.post(`${GEMINI_URL}?key=${key}`, {
      contents: [{
        parts: [{
          text: `Найди дополнительные факты об этой новости для игрового сайта.

Заголовок: ${title}
Описание: ${(description || '').substring(0, 1500)}

Нужны:
- Подробности события (что именно произошло, даты, цифры)
- Контекст игры: разработчик, издатель, жанр, платформы
- Продажи, оценки Metacritic (если есть)
- Дата релиза или анонса
- Связь с другими играми серии

Ответь списком фактов на русском. Коротко, по делу. Не больше 10 пунктов.`
        }]
      }],
      tools: [{ google_search_retrieval: {} }],
    }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    const text = response.data?.candidates?.[0]?.content?.parts
      ?.map(p => p.text)
      .filter(Boolean)
      .join('\n') || '';

    console.log(`[ENRICH] Grounding: ${text.length} chars`);
    return text;
  } catch (err) {
    console.error(`[ENRICH] Grounding error: ${err.response?.data?.error?.message || err.message}`);
    return '';
  }
}

// RAWG API — метаданные игры
async function fetchRawgData(gameName) {
  if (!gameName) return null;
  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: { key: RAWG_KEY, search: gameName, page_size: 1 },
      timeout: 10000,
    });

    const game = response.data?.results?.[0];
    if (!game) return null;

    const facts = [];
    if (game.name) facts.push(`Название: ${game.name}`);
    if (game.released) facts.push(`Дата релиза: ${game.released}`);
    if (game.metacritic) facts.push(`Metacritic: ${game.metacritic}`);
    if (game.genres?.length) facts.push(`Жанр: ${game.genres.map(g => g.name).join(', ')}`);
    if (game.developers?.length) facts.push(`Разработчик: ${game.developers.map(d => d.name).join(', ')}`);
    if (game.publishers?.length) facts.push(`Издатель: ${game.publishers.map(p => p.name).join(', ')}`);
    if (game.platforms?.length) facts.push(`Платформы: ${game.platforms.map(p => p.platform.name).join(', ')}`);

    console.log(`[ENRICH] RAWG: ${game.name} (Metacritic: ${game.metacritic || 'N/A'})`);
    return facts.join('\n');
  } catch (err) {
    console.error(`[ENRICH] RAWG error: ${err.message}`);
    return null;
  }
}

// Поиск игры в games.json по названию (fuzzy)
function findGameOnSite(gameName) {
  if (!gameName) return null;
  try {
    const data = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf-8'));
    const games = data.games || [];
    const query = gameName.toLowerCase();

    for (const game of games) {
      const name = game.name?.toLowerCase();
      if (!name) continue;

      // Точное вхождение
      if (query.includes(name) || name.includes(query)) {
        // Check ALL editions to find cheapest price
        const allEditions = [
          ...(game.prices?.TR?.editions || []),
          ...(game.prices?.UA?.editions || []),
        ].filter(e => e?.clientPrice || e?.clientSalePrice);

        if (!allEditions.length) continue;

        // Find cheapest edition
        let cheapest = allEditions[0];
        let cheapestPrice = cheapest.clientSalePrice || cheapest.clientPrice;
        for (const ed of allEditions) {
          const price = ed.clientSalePrice || ed.clientPrice;
          if (price < cheapestPrice) {
            cheapest = ed;
            cheapestPrice = price;
          }
        }

        // Also find the standard/base edition specifically
        const trEditions = game.prices?.TR?.editions || [];
        const standardEd = trEditions.find(e => !e.name || /standard|base|\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442/i.test(e.name || '')) || trEditions[0];

        return {
          gameId: game.id,
          name: game.name,
          minPrice: cheapestPrice,
          hasSale: !!(cheapest.salePrice && cheapest.salePrice < cheapest.basePrice),
          oldPrice: standardEd?.clientPrice || cheapest.clientPrice || null,
          salePrice: standardEd?.clientSalePrice || cheapest.clientSalePrice || null,
        };
      }
    }

    // Fuzzy: первые 3 слова
    const queryWords = query.split(/\s+/).slice(0, 3).join(' ');
    if (queryWords.length >= 5) {
      for (const game of games) {
        const name = game.name?.toLowerCase();
        if (!name) continue;
        if (name.includes(queryWords) || queryWords.includes(name.split(/\s+/).slice(0, 3).join(' '))) {
          const tr = game.prices?.TR?.editions?.[0];
          if (!tr?.clientPrice) continue;
          return {
            gameId: game.id,
            name: game.name,
            minPrice: tr.clientSalePrice || tr.clientPrice,
            hasSale: !!(tr.salePrice && tr.salePrice < tr.basePrice),
            oldPrice: tr.clientPrice,
            salePrice: tr.clientSalePrice || null,
          };
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

// Извлечь название игры из заголовка новости
function extractGameName(title) {
  if (!title) return null;
  // Убрать категорию
  const clean = title.replace(/^(Новость|Анонс|Обзор|Слух|Скидки|Гайд|Видео|Интервью|Инсайд|Хайп|Утечка)\s*[:—–\-]\s*/i, '');
  // Попробовать найти название игры (обычно в начале, до двоеточия или тире)
  const match = clean.match(/^([A-Z][A-Za-z0-9':&\- ]{2,})/);
  return match ? match[0].trim() : clean.split(/[—–:\-]/).shift()?.trim() || clean.substring(0, 50);
}

// Определить, является ли статья о распродаже/скидках
function isDealsArticle(article) {
  const title = (article.site?.title || article.title || '').toLowerCase();
  const text = (article.site?.text || article.description || '').toLowerCase();
  const combined = title + ' ' + text;
  const dealKeywords = ['распродаж', 'скидк', 'sale', 'deals', 'discount', 'spring sale', 'summer sale',
    'winter sale', 'holiday sale', 'black friday', 'весенн', 'летн', 'зимн', 'осенн',
    'ps store sale', 'playstation sale', 'до 90%', 'до 80%', 'до 70%', 'до 60%', 'до 50%'];
  return dealKeywords.some(kw => combined.includes(kw));
}

// Собрать топ игр со скидками из games.json для статьи о распродаже
function getTopDeals(maxItems = 15) {
  try {
    const data = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf-8'));
    const games = data.games || [];

    const dealsGames = [];
    for (const game of games) {
      // Проверяем все регионы
      for (const regionCode of ['TR', 'UA']) {
        const editions = game.prices?.[regionCode]?.editions || [];
        for (const ed of editions) {
          if (ed.salePrice && ed.basePrice && ed.salePrice < ed.basePrice && ed.clientSalePrice && ed.clientPrice) {
            const discountPct = Math.round((1 - ed.salePrice / ed.basePrice) * 100);
            if (discountPct >= 20) { // Только скидки от 20%
              dealsGames.push({
                name: game.name,
                edition: ed.name || 'Standard',
                oldPrice: ed.clientPrice,
                salePrice: ed.clientSalePrice,
                discountPct,
                metacritic: game.metacritic || null,
                region: regionCode,
              });
              break; // Одна запись на игру из региона
            }
          }
        }
        if (dealsGames.find(d => d.name === game.name)) break; // Не дублировать между регионами
      }
    }

    // Сортировать: сначала большие скидки на известные игры (metacritic > 0)
    dealsGames.sort((a, b) => {
      // Приоритет: есть metacritic → выше
      if (a.metacritic && !b.metacritic) return -1;
      if (!a.metacritic && b.metacritic) return 1;
      // Потом по metacritic
      if (a.metacritic && b.metacritic && a.metacritic !== b.metacritic) return b.metacritic - a.metacritic;
      // Потом по скидке
      return b.discountPct - a.discountPct;
    });

    return dealsGames.slice(0, maxItems);
  } catch (err) {
    console.error(`[ENRICH] getTopDeals error: ${err.message}`);
    return [];
  }
}

// Главная функция: собрать весь контекст для генерации текста
async function enrichArticle(article) {
  const title = article.site?.title || article.title || '';
  const description = article.site?.text || article.description || '';
  const gameName = extractGameName(title);
  const isDeal = isDealsArticle(article);

  // Параллельные запросы
  const [groundingFacts, rawgFacts, siteGame] = await Promise.all([
    searchGrounding(title, description),
    isDeal ? Promise.resolve(null) : fetchRawgData(gameName),
    Promise.resolve(isDeal ? null : findGameOnSite(gameName)),
  ]);

  const parts = [];

  if (groundingFacts) {
    parts.push('ФАКТЫ ИЗ ИНТЕРНЕТА:\n' + groundingFacts);
  }

  if (rawgFacts) {
    parts.push('ДАННЫЕ RAWG:\n' + rawgFacts);
  }

  if (siteGame) {
    const priceInfo = siteGame.hasSale
      ? `${siteGame.salePrice} ₽ (скидка с ${siteGame.oldPrice} ₽)`
      : `${siteGame.minPrice} ₽`;
    parts.push(`ИГРА НА ACTIVEPLAY:\nНазвание: ${siteGame.name}\nЦена: ${priceInfo}\nID: ${siteGame.gameId}`);
  }

  // Для статей о распродажах — подтягиваем реальные игры со скидками из базы
  if (isDeal) {
    const topDeals = getTopDeals(15);
    if (topDeals.length > 0) {
      const dealLines = topDeals.map(d => {
        const mc = d.metacritic ? ` (Metacritic: ${d.metacritic})` : '';
        return `- ${d.name}: ${d.salePrice} ₽ (было ${d.oldPrice} ₽, скидка ${d.discountPct}%)${mc}`;
      });
      parts.push(
        `ИГРЫ СО СКИДКАМИ НА ACTIVEPLAY (цены в рублях):\n` +
        `Всего игр со скидками в базе: ${topDeals.length}+\n` +
        dealLines.join('\n') +
        `\n\nВАЖНО: Используй ЭТИ цены в рублях из списка выше. НЕ выдумывай цены. НЕ пиши цены в долларах, турецких лирах или любой другой валюте. Все цены — ТОЛЬКО в рублях (₽). Упомяни 5-8 конкретных игр из этого списка с их ценами в рублях.`
      );
      console.log(`[ENRICH] Deals mode: injected ${topDeals.length} games with RUB prices`);
    } else {
      console.warn('[ENRICH] Deals mode: no sale games found in games.json');
    }

    // Помечаем статью как deals
    article.ctaType = 'deals';
    article.ctaText = 'Скидки PS Store';
    article.ctaLink = '/sale';
  }

  return {
    enrichedContext: parts.join('\n\n') || 'Дополнительные факты не найдены.',
    siteGame,
    gameName,
  };
}

module.exports = { enrichArticle, findGameOnSite, extractGameName };
