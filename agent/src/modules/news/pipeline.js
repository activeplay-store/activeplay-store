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
    } else {
      console.warn('[PIPELINE] Full article generation failed, using initial translation');
      // Проверяем минимальную длину текста из начального перевода
      const textLen = (article.site?.text || '').length;
      if (textLen < 300) {
        throw new Error(`Текст слишком короткий (${textLen} знаков) и полная генерация не удалась`);
      }
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
