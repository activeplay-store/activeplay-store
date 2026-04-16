const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { queueDeploy } = require('../utils/deployQueue');

const SITE_ROOT = process.env.SITE_ROOT || '/var/www/activeplay-store';
const NEWS_JSON = path.join(SITE_ROOT, 'src/data/news.json');
const NEWS_ARCHIVE = path.join(__dirname, '../../../data/news-archive.json');
const CHANNEL_ID = '@PS_PLUS_RUS';

async function publishToTelegram(bot, article) {
  const tg = article.telegram || {};
  const text = `📰 *${tg.title || article.title}*\n\n${tg.text || article.text}`;

  try {
    if (article.imageUrl && article.imageUrl.startsWith('http')) {
      await bot.telegram.sendPhoto(CHANNEL_ID, article.imageUrl, {
        caption: text, parse_mode: 'Markdown',
      });
    } else if (article.imageUrl) {
      // Локальный файл — отправить как Buffer
      const imgPath = path.join(SITE_ROOT, 'public', article.imageUrl);
      if (fs.existsSync(imgPath)) {
        await bot.telegram.sendPhoto(CHANNEL_ID, { source: imgPath }, {
          caption: text, parse_mode: 'Markdown',
        });
      } else {
        await bot.telegram.sendMessage(CHANNEL_ID, text, { parse_mode: 'Markdown' });
      }
    } else {
      await bot.telegram.sendMessage(CHANNEL_ID, text, { parse_mode: 'Markdown' });
    }
    console.log(`[NEWS] Published to TG: ${tg.title || article.title}`);
  } catch (err) {
    console.error(`[NEWS] TG error: ${err.message}`);
  }
}

async function publishToVK(article) {
  const VK_TOKEN = process.env.VK_ACCESS_TOKEN;
  const VK_GROUP_ID = process.env.VK_GROUP_ID;
  if (!VK_TOKEN || !VK_GROUP_ID) {
    console.error('[NEWS] VK publish skipped: VK_ACCESS_TOKEN or VK_GROUP_ID not set');
    return;
  }

  const vk = article.vk || {};
  const title = vk.title || article.site?.title || article.title || '';
  const rawText = vk.text || article.site?.text || article.text || '';
  const text = rawText.replace(/\\u20BD/g, '\u20bd');
  const tags = (article.site?.tags || article.tags || []).map(t => `#${t.replace(/\s+/g, '_')}`).join(' ');
  const articleUrl = article.slug ? `https://activeplay.games/news/${article.slug}` : 'https://activeplay.games';

  const message = `\ud83d\udcf0 ${title}\n\n${text}\n\n${tags}\n\n\ud83d\udd17 \u0427\u0438\u0442\u0430\u0442\u044c \u043d\u0430 \u0441\u0430\u0439\u0442\u0435: ${articleUrl}`;

  try {
    // Upload image to VK if available
    let attachment = '';
    const imageUrl = article.imageUrl || article.coverUrl || '';
    if (imageUrl) {
      try {
        attachment = await uploadPhotoToVK(imageUrl, VK_TOKEN, VK_GROUP_ID);
      } catch (imgErr) {
        console.error('[NEWS] VK image upload failed:', imgErr.message);
      }
    }

    const params = new URLSearchParams({
      owner_id: `-${VK_GROUP_ID}`,
      from_group: '1',
      message,
      v: '5.199',
      access_token: VK_TOKEN,
    });
    if (attachment) params.set('attachments', attachment);

    const res = await fetch(`https://api.vk.com/method/wall.post?${params.toString()}`, {
      method: 'POST',
    });
    const data = await res.json();

    if (data.error) {
      console.error(`[NEWS] VK error: ${data.error.error_msg}`);
    } else {
      console.log(`[NEWS] Published to VK: post_id=${data.response?.post_id}, title="${title}", image=${!!attachment}`);
    }
  } catch (err) {
    console.error(`[NEWS] VK error: ${err.message}`);
  }
}

// Upload photo to VK wall
async function uploadPhotoToVK(imageUrl, token, groupId) {
  const FormData = require('form-data');

  // Resolve image URL (may be relative path)
  let imageBuffer;
  if (imageUrl.startsWith('/')) {
    const localPath = path.join(__dirname, '../../../../public', imageUrl);
    imageBuffer = fs.readFileSync(localPath);
  } else {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 });
    imageBuffer = Buffer.from(response.data);
  }

  // 1. Get upload URL
  const uploadUrlRes = await fetch(
    `https://api.vk.com/method/photos.getWallUploadServer?group_id=${groupId}&v=5.199&access_token=${token}`
  );
  const uploadUrlData = await uploadUrlRes.json();
  if (uploadUrlData.error) throw new Error('getWallUploadServer: ' + uploadUrlData.error.error_msg);
  const uploadUrl = uploadUrlData.response.upload_url;

  // 2. Upload photo
  const form = new FormData();
  form.append('photo', imageBuffer, { filename: 'cover.jpg', contentType: 'image/jpeg' });

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
  });
  const uploadResult = await uploadRes.json();
  if (!uploadResult.photo || uploadResult.photo === '[]') throw new Error('Photo upload returned empty');

  // 3. Save photo
  const saveRes = await fetch(
    `https://api.vk.com/method/photos.saveWallPhoto?group_id=${groupId}&photo=${encodeURIComponent(uploadResult.photo)}&server=${uploadResult.server}&hash=${uploadResult.hash}&v=5.199&access_token=${token}`
  );
  const saveData = await saveRes.json();
  if (saveData.error) throw new Error('saveWallPhoto: ' + saveData.error.error_msg);

  const photo = saveData.response?.[0];
  if (!photo) throw new Error('No photo in saveWallPhoto response');

  console.log(`[NEWS] VK photo uploaded: photo${photo.owner_id}_${photo.id}`);
  return `photo${photo.owner_id}_${photo.id}`;
}

// Маппинг категорий переводчика → NewsCategory для сайта
const CATEGORY_MAP = {
  'Новость': 'news', 'Новости': 'news', 'Анонс': 'announcement', 'Обзор': 'review',
  'Слух': 'rumor', 'Слухи': 'rumor', 'Скидки': 'news', 'Гайд': 'guide',
  'Видео': 'video', 'Интервью': 'interview',
  'Хайп': 'hype', 'Инсайд': 'insider', 'Утечка': 'insider',
};

// Убрать категорию из начала заголовка (например "Инсайд: Title" → "Title")
const CATEGORY_PREFIX_RE = /^(Новость|Анонс|Обзор|Слух|Скидки|Гайд|Видео|Интервью|Инсайд|Хайп|Утечка|Rumor|News|Hype)\s*[:—–\-]\s*/i;
function stripCategoryPrefix(title) {
  return (title || '').replace(CATEGORY_PREFIX_RE, '');
}

// Поиск цены игры в games.json для автоматического CTA
const GAMES_FILE = path.join(__dirname, '../../../data/games.json');
const DLC_RE = /\b(dlc|дополнение|expansion|season pass|сезонный абонемент)\b/i;

function findGamePrice(title, content) {
  try {
    const data = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf-8'));
    const games = data.games || [];
    const text = (title + ' ' + content).toLowerCase();
    const isDlc = DLC_RE.test(text);

    for (const game of games) {
      const name = game.name?.toLowerCase();
      if (!name) continue;
      // Точное вхождение названия или первых 3 слов
      const shortName = name.split(' ').slice(0, 3).join(' ');
      if (text.includes(name) || text.includes(shortName)) {
        const tr = game.prices?.TR?.editions?.[0];
        if (tr && tr.clientPrice) {
          return {
            name: game.name,
            priceTRY: tr.basePrice || tr.salePrice,
            priceRUB: tr.clientPrice,
            salePriceRUB: tr.clientSalePrice || null,
            hasSale: !!tr.salePrice && tr.salePrice < tr.basePrice,
          };
        }
      }
    }

    // Для DLC — попробовать найти базовую игру (без суффикса DLC)
    if (isDlc) {
      const cleaned = text
        .replace(/dlc|дополнение|expansion|season pass|сезонный абонемент/gi, '')
        .replace(/\s+/g, ' ').trim();
      for (const game of games) {
        const name = game.name?.toLowerCase();
        if (!name) continue;
        if (cleaned.includes(name)) {
          const tr = game.prices?.TR?.editions?.[0];
          if (tr && tr.clientPrice) {
            return {
              name: game.name,
              priceTRY: tr.basePrice || tr.salePrice,
              priceRUB: tr.clientPrice,
              salePriceRUB: tr.clientSalePrice || null,
              hasSale: !!tr.salePrice && tr.salePrice < tr.basePrice,
            };
          }
        }
      }
    }

    return null;
  } catch { return null; }
}

// CTA — JSON-объекты для фронта
function buildCtaData(gamePrice) {
  if (!gamePrice) return null;
  const price = gamePrice.hasSale ? gamePrice.salePriceRUB : gamePrice.priceRUB;
  return {
    gameId: gamePrice.gameId || undefined,
    title: `Купить ${gamePrice.name}`,
    description: 'Активация за 5 минут. Турецкий PS Store.',
    price: price,
    oldPrice: gamePrice.hasSale ? gamePrice.priceRUB : undefined,
    url: '/sale',
    buttonText: `Купить за ${price} ₽ →`,
  };
}

const PRODUCT_CTA_MAP = {
  'ps-plus-essential': { title: 'PS Plus Essential', description: 'Бесплатные игры каждый месяц', url: '/ps-plus-essential', buttonText: 'Подробнее →' },
  'ps-plus-extra': { title: 'PS Plus Extra', description: 'Каталог из 400+ игр', url: '/ps-plus-extra', buttonText: 'Подробнее →' },
  'ps-plus-deluxe': { title: 'PS Plus Deluxe', description: 'Каталог + классика + пробные версии', url: '/ps-plus-deluxe', buttonText: 'Подробнее →' },
  'xbox-game-pass': { title: 'Xbox Game Pass', description: 'Сотни игр по подписке', url: '/xbox-game-pass-ultimate', buttonText: 'Подробнее →' },
  'ea-play': { title: 'EA Play', description: 'Все игры EA по подписке', url: '/ea-play', buttonText: 'Подробнее →' },
};

function buildProductCta(relatedProduct) {
  if (!relatedProduct || !PRODUCT_CTA_MAP[relatedProduct]) return null;
  return PRODUCT_CTA_MAP[relatedProduct];
}

// Валидация: чистый текст, без HTML
function validateNewsEntry(entry) {
  if (/<[a-z][\s\S]*>/i.test(entry.content || '')) {
    throw new Error(`HTML в content у "${entry.title}"! Запись отменена.`);
  }
  if ((entry.content || '').length < 100) {
    throw new Error(`Текст слишком короткий: ${(entry.content || '').length} знаков — ${entry.id}`);
  }
  if (!entry.id || !entry.title || !entry.content) {
    throw new Error(`Отсутствуют обязательные поля — ${entry.id}`);
  }
  return true;
}

// Backup news.json
const BACKUP_DIR = path.join(__dirname, '../../../data/news-backups');

function backupNewsJson() {
  try {
    if (!fs.existsSync(NEWS_JSON)) return;
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `news-${timestamp}.json`);
    fs.copyFileSync(NEWS_JSON, backupPath);
    console.log(`[NEWS] Backup: ${backupPath}`);

    const backups = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort();
    while (backups.length > 20) {
      fs.unlinkSync(path.join(BACKUP_DIR, backups.shift()));
    }
  } catch (err) {
    console.error(`[NEWS] Backup error: ${err.message}`);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[ёЁ]/g, 'е')
    .replace(/[а-яА-Я]/g, c => {
      const ru = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
      const en = ['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','shch','','y','','e','yu','ya'];
      const idx = ru.indexOf(c.toLowerCase());
      return idx >= 0 ? en[idx] : c;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

// Очистить текст от HTML
function stripHtml(text) {
  return (text || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function ensureUniqueSlug(slug, existingArticles) {
  let finalSlug = slug;
  let counter = 1;
  while (existingArticles.some(a => a.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  return finalSlug;
}

function isValidImageUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol)
      && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(parsed.pathname);
  } catch { return false; }
}

function writeToSite(newArticles) {
  // 1. BACKUP
  backupNewsJson();

  // 2. Прочитать текущие новости
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(NEWS_JSON, 'utf-8'));
  } catch (e) {
    console.error('[NEWS] Не удалось прочитать news.json, начинаем с пустого:', e.message);
  }

  // 3. Подготовить новые записи
  const prepared = newArticles.map(a => {
    const cleanTitle = stripCategoryPrefix(a.site?.title || a.title);
    const bodyText = stripHtml(a.site?.text || a.text || a.content || '');

    // CTA
    let cta = a.cta || null;
    let cta2 = a.cta2 || null;

    if (!cta) {
      const gamePrice = findGamePrice(cleanTitle, bodyText);
      if (gamePrice) {
        cta = buildCtaData(gamePrice);
        console.log(`[NEWS] Auto CTA: ${gamePrice.name} — ${gamePrice.priceRUB} ₽`);
      }
    }
    if (!cta2 && a.relatedProduct) {
      cta2 = buildProductCta(a.relatedProduct);
    }

    const baseSlug = a.slug || slugify(cleanTitle);
    const entry = {
      id: baseSlug,
      slug: baseSlug,
      title: cleanTitle,
      content: bodyText,
      metaDescription: a.site?.metaDescription || a.metaDescription || '',
      coverUrl: a.imageUrl || a.image || '',
      tags: a.site?.tags || a.tags || [],
      category: CATEGORY_MAP[a.category] || (['news','hype','insider','rumor','video','guide','interview','podcast','review','announcement'].includes(a.category) ? a.category : 'news'),
      source: a.sourceName || a.source || '',
      sourceUrl: a.link || a.sourceUrl || '',
      publishedAt: a.publishedAt || new Date().toISOString(),
      gameId: a.gameSlug || a.gameId || null,
      relatedProduct: a.relatedProduct || null,
      platform: a.platform || 'general',
      ctaType: a.ctaType || 'deals',
      ctaText: a.ctaText || 'Скидки на игры',
      ctaLink: a.ctaLink || '/sale',
      cta: cta,
      cta2: cta2,
    };

    // Валидация
    validateNewsEntry(entry);
    return entry;
  });

  // 4. Дедупликация coverUrl — каждая статья должна иметь уникальную обложку
  const usedCovers = new Set(existing.map(n => n.coverUrl).filter(Boolean));
  for (const article of prepared) {
    if (article.coverUrl && usedCovers.has(article.coverUrl)) {
      console.warn('[NEWS] WARNING: duplicate coverUrl detected for "' + article.title + '": ' + article.coverUrl);
      // Не блокируем, но логируем — в будущем можно перегенерировать
    }
    if (article.coverUrl) usedCovers.add(article.coverUrl);
  }

  // 5. Дедупликация и слияние (ensure unique slugs)
  const existingIds = new Set(existing.map(n => n.id));
  const toAdd = prepared.filter(a => !existingIds.has(a.id));
  for (const article of toAdd) {
    article.slug = ensureUniqueSlug(article.slug, existing);
    article.id = article.slug;
  }
  const merged = [...toAdd, ...existing].slice(0, 50);
  console.log(`[NEWS] Trimmed: ${toAdd.length + existing.length} → ${merged.length}`);

  // 5. Записать JSON
  fs.writeFileSync(NEWS_JSON, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`[NEWS] Записано в news.json: ${toAdd.length} новых, ${merged.length} всего`);

  // 6. Обновить архив
  try {
    let archive = [];
    try { archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, 'utf-8')); } catch {}
    const archiveIds = new Set(archive.map(a => a.id));
    const newForArchive = toAdd.filter(a => !archiveIds.has(a.id));
    archive = [...newForArchive, ...archive].slice(0, 100);
    fs.writeFileSync(NEWS_ARCHIVE, JSON.stringify(archive, null, 2));
  } catch (err) {
    console.error('[NEWS] Archive update error:', err.message);
  }
}

function deployToSite() {
  try {
    const imagesDir = path.join(SITE_ROOT, 'public/images/news');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const files = ['src/data/news.json'];
    const hasImages = fs.existsSync(imagesDir) && fs.readdirSync(imagesDir).length > 0;
    if (hasImages) {
      files.push('public/images/news/');
    }

    queueDeploy(files);
    console.log('[NEWS] Queued for deploy');
  } catch (err) {
    console.error(`[NEWS] Deploy error: ${err.message}`);
  }
}

module.exports = { publishToTelegram, publishToVK, writeToSite, deployToSite, validateNewsEntry, buildCtaData, buildProductCta, findGamePrice, slugify, stripHtml, CATEGORY_MAP, stripCategoryPrefix };
