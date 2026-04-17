const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { generateImage } = require('../utils/aiClient');

const IMAGES_DIR = path.join(__dirname, '../../../../public/images/news');
const FALLBACK_DIR = path.join(__dirname, '../../../../public/images/news/fallbacks');
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 675;
const RAWG_API_KEY = 'd9ca3380009e448e8fb356b3837cafa2';

// Track recently used image URLs to avoid duplicates
const USED_IMAGES_FILE = path.join(__dirname, '../../../data/used-images.json');

function getRecentlyUsedImages(days = 7) {
  try {
    const data = JSON.parse(fs.readFileSync(USED_IMAGES_FILE, 'utf-8'));
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return data.filter(entry => entry.usedAt > cutoff);
  } catch {
    return [];
  }
}

function markImageUsed(url, articleId) {
  const recent = getRecentlyUsedImages(14);
  recent.push({ url, articleId, usedAt: Date.now() });
  try {
    // Атомарная запись: tmp + rename. Защита от race при параллельной обработке нескольких статей.
    const tmp = `${USED_IMAGES_FILE}.tmp.${process.pid}.${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(recent, null, 2));
    fs.renameSync(tmp, USED_IMAGES_FILE);
  } catch {}
}

function isImageRecentlyUsed(url) {
  if (!url) return false;
  const recent = getRecentlyUsedImages(7);
  return recent.some(entry => entry.url === url);
}

// ═══════════════════════════════════════════════
// KNOWN_SLUGS — маппинг игр → RAWG slug
// Добавляй сюда все игры, у которых RAWG неправильно ищет по названию
// ═══════════════════════════════════════════════
const KNOWN_SLUGS = {
  'Crimson Desert': 'crimson-desert',
  'Death Stranding 2': 'death-stranding-2-on-the-beach',
  'Death Stranding': 'death-stranding',
  'Spider-Man 2': 'marvels-spider-man-2',
  'Spider-Man': 'marvels-spider-man',
  'EA FC 26': 'ea-sports-fc-26',
  'EA FC 25': 'ea-sports-fc-25',
  'GTA 6': 'grand-theft-auto-vi',
  'GTA VI': 'grand-theft-auto-vi',
  'GTA V': 'grand-theft-auto-v',
  'Borderlands 4': 'borderlands-4',
  'Ghost of Yotei': 'ghost-of-yotei',
  'Ghost of Tsushima': 'ghost-of-tsushima',
  'Monster Hunter Wilds': 'monster-hunter-wilds',
  'Mafia The Old Country': 'mafia-the-old-country',
  'Kingdom Come Deliverance 2': 'kingdom-come-deliverance-ii',
  'Kingdom Come Deliverance': 'kingdom-come-deliverance',
  'Black Myth Wukong': 'black-myth-wukong',
  'Astro Bot': 'astro-bot',
  'Silent Hill 2': 'silent-hill-2',
  'Metaphor ReFantazio': 'metaphor-refantazio',
  'Like a Dragon': 'like-a-dragon-infinite-wealth',
  'Metro': 'metro-exodus',
  'Metro Exodus': 'metro-exodus',
  'Metro 2033': 'metro-2033-redux',
  'Metro Last Light': 'metro-last-light-redux',
  'Pragmata': 'pragmata',
  'Lords of the Fallen': 'lords-of-the-fallen-2',
  'Tomb Raider I-III Remastered': 'tomb-raider-i-ii-iii-remastered',
  'Sword Art Online Fractured Daydream': 'sword-art-online-fractured-daydream',
  'Elden Ring': 'elden-ring',
  'God of War Ragnarok': 'god-of-war-ragnarok',
  'God of War': 'god-of-war-2018',
  'The Last of Us': 'the-last-of-us-part-i',
  'The Last of Us Part II': 'the-last-of-us-part-ii',
  'Horizon Forbidden West': 'horizon-forbidden-west',
  'Horizon Zero Dawn': 'horizon-zero-dawn',
  'Final Fantasy XVI': 'final-fantasy-xvi',
  'Final Fantasy VII Rebirth': 'final-fantasy-vii-rebirth',
  'Final Fantasy VII': 'final-fantasy-vii-remake',
  'Stellar Blade': 'stellar-blade',
  'Helldivers 2': 'helldivers-2',
  'Hogwarts Legacy': 'hogwarts-legacy',
  'Assassins Creed Shadows': 'assassins-creed-codename-red',
  'Assassin\'s Creed Shadows': 'assassins-creed-codename-red',
  'Fable': 'fable-4',
  'Doom The Dark Ages': 'doom-the-dark-ages',
  'Wolverine': 'marvels-wolverine',
  'Venom': 'marvels-venom',
  'Cyberpunk 2077': 'cyberpunk-2077',
  'The Witcher 4': 'the-witcher-4',
  'Witcher 4': 'the-witcher-4',
  'Red Dead Redemption 2': 'red-dead-redemption-2',
  'Hades II': 'hades-ii',
  'Hades 2': 'hades-ii',
  'Hollow Knight Silksong': 'hollow-knight-silksong',
  'Resident Evil 9': 'resident-evil-9',
  'Devil May Cry': 'devil-may-cry-5',
  'Dragon Age The Veilguard': 'dragon-age-dreadwolf',
  'Star Wars Outlaws': 'star-wars-outlaws',
  'Indiana Jones': 'indiana-jones-and-the-great-circle',
  'Avowed': 'avowed',
  'Clair Obscur Expedition 33': 'clair-obscur-expedition-33',
  'Expedition 33': 'clair-obscur-expedition-33',
  'Wuthering Waves': 'wuthering-waves',
  'Zenless Zone Zero': 'zenless-zone-zero',
  'Genshin Impact': 'genshin-impact',
  'Palworld': 'palworld',
  'Tekken 8': 'tekken-8',
  'Mortal Kombat 1': 'mortal-kombat-1-2',
  'Street Fighter 6': 'street-fighter-6',
  'Forza Horizon 6': 'forza-horizon-6',
  'Forza Horizon 5': 'forza-horizon-5',
  'Forza Motorsport': 'forza-motorsport-3',
  'Starfield': 'starfield',
  'Diablo IV': 'diablo-iv',
  'Diablo 4': 'diablo-iv',
  'Path of Exile 2': 'path-of-exile-2',
  'Baldur\'s Gate 3': 'baldurs-gate-iii',
  'ARC Raiders': 'arc-raiders',
  'Marathon': 'marathon-2',
  'The Elder Scrolls VI': 'the-elder-scrolls-vi',
  'State of Decay 3': 'state-of-decay-3',
  'Perfect Dark': 'perfect-dark-2',
  'Atomfall': 'atomfall',
  'Subnautica 2': 'subnautica-2',
  'Civilization VII': 'civilization-7',
  'Civilization 7': 'civilization-7',
  'Ratchet & Clank': 'ratchet-clank-rift-apart',
  'Returnal': 'returnal',
  'Bloodborne': 'bloodborne',
  'Demon\'s Souls': 'demons-souls',
  'Dark Souls': 'dark-souls-iii',
  'Graveyard Keeper': 'graveyard-keeper',
  'Graveyard Keeper 2': 'graveyard-keeper-2',
  'Dune Awakening': 'dune-awakening',
  'Judas': 'judas',
  'Dying Light 2': 'dying-light-2',
  'The Outer Worlds 2': 'the-outer-worlds-2',
  'South of Midnight': 'south-of-midnight',
  'Ninja Gaiden 4': 'ninja-gaiden-4',
  'Mafia 4': 'mafia-the-old-country',
  'Oblivion Remastered': 'the-elder-scrolls-iv-oblivion',
  'Oblivion': 'the-elder-scrolls-iv-oblivion',
  'Split Fiction': 'split-fiction',
  'Assassins Creed Mirage': 'assassins-creed-mirage',
  'Assassin\'s Creed Mirage': 'assassins-creed-mirage',
  'Mouse P.I. For Hire': 'mouse-p-i-for-hire',
};

// ═══════════════════════════════════════════════
// УТИЛИТЫ
// ═══════════════════════════════════════════════

function isJunkImage(url) {
  if (!url) return true;
  const junk = ['avatar', 'icon', 'logo', 'thumbnail', 'profile', 'favicon', 'badge', 'emoji',
    'placeholder', 'default', 'blank', 'spacer', '1x1', 'pixel', 'spinner', 'loading',
    'author', 'gravatar', 'widget', 'button', 'arrow', 'banner-ad', 'advert', 'tracking',
    'social-share', 'share-btn', '/ads/', '/ad/', 'captcha'];
  const lower = url.toLowerCase();
  return junk.some(word => lower.includes(word));
}

// Русские прилагательные-описатели перед названием игры
const RU_ADJECTIVES = /^(новая|новый|новое|новые|следующая|следующий|грядущая|грядущий|большой|большая|ожидаемая|ожидаемый|анонсирован[аоы]?|долгожданн[аоыйе]+|предстоящ[аоыйе]+)\s+/i;

// Сервисы/подписки — НЕ игры. Если заголовок начинается с них, игру надо искать ПОСЛЕ двоеточия/тире
const SERVICE_NAMES = /^(Xbox\s*Game\s*Pass|PS\s*Plus|PlayStation\s*Plus|EA\s*Play|Game\s*Pass|Ubisoft\+|Nintendo\s*Switch\s*Online)\b/i;

// Платформы/консоли — НЕ игры. Если extractGameName вернул одно из этих — игнорировать
const PLATFORM_NAMES = /^(ps5|ps4|ps3|playstation\s*\d?|xbox|xbox\s*(one|series\s*[xs])?|nintendo(\s*switch)?(\s*\d)?|steam|pc|sony|microsoft|valve|epic\s*games)$/i;

function isPlatformName(name) {
  if (!name) return false;
  return PLATFORM_NAMES.test(name.trim());
}

function isServiceTitle(title) {
  return SERVICE_NAMES.test(title.trim());
}

// Извлечь название игры из ПРАВОЙ части заголовка (после двоеточия/тире)
function extractGameFromRightPart(title) {
  // "Xbox Game Pass в мае 2026: Forza Horizon 6 и другие новинки" → "Forza Horizon 6"
  const afterColon = title.match(/[:\u2013\u2014]\s*(.+)/);
  if (!afterColon) return null;
  const right = afterColon[1].trim();

  // Текст в кавычках
  const quoteMatch = right.match(/[\u00ab\u201c'"]([^\u00bb\u201d'"]+)[\u00bb\u201d'"]/);
  if (quoteMatch) return quoteMatch[1].trim();

  // Английское название игры в начале правой части
  const engMatch = right.match(/^([A-Z][A-Za-z0-9'\s\-&.:]{2,40}?)(?:\s+и\s|\s+[\u0400-\u04FF]|\s*[\u2013\u2014!?]|$)/);
  if (engMatch) return engMatch[1].trim();

  // НЕ возвращаем чисто русский текст без заглавных английских слов — это не название игры,
  // а описание ("названы игры-кандидаты", "обновление каталога", etc.)
  // Русское название подходит только если начинается с заглавной и похоже на название
  const ruMatch = right.match(/^([А-ЯЁ][А-Яа-яёЁA-Za-z0-9'\s\-&.:]{2,50}?)(?:\s+и\s+друг|\s+и\s+ещ[её]|,|\s*$)/);
  if (ruMatch) {
    const candidate = ruMatch[1].trim();
    // Отсеиваем фразы, которые не похожи на названия игр
    const notGameName = /^(назван|список|обновлен|добавлен|удалён|убран|первые|новые|лучшие|все |какие|когда|почему|стали|сколько|появи)/i;
    if (!notGameName.test(candidate)) return candidate;
  }

  return null;
}

function extractGameName(article) {
  const title = article.site?.title || article.title || '';

  // ═══ СЕРВИСНЫЕ ЗАГОЛОВКИ: Game Pass, PS Plus — ищем игру ПОСЛЕ двоеточия ═══
  if (isServiceTitle(title)) {
    const gameFromRight = extractGameFromRightPart(title);
    if (gameFromRight) {
      console.log('[NEWS] Service title detected, game from right part: "' + gameFromRight + '"');
      return gameFromRight;
    }
    // Если после двоеточия нет конкретной игры — вернуть null (это новость про сервис)
    console.log('[NEWS] Service title without specific game: "' + title + '"');
    return null;
  }

  // Текст в кавычках
  const quoteMatch = title.match(/[\u00ab\u201c'"]([^\u00bb\u201d'"]+)[\u00bb\u201d'"]/);
  if (quoteMatch) return quoteMatch[1].trim();

  // До двоеточия или тире
  const colonMatch = title.match(/^([A-Za-z\u0400-\u04FF\u0451\u04010-9\s:'\-&.]+?)[\s]*[:\u2013\u2014]/);
  if (colonMatch) {
    const candidate = colonMatch[1].trim();
    // Убедиться что это не сервис и не платформа
    if (candidate.length >= 3 && !SERVICE_NAMES.test(candidate) && !isPlatformName(candidate)) return candidate;
  }

  // Английские слова в начале перед русским текстом/глаголом
  const engMatch = title.match(/^([A-Z][A-Za-z0-9'\s\-&.]{2,40}?)(?:\s+[\u0400-\u04FF]|\s*[:\u2013\u2014!?]|\s+на\s|\s+для\s|\s+получ|\s+выход|\s+убрал|\s+стал|\s+побил|\s+лиш|\s+потер)/);
  if (engMatch && !SERVICE_NAMES.test(engMatch[1].trim()) && !isPlatformName(engMatch[1].trim())) return engMatch[1].trim();

  // Просто первые английские слова
  const simpleEng = title.match(/^([A-Z][A-Za-z0-9'\s\-&.]{2,30})\b/);
  if (simpleEng && !SERVICE_NAMES.test(simpleEng[1].trim()) && !isPlatformName(simpleEng[1].trim())) return simpleEng[1].trim();

  return null;
}

// Очистить извлечённое имя игры от русских описателей
function cleanGameName(name) {
  if (!name) return name;
  return name.replace(RU_ADJECTIVES, '').trim() || name;
}

// Найти slug в KNOWN_SLUGS (case-insensitive, с очисткой)
function findKnownSlug(gameName) {
  if (!gameName) return null;
  const clean = cleanGameName(gameName);

  // Точное совпадение
  if (KNOWN_SLUGS[clean]) return KNOWN_SLUGS[clean];
  if (KNOWN_SLUGS[gameName]) return KNOWN_SLUGS[gameName];

  // Case-insensitive
  const lower = clean.toLowerCase();
  for (const [key, slug] of Object.entries(KNOWN_SLUGS)) {
    if (key.toLowerCase() === lower) return slug;
  }

  // Partial match — если запрос содержит известное название
  for (const [key, slug] of Object.entries(KNOWN_SLUGS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return slug;
    }
  }

  return null;
}

function isSaleNews(article) {
  const title = (article.site?.title || article.title || '').toLowerCase();
  const saleKeywords = ['распродаж', 'скидк', 'sale', 'deals', 'акци', 'снижен',
    'ps store:', 'spring sale', 'summer sale', 'winter sale', 'holiday sale', 'black friday',
    'скидки до', 'бесплатн'];
  return saleKeywords.some(kw => title.includes(kw));
}

// ═══════════════════════════════════════════════
// RAWG
// ═══════════════════════════════════════════════

async function getRAWGBySlug(slug) {
  try {
    const response = await axios.get('https://api.rawg.io/api/games/' + slug, {
      params: { key: RAWG_API_KEY },
      timeout: 10000,
    });
    return response.data?.background_image || null;
  } catch {
    return null;
  }
}

async function searchRAWG(gameName, skipCache = false) {
  if (!gameName) return null;
  const clean = cleanGameName(gameName);

  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        search: clean,
        page_size: 5,
        search_precise: true,
      },
      timeout: 10000,
    });

    const results = response.data?.results;
    if (!results || results.length === 0) return null;

    // Строгая валидация релевантности результата RAWG
    const game = results.find(g => {
      if (!g.background_image) return false;
      const gName = g.name.toLowerCase();
      const qName = clean.toLowerCase();
      const queryWords = qName.split(/\s+/).filter(w => w.length >= 3);
      if (queryWords.length === 0) return false;
      if (queryWords.length === 1) {
        // Однословный запрос: требуем exact match по имени (без пунктуации/регистра)
        const normalize = s => s.replace(/[^\w]+/g, '').toLowerCase();
        return normalize(gName) === normalize(qName);
      }
      // Многословный: ВСЕ значимые слова должны входить в имя игры
      return queryWords.every(w => gName.includes(w));
    });

    if (!game) {
      console.log('[NEWS] RAWG: no relevant match for "' + clean + '" in results: ' +
        results.slice(0, 3).map(g => g.name).join(', '));
      return null;
    }

    if (skipCache || !isImageRecentlyUsed(game.background_image)) {
      console.log('[NEWS] RAWG found: "' + game.name + '" for query "' + clean + '"');
      return game.background_image;
    }

    // Image is duplicate — try screenshots
    console.log('[NEWS] RAWG image already used recently, trying screenshots...');
    try {
      const ssResponse = await axios.get('https://api.rawg.io/api/games/' + game.id + '/screenshots', {
        params: { key: RAWG_API_KEY },
        timeout: 10000,
      });
      const screenshots = ssResponse.data?.results || [];
      const usedUrls = getRecentlyUsedImages(7).map(e => e.url);
      const fresh = screenshots.find(ss => ss.image && !usedUrls.includes(ss.image));
      if (fresh) {
        console.log('[NEWS] Using RAWG screenshot: ' + fresh.image);
        return fresh.image;
      }
    } catch (err) {
      console.error('[NEWS] RAWG screenshots error: ' + err.message);
    }

    console.log('[NEWS] No fresh screenshots, using duplicate image');
    return game.background_image;
  } catch (err) {
    console.error('[NEWS] RAWG search error: ' + err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════
// СКАЧИВАНИЕ И ОБРАБОТКА
// ═══════════════════════════════════════════════

async function downloadAndResize(url, filename) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    return await resizeImage(Buffer.from(response.data), filename);
  } catch (err) {
    console.error('[NEWS] Image download failed: ' + err.message);
    return null;
  }
}

async function checkSourceImage(imageUrl) {
  if (!imageUrl) return null;
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    const buf = Buffer.from(response.data);
    const metadata = await sharp(buf).metadata();

    // Минимум 800px ширина (раньше было 600 — слишком мало, пропускало мусор)
    if (!metadata.width || metadata.width < 800) {
      console.log('[NEWS] Image rejected: too small (' + metadata.width + 'x' + metadata.height + ') — ' + imageUrl.substring(0, 80));
      return null;
    }

    // Минимум 400px высота — отсеивает узкие баннеры и полоски
    if (!metadata.height || metadata.height < 400) {
      console.log('[NEWS] Image rejected: too short (' + metadata.width + 'x' + metadata.height + ') — ' + imageUrl.substring(0, 80));
      return null;
    }

    // Проверка соотношения сторон: не уже 4:1 и не выше 1:2
    const ratio = metadata.width / metadata.height;
    if (ratio > 4 || ratio < 0.5) {
      console.log('[NEWS] Image rejected: bad aspect ratio (' + ratio.toFixed(2) + ') — ' + imageUrl.substring(0, 80));
      return null;
    }

    return buf;
  } catch {
    return null;
  }
}

async function resizeImage(imageBuffer, filename) {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const outputPath = path.join(IMAGES_DIR, filename);
  await sharp(imageBuffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
  return '/images/news/' + filename;
}

async function getFallbackImage(platform) {
  const platformMap = {
    playstation: 'fallback-playstation',
    xbox: 'fallback-xbox',
    nintendo: 'fallback-nintendo',
    pc: 'fallback-pc',
    general: 'fallback-general',
    multi: 'fallback-general',
  };
  const name = platformMap[platform] || platformMap.general;
  const jpgPath = path.join(FALLBACK_DIR, name + '.jpg');
  if (fs.existsSync(jpgPath)) return '/images/news/fallbacks/' + name + '.jpg';
  const svgPath = path.join(FALLBACK_DIR, name + '.svg');
  if (!fs.existsSync(svgPath)) return null;
  try {
    await sharp(svgPath).resize(1200, 675).jpeg({ quality: 90 }).toFile(jpgPath);
    return '/images/news/fallbacks/' + name + '.jpg';
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════
// og:image ИЗ ИСТОЧНИКА
// ═══════════════════════════════════════════════

async function fetchOgImage(sourceUrl) {
  if (!sourceUrl) return null;
  try {
    const response = await axios.get(sourceUrl, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      maxRedirects: 3,
    });
    const html = typeof response.data === 'string' ? response.data : '';
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch && ogMatch[1] && !isJunkImage(ogMatch[1])) {
      console.log('[NEWS] Found og:image: ' + ogMatch[1]);
      return ogMatch[1];
    }
    const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twMatch && twMatch[1] && !isJunkImage(twMatch[1])) {
      console.log('[NEWS] Found twitter:image: ' + twMatch[1]);
      return twMatch[1];
    }
    return null;
  } catch (err) {
    console.error('[NEWS] og:image error: ' + err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════
// ВЕБ-ПОИСК КАРТИНОК (Google + Bing + DuckDuckGo)
// ═══════════════════════════════════════════════

// Построить умный поисковый запрос
function buildImageSearchQuery(article) {
  const gameName = extractGameName(article);
  const title = article.site?.title || article.title || '';

  if (isSaleNews(article)) {
    const platform = article.platform || '';
    if (platform === 'playstation' || /ps\s?(store|plus|4|5)/i.test(title)) {
      const saleType = title.match(/(весенн|летн|зимн|осенн|holiday|spring|summer|winter|black friday)/i);
      const season = saleType ? saleType[0] : '';
      return `PlayStation Store ${season} sale official banner`.trim();
    }
    if (platform === 'xbox' || /xbox|game\s?pass/i.test(title)) {
      return 'Xbox Store sale official banner';
    }
    return 'PlayStation Store sale banner official';
  }

  // Сервисные новости (Game Pass, PS Plus) без конкретной игры — искать брендинг сервиса
  if (isServiceTitle(title) && !gameName) {
    if (/game\s*pass/i.test(title)) return 'Xbox Game Pass official banner 2026 wallpaper';
    if (/ps\s*plus|playstation\s*plus/i.test(title)) return 'PS Plus official banner 2026 wallpaper';
    if (/ea\s*play/i.test(title)) return 'EA Play official banner wallpaper';
    return 'gaming subscription service banner';
  }

  if (gameName) {
    const clean = cleanGameName(gameName);
    return `${clean} game official key art wallpaper`;
  }

  // Платформенные/индустриальные новости — искать по платформе
  const platform = article.platform || '';
  if (/ps5|ps4|playstation/i.test(title)) return 'PlayStation 5 console official promo wallpaper';
  if (/xbox/i.test(title)) return 'Xbox Series X console official promo wallpaper';
  if (/nintendo|switch/i.test(title)) return 'Nintendo Switch official promo wallpaper';
  if (/steam|valve/i.test(title)) return 'Steam gaming platform official wallpaper';

  // Фоллбэк
  const cleanTitle = title
    .replace(/[\u2014\u2013:!?]/g, ' ')
    .replace(/(инсайд|слух|анонс|новост|обзор|хайп|уже|на следующ|скоро|стал|побил|получ|продажи|рухнули|после|повышени)/gi, '')
    .replace(/ {2,}/g, ' ')
    .trim();
  return (cleanTitle.substring(0, 80) + ' official wallpaper').trim();
}

// Поиск через Google Images (scraping)
async function searchGoogleImages(query) {
  try {
    const response = await axios.get('https://www.google.com/search', {
      params: { q: query, tbm: 'isch', tbs: 'isz:l' }, // isz:l = large images
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const html = response.data || '';
    // Google Images stores URLs in multiple formats
    const urls = [];
    // Format 1: ["url",width,height]
    const matches1 = [...html.matchAll(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))[^"]*",\d+,\d+\]/gi)];
    for (const m of matches1) urls.push(m[1]);
    // Format 2: data-src or src attributes
    const matches2 = [...html.matchAll(/(?:data-src|src)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)];
    for (const m of matches2) urls.push(m[1]);
    // Format 3: ou: parameter (old format)
    const matches3 = [...html.matchAll(/"ou":"(https?:\/\/[^"]+)"/g)];
    for (const m of matches3) urls.push(m[1]);

    // Deduplicate and filter
    const unique = [...new Set(urls)].filter(u =>
      !isJunkImage(u) &&
      !u.includes('gstatic.com') &&
      !u.includes('google.com') &&
      !u.includes('googleapis.com/encrypted') &&
      u.length < 500
    );
    console.log('[NEWS] Google Images found ' + unique.length + ' candidates for: "' + query + '"');
    return unique.slice(0, 10);
  } catch (err) {
    console.error('[NEWS] Google Images error: ' + err.message);
    return [];
  }
}

// Поиск через Bing Images (scraping)
async function searchBingImages(query) {
  try {
    const response = await axios.get('https://www.bing.com/images/search', {
      params: { q: query, first: 1, count: 10, qft: '+filterui:imagesize-wallpaper' },
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    const html = response.data || '';
    const matches = [...html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)];
    const urls = matches.map(m => m[1]).filter(u => !isJunkImage(u));
    console.log('[NEWS] Bing Images found ' + urls.length + ' candidates for: "' + query + '"');
    return urls.slice(0, 10);
  } catch (err) {
    console.error('[NEWS] Bing Images error: ' + err.message);
    return [];
  }
}

// Основной поиск: Google → Bing → фильтрация
async function searchWebImage(article, customQuery, skipCache = false) {
  const query = customQuery || buildImageSearchQuery(article);
  console.log('[NEWS] Image search: "' + query + '"');

  // Собираем кандидатов из нескольких источников
  let candidates = [];

  // Google Images (приоритет — более релевантные результаты)
  const googleResults = await searchGoogleImages(query);
  candidates.push(...googleResults);

  // Если Google не дал результатов — Bing
  if (candidates.length === 0) {
    const bingResults = await searchBingImages(query);
    candidates.push(...bingResults);
  }

  // Фильтруем и валидируем
  for (const imgUrl of candidates) {
    if (!skipCache && isImageRecentlyUsed(imgUrl)) continue;
    const buf = await checkSourceImage(imgUrl);
    if (buf) {
      console.log('[NEWS] Web search found valid image: ' + imgUrl);
      return imgUrl;
    }
  }

  // Если первый запрос не сработал и это игра — альтернативный запрос
  const gameName = extractGameName(article);
  if (gameName && !customQuery) {
    const clean = cleanGameName(gameName);
    const altQuery = clean + ' game wallpaper banner';
    console.log('[NEWS] Trying alt query: "' + altQuery + '"');
    const altResults = await searchBingImages(altQuery);
    for (const imgUrl of altResults) {
      if (!skipCache && isImageRecentlyUsed(imgUrl)) continue;
      const buf = await checkSourceImage(imgUrl);
      if (buf) {
        console.log('[NEWS] Alt search found: ' + imgUrl);
        return imgUrl;
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════
// AI-ГЕНЕРАЦИЯ ОБЛОЖКИ
// ═══════════════════════════════════════════════

async function generateAiCover(article, filename) {

  const gameName = cleanGameName(extractGameName(article));
  const title = article.site?.title || article.title || '';

  // Определяем тему для генерации релевантной картинки
  const platform = article.platform || 'general';
  let imagePrompt;

  if (isSaleNews(article)) {
    const plat = platform === 'xbox' ? 'Xbox' : 'PlayStation';
    imagePrompt = `A sleek promotional banner for a ${plat} gaming store sale. Dark blue and cyan color scheme. Text "SALE" with glowing neon effect. Gaming controllers and digital discount tags floating. Modern, premium, minimalist design. 16:9 aspect ratio, high quality.`;
  } else if (gameName) {
    imagePrompt = `A cinematic key art for the video game "${gameName}". Epic, dramatic scene from the game. Dark atmospheric lighting. AAA game quality. 16:9 aspect ratio, photorealistic, highly detailed.`;
  } else {
    // Индустриальные/платформенные новости — генерируем картинку по контексту заголовка
    const titleLower = title.toLowerCase();
    if (/ps5|playstation\s*5/i.test(title)) {
      if (/продаж|цен|подорож|рынок|япони/i.test(title)) {
        imagePrompt = `A PlayStation 5 console on a dramatic dark background with Japanese aesthetic elements. Moody blue and white neon lighting. The PS5 console is the hero element, centered, glowing. Dark gradient background with subtle price chart going down. Professional product photography style. 16:9 aspect ratio, photorealistic.`;
      } else {
        imagePrompt = `A PlayStation 5 console on a dramatic dark background with blue neon accents. Professional product photography style. The PS5 is the hero element, glowing edges. Dark gradient background. 16:9 aspect ratio, photorealistic, premium feel.`;
      }
    } else if (/xbox/i.test(title)) {
      imagePrompt = `An Xbox Series X console on a dramatic dark background with green neon accents. Professional product photography style. The console is centered and prominent. Dark gradient background. 16:9 aspect ratio, photorealistic, premium feel.`;
    } else if (/nintendo|switch/i.test(title)) {
      imagePrompt = `A Nintendo Switch console on a vibrant red background with gaming elements. Professional product photography style. 16:9 aspect ratio, photorealistic, premium feel.`;
    } else if (/sony|microsoft|epic|valve|steam/i.test(title)) {
      imagePrompt = `A modern gaming setup with multiple screens showing game titles. Dark atmospheric lighting with neon blue and purple accents. Professional, cinematic. 16:9 aspect ratio, high quality.`;
    } else {
      imagePrompt = `A cinematic gaming news banner. Dark atmospheric design with gaming controllers, screens and neon accents on dark background. Modern, premium, editorial feel. 16:9 aspect ratio, high quality.`;
    }
  }

  console.log('[NEWS] AI cover: ' + imagePrompt.substring(0, 100) + '...');

  try {
    const imageUrl = await generateImage(imagePrompt);
    if (!imageUrl) return null;

    const result = await downloadAndResize(imageUrl, filename);
    if (result) markImageUsed('ai-generated:' + article.id, article.id);
    return result;
  } catch (err) {
    console.error('[NEWS] AI image error: ' + err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════
// ГЛАВНАЯ ФУНКЦИЯ
// ═══════════════════════════════════════════════

async function getNewsImage(article, opts = {}) {
  const filename = article.id + '.jpg';
  const platform = article.platform || 'general';
  const skipCache = !!opts.skipCache;
  // При skipCache пропускаем проверку used-images: позволяем выбрать картинку заново.
  const wasRecentlyUsed = (url) => skipCache ? false : isImageRecentlyUsed(url);

  // ═══ РАСПРОДАЖА/СКИДКИ ═══
  if (isSaleNews(article)) {
    console.log('[NEWS] === Sale news: ' + article.title + ' ===');

    // 1. og:image (у крупных источников типа PS Blog всегда есть хороший баннер)
    const ogUrl = await fetchOgImage(article.sourceUrl || article.link);
    if (ogUrl) {
      const ogImg = await downloadAndResize(ogUrl, filename);
      if (ogImg) {
        markImageUsed(ogUrl, article.id);
        console.log('[NEWS] SALE: og:image from source');
        return ogImg;
      }
    }

    // 2. RSS image (если качественная)
    if (article.image && !isJunkImage(article.image)) {
      const sourceImage = await checkSourceImage(article.image);
      if (sourceImage) {
        console.log('[NEWS] SALE: RSS source image');
        return await resizeImage(sourceImage, filename);
      }
    }

    // 3. Веб-поиск баннера
    const webUrl = await searchWebImage(article, undefined, skipCache);
    if (webUrl) {
      const webImg = await downloadAndResize(webUrl, filename);
      if (webImg) {
        markImageUsed(webUrl, article.id);
        console.log('[NEWS] SALE: web search image');
        return webImg;
      }
    }

    // 4. AI-генерация
    const aiResult = await generateAiCover(article, filename);
    if (aiResult) return aiResult;

    // 5. Заглушка
    return await getFallbackImage(platform);
  }

  // ═══ ОБЫЧНАЯ НОВОСТЬ ═══
  const title = article.site?.title || article.title || '';
  const isService = isServiceTitle(title);
  console.log('[NEWS] === Regular news: ' + title + (isService ? ' [SERVICE]' : '') + ' ===');
  const gameName = extractGameName(article);

  // 1. RAWG — обложка игры (приоритет для игровых новостей)
  if (gameName) {
    const clean = cleanGameName(gameName);
    console.log('[NEWS] Game: "' + gameName + '" → clean: "' + clean + '"');

    let rawgUrl = null;

    // 1a. KNOWN_SLUGS (гарантированный результат)
    const knownSlug = findKnownSlug(gameName);
    if (knownSlug) {
      console.log('[NEWS] Known slug: ' + knownSlug);
      rawgUrl = await getRAWGBySlug(knownSlug);
    }

    // 1b. Поиск по названию с валидацией релевантности
    if (!rawgUrl) {
      rawgUrl = await searchRAWG(clean, skipCache);
    }

    if (rawgUrl) {
      const img = await downloadAndResize(rawgUrl, filename);
      if (img) {
        markImageUsed(rawgUrl, article.id);
        console.log('[NEWS] GAME: RAWG image for "' + clean + '"');
        return img;
      }
    }

    // 1c. og:image источника — приоритет перед Bing, т.к. при отсутствии RAWG
    // Bing часто подсовывает нерелевантные «похожие» картинки (Pickmos → cyberpunk-арт).
    // og:image от новостного сайта почти всегда релевантен.
    const gameOgUrl = await fetchOgImage(article.sourceUrl || article.link);
    if (gameOgUrl && !wasRecentlyUsed(gameOgUrl)) {
      const gameOgImg = await downloadAndResize(gameOgUrl, filename);
      if (gameOgImg) {
        markImageUsed(gameOgUrl, article.id);
        console.log('[NEWS] GAME: og:image from source for "' + clean + '"');
        return gameOgImg;
      }
    }

    // 1d. Веб-поиск конкретной игры (Bing). Только если og:image не сработал.
    const gameWebQuery = `${clean} game official key art wallpaper`;
    console.log('[NEWS] Game web search: "' + gameWebQuery + '"');
    const gameWebUrl = await searchWebImage(article, gameWebQuery, skipCache);
    if (gameWebUrl) {
      const gameWebImg = await downloadAndResize(gameWebUrl, filename);
      if (gameWebImg) {
        markImageUsed(gameWebUrl, article.id);
        console.log('[NEWS] GAME: web search image for "' + clean + '"');
        return gameWebImg;
      }
    }
  }

  // ═══ НЕТ КОНКРЕТНОЙ ИГРЫ — индустрия, консоли, сервисы без игры ═══
  // Для таких новостей og:image и веб-поиск часто дают мусор.
  // Приоритет: og:image источника → AI-генерация → веб-поиск → заглушка
  if (!gameName) {
    console.log('[NEWS] No game detected — industry/platform news flow');

    // 2a. og:image источника (у крупных сайтов обычно качественная)
    const ogUrl = await fetchOgImage(article.sourceUrl || article.link);
    if (ogUrl && !wasRecentlyUsed(ogUrl)) {
      const ogImg = await downloadAndResize(ogUrl, filename);
      if (ogImg) {
        markImageUsed(ogUrl, article.id);
        console.log('[NEWS] INDUSTRY: og:image from source');
        return ogImg;
      }
    }

    // 2b. RSS image
    if (article.image && !isJunkImage(article.image)) {
      const sourceImage = await checkSourceImage(article.image);
      if (sourceImage) {
        console.log('[NEWS] INDUSTRY: RSS image');
        return await resizeImage(sourceImage, filename);
      }
    }

    // 2c. AI-генерация — ПРИОРИТЕТ для индустриальных новостей
    // (веб-поиск для таких тем обычно даёт нерелевантный мусор)
    console.log('[NEWS] INDUSTRY: generating AI cover (best option for non-game news)');
    const aiResult = await generateAiCover(article, filename);
    if (aiResult) return aiResult;

    // 2d. Веб-поиск (последний шанс перед заглушкой)
    const webUrl = await searchWebImage(article, undefined, skipCache);
    if (webUrl) {
      const webImg = await downloadAndResize(webUrl, filename);
      if (webImg) {
        markImageUsed(webUrl, article.id);
        console.log('[NEWS] INDUSTRY: web search image');
        return webImg;
      }
    }

    // 2e. Заглушка
    console.log('[NEWS] FALLBACK: ' + platform);
    return await getFallbackImage(platform);
  }

  // ═══ ЕСТЬ ИГРА, НО RAWG НЕ НАШЁЛ — стандартный фоллбэк ═══

  // 2. og:image с сайта-источника
  const ogUrl = await fetchOgImage(article.sourceUrl || article.link);
  if (ogUrl && !wasRecentlyUsed(ogUrl)) {
    const ogImg = await downloadAndResize(ogUrl, filename);
    if (ogImg) {
      markImageUsed(ogUrl, article.id);
      console.log('[NEWS] SOURCE: og:image');
      return ogImg;
    }
  }

  // 3. RSS image
  if (article.image && !isJunkImage(article.image)) {
    const sourceImage = await checkSourceImage(article.image);
    if (sourceImage) {
      console.log('[NEWS] SOURCE: RSS image');
      return await resizeImage(sourceImage, filename);
    }
  }

  // 4. Веб-поиск
  const webUrl = await searchWebImage(article, undefined, skipCache);
  if (webUrl) {
    const webImg = await downloadAndResize(webUrl, filename);
    if (webImg) {
      markImageUsed(webUrl, article.id);
      console.log('[NEWS] WEB: search image');
      return webImg;
    }
  }

  // 5. AI-генерация
  const aiResult = await generateAiCover(article, filename);
  if (aiResult) return aiResult;

  // 6. Заглушка
  console.log('[NEWS] FALLBACK: ' + platform);
  return await getFallbackImage(platform);
}

module.exports = {
  getNewsImage, checkSourceImage, searchRAWG, resizeImage, extractGameName,
  isJunkImage, getFallbackImage, fetchOgImage, searchWebImage, generateAiCover,
  cleanGameName, findKnownSlug, isServiceTitle, KNOWN_SLUGS,
};
