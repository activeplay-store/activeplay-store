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

// Главная функция: получить картинку для новости
async function getNewsImage(article) {
  const filename = `${article.id}.jpg`;

  // 1. Попробовать оригинал из RSS
  const sourceImage = await checkSourceImage(article.image);
  if (sourceImage) {
    console.log(`[NEWS] Using source image for: ${article.title}`);
    return await resizeImage(sourceImage, filename);
  }

  // 2. Поиск обложки игры через RAWG (лучший вариант для игровых новостей)
  console.log(`[NEWS] Trying RAWG for: ${article.site?.title || article.title}`);
  const rawgImage = await searchRawgImage(article.site?.title || article.title);
  if (rawgImage) {
    return await resizeImage(rawgImage, filename);
  }

  // 3. Генерить через Gemini Imagen (может быть недоступен по геолокации)
  console.log(`[NEWS] Generating Gemini image for: ${article.site?.title || article.title}`);
  const generated = await generateImage(article.site?.title || article.title);
  if (generated) {
    return await resizeImage(generated, filename);
  }

  // 4. Ничего не нашли
  console.error(`[NEWS] No image for: ${article.title}`);
  return null;
}

module.exports = { getNewsImage, checkSourceImage, generateImage, searchRawgImage, resizeImage };
