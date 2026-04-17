// agent/src/modules/news/scorer.js
// Скоринг и ранжирование новостей — v2
// Изменения: сжатие весов, event-бонус, community-сигнал, breakdown, 10 новостей, diversity

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
  'metal gear': 8, 'zelda': 7, 'mario': 5, 'halo': 6,
  "assassin's creed": 7, 'call of duty': 7, 'cyberpunk': 7,
  'witcher': 7, 'diablo': 6, 'destiny': 5, 'fortnite': 5,
  'monster hunter': 7, 'persona': 6, 'dragon age': 6,

  // Коммерция
  'free': 6, 'sale': 5, 'discount': 5, 'deal': 4,
  'launch': 5, 'reveal': 6, 'announce': 6, 'trailer': 5,

  // Средний приоритет (РАСШИРЕННЫЙ)
  'dlc': 3, 'expansion': 3, 'update': 2, 'patch': 2,
  'review': 3, 'gameplay': 3, 'hands-on': 4,
  'multiplayer': 2, 'co-op': 2, 'remake': 4, 'remaster': 3,
  'preview': 4, 'interview': 4, 'roadmap': 3,
  'sequel': 3, 'prequel': 3, 'spin-off': 3,
  'open world': 3, 'early access': 3, 'beta': 3,
  'performance mode': 3, 'ray tracing': 3,
  'crossplay': 2, 'cross-gen': 2, 'backward': 2,
  'acquisition': 5, 'layoff': 4, 'shut down': 5, 'closure': 5,

  // Полный бан / жёсткий минус
  'розыгрыш': -100, 'giveaway': -100, 'raffle': -100, 'конкурс': -100,
  'nintendo switch': -50, 'switch 2': -50,
  'amazon': -40,
  'kindle': -50,
  'книг': -40, 'novel': -40, 'paperback': -40, 'book': -30,
  'angry birds': -30,
};

// === EVENT БОНУС (НОВОЕ) ===
const EVENT_KEYWORDS = [
  'state of play', 'playstation showcase', 'xbox showcase',
  'xbox developer direct', 'summer game fest', 'the game awards',
  'tga 2026', 'tga 2025', 'gamescom', 'tokyo game show', 'tgs',
  'nintendo direct', 'indie world', 'gdc',
  'sgf', 'future games show', 'pc gaming show',
  'playstation experience', 'psx',
];

const NEGATIVE_KEYWORDS = [
  'mobile game', 'mobile gaming', 'gacha', 'idle game',
  'sponsored', 'advertisement', 'affiliate',
  'what are you playing', 'talking point', 'opinion piece',
  'review roundup', 'podcast', 'quiz', 'best of',
  'wordle', 'crossword', 'puzzle answer',
];

// Чёрный список — нерелевантный контент
const BLACKLIST = [
  "DAC", "ЦАП", "headphone", "наушники", "headset", "гарнитура", "controller stand",
  "зарядная станция", "charging dock", "carrying case", "чехол", "screen protector",
  "защитное стекло", "кабель", "cable", "adapter", "адаптер", "HiFi",
  "mobile game", "мобильная игра", "iOS game", "Android game", "App Store", "Google Play",
  "firmware update", "обновление прошивки", "router", "роутер", "TV settings",
  "настройки телевизора", "soundbar", "саундбар",
  "giveaway", "розыгрыш", "sweepstakes", "free codes",
];

function isBlacklisted(article) {
  const title = (article.title || "").toLowerCase();
  const description = (article.description || "").toLowerCase();
  const combined = title + " " + description;
  return BLACKLIST.some(word => combined.includes(word.toLowerCase()));
}

// РАСШИРЕННЫЙ список gaming-слов
const GAMING_KEYWORDS = [
  "PS5", "PS4", "PlayStation", "Xbox", "Nintendo", "Switch", "Steam", "PC",
  "PS Plus", "Game Pass", "EA Play", "game", "игр", "RPG", "FPS", "MMO",
  "DLC", "патч", "patch", "update", "релиз", "release", "анонс",
  "трейлер", "trailer", "геймплей", "gameplay", "студия", "studio",
  "разработчик", "developer", "издатель", "publisher",
  // Новые — закрываем дыры
  "interview", "hands-on", "preview", "review", "remaster", "remake",
  "roadmap", "sequel", "co-op", "multiplayer", "open world", "early access",
  "beta", "alpha", "showcase", "reveal", "crossplay", "ray tracing",
  "performance", "expansion", "season pass", "battle pass",
  "esports", "киберспорт", "indie", "инди", "AAA",
  "acquisition", "layoff", "closure", "shut down",
  "Unreal Engine", "Unity", "mod", "мод",
];

function hasGamingContent(article) {
  const combined = ((article.title || "") + " " + (article.description || "")).toLowerCase();
  return GAMING_KEYWORDS.some(kw => combined.includes(kw.toLowerCase()));
}

function scoreArticle(article) {
  // Blacklist — мгновенный 0
  if (isBlacklisted(article)) {
    console.log("[SCORER] Blacklisted: " + (article.title || "").slice(0, 60));
    return { score: 0, breakdown: { blacklisted: true } };
  }

  const breakdown = {};
  let score = 0;
  const text = `${article.title} ${article.description}`.toLowerCase();
  const titleLower = (article.title || '').toLowerCase();

  // 1. Ключевые слова
  let kwScore = 0;
  const matchedKw = [];
  for (const [keyword, points] of Object.entries(KEYWORD_SCORES)) {
    if (text.includes(keyword)) {
      kwScore += points;
      matchedKw.push(`${keyword}(${points > 0 ? '+' : ''}${points})`);
    }
  }
  score += kwScore;
  if (matchedKw.length) breakdown.keywords = { score: kwScore, matched: matchedKw };

  // 2. Негативные ключевые слова
  let negScore = 0;
  const matchedNeg = [];
  for (const neg of NEGATIVE_KEYWORDS) {
    if (text.includes(neg)) {
      negScore -= 20;
      matchedNeg.push(neg);
    }
  }
  score += negScore;
  if (matchedNeg.length) breakdown.negative = { score: negScore, matched: matchedNeg };

  // 3. Скидки на аксессуары — минус
  if ((titleLower.includes('deal') || titleLower.includes('sale') || titleLower.includes('off'))
      && !titleLower.includes('ps store') && !titleLower.includes('game pass')
      && !titleLower.includes('playstation') && !titleLower.includes('xbox game')) {
    score -= 30;
    breakdown.accessory_deal = -30;
  }

  // 4. Короткое описание
  if ((article.description || '').length < 100) {
    score -= 20;
    breakdown.short_desc = -20;
  }

  // 5. Вес источника — СЖАТЫЙ (×1.5 вместо ×2)
  //    Было: PSBlog=20, Reddit=12, разница 8
  //    Стало: PSBlog=15, Reddit=12, разница 3
  const sourceBonus = Math.round((article.sourceWeight || 1) * 1.5);
  score += sourceBonus;
  breakdown.source_weight = { raw: article.sourceWeight, bonus: sourceBonus };

  // 6. Свежесть
  const ageHours = (Date.now() - new Date(article.pubDate).getTime()) / (1000 * 60 * 60);
  let freshness = 0;
  if (ageHours < 2) freshness = 10;
  else if (ageHours < 6) freshness = 5;
  else if (ageHours < 12) freshness = 2;
  if (ageHours > 48) freshness -= 30;
  if (ageHours > 72) freshness -= 50;
  score += freshness;
  breakdown.freshness = { hours: Math.round(ageHours * 10) / 10, bonus: freshness };

  // 7. Категория источника — community теперь тоже получает бонус
  let catBonus = 0;
  if (article.category === 'official') catBonus = 8;
  else if (article.category === 'insider') catBonus = 6;
  else if (article.category === 'platform') catBonus = 3;
  else if (article.category === 'community') catBonus = 2;
  score += catBonus;
  if (catBonus) breakdown.category = { type: article.category, bonus: catBonus };

  // 8. Длина описания
  let lenBonus = 0;
  if ((article.description || '').length > 500) lenBonus += 3;
  if ((article.description || '').length > 1000) lenBonus += 2;
  score += lenBonus;
  if (lenBonus) breakdown.desc_length = lenBonus;

  // 9. Картинка
  if (article.image) {
    score += 1;
    breakdown.image = 1;
  }

  // 10. Reddit score — УСИЛЕННЫЙ
  if (article.redditScore) {
    let redditBonus = 0;
    if (article.redditScore > 5000) redditBonus = 20;
    else if (article.redditScore > 2000) redditBonus = 15;
    else if (article.redditScore > 1000) redditBonus = 10;
    else if (article.redditScore > 500) redditBonus = 7;
    else if (article.redditScore > 200) redditBonus = 4;
    score += redditBonus;
    if (redditBonus) breakdown.reddit = { upvotes: article.redditScore, bonus: redditBonus };
  }

  // 11. EVENT БОНУС (НОВОЕ) — не суммируется, максимум +15
  let eventBonus = 0;
  const matchedEvents = [];
  for (const ev of EVENT_KEYWORDS) {
    if (text.includes(ev)) {
      eventBonus = 15;
      matchedEvents.push(ev);
    }
  }
  score += eventBonus;
  if (eventBonus) breakdown.event = { bonus: eventBonus, matched: matchedEvents };

  // Gaming-контент проверка — без gaming-слов скор ×0.5
  if (!hasGamingContent(article)) {
    console.log("[SCORER] No gaming content: " + (article.title || "").slice(0, 60));
    score = Math.round(score * 0.5);
    breakdown.no_gaming_penalty = 'x0.5';
  }

  const finalScore = Math.max(0, Math.round(score * 10) / 10);
  breakdown._total = finalScore;

  return { score: finalScore, breakdown };
}

// topN = 10 (было 5), maxPerSource = 2 (НОВОЕ — diversity)
function rankNews(articles, topN = 10, maxPerSource = 2) {
  const scored = articles.map(a => {
    const { score, breakdown } = scoreArticle(a);
    return { ...a, score, _scoreBreakdown: breakdown };
  });
  scored.sort((a, b) => b.score - a.score);

  // === ЛОГ: Score Breakdown для топ-15 ===
  console.log('\n[SCORER] ═══════════ Score Breakdown (top 15) ═══════════');
  for (const item of scored.slice(0, 15)) {
    const bd = item._scoreBreakdown || {};
    console.log(`  ${String(item.score).padStart(5)} | ${(item.sourceName || '').padEnd(22)} | ${(item.title || '').slice(0, 70)}`);
    const parts = [];
    if (bd.keywords) parts.push(`kw:${bd.keywords.score}`);
    if (bd.source_weight) parts.push(`src:${bd.source_weight.bonus}`);
    if (bd.freshness) parts.push(`fresh:${bd.freshness.bonus}`);
    if (bd.category) parts.push(`cat:${bd.category.bonus}`);
    if (bd.reddit) parts.push(`reddit:${bd.reddit.bonus}(↑${bd.reddit.upvotes})`);
    if (bd.event) parts.push(`event:${bd.event.bonus}`);
    if (bd.negative) parts.push(`neg:${bd.negative.score}`);
    if (bd.short_desc) parts.push(`short:-20`);
    if (bd.accessory_deal) parts.push(`acc_deal:-30`);
    if (bd.no_gaming_penalty) parts.push('NO_GAMING:x0.5');
    console.log(`        └─ ${parts.join(' | ')}`);
  }
  console.log('[SCORER] ══════════════════════════════════════════════════\n');

  // Жёсткие фильтры
  const filtered = scored.filter(article => {
    const t = (article.title || '').toLowerCase();
    const cat = (article.category || '').toLowerCase();
    if (cat.includes('розыгрыш') || t.includes('розыгрыш') || t.includes('giveaway') || t.includes('raffle')) return false;
    if ((t.includes('nintendo switch') || t.includes('switch 2'))
        && !t.includes('playstation') && !t.includes('ps5') && !t.includes('ps4') && !t.includes('xbox')) return false;
    return true;
  });

  // Дедупликация по теме
  const selected = [];
  const usedKeys = new Set();
  for (const article of filtered) {
    const key = normalizeForDedup(article.title);
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    selected.push(article);
    if (selected.length >= topN * 3) break;
  }

  // === DIVERSITY: max N из одного источника + лимит Xbox-only ===
  let xboxCount = 0;
  const sourceCount = {};
  const finalSelected = [];

  for (const article of selected) {
    const srcId = article.sourceId || article.sourceName || 'unknown';
    const title = article.title.toLowerCase();

    // Max per source — не больше 2 из одного
    sourceCount[srcId] = (sourceCount[srcId] || 0) + 1;
    if (sourceCount[srcId] > maxPerSource) continue;

    // Xbox-only лимит: max 2 из 10
    const isXboxOnly = (title.includes('xbox') || (article.sourceId || '').includes('xbox'))
      && !title.includes('playstation') && !title.includes('ps5') && !title.includes('ps4');
    if (isXboxOnly) {
      xboxCount++;
      if (xboxCount > 2) continue;
    }

    finalSelected.push(article);
    if (finalSelected.length >= topN) break;
  }

  // Лог финала
  const srcSummary = {};
  for (const a of finalSelected) srcSummary[a.sourceName] = (srcSummary[a.sourceName] || 0) + 1;
  console.log(`[SCORER] Final ${finalSelected.length} articles:`, JSON.stringify(srcSummary));

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
