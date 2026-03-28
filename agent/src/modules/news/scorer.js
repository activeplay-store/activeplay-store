// Скоринг и ранжирование новостей

// Ключевые слова с весами
const KEYWORD_SCORES = {
  // PlayStation-приоритет
  'ps5 exclusive': 15, 'playstation studios': 15, 'state of play': 15,
  'ps plus': 15, 'dualsense': 10, 'psn': 10, 'ps5 pro': 12, 'psvr': 8,
  'ps store': 12, 'playstation store': 12,

  // Инсайды и анонсы
  'exclusive': 10, 'first look': 10, 'insider': 8, 'confirmed': 8,
  'officially': 8, 'release date': 12, 'delay': 10, 'cancelled': 10,
  'first trailer': 12, 'gameplay reveal': 12, 'showcase': 10,

  // Платформы
  'ps5': 8, 'playstation': 8, 'ps4': 5,
  'xbox': 4, 'game pass': 5, 'series x': 3,

  // Топовые франшизы
  'gta': 10, 'god of war': 10, 'spider-man': 10, 'the last of us': 10,
  'uncharted': 8, 'final fantasy': 8, 'elden ring': 8, 'hogwarts': 8,
  'ghost of tsushima': 8, 'death stranding': 8, 'resident evil': 8,
  'silent hill': 8, 'horizon': 7, 'gran turismo': 7,

  // Коммерция
  'free': 6, 'sale': 5, 'discount': 5, 'deal': 4,
  'launch': 5, 'reveal': 6, 'announce': 6, 'trailer': 5,

  // Средний приоритет
  'dlc': 3, 'expansion': 3, 'update': 2, 'patch': 2,
  'review': 3, 'gameplay': 3, 'hands-on': 3,
  'multiplayer': 2, 'co-op': 2, 'remake': 4, 'remaster': 3,

  // Полный бан / жёсткий минус
  'розыгрыш': -100, 'giveaway': -100, 'raffle': -100, 'конкурс': -100,
  'nintendo switch': -50, 'switch 2': -50,
  'amazon': -40,
  'kindle': -50,
  'книг': -40, 'novel': -40, 'paperback': -40, 'book': -30,
  'angry birds': -30,
};

const NEGATIVE_KEYWORDS = [
  'mobile game', 'mobile gaming', 'gacha', 'idle game',
  'sponsored', 'advertisement', 'affiliate',
  'what are you playing', 'talking point', 'opinion piece',
  'review roundup', 'podcast', 'quiz', 'best of',
  'wordle', 'crossword', 'puzzle answer',
];

function scoreArticle(article) {
  let score = 0;
  const text = `${article.title} ${article.description}`.toLowerCase();
  const titleLower = (article.title || '').toLowerCase();

  // 1. Ключевые слова (точные фразы)
  for (const [keyword, points] of Object.entries(KEYWORD_SCORES)) {
    if (text.includes(keyword)) score += points;
  }

  // 2. Негативные ключевые слова
  for (const neg of NEGATIVE_KEYWORDS) {
    if (text.includes(neg)) score -= 20;
  }

  // 3. Скидки на аксессуары (НЕ на игры) — минус
  if ((titleLower.includes('deal') || titleLower.includes('sale') || titleLower.includes('off'))
      && !titleLower.includes('ps store') && !titleLower.includes('game pass')
      && !titleLower.includes('playstation') && !titleLower.includes('xbox game')) {
    score -= 30;
  }

  // 4. Короткое описание — скорее всего мусор
  if ((article.description || '').length < 100) {
    score -= 20;
  }

  // 5. Вес источника (1-10 шкала)
  score += (article.sourceWeight || 1) * 2;

  // 6. Свежесть (бонус за новые, штраф за старые)
  const ageHours = (Date.now() - new Date(article.pubDate).getTime()) / (1000 * 60 * 60);
  if (ageHours < 2) score += 10;
  else if (ageHours < 6) score += 5;
  else if (ageHours < 12) score += 2;
  if (ageHours > 48) score -= 30;
  if (ageHours > 72) score -= 50;

  // 7. Категория источника
  if (article.category === 'official') score += 8;
  if (article.category === 'insider') score += 6;
  if (article.category === 'platform') score += 3;

  // 8. Длина описания (подробные — лучше)
  if ((article.description || '').length > 500) score += 3;
  if ((article.description || '').length > 1000) score += 2;

  // 9. Наличие картинки
  if (article.image) score += 1;

  // 10. Reddit score бонус
  if (article.redditScore && article.redditScore > 500) score += 5;
  if (article.redditScore && article.redditScore > 2000) score += 5;

  return Math.max(0, Math.round(score * 10) / 10);
}

function rankNews(articles, topN = 5) {
  const scored = articles.map(a => ({ ...a, score: scoreArticle(a) }));
  scored.sort((a, b) => b.score - a.score);

  // Жёсткие фильтры: розыгрыши и Nintendo-only
  const BANNED_WORDS = ['розыгрыш', 'giveaway', 'raffle', 'конкурс', 'подарим', 'выиграй'];
  const filtered = scored.filter(article => {
    const t = (article.title || '').toLowerCase();
    const d = (article.description || '').toLowerCase();
    const cat = (article.category || '').toLowerCase();
    const text = `${t} ${d} ${cat}`;

    // Полный бан розыгрышей — проверяем title + description + category
    if (BANNED_WORDS.some(w => text.includes(w))) return false;

    // Nintendo-only без упоминания PS/Xbox
    if ((t.includes('nintendo switch') || t.includes('switch 2'))
        && !t.includes('playstation') && !t.includes('ps5') && !t.includes('ps4') && !t.includes('xbox')) return false;

    return true;
  });

  // Дедупликация по теме (берём лучший из похожих)
  const selected = [];
  const usedKeys = new Set();
  for (const article of filtered) {
    const key = normalizeForDedup(article.title);
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    selected.push(article);
    if (selected.length >= topN * 3) break; // запас для Xbox-лимита
  }

  // Лимит: максимум 1 Xbox-only новость из 5
  let xboxCount = 0;
  const finalSelected = [];
  for (const article of selected) {
    const title = article.title.toLowerCase();
    const isXboxOnly = (title.includes('xbox') || (article.sourceId || '').includes('xbox'))
      && !title.includes('playstation') && !title.includes('ps5') && !title.includes('ps4');

    if (isXboxOnly) {
      xboxCount++;
      if (xboxCount > 1) continue;
    }
    finalSelected.push(article);
    if (finalSelected.length >= topN) break;
  }
  return finalSelected;
}

function normalizeForDedup(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .slice(0, 5)
    .join(' ');
}

module.exports = { rankNews, scoreArticle };
