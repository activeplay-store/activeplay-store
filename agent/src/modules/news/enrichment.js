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
        const tr = game.prices?.TR?.editions?.[0];
        const ua = game.prices?.UA?.editions?.[0];
        const minPrice = Math.min(
          tr?.clientSalePrice || tr?.clientPrice || Infinity,
          ua?.clientSalePrice || ua?.clientPrice || Infinity
        );

        if (minPrice === Infinity) continue;

        return {
          gameId: game.id,
          name: game.name,
          minPrice: minPrice,
          hasSale: !!(tr?.salePrice && tr.salePrice < tr.basePrice),
          oldPrice: tr?.clientPrice || null,
          salePrice: tr?.clientSalePrice || null,
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

// Главная функция: собрать весь контекст для генерации текста
async function enrichArticle(article) {
  const title = article.site?.title || article.title || '';
  const description = article.site?.text || article.description || '';
  const gameName = extractGameName(title);

  // Параллельные запросы
  const [groundingFacts, rawgFacts, siteGame] = await Promise.all([
    searchGrounding(title, description),
    fetchRawgData(gameName),
    Promise.resolve(findGameOnSite(gameName)),
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

  return {
    enrichedContext: parts.join('\n\n') || 'Дополнительные факты не найдены.',
    siteGame,
    gameName,
  };
}

module.exports = { enrichArticle, findGameOnSite, extractGameName };
