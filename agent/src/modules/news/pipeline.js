// pipeline.js — ГЛАВНЫЙ ПАЙПЛАЙН ПУБЛИКАЦИИ
// Каждая новость проходит через все 7 шагов. Без исключений.
// Время выполнения: 60-120 секунд.

const fs = require('fs');
const path = require('path');
const { translateAndRewrite, generateFullArticle, checkHeadline } = require('./translator');
const { enrichArticle, findGameOnSite } = require('./enrichment');
const { getNewsImage } = require('./imageGen');
const { writeToSite, deployToSite, publishToTelegram, publishToVK, buildCtaData, buildProductCta, slugify } = require('./publisher');

const STAGING_DIR = path.join(__dirname, '../../../data/news-staging');

async function runPipeline(article, targets, bot) {
  const ADMIN_ID = process.env.ADMIN_CHAT_ID;
  const startTime = Date.now();

  try {
    // Уведомить о начале
    if (bot && ADMIN_ID) {
      await bot.telegram.sendMessage(ADMIN_ID, '⏳ Готовлю новость... ~1-2 минуты');
    }

    console.log(`[PIPELINE] Starting for: ${article.site?.title || article.title}`);

    // ═══ ШАГ 1: ПЕРЕВОД (если ещё не переведена) ═══
    if (!article.site?.text) {
      console.log('[PIPELINE] Step 1: Translating...');
      const translation = await translateAndRewrite(article);
      if (translation) {
        Object.assign(article, translation);
      } else {
        throw new Error('Перевод не удался');
      }
    } else {
      console.log('[PIPELINE] Step 1: Already translated, skipping');
    }

    // ═══ ШАГ 2: СБОР ФАКТУРЫ ═══
    console.log('[PIPELINE] Step 2: Enriching...');
    const { enrichedContext, siteGame } = await enrichArticle(article);

    // ═══ ШАГ 3: ГЕНЕРАЦИЯ ПОЛНОГО ТЕКСТА ═══
    console.log('[PIPELINE] Step 3: Generating full article...');
    const fullArticle = await generateFullArticle(article, enrichedContext);
    if (fullArticle) {
      // Перезаписать site/telegram/vk данными из полной генерации
      article.site = fullArticle.site;
      article.telegram = fullArticle.telegram || article.telegram;
      article.vk = fullArticle.vk || article.vk;
      article.category = fullArticle.category || article.category;

      // Сохранить gameSlug и relatedProduct из генерации
      if (fullArticle.gameSlug && fullArticle.gameSlug !== 'null') {
        article.gameSlug = fullArticle.gameSlug;
      }
      if (fullArticle.relatedProduct && fullArticle.relatedProduct !== 'null') {
        article.relatedProduct = fullArticle.relatedProduct;
      }

      // Propagate platform and CTA fields from Gemini
      if (fullArticle.platform) article.platform = fullArticle.platform;
      if (fullArticle.ctaType) article.ctaType = fullArticle.ctaType;
      if (fullArticle.ctaText) article.ctaText = fullArticle.ctaText;
      if (fullArticle.ctaLink) article.ctaLink = fullArticle.ctaLink;
    } else {
      console.warn('[PIPELINE] Full article generation failed, using initial translation');
      const textLen = (article.site?.text || '').length;
      if (textLen < 300) {
        throw new Error(`Текст слишком короткий (${textLen} знаков) и полная генерация не удалась`);
      }
    }

    // ═══ ГАРАНТИЯ: platform + ctaType + воронка ActivePlay ═══
    // Если generateFullArticle не заполнил — определяем из текста
    if (!article.platform || article.platform === 'general') {
      const combined = ((article.site?.title || '') + ' ' + (article.site?.text || '') + ' ' + (article.tags || []).join(' ')).toLowerCase();
      if (/xbox|game pass|microsoft|series x|series s/.test(combined)) {
        article.platform = 'xbox';
      } else if (/playstation|ps5|ps4|ps plus|sony|ps store|dualsense/.test(combined)) {
        article.platform = 'playstation';
      } else if (/nintendo|switch/.test(combined)) {
        article.platform = 'nintendo';
      } else if (/steam|pc|epic games|valve/.test(combined)) {
        article.platform = 'pc';
      } else if (/(ps5|ps4|playstation).*(xbox|game pass)|(xbox|game pass).*(ps5|ps4|playstation)/.test(combined)) {
        article.platform = 'multi';
      }
      if (article.platform !== 'general') {
        console.log(`[PIPELINE] Platform detected from text: ${article.platform}`);
      }
    }

    // CTA type по платформе
    if (!article.ctaType || article.ctaType === 'deals') {
      const ctaMap = {
        xbox: { ctaType: 'gamepass', ctaText: 'Xbox Game Pass', ctaLink: '/subscriptions' },
        playstation: { ctaType: 'psplus', ctaText: 'PS Plus от 1 250 \u20BD/мес', ctaLink: '/subscriptions' },
        nintendo: { ctaType: 'general', ctaText: 'Подписки и игры', ctaLink: '/subscriptions' },
        pc: { ctaType: 'general', ctaText: 'Xbox Game Pass PC', ctaLink: '/subscriptions' },
        multi: { ctaType: 'general', ctaText: 'Подписки от 1 250 \u20BD/мес', ctaLink: '/subscriptions' },
      };
      const mapped = ctaMap[article.platform];
      if (mapped) {
        article.ctaType = mapped.ctaType;
        article.ctaText = mapped.ctaText;
        article.ctaLink = mapped.ctaLink;
        console.log(`[PIPELINE] CTA set from platform: ${article.ctaType}`);
      }
    }

    // Гарантия воронки: если нет упоминания ActivePlay — дописать
    if (article.site?.text && !article.site.text.includes('ActivePlay')) {
      const funnels = {
        playstation: '\n\nОформить PS Plus можно в ActivePlay от 1 250 \u20BD/мес. Активация за 10 минут, оплата в рублях.',
        xbox: '\n\nОформить Xbox Game Pass можно в ActivePlay. Быстро, из России, оплата в рублях.',
        multi: '\n\nПодписки PS Plus и Xbox Game Pass доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
        pc: '\n\nXbox Game Pass PC доступен в ActivePlay. Сотни игр по подписке, оформление из России за 10 минут.',
        nintendo: '\n\nИгровые подписки доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
        general: '\n\nИгровые подписки PS Plus, Xbox Game Pass и EA Play доступны в ActivePlay от 1 250 \u20BD/мес.',
      };
      const funnel = funnels[article.platform] || funnels.general;
      article.site.text += funnel;
      console.log(`[PIPELINE] Funnel appended (platform: ${article.platform})`);
    }

    // ═══ ШАГ 4: ПРОВЕРКА ЗАГОЛОВКА ═══
    console.log('[PIPELINE] Step 4: Checking headline...');
    const summary = (article.site?.text || '').substring(0, 200);
    const improvedTitle = await checkHeadline(article.site.title, summary);
    if (improvedTitle) {
      article.site.title = improvedTitle;
    }

    // ═══ ШАГ 5: КАРТИНКА ═══
    console.log('[PIPELINE] Step 5: Getting image...');
    if (!article.imageUrl) {
      article.imageUrl = await getNewsImage(article);
    }

    // ═══ ШАГ 6: CTA ═══
    console.log('[PIPELINE] Step 6: Building CTA...');

    // CTA из данных пайплайна
    if (siteGame) {
      article.cta = buildCtaData({
        name: siteGame.name,
        gameId: siteGame.gameId,
        priceRUB: siteGame.oldPrice || siteGame.minPrice,
        salePriceRUB: siteGame.salePrice,
        hasSale: siteGame.hasSale,
      });
    } else if (article.gameSlug) {
      // Попробовать найти по gameSlug из Gemini
      const gameData = findGameOnSite(article.gameSlug);
      if (gameData) {
        article.cta = buildCtaData({
          name: gameData.name,
          gameId: gameData.gameId,
          priceRUB: gameData.oldPrice || gameData.minPrice,
          salePriceRUB: gameData.salePrice,
          hasSale: gameData.hasSale,
        });
      }
    }

    // CTA2 для подписок
    if (article.relatedProduct) {
      article.cta2 = buildProductCta(article.relatedProduct);
    }

    // Slug
    if (!article.slug) {
      article.slug = slugify(article.site.title);
    }

    // ═══ ШАГ 7: СБОРКА И ПУБЛИКАЦИЯ ═══
    console.log('[PIPELINE] Step 7: Publishing...');

    // a) Сохранить в staging
    if (!fs.existsSync(STAGING_DIR)) fs.mkdirSync(STAGING_DIR, { recursive: true });
    const stagingPath = path.join(STAGING_DIR, `${article.id}.json`);
    fs.writeFileSync(stagingPath, JSON.stringify(article, null, 2));

    // b-f) Записать на сайт (backup + validation + write внутри writeToSite)
    if (targets.includes('site')) {
      writeToSite([article]);
      deployToSite();
    }

    // g-h) Публикация в соцсети
    if (targets.includes('telegram') && bot) {
      await publishToTelegram(bot, article);
    }
    if (targets.includes('vk')) {
      await publishToVK(article);
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`[PIPELINE] Done in ${elapsed}s: ${article.site.title}`);

    // i) Уведомить админа
    if (bot && ADMIN_ID) {
      const publishedTargets = targets.join(' + ');
      await bot.telegram.sendMessage(ADMIN_ID,
        `✅ Опубликовано (${elapsed}с): ${article.site.title}\n` +
        `📢 ${publishedTargets}\n` +
        `🔗 https://activeplay.games/news/${article.slug}`
      );
    }

    return article;
  } catch (err) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.error(`[PIPELINE] Error after ${elapsed}s:`, err);

    if (bot && ADMIN_ID) {
      await bot.telegram.sendMessage(ADMIN_ID,
        `❌ Ошибка публикации (${elapsed}с): ${err.message}\n` +
        `📰 ${article.site?.title || article.title}`
      );
    }

    throw err;
  }
}

module.exports = { runPipeline };
