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

// Генерация через DALL-E 3
async function generateImage(title, description) {
  const prompt = `Gaming news illustration, 16:9 format, modern digital art style: ${title}. ${(description || '').substring(0, 200)}. Professional gaming media style, no text on image, vibrant colors.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024', // Ближайший к 16:9 у DALL-E
      quality: 'standard',
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });

    const imageUrl = response.data?.data?.[0]?.url;
    if (!imageUrl) return null;

    // Скачать сгенерированное изображение
    const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 30000 });
    return Buffer.from(imgResponse.data);
  } catch (err) {
    console.error('[NEWS] DALL-E error:', err.message);
    return null;
  }
}

// Главная функция: получить картинку для новости
async function getNewsImage(article) {
  const filename = `${article.id}.jpg`;

  // 1. Попробовать оригинал
  const sourceImage = await checkSourceImage(article.image);
  if (sourceImage) {
    console.log(`[NEWS] Using source image for: ${article.title}`);
    return await resizeImage(sourceImage, filename);
  }

  // 2. Генерить через DALL-E
  console.log(`[NEWS] Generating DALL-E image for: ${article.title}`);
  const generated = await generateImage(
    article.site?.title || article.title,
    article.site?.text || article.description
  );
  if (generated) {
    return await resizeImage(generated, filename);
  }

  // 3. Fallback — null (но стараемся не допускать)
  console.error(`[NEWS] No image for: ${article.title}`);
  return null;
}

module.exports = { getNewsImage, checkSourceImage, generateImage, resizeImage };
