const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { execSync } = require("child_process");

const SITE_ROOT = "/var/www/activeplay-store";
const DATA_DIR = path.join(SITE_ROOT, "src/data");
const NEWS_ARCHIVE = path.join(SITE_ROOT, "agent/data/news-archive.json");
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function executeAction(intent, options = {}) {
  const { dryRun = false } = options;
  const handler = ACTION_HANDLERS[intent.intent];

  if (!handler) {
    throw new Error(`Неизвестный intent: ${intent.intent}`);
  }

  return await handler(intent.params, dryRun, options);
}

// ==================== НОВОСТИ ====================

async function editNewsTitle(params, dryRun) {
  const article = getNewsArticle(params.newsId, params.newsTitle);
  const oldTitle = article.title;

  if (dryRun) {
    return { oldValue: oldTitle, newValue: params.newTitle, field: "title" };
  }

  updateNewsField(params.newsId, "title", params.newTitle);
  updateSiteNews(params.newsId, { title: params.newTitle });

  return {
    summary: `Заголовок обновлён: «${params.newTitle}»`,
    needsDeploy: true,
    commitMessage: `fix: update news title - ${params.newTitle.slice(0, 40)}`,
  };
}

async function editNewsParagraph(params, dryRun, options = {}) {
  const article = getNewsArticle(params.newsId, params.newsTitle);
  const text = article.text || "";
  const paragraphs = text.split("\n\n").filter(p => p.trim());
  const pIndex = (params.paragraphNumber || 1) - 1;

  if (pIndex < 0 || pIndex >= paragraphs.length) {
    throw new Error(`Абзац ${params.paragraphNumber} не найден (всего ${paragraphs.length})`);
  }

  const oldParagraph = paragraphs[pIndex];
  const newParagraph = await rewriteParagraph(oldParagraph, params.instruction, article.title, options.retry);

  if (dryRun) {
    return { oldValue: oldParagraph, newValue: newParagraph, field: `paragraph_${params.paragraphNumber}` };
  }

  paragraphs[pIndex] = newParagraph;
  const newText = paragraphs.join("\n\n");

  updateNewsField(params.newsId, "text", newText);
  updateSiteNews(params.newsId, { text: newText });

  return {
    summary: `Абзац ${params.paragraphNumber} обновлён`,
    needsDeploy: true,
    commitMessage: `fix: rewrite paragraph ${params.paragraphNumber} in news`,
  };
}

async function editNewsFix(params, dryRun) {
  const article = getNewsArticle(params.newsId, params.newsTitle);
  const oldText = article.text || "";
  const oldTitle = article.title || "";

  let newText = oldText;
  let newTitle = oldTitle;
  let fixed = false;

  if (oldTitle.includes(params.errorText)) {
    newTitle = oldTitle.replace(params.errorText, params.fixText || "");
    fixed = true;
  }
  if (oldText.includes(params.errorText)) {
    newText = oldText.replace(params.errorText, params.fixText || "");
    fixed = true;
  }

  if (!fixed) {
    throw new Error(`Не нашёл "${params.errorText}" в тексте или заголовке`);
  }

  if (dryRun) {
    return { oldValue: params.errorText, newValue: params.fixText || "(удалено)", field: "text_fix" };
  }

  if (newTitle !== oldTitle) updateNewsField(params.newsId, "title", newTitle);
  if (newText !== oldText) updateNewsField(params.newsId, "text", newText);
  updateSiteNews(params.newsId, { title: newTitle, text: newText });

  return {
    summary: `Исправлено: "${params.errorText}" → "${params.fixText || "(удалено)"}"`,
    needsDeploy: true,
    commitMessage: "fix: correct news text",
  };
}

async function deleteNews(params, dryRun) {
  const article = getNewsArticle(params.newsId, params.newsTitle);

  if (dryRun) {
    return { oldValue: article.title, newValue: "(удалена)", field: "delete" };
  }

  const archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, "utf-8"));
  const index = params.newsId === "latest" ? 0 : archive.findIndex(a => a.id === params.newsId);
  if (index >= 0) {
    archive.splice(index, 1);
    fs.writeFileSync(NEWS_ARCHIVE, JSON.stringify(archive, null, 2));
  }

  rebuildSiteNews(archive);

  return {
    summary: `Новость удалена: «${article.title}»`,
    needsDeploy: true,
    commitMessage: `fix: delete news - ${article.title.slice(0, 40)}`,
  };
}

async function regenerateNews(params, dryRun) {
  const article = getNewsArticle(params.newsId, params.newsTitle);

  const { generateFullArticle } = require("../news/translator");
  const newArticle = await generateFullArticle({
    title: article.title,
    description: article.text,
    sourceName: article.source,
    link: article.sourceUrl,
  });

  if (!newArticle) throw new Error("Не удалось перегенерировать");

  if (dryRun) {
    return { oldValue: article.text, newValue: newArticle.site?.text || "", field: "full_text" };
  }

  updateNewsField(params.newsId, "text", newArticle.site.text);
  updateNewsField(params.newsId, "title", newArticle.site.title);
  updateSiteNews(params.newsId, { text: newArticle.site.text, title: newArticle.site.title });

  return {
    summary: `Текст перегенерирован: «${newArticle.site.title}»`,
    needsDeploy: true,
    commitMessage: "fix: regenerate news text",
  };
}

// ==================== ГЛАВНАЯ ====================

async function homeHotReplace(params, dryRun) {
  const filePath = path.join(DATA_DIR, "hotReleases.ts");
  const content = fs.readFileSync(filePath, "utf-8");

  if (dryRun) {
    return { oldValue: params.oldGame, newValue: params.newGame, field: "hot_releases" };
  }

  if (!content.includes(params.oldGame)) {
    throw new Error(`Игра "${params.oldGame}" не найдена в горящих новинках`);
  }

  const newContent = content.replace(params.oldGame, params.newGame);
  fs.writeFileSync(filePath, newContent);

  return {
    summary: `В новинках: ${params.oldGame} → ${params.newGame}`,
    needsDeploy: true,
    commitMessage: `feat: replace ${params.oldGame} with ${params.newGame} in hot releases`,
  };
}

// ==================== КУРСЫ ====================

async function ratesUpdate(params, dryRun) {
  if (dryRun) {
    return { oldValue: "текущий курс", newValue: "обновлённый с ЦБ", field: "rates" };
  }

  try {
    const { updateRates } = require("../currency");
    const result = await updateRates();
    return {
      summary: `Курс обновлён: TRY ${result?.TRY || "?"}`,
      needsDeploy: false,
    };
  } catch (err) {
    throw new Error(`Не удалось обновить курс: ${err.message}`);
  }
}

async function ratesSetMarkup(params, dryRun) {
  const anchorsPath = path.join(SITE_ROOT, "agent/data/anchors.json");
  let anchors = {};
  try { anchors = JSON.parse(fs.readFileSync(anchorsPath, "utf-8")); } catch {}

  const oldMarkup = anchors.markup?.[params.currency] || 0.15;

  if (dryRun) {
    return { oldValue: `+${oldMarkup}`, newValue: `+${params.markup}`, field: "markup" };
  }

  if (!anchors.markup) anchors.markup = {};
  anchors.markup[params.currency] = params.markup;
  fs.writeFileSync(anchorsPath, JSON.stringify(anchors, null, 2));

  return {
    summary: `Наценка ${params.currency}: +${oldMarkup} → +${params.markup}`,
    needsDeploy: false,
  };
}

// ==================== САЙТ ====================

async function siteStatus(params, dryRun) {
  const pm2Status = execSync("pm2 jlist", { timeout: 5000 }).toString();
  const processes = JSON.parse(pm2Status);

  const status = processes.map(p => {
    const emoji = p.pm2_env.status === "online" ? "\uD83D\uDFE2" : "\uD83D\uDD34";
    return `${emoji} ${p.name}: ${p.pm2_env.status} (pid ${p.pid})`;
  }).join("\n");

  return {
    summary: status,
    needsDeploy: false,
    skipPreview: true,
  };
}

// ==================== ПРЕВЬЮ ПРАВКИ ====================

async function previewEditTitle(params, dryRun) {
  const pendingPath = path.join(SITE_ROOT, "agent/data/pending-news.json");
  const pending = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));
  const article = pending[pending.length - 1];

  if (!article) throw new Error("Нет активного превью");

  const oldTitle = article.site?.title || article.title;

  if (dryRun) {
    return { oldValue: oldTitle, newValue: params.newTitle, field: "preview_title" };
  }

  if (article.site) article.site.title = params.newTitle;
  article.title = params.newTitle;
  fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

  return {
    summary: `Заголовок превью обновлён: «${params.newTitle}»`,
    needsDeploy: false,
  };
}

async function previewEditParagraph(params, dryRun, options = {}) {
  const pendingPath = path.join(SITE_ROOT, "agent/data/pending-news.json");
  const pending = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));
  const article = pending[pending.length - 1];

  if (!article) throw new Error("Нет активного превью");

  const text = article.site?.text || article.text || "";
  const paragraphs = text.split("\n\n").filter(p => p.trim());
  const pIndex = (params.paragraphNumber || 1) - 1;

  if (pIndex < 0 || pIndex >= paragraphs.length) {
    throw new Error(`Абзац ${params.paragraphNumber} не найден`);
  }

  const oldParagraph = paragraphs[pIndex];
  const newParagraph = await rewriteParagraph(oldParagraph, params.instruction, article.title, options.retry);

  if (dryRun) {
    return { oldValue: oldParagraph, newValue: newParagraph, field: `preview_p${params.paragraphNumber}` };
  }

  paragraphs[pIndex] = newParagraph;
  const newText = paragraphs.join("\n\n");
  if (article.site) article.site.text = newText;
  article.text = newText;
  fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

  return {
    summary: `Абзац ${params.paragraphNumber} обновлён в превью`,
    needsDeploy: false,
  };
}

async function previewEditFix(params, dryRun) {
  const pendingPath = path.join(SITE_ROOT, "agent/data/pending-news.json");
  const pending = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));
  const article = pending[pending.length - 1];

  if (!article) throw new Error("Нет активного превью");

  const text = article.site?.text || article.text || "";
  const title = article.site?.title || article.title || "";
  let newText = text;
  let newTitle = title;
  let fixed = false;

  if (title.includes(params.errorText)) {
    newTitle = title.replace(params.errorText, params.fixText || "");
    fixed = true;
  }
  if (text.includes(params.errorText)) {
    newText = text.replace(params.errorText, params.fixText || "");
    fixed = true;
  }

  if (!fixed) throw new Error(`Не нашёл "${params.errorText}" в превью`);

  if (dryRun) {
    return { oldValue: params.errorText, newValue: params.fixText || "(удалено)", field: "preview_fix" };
  }

  if (article.site) {
    article.site.text = newText;
    article.site.title = newTitle;
  }
  article.text = newText;
  article.title = newTitle;
  fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

  return {
    summary: `Исправлено в превью: "${params.errorText}" → "${params.fixText || "(удалено)"}"`,
    needsDeploy: false,
  };
}

// ==================== HELPERS ====================

const TRANSLIT_MAP = {
  "\u044d\u043b\u0434\u0435\u043d": "elden", "\u0440\u0438\u043d\u0433": "ring", "\u043a\u0440\u0438\u043c\u0441\u043e\u043d": "crimson", "\u0434\u0435\u0437\u0435\u0440\u0442": "desert",
  "\u0431\u043e\u0440\u0434\u0435\u0440\u043b\u0435\u043d\u0434\u0441": "borderlands", "\u0440\u0435\u0437\u0438\u0434\u0435\u043d\u0442": "resident", "\u0441\u043f\u0430\u0439\u0434\u0435\u0440\u043c\u0435\u043d": "spider-man",
  "\u043c\u0430\u0440\u0432\u0435\u043b": "marvel", "\u043b\u0430\u0441\u0442": "last", "\u0433\u043e\u0434": "god",
  "\u0445\u043e\u0433\u0432\u0430\u0440\u0442\u0441": "hogwarts", "\u0441\u0430\u0439\u043b\u0435\u043d\u0442": "silent", "\u0445\u0438\u043b\u043b": "hill",
  "\u0433\u0440\u0430\u043d": "gran", "\u0442\u0443\u0440\u0438\u0437\u043c\u043e": "turismo", "\u0434\u0430\u0440\u043a": "dark", "\u0441\u043e\u0443\u043b\u0441": "souls",
  "\u0444\u0430\u0439\u043d\u0430\u043b": "final", "\u0444\u044d\u043d\u0442\u0435\u0437\u0438": "fantasy", "\u043c\u043e\u043d\u0441\u0442\u0435\u0440": "monster", "\u0445\u0430\u043d\u0442\u0435\u0440": "hunter",
  "\u043c\u0430\u0444\u0438\u044f": "mafia", "\u043c\u0430\u0440\u0430\u0444\u043e\u043d": "marathon", "\u0434\u0438\u0430\u0431\u043b\u043e": "diablo",
  "\u043a\u0438\u043d\u0433\u0434\u043e\u043c": "kingdom", "\u043a\u0430\u043c": "come", "\u0434\u0435\u043b\u0438\u0432\u0435\u0440\u0430\u043d\u0441": "deliverance",
  "\u0441\u0442\u0440\u0435\u043d\u0434\u0438\u043d\u0433": "stranding", "\u0434\u0435\u0441": "death",
};

function transliterate(text) {
  let result = text.toLowerCase();
  for (const [ru, en] of Object.entries(TRANSLIT_MAP)) {
    result = result.replace(new RegExp(ru, "g"), en);
  }
  return result;
}

function getNewsArticle(newsId, newsTitle) {
  console.log(`[CMD] getNewsArticle: newsId=${newsId}, newsTitle=${newsTitle}`);
  const archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, "utf-8"));

  if ((newsId === "search" || newsTitle) && newsTitle) {
    const lower = newsTitle.toLowerCase();
    const translit = transliterate(newsTitle);
    const searchTerms = translit.split(/\s+/).filter(w => w.length > 2);
    console.log(`[CMD] Searching archive for: "${lower}" (translit: "${translit}", terms: ${searchTerms.join(", ")})`);

    // 1. Exact substring match (original)
    const exact = archive.find(a => (a.title || "").toLowerCase().includes(lower));
    if (exact) {
      console.log(`[CMD] Exact match: "${exact.title}"`);
      return exact;
    }

    // 2. Transliterated substring match
    const translitMatch = archive.find(a => (a.title || "").toLowerCase().includes(translit));
    if (translitMatch) {
      console.log(`[CMD] Translit match: "${translitMatch.title}"`);
      return translitMatch;
    }

    // 3. All significant words must match (transliterated)
    if (searchTerms.length > 0) {
      const wordMatch = archive.find(a => {
        const title = (a.title || "").toLowerCase();
        return searchTerms.every(w => title.includes(w));
      });
      if (wordMatch) {
        console.log(`[CMD] Word match: "${wordMatch.title}"`);
        return wordMatch;
      }
    }

    // 4. Any significant word matches (best effort)
    if (searchTerms.length > 0) {
      const anyMatch = archive.find(a => {
        const title = (a.title || "").toLowerCase();
        return searchTerms.some(w => w.length > 3 && title.includes(w));
      });
      if (anyMatch) {
        console.log(`[CMD] Partial match: "${anyMatch.title}"`);
        return anyMatch;
      }
    }

    console.log(`[CMD] Not found by title, falling back to latest`);
  }

  if (newsId === "latest" || newsId === "search" || !newsId) return archive[0];

  const article = archive.find(a => a.id === newsId);
  if (!article) throw new Error(`Новость ${newsId} не найдена`);
  return article;
}

function updateNewsField(newsId, field, value) {
  const archive = JSON.parse(fs.readFileSync(NEWS_ARCHIVE, "utf-8"));
  const index = newsId === "latest" ? 0 : archive.findIndex(a => a.id === newsId);
  if (index < 0) throw new Error("Новость не найдена");
  archive[index][field] = value;
  fs.writeFileSync(NEWS_ARCHIVE, JSON.stringify(archive, null, 2));
}

function updateSiteNews(newsId, fields) {
  const newsJsonPath = path.join(DATA_DIR, "news.json");

  if (fs.existsSync(newsJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(newsJsonPath, "utf-8"));
      const index = newsId === "latest" ? 0 : data.findIndex(a => a.id === newsId);
      if (index >= 0) {
        // Map archive field names to site field names (text -> content)
        const mapped = {};
        for (const [key, val] of Object.entries(fields)) {
          mapped[key === "text" ? "content" : key] = val;
        }
        Object.assign(data[index], mapped);
        fs.writeFileSync(newsJsonPath, JSON.stringify(data, null, 2));
        console.log("[CMD] updateSiteNews: updated fields for " + newsId);
      }
    } catch (err) {
      console.error("[CMD] updateSiteNews error:", err.message);
    }
  }
}

function rebuildSiteNews(archive) {
  const newsJsonPath = path.join(DATA_DIR, "news.json");
  if (fs.existsSync(newsJsonPath)) {
    fs.writeFileSync(newsJsonPath, JSON.stringify(archive.slice(0, 50), null, 2));
  }
}

async function rewriteParagraph(oldParagraph, instruction, articleTitle, isRetry = false) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  const prompt = `Перепиши абзац статьи по указанию редактора.

Статья: "${articleTitle}"
Текущий абзац: "${oldParagraph}"
Указание редактора: "${instruction}"
${isRetry ? "ВАЖНО: предыдущий вариант не понравился, напиши ДРУГОЙ." : ""}

ПРАВИЛА:
- Сохрани факты из оригинала
- Добавь то, что просит редактор
- Живой русский, короткие предложения 12-18 слов
- Без канцеляризмов
- Минимум 3 предложения
- Только текст абзаца, без кавычек и пояснений`;

  try {
    const response = await axios.post(OPENROUTER_URL, {
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      temperature: isRetry ? 0.9 : 0.7,
      max_tokens: 1000,
    }, {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://activeplay.games",
      },
      timeout: 30000,
    });

    return response.data?.choices?.[0]?.message?.content?.trim() || oldParagraph;
  } catch (err) {
    console.error(`[CMD] Rewrite error: ${err.message}`);
    return oldParagraph;
  }
}


async function suggestNewsTitles(params, dryRun) {
  const article = getNewsArticle(params.newsId, params.newsTitle);
  const count = params.count || 3;

  const prompt = `Предложи ${count} варианта SEO-заголовка для этой новости.

Текущий заголовок: "${article.title}"
Текст статьи: "${(article.text || "").slice(0, 500)}"

ПРАВИЛА:
- SEO-формат: название игры + суть новости
- Без восклицательных знаков
- Без вопросительных знаков
- Без кликбейта
- Конкретика, не общие слова

Ответ — только ${count} заголовков, каждый на новой строке, без нумерации и без пояснений.`;

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    const response = await axios.post(OPENROUTER_URL, {
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    }, {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://activeplay.games",
      },
      timeout: 20000,
    });

    const titles = response.data?.choices?.[0]?.message?.content?.trim().split("\n").filter(t => t.trim());

    if (dryRun) {
      return {
        oldValue: article.title,
        newValue: titles.map((t, i) => `${i + 1}. ${t.trim()}`).join("\n"),
        field: "suggest_titles",
        suggestions: titles.map(t => t.trim()),
      };
    }

    return { summary: titles.join("\n"), needsDeploy: false };
  } catch (err) {
    throw new Error(`Не удалось сгенерировать: ${err.message}`);
  }
}

const ACTION_HANDLERS = {
  edit_news_title: editNewsTitle,
  edit_news_paragraph: editNewsParagraph,
  edit_news_fix: editNewsFix,
  delete_news: deleteNews,
  regenerate_news: regenerateNews,
  home_hot_replace: homeHotReplace,
  rates_update: ratesUpdate,
  rates_set_markup: ratesSetMarkup,
  site_status: siteStatus,
  preview_edit_title: previewEditTitle,
  preview_edit_paragraph: previewEditParagraph,
  preview_edit_fix: previewEditFix,
  suggest_news_titles: suggestNewsTitles,
};

module.exports = { executeAction, getNewsArticle, updateNewsField, updateSiteNews };
