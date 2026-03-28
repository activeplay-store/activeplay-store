// Скоринг и ранжирование новостей

// Ключевые слова с весами (чем выше — тем интереснее аудитории ActivePlay)
const KEYWORDS = {
  high: [
    'ps5', 'playstation', 'ps plus', 'ps store', 'dualsense',
    'xbox', 'game pass', 'series x',
    'gta', 'god of war', 'spider-man', 'the last of us', 'uncharted',
    'final fantasy', 'elden ring', 'hogwarts', 'ghost of tsushima',
    'horizon', 'death stranding', 'resident evil', 'silent hill',
    'free', 'бесплатно', 'sale', 'скидки', 'discount', 'deal',
    'exclusive', 'эксклюзив', 'release date', 'дата выхода',
    'launch', 'reveal', 'announce', 'trailer',
  ],
  medium: [
    'nintendo', 'switch', 'steam', 'epic games',
    'dlc', 'expansion', 'update', 'patch',
    'review', 'обзор', 'gameplay', 'hands-on',
    'multiplayer', 'co-op', 'online',
    'indie', 'инди', 'remake', 'remaster',
  ],
  low: [
    'mobile', 'ios', 'android', 'gacha',
    'esports', 'tournament', 'league',
    'vr', 'psvr',
  ],
};

function scoreArticle(article) {
  let score = 0;
  const text = `${article.title} ${article.description}`.toLowerCase();

  // 1. Ключевые слова
  for (const kw of KEYWORDS.high) {
    if (text.includes(kw)) score += 3;
  }
  for (const kw of KEYWORDS.medium) {
    if (text.includes(kw)) score += 1;
  }
  for (const kw of KEYWORDS.low) {
    if (text.includes(kw)) score -= 1;
  }

  // 2. Вес источника
  score *= (article.sourceWeight || 1);

  // 3. Свежесть (чем новее — тем лучше)
  const ageHours = (Date.now() - new Date(article.pubDate).getTime()) / (1000 * 60 * 60);
  if (ageHours < 2) score += 5;
  else if (ageHours < 6) score += 3;
  else if (ageHours < 12) score += 1;

  // 4. Официальный источник = бонус
  if (article.sourceCategory === 'official') score += 4;

  // 5. Длина описания (подробные — лучше)
  if ((article.description || '').length > 500) score += 2;
  if ((article.description || '').length > 1000) score += 1;

  // 6. Наличие картинки — бонус
  if (article.image) score += 1;

  return Math.max(0, Math.round(score * 10) / 10);
}

function rankNews(articles, topN = 10) {
  const scored = articles.map(a => ({ ...a, score: scoreArticle(a) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

module.exports = { rankNews, scoreArticle };
