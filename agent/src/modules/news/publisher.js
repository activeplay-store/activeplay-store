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

function writeToSite(articles) {
  let archive = [];
  try { archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, 'utf-8')); } catch {}

  const newEntries = articles.map(a => ({
    id: a.id,
    title: a.site?.title || a.title,
    text: a.site?.text || a.text,
    metaDescription: a.site?.metaDescription || '',
    image: a.imageUrl || '',
    tags: a.site?.tags || a.tags || [],
    category: a.category || 'Новость',
    source: a.sourceName,
    sourceUrl: a.link,
    publishedAt: new Date().toISOString(),
  }));

  archive = [...newEntries, ...archive].slice(0, 100);
  fs.writeFileSync(NEWS_ARCHIVE, JSON.stringify(archive, null, 2));

  // TypeScript для сайта — подстроить под формат страницы /news
  const ts = `// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: ${new Date().toISOString()}

export interface NewsArticle {
  id: string;
  title: string;
  text: string;
  metaDescription: string;
  image: string;
  tags: string[];
  category: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
}

export const newsData: NewsArticle[] = ${JSON.stringify(archive.slice(0, 50), null, 2)};
`;

  fs.writeFileSync(NEWS_FILE, ts);
  console.log(`[NEWS] Written to site: ${newEntries.length} new, ${archive.length} total`);
}

function deployToSite() {
  try {
    execSync(
      `cd ${SITE_ROOT} && git add src/data/news.ts public/images/news/ && git commit -m "news: auto update" && git push`,
      { timeout: 30000 }
    );
    console.log('[NEWS] Deployed');
  } catch (err) {
    console.error(`[NEWS] Deploy error: ${err.message}`);
  }
}

module.exports = { publishToTelegram, publishToVK, writeToSite, deployToSite };
