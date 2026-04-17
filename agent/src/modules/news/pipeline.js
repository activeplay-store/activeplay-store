// pipeline.js — ГЛАВНЫЙ ПАЙПЛАЙН ПУБЛИКАЦИИ
// Каждая новость проходит через все 7 шагов. Без исключений.
// Время выполнения: 60-120 секунд.

const fs = require('fs');
const path = require('path');
const { translateAndRewrite, generateFullArticle, checkHeadline, cleanHeadline, countParagraphs } = require('./translator');
const { enrichArticle, findGameOnSite } = require('./enrichment');
const { getNewsImage } = require('./imageGen');
const { writeToSite, deployToSite, publishToTelegram, publishToVK, buildCtaData, buildProductCta, slugify } = require('./publisher');
const { factCheckArticle } = require('./factCheck');

const STAGING_DIR = path.join(__dirname, '../../../data/news-staging');

function getFunnelText(article, siteGame) {
  const text = (article.site?.text || article.text || '').toLowerCase();
  const title = (article.site?.title || article.title || '').toLowerCase();
  const combined = title + ' ' + text;

  // Для новостей о скидках/распродажах — воронка на страницу скидок
  if (article.ctaType === 'deals') {
    return '\n\nАктуальные скидки PS Store со всеми ценами в рублях собраны на activeplay.games в разделе PlayStation Store скидки. Успейте воспользоваться предложениями, пока распродажа не закончилась.';
  }

  // Если игра есть на сайте — воронка про покупку этой игры
  if (siteGame || article.cta) {
    const gameName = siteGame?.name || article.gameSlug || '';
    const price = siteGame?.minPrice || '';
    if (price) {
      return `\n\nПредзаказать ${gameName} можно в ActivePlay от ${price} \u20BD. Активация за 5 минут, оплата в рублях.`;
    }
    return `\n\n${gameName} доступна в ActivePlay. Активация за 5 минут, оплата в рублях.`;
  }

  const isGaming = ['ps5', 'ps4', 'playstation', 'xbox', 'nintendo', 'switch', 'steam', 'pc',
    'ps plus', 'game pass', 'ea play', 'game', 'игр', 'подписк']
    .some(kw => combined.includes(kw));

  if (!isGaming) {
    return '\n\nСледите за новостями игровой индустрии на activeplay.games. Подписки PS Plus, Xbox Game Pass и EA Play доступны с доставкой из ActivePlay.';
  }

  const platform = article.platform || 'general';
  const funnels = {
    playstation: '\n\nОформить PS Plus можно в ActivePlay от 1 250 \u20BD/мес. Активация за 10 минут, оплата в рублях. 52 000+ клиентов с 2022 года.',
    xbox: '\n\nОформить Xbox Game Pass можно в ActivePlay. Сотни игр по подписке, новинки с первого дня. Быстро, из России, оплата в рублях.',
    multi: '\n\nПодписки PS Plus и Xbox Game Pass доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
    pc: '\n\nXbox Game Pass PC открывает доступ к сотням игр. Оформить можно в ActivePlay \u2014 быстро, из России, оплата в рублях.',
    nintendo: '\n\nИгровые подписки доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
    general: '\n\nПодписки PS Plus, Xbox Game Pass и EA Play доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
  };

  return funnels[platform] || funnels.general;
}

async function runPipeline(article, targets, bot) {
  const ADMIN_ID = process.env.ADMIN_CHAT_ID;
  const startTime = Date.now();

  try {
    // Уведомить о начале
    if (bot && ADMIN_ID) {
      await bot.telegram.sendMessage(ADMIN_ID, '\u23f3 Готовлю новость... ~1-2 минуты');
    }

    console.log(`[PIPELINE] Starting for: ${article.site?.title || article.title}`);

    // ═══ ШАГ 1: ПЕРЕВОД (если ещё не переведена) ═══
    let step1Start = Date.now();
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
    console.log(`[PIPELINE] Step 1 done in ${((Date.now() - step1Start) / 1000).toFixed(1)}s`);

    // ═══ ШАГ 2: СБОР ФАКТУРЫ ═══
    let step2Start = Date.now();
    console.log('[PIPELINE] Step 2: Enriching...');
    const { enrichedContext, siteGame } = await enrichArticle(article);
    article.enrichedContext = enrichedContext; // нужно для Step 4.5 (fact-check)
    console.log(`[PIPELINE] Step 2 done in ${((Date.now() - step2Start) / 1000).toFixed(1)}s`);

    // ═══ ШАГ 3: ГЕНЕРАЦИЯ ПОЛНОГО ТЕКСТА ═══
    let step3Start = Date.now();
    // Если текст был отредактирован вручную (через голосовые команды) — НЕ перезаписывать
    if (article.manuallyEdited) {
      console.log('[PIPELINE] Step 3: SKIPPED \u2014 article was manually edited');
    } else {
      console.log('[PIPELINE] Step 3: Generating full article...');
      // Add game-on-site context so LLM writes about buying the game, not subscription
      let finalContext = enrichedContext
        ? `ДОПОЛНИТЕЛЬНЫЙ КОНТЕКСТ (может содержать неточности) — приоритет у исходника статьи:\n${enrichedContext}`
        : '';
      if (siteGame) {
        finalContext += `\nИГРА НА САЙТЕ ACTIVEPLAY: ${siteGame.name}, цена от ${siteGame.minPrice} руб. В 4-м абзаце пиши про покупку/предзаказ этой игры в ActivePlay, а НЕ про подписку PS Plus или Game Pass. Укажи цену.`;
        console.log(`[PIPELINE] Game on site: ${siteGame.name} (${siteGame.minPrice} RUB) \u2014 LLM will write game-specific funnel`);
      }
      const fullArticle = await generateFullArticle(article, finalContext);
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

        // Propagate platform and CTA fields from GPT-4o
        // НО: если enrichment уже выставил ctaType='deals', НЕ перезаписывать
        if (fullArticle.platform) article.platform = fullArticle.platform;
        if (article.ctaType !== 'deals') {
          if (fullArticle.ctaType) article.ctaType = fullArticle.ctaType;
          if (fullArticle.ctaText) article.ctaText = fullArticle.ctaText;
          if (fullArticle.ctaLink) article.ctaLink = fullArticle.ctaLink;
        }
      } else {
        console.warn('[PIPELINE] Full article generation failed, using initial translation');
        const textLen = (article.site?.text || '').length;
        if (textLen < 300) {
          throw new Error(`Текст слишком короткий (${textLen} знаков) и полная генерация не удалась`);
        }
      }
    }
    console.log(`[PIPELINE] Step 3 done in ${((Date.now() - step3Start) / 1000).toFixed(1)}s`);

    // Count-based platform detection — always verify, even if GPT-4o set a platform
    {
      const combined = ((article.site?.title || '') + ' ' + (article.site?.text || '') + ' ' + (article.tags || []).join(' ')).toLowerCase();
      const psCount = (combined.match(/ps5|ps4|playstation|dualsense|ps plus|sony|ps store/g) || []).length;
      const xboxCount = (combined.match(/xbox|game pass|series x|series s|microsoft/g) || []).length;
      const nintendoCount = (combined.match(/nintendo|switch/g) || []).length;
      const pcCount = (combined.match(/steam|pc|epic games|valve/g) || []).length;

      const maxCount = Math.max(psCount, xboxCount, nintendoCount, pcCount);
      if (maxCount > 0) {
        let detected;
        if (psCount > 0 && xboxCount > 0 && Math.abs(psCount - xboxCount) <= 1) {
          detected = 'multi';
        } else if (psCount === maxCount) {
          detected = 'playstation';
        } else if (xboxCount === maxCount) {
          detected = 'xbox';
        } else if (nintendoCount === maxCount) {
          detected = 'nintendo';
        } else if (pcCount === maxCount) {
          detected = 'pc';
        }
        if (detected && detected !== article.platform) {
          console.log('[PIPELINE] Platform override: ' + article.platform + ' -> ' + detected + ' (ps:' + psCount + ' xbox:' + xboxCount + ')');
          article.platform = detected;
        } else if (!article.platform || article.platform === 'general') {
          article.platform = detected || 'general';
          console.log('[PIPELINE] Platform detected: ' + article.platform);
        }
      }
    }

    // CTA type по платформе (только если GPT-4o не определил)
    if (!article.ctaType) {
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

    // Если ctaType === 'deals' — убедиться, что ссылка на /sale
    if (article.ctaType === 'deals') {
      article.ctaLink = article.ctaLink || '/sale';
      article.ctaText = article.ctaText || 'Скидки PS Store';
      console.log(`[PIPELINE] Deals CTA preserved: ${article.ctaText} \u2192 ${article.ctaLink}`);
    }

    // Гарантия воронки: если нет упоминания ActivePlay — дописать
    if (article.site?.text && !article.site.text.includes('ActivePlay')) {
      const funnel = getFunnelText(article, siteGame);
      article.site.text += funnel;
      console.log(`[PIPELINE] Funnel appended (platform: ${article.platform}, ctaType: ${article.ctaType})`);
    }

    // ═══ ШАГ 4: ПРОВЕРКА ЗАГОЛОВКА + ПРОВЕРКА ВНУТРЕННЕЙ ЛОГИКИ ТЕКСТА ═══
    let step4Start = Date.now();
    console.log('[PIPELINE] Step 4: Checking headline + text logic...');
    const fullText = article.site?.text || '';
    const checkResult = await checkHeadline(article.site.title, fullText);
    if (checkResult?.headline) {
      article.site.title = checkResult.headline;
    }
    if (checkResult?.textFixes) {
      article.logicCheckNotes = checkResult.textFixes;
      console.warn(`[PIPELINE] Step 4: logic flag for "${article.site.title}" — ${checkResult.textFixes}`);
    }
    console.log(`[PIPELINE] Step 4 done in ${((Date.now() - step4Start) / 1000).toFixed(1)}s`);

    // ═══ ШАГ 4.5: ФАКТ-ЧЕК (глубокая сверка с оригиналом + RAWG) ═══
    let step45Start = Date.now();
    console.log('[PIPELINE] Step 4.5: Fact-checking...');
    const factResult = await factCheckArticle(article);
    if (factResult?.hasErrors && factResult.errors?.length > 0) {
      if (factResult.correctedTitle) {
        console.log(`[PIPELINE] Title fixed: "${article.site.title}" \u2192 "${factResult.correctedTitle}"`);
        article.site.title = factResult.correctedTitle;
        if (article.telegram) article.telegram.title = factResult.correctedTitle;
        if (article.vk) article.vk.title = factResult.correctedTitle;
      }
      if (factResult.correctedText) {
        const pars = countParagraphs(factResult.correctedText);
        const len = factResult.correctedText.length;
        if (pars >= 4 && len >= 1000) {
          console.log(`[PIPELINE] Text corrected: ${factResult.errors.length} fixes applied`);
          article.site.text = factResult.correctedText;
        } else {
          console.warn(`[FACTCHECK] correctedText rejected: paragraphs=${pars}, len=${len} — keeping Step 3 version`);
        }
      }
      article.factCheckNotes = factResult.errors;
    }
    console.log(`[PIPELINE] Step 4.5 done in ${((Date.now() - step45Start) / 1000).toFixed(1)}s`);

    // ═══ ШАГ 5: КАРТИНКА ═══
    let step5Start = Date.now();
    console.log('[PIPELINE] Step 5: Getting image...');
    if (!article.imageUrl) {
      article.imageUrl = await getNewsImage(article);
    }
    console.log(`[PIPELINE] Step 5 done in ${((Date.now() - step5Start) / 1000).toFixed(1)}s`);

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
      // Попробовать найти по gameSlug от LLM
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

    // Автоопределение relatedProduct для PS Plus Essential
    if (!article.relatedProduct) {
      const titleLower = (article.site?.title || article.title || '').toLowerCase();
      const tagsLower = (article.tags || []).map(t => t.toLowerCase());
      if (
        tagsLower.includes('ps-plus-essential') ||
        (titleLower.includes('ps plus essential') && (titleLower.includes('бесплатн') || titleLower.includes('monthly') || titleLower.includes('игры')))
      ) {
        article.relatedProduct = 'ps-plus-essential';
        console.log('[PIPELINE] relatedProduct auto-detected: ps-plus-essential');
      } else if (
        tagsLower.includes('ps-plus-extra') ||
        (titleLower.includes('ps plus extra') && (titleLower.includes('каталог') || titleLower.includes('catalog') || titleLower.includes('новые игры')))
      ) {
        article.relatedProduct = 'ps-plus-extra';
        console.log('[PIPELINE] relatedProduct auto-detected: ps-plus-extra');
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
      if (article.site?.title) article.site.title = cleanHeadline(article.site.title);
      if (article.title) article.title = cleanHeadline(article.title);
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
        `\u2705 Опубликовано (${elapsed}с): ${article.site.title}\n` +
        `\ud83d\udce2 ${publishedTargets}\n` +
        `\ud83d\udd17 https://activeplay.games/news/${article.slug}`
      );
    }

    // ═══ POST-PUBLISH: Обновить каталог Essential если это новость о бесплатных играх ═══
    if (article.relatedProduct === 'ps-plus-essential') {
      try {
        const titleLower = (article.site?.title || '').toLowerCase();
        const isMonthlyGamesNews =
          titleLower.includes('бесплатн') || titleLower.includes('уже доступн') ||
          titleLower.includes('monthly') || titleLower.includes('new games');

        if (isMonthlyGamesNews) {
          console.log('[PIPELINE] Detected Essential monthly games news — updating catalog...');
          const { updateEssentialFromNews } = require('../catalogMonitor');

          // Extract game names from tags (skip platform/category tags)
          const skipTags = new Set(['ps5', 'ps4', 'ps-plus-essential', 'ps-plus-extra', 'ps-plus-deluxe', 'sony', 'playstation']);
          const gameNames = (article.tags || []).filter(t => !skipTags.has(t.toLowerCase()));

          // Extract platforms from article content
          const content = (article.site?.text || article.content || '').toLowerCase();
          const games = gameNames.map(name => {
            const nameLower = name.toLowerCase();
            // Check if PS4 is mentioned near this game name
            const nearContext = content.slice(
              Math.max(0, content.indexOf(nameLower) - 50),
              content.indexOf(nameLower) + nameLower.length + 100
            );
            const hasPS4 = /ps4|ps 4/.test(nearContext);
            const hasPS5 = /ps5|ps 5/.test(nearContext);
            const platforms = [];
            if (hasPS4) platforms.push('PS4');
            if (hasPS5 || platforms.length === 0) platforms.push('PS5');
            return { name, platforms };
          });

          if (games.length > 0) {
            const result = await updateEssentialFromNews(games);
            if (result.changed) {
              console.log(`[PIPELINE] Essential catalog updated: ${games.length} games`);
            }
          }
        }
      } catch (err) {
        console.error('[PIPELINE] Essential catalog update failed:', err.message);
      }
    }

    return article;
  } catch (err) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.error(`[PIPELINE] Error after ${elapsed}s:`, err);

    if (bot && ADMIN_ID) {
      await bot.telegram.sendMessage(ADMIN_ID,
        `\u274c Ошибка публикации (${elapsed}с): ${err.message}\n` +
        `\ud83d\udcf0 ${article.site?.title || article.title}`
      );
    }

    throw err;
  }
}

module.exports = { runPipeline };
