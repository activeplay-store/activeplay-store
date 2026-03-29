const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE_ROOT = process.env.SITE_ROOT || '/var/www/activeplay-store';
const SITE_DATA = path.join(SITE_ROOT, 'src/data');
const NEWS_FILE = path.join(SITE_DATA, 'news.ts');
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
  const VK_GROUP_ID = process.env.VK_GROUP_ID; // числовой ID группы (без минуса)
  if (!VK_TOKEN || !VK_GROUP_ID) {
    console.error('[NEWS] VK publish skipped: VK_ACCESS_TOKEN or VK_GROUP_ID not set');
    return;
  }

  const vk = article.vk || {};
  const title = vk.title || article.site?.title || article.title || '';
  const rawText = vk.text || article.site?.text || article.text || '';
  // Clean text for VK: convert unicode escapes to actual symbols
  const text = rawText.replace(/\\u20BD/g, '\u20BD');
  const tags = (article.site?.tags || article.tags || []).map(t => `#${t.replace(/\s+/g, '_')}`).join(' ');
  const articleUrl = article.slug ? `https://activeplay.games/news/${article.slug}` : 'https://activeplay.games';
  const message = `📰 ${title}\n\n${text}\n\n${tags}\n\n🔗 Читать на сайте: ${articleUrl}`;

  try {
    const params = new URLSearchParams({
      owner_id: `-${VK_GROUP_ID}`,
      from_group: '1',
      message,
      v: '5.199',
      access_token: VK_TOKEN,
    });

    const res = await fetch(`https://api.vk.com/method/wall.post?${params.toString()}`, {
      method: 'POST',
    });
    const data = await res.json();

    if (data.error) {
      console.error(`[NEWS] VK error: ${data.error.error_msg}`);
    } else {
      console.log(`[NEWS] Published to VK: post_id=${data.response?.post_id}, title="${title}"`);
    }
  } catch (err) {
    console.error(`[NEWS] VK error: ${err.message}`);
  }
}

// Маппинг категорий переводчика → NewsCategory для сайта
const CATEGORY_MAP = {
  'Новость': 'news', 'Анонс': 'announcement', 'Обзор': 'review',
  'Слух': 'rumor', 'Скидки': 'news', 'Гайд': 'guide',
  'Видео': 'video', 'Интервью': 'interview',
  'Хайп': 'hype', 'Инсайд': 'insider',
};

// Убрать категорию из начала заголовка (например "Инсайд: Title" → "Title")
const CATEGORY_PREFIX_RE = /^(Новость|Анонс|Обзор|Слух|Скидки|Гайд|Видео|Интервью|Инсайд|Хайп|Утечка|Rumor|News|Hype)\s*[:—–\-]\s*/i;
function stripCategoryPrefix(title) {
  return (title || '').replace(CATEGORY_PREFIX_RE, '');
}

// Автоссылки на продукты (только первое вхождение каждого)
const PRODUCT_LINKS = {
  'PS Plus Essential': '/ps-plus-essential',
  'PS Plus Extra': '/ps-plus-extra',
  'PS Plus Deluxe': '/ps-plus-deluxe',
  'Xbox Game Pass': '/xbox-game-pass-ultimate',
  'EA Play': '/ea-play',
  'PS Store': '/sale',
};

function addProductLinks(html) {
  const used = new Set();
  let result = html;
  for (const [keyword, url] of Object.entries(PRODUCT_LINKS)) {
    if (!used.has(keyword) && result.includes(keyword)) {
      // Не заменять внутри уже существующих тегов <a>
      const re = new RegExp(`(?![^<]*<\\/a>)${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, '');
      result = result.replace(re, `<a href="${url}" class="text-[#00D4FF] hover:underline">${keyword}</a>`);
      used.add(keyword);
    }
  }
  return result;
}

// Разбить текст на абзацы по 2-3 предложения (макс 3 абзаца)
function textToHtml(text) {
  if (!text) return '';
  // Если уже HTML — вернуть как есть
  if (text.trim().startsWith('<p>')) return text;
  // Разбиваем по переносам строк (если переводчик сам разбил на абзацы)
  let paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length <= 1) {
    // Один блок текста — разбить по предложениям, группировать по 2-3
    const sentences = text.split(/(?<=\.)\s+/).filter(s => s.trim());
    paragraphs = [];
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(' '));
    }
  }
  // Максимум 4 абзаца
  return paragraphs.slice(0, 4).map(p => `<p>${p.trim()}</p>`).join('\n');
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

// CTA теперь — JSON-объекты, а не HTML. Фронт рендерит сам.
function buildCtaData(gamePrice) {
  if (!gamePrice) return null;
  const price = gamePrice.hasSale ? gamePrice.salePriceRUB : gamePrice.priceRUB;
  return {
    gameId: gamePrice.gameId || undefined,
    title: `Купить ${gamePrice.name}`,
    subtitle: 'Активация за 5 минут. Турецкий PS Store.',
    price: `${price} ₽`,
    oldPrice: gamePrice.hasSale ? `${gamePrice.priceRUB} ₽` : undefined,
    link: '/sale',
    productLink: '/sale',
  };
}

// Продуктовый CTA (подписки)
const PRODUCT_CTA_MAP = {
  'ps-plus-essential': { title: 'PS Plus Essential', link: '/ps-plus-essential', subtitle: 'Бесплатные игры каждый месяц', price: 'от 1200 ₽' },
  'ps-plus-extra': { title: 'PS Plus Extra', link: '/ps-plus-extra', subtitle: 'Каталог из 400+ игр', price: 'от 2400 ₽' },
  'ps-plus-deluxe': { title: 'PS Plus Deluxe', link: '/ps-plus-deluxe', subtitle: 'Каталог + классика + пробные версии', price: 'от 2900 ₽' },
  'xbox-game-pass': { title: 'Xbox Game Pass', link: '/xbox-game-pass-ultimate', subtitle: 'Сотни игр по подписке', price: 'от 800 ₽' },
  'ea-play': { title: 'EA Play', link: '/ea-play', subtitle: 'Все игры EA по подписке', price: 'от 600 ₽' },
};

function buildProductCta(relatedProduct) {
  if (!relatedProduct || !PRODUCT_CTA_MAP[relatedProduct]) return null;
  return PRODUCT_CTA_MAP[relatedProduct];
}

// Валидация записи перед записью в news.ts
function validateNewsEntry(entry) {
  // Проверяем content (HTML), а не text (сырой). Допускаем <p>, <a>, но не <div>, <script> и т.д.
  const dangerousHtml = /<(?!\/?(p|a|br|strong|em|ul|ol|li)\b)[a-z][\s\S]*?>/i;
  if (entry.content && dangerousHtml.test(entry.content)) {
    throw new Error(`Опасный HTML в контенте новости: ${entry.id}`);
  }
  const rawText = (entry.content || '').replace(/<[^>]+>/g, '');
  if (rawText.length < 300) {
    throw new Error(`Текст слишком короткий: ${rawText.length} знаков (мин. 300) — ${entry.id}`);
  }
  if (!entry.title || entry.title.length > 120) {
    throw new Error(`Проблема с заголовком: "${entry.title}" — ${entry.id}`);
  }
  if (!entry.id || !entry.slug || !entry.category) {
    throw new Error(`Отсутствуют обязательные поля — ${entry.id}`);
  }
  return true;
}

// Backup news.ts перед записью
const BACKUP_DIR = path.join(__dirname, '../../../data/news-backups');

function backupNewsFile() {
  try {
    if (!fs.existsSync(NEWS_FILE)) return;
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `news-${timestamp}.ts`);
    fs.copyFileSync(NEWS_FILE, backupPath);
    console.log(`[NEWS] Backup: ${backupPath}`);

    // Хранить максимум 20 бэкапов
    const backups = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.ts')).sort();
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
      const map = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
      const lat = 'abvgdezhziyklmnoprstufhcchshshchyeyuya'.match(/.{1,2}/g) || [];
      // Simple transliteration
      const ru = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
      const en = ['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','shch','','y','','e','yu','ya'];
      const idx = ru.indexOf(c.toLowerCase());
      return idx >= 0 ? en[idx] : c;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function writeToSite(articles) {
  // BACKUP перед записью
  backupNewsFile();

  let archive = [];
  try { archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, 'utf-8')); } catch {}

  const now = new Date();
  const newEntries = articles.map(a => {
    const cleanTitle = stripCategoryPrefix(a.site?.title || a.title);
    const bodyText = a.site?.text || a.text || '';
    const htmlContent = addProductLinks(textToHtml(bodyText));

    // CTA: из данных пайплайна или автоматический поиск цены
    let cta = a.cta || a.site?.cta || undefined;
    let cta2 = a.cta2 || a.site?.cta2 || undefined;

    // Если CTA не передан пайплайном — попробовать найти цену
    if (!cta) {
      const gamePrice = findGamePrice(cleanTitle, bodyText);
      if (gamePrice) {
        cta = buildCtaData(gamePrice);
        console.log(`[NEWS] Auto CTA: ${gamePrice.name} — ${gamePrice.priceRUB} ₽`);
      }
    }

    // Если relatedProduct передан — создать cta2
    if (!cta2 && a.relatedProduct) {
      cta2 = buildProductCta(a.relatedProduct);
    }

    const entry = {
      id: a.id,
      slug: a.slug || slugify(cleanTitle),
      category: CATEGORY_MAP[a.category] || 'news',
      title: cleanTitle,
      excerpt: bodyText.substring(0, 200),
      content: htmlContent,
      coverUrl: a.imageUrl || a.image || '',
      date: now.toISOString(),
      source: a.sourceName,
      author: 'ActivePlay',
      tags: a.site?.tags || a.tags || [],
      metaDescription: a.site?.metaDescription || '',
      cta: cta,
      cta2: cta2,
    };

    // Валидация
    validateNewsEntry(entry);

    return entry;
  });

  // Deduplicate: don't overwrite existing archive entries (preserves coverUrl etc.)
  const existingIds = new Set(archive.map(a => a.id));
  const trulyNew = newEntries.filter(e => !existingIds.has(e.id));
  archive = [...trulyNew, ...archive].slice(0, 100);
  fs.writeFileSync(NEWS_ARCHIVE, JSON.stringify(archive, null, 2));

  // Читаем существующий news.ts чтобы сохранить ручные статьи
  let existingItems = [];
  try {
    const existing = fs.readFileSync(NEWS_FILE, 'utf-8');
    // Извлечь ID уже существующих статей из архива
    const idMatch = existing.match(/id:\s*'([^']+)'/g);
    if (idMatch) {
      existingItems = idMatch.map(m => m.match(/id:\s*'([^']+)'/)[1]);
    }
  } catch {}

  // Экранирование для одинарных кавычек в TS
  function escSingle(s) {
    return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\r/g, '');
  }
  // Экранирование для backtick template literals
  function escBacktick(s) {
    return (s || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }

  // Генерация TypeScript, совместимого с интерфейсом NewsItem
  const tsItems = archive.slice(0, 50).map(item => {
    const cleanTitle = stripCategoryPrefix(item.title);
    const bodyRaw = item.content || item.text || '';
    const content = escBacktick(addProductLinks(textToHtml(bodyRaw)));
    const excerpt = (item.excerpt || bodyRaw.replace(/<[^>]+>/g, '').substring(0, 200));
    return `  {
    id: '${item.id}',
    slug: '${item.slug || slugify(cleanTitle)}',
    category: '${CATEGORY_MAP[item.category] || item.category || 'news'}' as NewsCategory,
    title: '${escSingle(cleanTitle)}',
    excerpt: '${escSingle(excerpt)}',
    content: \`${content}\`,
    coverUrl: '${item.coverUrl || item.image || ''}',
    date: '${item.date || now.toISOString()}',
    source: '${escSingle(item.source || item.sourceName || '')}',
    author: '${escSingle(item.author || 'ActivePlay')}',
    tags: ${JSON.stringify(item.tags || [])},${item.metaDescription ? `\n    metaDescription: '${escSingle(item.metaDescription || '')}',` : ''}${item.cta ? `\n    cta: ${JSON.stringify(item.cta)},` : ''}${item.cta2 ? `\n    cta2: ${JSON.stringify(item.cta2)},` : ''}
  }`;
  }).join(',\n');

  const ts = `// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: ${now.toISOString()}

export type NewsCategory = 'news' | 'hype' | 'insider' | 'rumor' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

export interface NewsCta {
  gameId?: string;
  productLink?: string;
  title: string;
  price?: string;
  oldPrice?: string;
  link: string;
  subtitle?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  content?: string;
  coverUrl: string;
  date: string;
  source?: string;
  author?: string;
  tags?: string[];
  youtubeUrl?: string;
  duration?: string;
  hot?: boolean;
  pinned?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  cta?: NewsCta;
  cta2?: NewsCta;
}

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; color: string; icon: string }> = {
  news:         { label: 'Новость',   color: '#00D4FF', icon: '📰' },
  hype:         { label: 'Хайп',      color: '#FF4D6A', icon: '🔥' },
  insider:      { label: 'Инсайд',    color: '#A855F7', icon: '🕵️' },
  rumor:        { label: 'Слух',      color: '#F59E0B', icon: '🤫' },
  video:        { label: 'Видео',     color: '#EF4444', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#818CF8', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F97316', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};

export const newsData: NewsItem[] = [
${tsItems}
];
`;

  fs.writeFileSync(NEWS_FILE, ts);
  console.log(`[NEWS] Written to site: ${newEntries.length} new, ${archive.length} total`);
}

function deployToSite() {
  try {
    // Ensure images directory exists
    const imagesDir = path.join(SITE_ROOT, 'public/images/news');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Stage news.ts always, images only if directory has files
    let gitAdd = `cd ${SITE_ROOT} && git add src/data/news.ts`;
    const hasImages = fs.readdirSync(imagesDir).length > 0;
    if (hasImages) {
      gitAdd += ' public/images/news/';
    }

    execSync(
      `${gitAdd} && git commit -m "news: auto update" && git push`,
      { timeout: 30000 }
    );
    console.log('[NEWS] Deployed');
  } catch (err) {
    console.error(`[NEWS] Deploy error: ${err.message}`);
  }
}

module.exports = { publishToTelegram, publishToVK, writeToSite, deployToSite, validateNewsEntry, buildCtaData, buildProductCta, findGamePrice, slugify };
