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
  // VK API — wall.post
  // Заглушка, подключим позже когда протестируем TG
  console.log(`[NEWS] VK publish placeholder: ${article.vk?.title || article.title}`);
}

// Маппинг категорий переводчика → NewsCategory для сайта
const CATEGORY_MAP = {
  'Новость': 'news', 'Анонс': 'announcement', 'Обзор': 'review',
  'Слух': 'insider', 'Скидки': 'news', 'Гайд': 'guide',
  'Видео': 'video', 'Интервью': 'interview',
};

// Убрать категорию из начала заголовка (например "Инсайд: Title" → "Title")
const CATEGORY_PREFIX_RE = /^(Новость|Анонс|Обзор|Слух|Скидки|Гайд|Видео|Интервью|Инсайд|Утечка|Rumor|News)\s*[:—–\-]\s*/i;
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
  let archive = [];
  try { archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, 'utf-8')); } catch {}

  const now = new Date();
  const newEntries = articles.map(a => {
    const cleanTitle = stripCategoryPrefix(a.site?.title || a.title);
    const bodyText = a.site?.text || a.text || '';
    return {
      id: a.id,
      slug: slugify(cleanTitle),
      category: CATEGORY_MAP[a.category] || 'news',
      title: cleanTitle,
      excerpt: bodyText.substring(0, 200),
      content: addProductLinks(textToHtml(bodyText)),
      coverUrl: a.imageUrl || a.image || '',
      date: now.toISOString().split('T')[0],
      source: a.sourceName,
      author: 'ActivePlay',
      tags: a.site?.tags || a.tags || [],
      metaDescription: a.site?.metaDescription || '',
    };
  });

  archive = [...newEntries, ...archive].slice(0, 100);
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

  // Генерация TypeScript, совместимого с интерфейсом NewsItem
  const tsItems = archive.slice(0, 50).map(item => {
    const cleanTitle = stripCategoryPrefix(item.title);
    const bodyRaw = item.content || item.text || '';
    const content = addProductLinks(textToHtml(bodyRaw))
      .replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const excerpt = item.excerpt || bodyRaw.replace(/<[^>]+>/g, '').substring(0, 200);
    return `  {
    id: '${item.id}',
    slug: '${item.slug || slugify(cleanTitle)}',
    category: '${CATEGORY_MAP[item.category] || item.category || 'news'}' as NewsCategory,
    title: '${cleanTitle.replace(/'/g, "\\'")}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    content: \`${content}\`,
    coverUrl: '${item.coverUrl || item.image || ''}',
    date: '${item.date || item.publishedAt?.split('T')[0] || now.toISOString().split('T')[0]}',
    source: '${(item.source || item.sourceName || '').replace(/'/g, "\\'")}',
    author: '${item.author || 'ActivePlay'}',
    tags: ${JSON.stringify(item.tags || [])},${item.metaDescription ? `\n    metaDescription: '${(item.metaDescription || '').replace(/'/g, "\\'")}',` : ''}
  }`;
  }).join(',\n');

  const ts = `// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: ${now.toISOString()}

export type NewsCategory = 'news' | 'insider' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

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
}

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; color: string; icon: string }> = {
  news:         { label: 'Новость',   color: '#00D4FF', icon: '📰' },
  insider:      { label: 'Инсайд',   color: '#FF9500', icon: '🔍' },
  video:        { label: 'Видео',     color: '#FF4D6A', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#A855F7', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F59E0B', icon: '🎧' },
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

module.exports = { publishToTelegram, publishToVK, writeToSite, deployToSite };
