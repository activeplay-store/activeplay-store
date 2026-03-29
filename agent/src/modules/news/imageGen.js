const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '../../../../public/images/news');
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 675;

// Проверить качество картинки из источника
async function checkSourceImage(imageUrl) {
  if (!imageUrl) return null;
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
    });
    const metadata = await sharp(Buffer.from(response.data)).metadata();
    if (metadata.width >= 600) {
      return Buffer.from(response.data);
    }
    return null; // Слишком маленькая
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

// Генерация через Gemini Imagen
async function generateImage(title) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const prompt = `Generate an image: Gaming news cover image, 16:9 aspect ratio, high quality, cinematic lighting, professional gaming media style, NO TEXT on image: ${title}. Combine visual elements from the topic.`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`;

  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    }, { timeout: 60000 });

    const parts = response.data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
    if (!imagePart) {
      console.error('[NEWS] Gemini: no image in response');
      return null;
    }

    return Buffer.from(imagePart.inlineData.data, 'base64');
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error('[NEWS] Gemini image error:', msg);
    return null;
  }
}

// Поиск обложки игры через RAWG API
const RAWG_KEY = process.env.RAWG_API_KEY || 'd9ca3380009e448e8fb356b3837cafa2';

async function searchRawgImage(title) {
  if (!title) return null;
  try {
    const gameMatch = title.match(/[A-Z][A-Za-z0-9':&\- ]{2,}/);
    const query = gameMatch ? gameMatch[0].trim() : title.substring(0, 40);

    const response = await axios.get('https://api.rawg.io/api/games', {
      params: { key: RAWG_KEY, search: query, page_size: 1 },
      timeout: 10000,
    });

    const game = response.data?.results?.[0];
    if (game?.background_image) {
      console.log(`[NEWS] RAWG found: ${game.name} → ${game.background_image}`);
      const imgResponse = await axios.get(game.background_image, {
        responseType: 'arraybuffer',
        timeout: 10000,
      });
      return Buffer.from(imgResponse.data);
    }
    return null;
  } catch (err) {
    console.error(`[NEWS] RAWG error: ${err.message}`);
    return null;
  }
}

// Поиск картинки через Steam CDN
async function searchSteamImage(title) {
  if (!title) return null;
  try {
    // Извлечь название игры для поиска
    const gameName = title.replace(/^(Новость|Анонс|Обзор|Слух|Инсайд|Хайп)\s*[:—–\-]\s*/i, '').trim();
    // Поиск через Steam store search API
    const response = await axios.get('https://store.steampowered.com/api/storesearch/', {
      params: { term: gameName, l: 'english', cc: 'US' },
      timeout: 10000,
      headers: { 'User-Agent': 'ActivePlay News Bot 1.0' },
    });

    const app = response.data?.items?.[0];
    if (!app?.id) return null;

    // Steam header image (460x215, но лучше чем ничего)
    const steamUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${app.id}/header.jpg`;
    console.log(`[NEWS] Steam found: ${app.name} (${app.id})`);

    const imgResponse = await axios.get(steamUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    return Buffer.from(imgResponse.data);
  } catch (err) {
    console.error(`[NEWS] Steam image error: ${err.message}`);
    return null;
  }
}

// Дефолтная картинка-заглушка
const DEFAULT_IMAGE = path.join(IMAGES_DIR, 'default-news.jpg');

async function ensureDefaultImage() {
  if (fs.existsSync(DEFAULT_IMAGE)) return;
  // Создать простую заглушку через sharp
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  await sharp({
    create: {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      channels: 3,
      background: { r: 15, g: 23, b: 42 },
    },
  })
    .jpeg({ quality: 85 })
    .toFile(DEFAULT_IMAGE);
  console.log('[NEWS] Created default news image');
}

// Главная функция: получить картинку для новости
async function getNewsImage(article) {
  const filename = `${article.id}.jpg`;

  // 1. Попробовать оригинал из RSS
  const sourceImage = await checkSourceImage(article.image);
  if (sourceImage) {
    console.log(`[NEWS] Using source image for: ${article.title}`);
    return await resizeImage(sourceImage, filename);
  }

  // 2. Поиск обложки игры через RAWG
  console.log(`[NEWS] Trying RAWG for: ${article.site?.title || article.title}`);
  const rawgImage = await searchRawgImage(article.site?.title || article.title);
  if (rawgImage) {
    return await resizeImage(rawgImage, filename);
  }

  // 3. Steam CDN
  console.log(`[NEWS] Trying Steam for: ${article.site?.title || article.title}`);
  const steamImage = await searchSteamImage(article.site?.title || article.title);
  if (steamImage) {
    return await resizeImage(steamImage, filename);
  }

  // 4. Генерить через Gemini Imagen
  console.log(`[NEWS] Generating Gemini image for: ${article.site?.title || article.title}`);
  const generated = await generateImage(article.site?.title || article.title);
  if (generated) {
    return await resizeImage(generated, filename);
  }

  // 5. Дефолтная заглушка
  console.warn(`[NEWS] Using default image for: ${article.title}`);
  await ensureDefaultImage();
  const defaultBuf = fs.readFileSync(DEFAULT_IMAGE);
  return await resizeImage(defaultBuf, filename);
}

module.exports = { getNewsImage, checkSourceImage, generateImage, searchRawgImage, searchSteamImage, resizeImage };
