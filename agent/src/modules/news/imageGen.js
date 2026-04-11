const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
  const recent = getRecentlyUsedImages(14); // keep 2 weeks
  recent.push({ url, articleId, usedAt: Date.now() });
  try {
    fs.writeFileSync(USED_IMAGES_FILE, JSON.stringify(recent, null, 2));
  } catch {}
}

function isImageRecentlyUsed(url) {
  if (!url) return false;
  const recent = getRecentlyUsedImages(7);
  return recent.some(entry => entry.url === url);
}


const KNOWN_SLUGS = {
  'Crimson Desert': 'crimson-desert',
  'Death Stranding 2': 'death-stranding-2-on-the-beach',
  'Spider-Man 2': 'marvels-spider-man-2',
  'EA FC 26': 'ea-sports-fc-26',
  'EA FC 25': 'ea-sports-fc-25',
  'GTA 6': 'grand-theft-auto-vi',
  'GTA VI': 'grand-theft-auto-vi',
  'Borderlands 4': 'borderlands-4',
  'Ghost of Yotei': 'ghost-of-yotei',
  'Monster Hunter Wilds': 'monster-hunter-wilds',
  'Mafia The Old Country': 'mafia-the-old-country',
  'Kingdom Come Deliverance 2': 'kingdom-come-deliverance-ii',
  'Black Myth Wukong': 'black-myth-wukong',
  'Astro Bot': 'astro-bot',
  'Silent Hill 2': 'silent-hill-2',
  'Metaphor ReFantazio': 'metaphor-refantazio',
  'Like a Dragon': 'like-a-dragon-infinite-wealth',
  'Metro': 'metro-exodus',
  'Metro Exodus': 'metro-exodus',
  'Metro 2033': 'metro-2033-redux',
  'Pragmata': 'pragmata',
};

// Фильтр мусорных RSS-картинок
function isJunkImage(url) {
  if (!url) return true;
  const junk = ['avatar', 'icon', 'logo', 'thumbnail', 'profile', 'favicon', 'badge', 'emoji', 'placeholder', 'default', 'blank', 'spacer', '1x1', 'pixel'];
  const lower = url.toLowerCase();
  return junk.some(word => lower.includes(word));
}

// Извлечь название игры из заголовка новости
function extractGameName(article) {
  const title = article.site?.title || article.title || '';

  // Текст в кавычках
  const quoteMatch = title.match(/[\u00ab\u201c'"]([^\u00bb\u201d'"]+)[\u00bb\u201d'"]/);
  if (quoteMatch) return quoteMatch[1].trim();

  // До двоеточия или тире
  const colonMatch = title.match(/^([A-Za-z\u0400-\u04FF\u0451\u04010-9\s:'\-&.]+?)[\s]*[:\u2013\u2014]/);
  if (colonMatch) {
    const candidate = colonMatch[1].trim();
    if (candidate.length >= 3) return candidate;
  }

  // Английские слова в начале перед русским текстом/глаголом
  const engMatch = title.match(/^([A-Z][A-Za-z0-9'\s\-&.]{2,40}?)(?:\s+[\u0400-\u04FF]|\s*[:\u2013\u2014!?]|\s+на\s|\s+для\s|\s+получ|\s+выход|\s+убрал|\s+стал|\s+побил|\s+лиш|\s+потер)/);
  if (engMatch) return engMatch[1].trim();

  // Просто первые английские слова
  const simpleEng = title.match(/^([A-Z][A-Za-z0-9'\s\-&.]{2,30})\b/);
  if (simpleEng) return simpleEng[1].trim();

  return null;
}

// Прямой запрос по slug
async function getRAWGBySlug(slug) {
  try {
    const url = 'https://api.rawg.io/api/games/' + slug;
    const response = await axios.get(url, {
      params: { key: RAWG_API_KEY },
      timeout: 10000,
    });
    return response.data?.background_image || null;
  } catch {
    return null;
  }
}

// Поиск обложки через RAWG
async function searchRAWG(gameName) {
  if (!gameName) return null;

  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        search: gameName,
        page_size: 3,
        search_precise: true,
      },
      timeout: 10000,
    });

    const results = response.data?.results;
    if (!results || results.length === 0) return null;

    const game = results.find(g => g.background_image);
    if (!game) return null;

    // Check if this image was recently used
    if (!isImageRecentlyUsed(game.background_image)) {
      console.log('[NEWS] RAWG found: "' + game.name + '" for query "' + gameName + '", image: ' + game.background_image);
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
        console.log('[NEWS] Using RAWG screenshot instead: ' + fresh.image);
        return fresh.image;
      }
    } catch (err) {
      console.error('[NEWS] RAWG screenshots error: ' + err.message);
    }

    // No fresh screenshots — use background_image anyway (better than nothing)
    console.log('[NEWS] No fresh screenshots, using duplicate image');
    return game.background_image;
  } catch (err) {
    console.error('[NEWS] RAWG search error: ' + err.message);
    return null;
  }
}

// Скачать и ресайзить картинку
async function downloadAndResize(url, filename) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
    });
    return await resizeImage(Buffer.from(response.data), filename);
  } catch (err) {
    console.error('[NEWS] Image download failed: ' + err.message);
    return null;
  }
}

// Проверить качество картинки из источника
async function checkSourceImage(imageUrl) {
  if (!imageUrl) return null;
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
    });
    const buf = Buffer.from(response.data);
    const metadata = await sharp(buf).metadata();
    if (metadata.width >= 600) return buf;
    return null;
  } catch {
    return null;
  }
}

// Ресайз картинки в 16:9
async function resizeImage(imageBuffer, filename) {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const outputPath = path.join(IMAGES_DIR, filename);
  await sharp(imageBuffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
  return '/images/news/' + filename;
}

// Платформенная заглушка
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

  if (fs.existsSync(jpgPath)) {
    return '/images/news/fallbacks/' + name + '.jpg';
  }

  const svgPath = path.join(FALLBACK_DIR, name + '.svg');
  if (!fs.existsSync(svgPath)) {
    console.error('[NEWS] Fallback SVG not found: ' + svgPath);
    return null;
  }

  try {
    await sharp(svgPath)
      .resize(1200, 675)
      .jpeg({ quality: 90 })
      .toFile(jpgPath);
    console.log('[NEWS] Created fallback JPG: ' + name + '.jpg');
    return '/images/news/fallbacks/' + name + '.jpg';
  } catch (err) {
    console.error('[NEWS] Fallback conversion error: ' + err.message);
    return null;
  }
}

// Извлечь og:image с веб-страницы источника
async function fetchOgImage(sourceUrl) {
  if (!sourceUrl) return null;
  try {
    const response = await axios.get(sourceUrl, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ActivePlayBot/1.0)' },
      maxRedirects: 3,
    });
    const html = typeof response.data === 'string' ? response.data : '';
    // Try og:image first
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch && ogMatch[1] && !isJunkImage(ogMatch[1])) {
      console.log('[NEWS] Found og:image from source: ' + ogMatch[1]);
      return ogMatch[1];
    }
    // Try twitter:image
    const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twMatch && twMatch[1] && !isJunkImage(twMatch[1])) {
      console.log('[NEWS] Found twitter:image from source: ' + twMatch[1]);
      return twMatch[1];
    }
    return null;
  } catch (err) {
    console.error('[NEWS] og:image fetch error: ' + err.message);
    return null;
  }
}

// Построить умный поисковый запрос для изображения
function buildImageSearchQuery(article) {
  const gameName = extractGameName(article);
  const title = article.site?.title || article.title || '';

  // Для распродаж/скидок — ищем официальный баннер
  if (isSaleNews(article)) {
    const platform = article.platform || '';
    if (platform === 'playstation' || /ps\s?(store|plus|4|5)/i.test(title)) {
      // Извлекаем тип распродажи из заголовка
      const saleType = title.match(/(весенн|летн|зимн|осенн|holiday|spring|summer|winter|black friday|январск|февральск)/i);
      const saleName = saleType ? saleType[0] : '';
      return `PlayStation Store ${saleName} sale official banner 2026`.trim();
    }
    if (platform === 'xbox' || /xbox|game\s?pass/i.test(title)) {
      return 'Xbox Store sale official banner 2026';
    }
    return title.substring(0, 80) + ' official sale banner';
  }

  // Для игровых новостей — ищем по названию игры + "game"
  if (gameName) {
    // Убираем русские прилагательные-описатели (новая, следующая и т.д.)
    const cleanName = gameName
      .replace(/^(новая|новый|новое|новые|следующая|следующий|грядущая|грядущий|большой|большая)\s+/i, '')
      .trim();
    const searchName = cleanName || gameName;
    return `${searchName} video game official screenshot 2026`;
  }

  // Фоллбэк — заголовок без русских стоп-слов + game
  const cleanTitle = title
    .replace(/[\u2014\u2013:!?]/g, ' ')
    .replace(/(инсайд|слух|анонс|новост|обзор|хайп|уже|на следующ|скоро|стал|побил|получ)/gi, '')
    .replace(/ {2,}/g, ' ')
    .trim();
  return (cleanTitle.substring(0, 80) + ' game screenshot').trim();
}

// Поиск изображения через веб по ключевым словам статьи
async function searchWebImage(article, customQuery) {
  const query = customQuery || buildImageSearchQuery(article);
  console.log('[NEWS] Web image search query: "' + query + '"');

  // Try Bing Image Search (scraping — no API key needed)
  try {
    const searchUrl = 'https://www.bing.com/images/search';
    const response = await axios.get(searchUrl, {
      params: { q: query, first: 1, count: 10, qft: '+filterui:imagesize-wallpaper' },
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    const html = response.data || '';
    // Extract image URLs from murl attribute
    const matches = [...html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)];
    for (const match of matches) {
      const imgUrl = match[1];
      if (!isJunkImage(imgUrl) && !isImageRecentlyUsed(imgUrl)) {
        // Verify image is large enough
        const buf = await checkSourceImage(imgUrl);
        if (buf) {
          console.log('[NEWS] Web search found image: ' + imgUrl);
          return imgUrl;
        }
      }
    }
  } catch (err) {
    console.error('[NEWS] Web image search error: ' + err.message);
  }
  return null;
}

// Определить, является ли новость о распродаже/скидках (не о конкретной игре)
function isSaleNews(article) {
  const title = (article.site?.title || article.title || '').toLowerCase();
  const saleKeywords = ['распродаж', 'скидк', 'sale', 'deals', 'акци', 'снижен', 'ps store:', 'spring sale', 'summer sale', 'winter sale', 'holiday sale', 'black friday'];
  return saleKeywords.some(kw => title.includes(kw));
}

// Главная функция: получить картинку для новости
async function getNewsImage(article) {
  var filename = article.id + '.jpg';
  var platform = article.platform || 'general';

  // Для новостей о распродажах/скидках — приоритет на RSS картинку из источника
  // (RAWG вернёт случайную обложку игры, а нужна картинка распродажи)
  if (isSaleNews(article)) {
    console.log('[NEWS] Sale/deals news detected, prioritizing source image');

    // 1. RSS image из источника (баннер распродажи)
    if (article.image && !isJunkImage(article.image)) {
      var sourceImage = await checkSourceImage(article.image);
      if (sourceImage) {
        console.log('[NEWS] Using source image for sale news: ' + article.title);
        return await resizeImage(sourceImage, filename);
      }
    }

    // 2. og:image с сайта-источника
    var ogUrl = await fetchOgImage(article.sourceUrl || article.link);
    if (ogUrl) {
      var ogImg = await downloadAndResize(ogUrl, filename);
      if (ogImg) {
        markImageUsed(ogUrl, article.id);
        console.log('[NEWS] Using og:image for sale news: ' + article.title);
        return ogImg;
      }
    }

    // 3. Поиск баннера через веб
    var webUrl = await searchWebImage(article);
    if (webUrl) {
      var webImg = await downloadAndResize(webUrl, filename);
      if (webImg) {
        markImageUsed(webUrl, article.id);
        console.log('[NEWS] Using web search image for sale news: ' + article.title);
        return webImg;
      }
    }

    // 4. AI-генерация обложки
    var aiUrl = await generateAiCover(article, filename);
    if (aiUrl) {
      console.log('[NEWS] Using AI-generated cover for sale news: ' + article.title);
      return aiUrl;
    }

    // 5. Платформенная заглушка
    console.log('[NEWS] Using ' + platform + ' fallback for sale news: ' + article.title);
    return await getFallbackImage(platform);
  }

  // Для обычных новостей — стандартный порядок

  // 1. RAWG — обложка игры (приоритет)
  var gameName = extractGameName(article);
  if (gameName) {
    console.log('[NEWS] Searching RAWG for: "' + gameName + '"');

    var rawgUrl = null;

    // 1a. Точный slug из маппинга
    var knownSlug = KNOWN_SLUGS[gameName];
    if (knownSlug) {
      console.log('[NEWS] Using known slug: ' + knownSlug);
      rawgUrl = await getRAWGBySlug(knownSlug);
    }

    // 1b. Поиск по названию
    if (!rawgUrl) {
      rawgUrl = await searchRAWG(gameName);
    }

    if (rawgUrl) {
      var img = await downloadAndResize(rawgUrl, filename);
      if (img) {
        markImageUsed(rawgUrl, article.id);
        console.log('[NEWS] Using RAWG image for: ' + gameName);
        return img;
      }
    }
  }

  // 2. og:image с сайта-источника
  var ogUrl = await fetchOgImage(article.sourceUrl || article.link);
  if (ogUrl && !isImageRecentlyUsed(ogUrl)) {
    var ogImg = await downloadAndResize(ogUrl, filename);
    if (ogImg) {
      markImageUsed(ogUrl, article.id);
      console.log('[NEWS] Using og:image for: ' + article.title);
      return ogImg;
    }
  }

  // 3. RSS image (только если не мусор)
  if (article.image && !isJunkImage(article.image)) {
    var sourceImage = await checkSourceImage(article.image);
    if (sourceImage) {
      console.log('[NEWS] Using source image for: ' + article.title);
      return await resizeImage(sourceImage, filename);
    }
  }

  // 4. Поиск через веб по ключевым словам (умный запрос)
  var webUrl = await searchWebImage(article);
  if (webUrl) {
    var webImg = await downloadAndResize(webUrl, filename);
    if (webImg) {
      markImageUsed(webUrl, article.id);
      console.log('[NEWS] Using web search image for: ' + article.title);
      return webImg;
    }
  }

  // 4b. Вторая попытка веб-поиска с альтернативными ключевыми словами
  if (gameName) {
    var altQuery = gameName + ' game banner wallpaper';
    var altUrl = await searchWebImage(article, altQuery);
    if (altUrl) {
      var altImg = await downloadAndResize(altUrl, filename);
      if (altImg) {
        markImageUsed(altUrl, article.id);
        console.log('[NEWS] Using alt web search image for: ' + article.title);
        return altImg;
      }
    }
  }

  // 5. AI-генерация обложки (если есть OPENROUTER_API_KEY)
  var aiUrl = await generateAiCover(article, filename);
  if (aiUrl) {
    console.log('[NEWS] Using AI-generated cover for: ' + article.title);
    return aiUrl;
  }

  // 6. Платформенная заглушка (финальный fallback)
  console.log('[NEWS] Using ' + platform + ' fallback for: ' + article.title);
  return await getFallbackImage(platform);
}

// AI-генерация обложки через OpenRouter (Flux)
async function generateAiCover(article, filename) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const gameName = extractGameName(article);
  const title = article.site?.title || article.title || '';

  // Составляем промпт для генерации
  let imagePrompt;
  if (isSaleNews(article)) {
    const platform = article.platform || 'playstation';
    imagePrompt = `A sleek promotional banner for a ${platform} gaming store sale. Dark blue and cyan color scheme. Text "SALE" with glowing neon effect. Gaming controllers and digital discount tags floating. Modern, premium, minimalist design. 16:9 aspect ratio, high quality.`;
  } else if (gameName) {
    imagePrompt = `A cinematic key art for the video game "${gameName}". Epic, dramatic scene from the game. Dark atmospheric lighting. AAA game quality. 16:9 aspect ratio, photorealistic, highly detailed.`;
  } else {
    imagePrompt = `A cinematic gaming news banner for: "${title}". Dark atmospheric design with gaming elements. Neon accents on dark background. Modern, premium feel. 16:9 aspect ratio, high quality.`;
  }

  console.log('[NEWS] Generating AI cover with prompt: ' + imagePrompt.substring(0, 100) + '...');

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/images/generations', {
      model: 'flux/schnell',
      prompt: imagePrompt,
      n: 1,
      size: '1024x576',
    }, {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });

    const imageUrl = response.data?.data?.[0]?.url;
    if (!imageUrl) {
      console.log('[NEWS] AI image generation returned no URL');
      return null;
    }

    const result = await downloadAndResize(imageUrl, filename);
    if (result) {
      markImageUsed('ai-generated:' + article.id, article.id);
    }
    return result;
  } catch (err) {
    console.error('[NEWS] AI image generation error: ' + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
    return null;
  }
}

module.exports = { getNewsImage, checkSourceImage, searchRAWG, resizeImage, extractGameName, isJunkImage, getFallbackImage, fetchOgImage, searchWebImage, generateAiCover };
