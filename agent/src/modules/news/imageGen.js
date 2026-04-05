const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '../../../../public/images/news');
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 675;
const RAWG_API_KEY = 'd9ca3380009e448e8fb356b3837cafa2';

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
};

// Извлечь название игры из заголовка новости
function extractGameName(article) {
  const title = article.site?.title || article.title || '';

  // Текст в кавычках
  const quoteMatch = title.match(/[«"']([^»"']+)[»"']/);
  if (quoteMatch) return quoteMatch[1].trim();

  // До двоеточия или тире
  const colonMatch = title.match(/^([A-Za-zА-Яа-яёЁ0-9\s:'\-&.]+?)[\s]*[:\–\—]/);
  if (colonMatch) {
    const candidate = colonMatch[1].trim();
    if (candidate.length >= 3) return candidate;
  }

  // Английские слова в начале (название игры) перед русским текстом/глаголом
  const engMatch = title.match(/^([A-Z][A-Za-z0-9'\s\-&.]{2,40}?)(?:\s+[\u0400-\u04FF]|\s*[:\–\—!?]|\s+на\s|\s+для\s|\s+получ|\s+выход|\s+убрал|\s+стал|\s+побил|\s+лиш|\s+потер)/);
  if (engMatch) return engMatch[1].trim();

  // Просто первые английские слова
  const simpleEng = title.match(/^([A-Z][A-Za-z0-9'\s\-&.]{2,30})\b/);
  if (simpleEng) return simpleEng[1].trim();

  return null;
}

// Прямой запрос по slug
async function getRAWGBySlug(slug) {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${slug}`, {
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

    console.log(`[NEWS] RAWG found: "${game.name}" for query "${gameName}", image: ${game.background_image}`);
    return game.background_image;
  } catch (err) {
    console.error(`[NEWS] RAWG search error: ${err.message}`);
    return null;
  }
}

// Скачать картинку по URL
async function downloadImage(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
  });
  return Buffer.from(response.data);
}

// Проверить качество картинки из источника
async function checkSourceImage(imageUrl) {
  if (!imageUrl) return null;
  try {
    const buf = await downloadImage(imageUrl);
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
  return `/images/news/${filename}`;
}

// Главная функция: получить картинку для новости
async function getNewsImage(article) {
  const filename = `${article.id}.jpg`;

  // 1. RAWG — обложка игры (приоритет)
  const gameName = extractGameName(article);
  if (gameName) {
    console.log(`[NEWS] Searching RAWG for: "${gameName}"`);

    let rawgUrl = null;

    // 1a. Точный slug из маппинга
    const knownSlug = KNOWN_SLUGS[gameName];
    if (knownSlug) {
      console.log(`[NEWS] Using known slug: ${knownSlug}`);
      rawgUrl = await getRAWGBySlug(knownSlug);
    }

    // 1b. Поиск по названию
    if (!rawgUrl) {
      rawgUrl = await searchRAWG(gameName);
    }

    if (rawgUrl) {
      try {
        const buf = await downloadImage(rawgUrl);
        const resized = await resizeImage(buf, filename);
        console.log(`[NEWS] Using RAWG image for: ${gameName}`);
        return resized;
      } catch (err) {
        console.error(`[NEWS] RAWG image download failed: ${err.message}`);
      }
    }
  }

  // 2. Source image из RSS (fallback)
  const sourceImage = await checkSourceImage(article.image);
  if (sourceImage) {
    console.log(`[NEWS] Using source image for: ${article.title}`);
    return await resizeImage(sourceImage, filename);
  }

  // 3. Null — без картинки
  console.log(`[NEWS] No image found for: ${article.title}`);
  return null;
}

module.exports = { getNewsImage, checkSourceImage, searchRAWG, resizeImage, extractGameName };
