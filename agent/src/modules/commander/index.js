const fs = require("fs");
const path = require("path");
const { parseIntent } = require("./intentParser");
const { executeAction, getNewsArticle, updateNewsField, updateSiteNews } = require("./executor");
const { buildPreview } = require("./preview");
const { validateParams } = require("./validators");

const PENDING_FILE = path.join(__dirname, "../../../data/pending-commands.json");

async function handleCommand(bot, chatId, text, context = {}) {
  console.log(`[CMD] Received command: "${text}"`);

  try {
    // 1. Парсим intent через LLM
    const intent = await parseIntent(text, context);
    if (!intent || intent.intent === "unknown") {
      return null; // Не распознано — вернём null, чтобы route мог обработать
    }

    console.log(`[CMD] Parsed intent: ${intent.intent}, action: ${JSON.stringify(intent.params)}`);

    // 2. Валидация параметров
    const validation = validateParams(intent);
    if (!validation.valid) {
      await bot.telegram.sendMessage(chatId, `\u26A0\uFE0F ${validation.error}`);
      return true;
    }

    // 3. Подготовка (получить текущее значение для превью "Было")
    const currentState = await executeAction(intent, { dryRun: true });

    // 4. Если skipPreview — выполняем сразу
    if (currentState?.skipPreview) {
      await bot.telegram.sendMessage(chatId, currentState.summary);
      return true;
    }

    // 5. Формируем превью
    const preview = buildPreview(intent, currentState);

    // 5.5. Спец-обработка suggest_news_titles
    if (intent.intent === "suggest_news_titles" && currentState.suggestions) {
      const buttons = currentState.suggestions.map((title, i) => ([
        { text: (i + 1) + ". " + title.slice(0, 50), callback_data: "cmd_pick_title_" + intent.id + "_" + i }
      ]));
      buttons.push([{ text: "\u274c \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c", callback_data: "cmd_cancel_" + intent.id }]);
      buttons.push([{ text: "\uD83D\uDD04 \u0414\u0440\u0443\u0433\u0438\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u044b", callback_data: "cmd_retry_" + intent.id }]);

      intent.suggestions = currentState.suggestions;
      savePendingCommand(intent);

      await bot.telegram.sendMessage(chatId,
        "\uD83D\uDCDD *\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043a\u0430*\n\n\u0422\u0435\u043a\u0443\u0449\u0438\u0439: _" + currentState.oldValue + "_\n\n" + currentState.newValue,
        { parse_mode: "Markdown", reply_markup: { inline_keyboard: buttons } }
      );
      return true;
    }

    // 6. Отправляе�� превью с кнопками
    await bot.telegram.sendMessage(chatId, preview.text, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "\u2705 \u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c", callback_data: `cmd_apply_${intent.id}` },
            { text: "\u274C \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c", callback_data: `cmd_cancel_${intent.id}` },
          ],
          [
            { text: "\uD83D\uDD04 \u0414\u0440\u0443\u0433\u043e\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442", callback_data: `cmd_retry_${intent.id}` },
          ],
        ],
      },
    });

    // 7. Сохранить pending command
    savePendingCommand(intent);
    return true;

  } catch (err) {
    console.error(`[CMD] Error: ${err.message}`);
    await bot.telegram.sendMessage(chatId, `\u274C \u041e\u0448\u0438\u0431\u043a\u0430: ${err.message}`);
    return true;
  }
}

// Обработка кнопок подтверждения
function setupCommandHandlers(bot) {
  // Применить
  bot.action(/^cmd_apply_(.+)$/, async (ctx) => {
    const intentId = ctx.match[1];
    const intent = loadPendingCommand(intentId);
    if (!intent) return ctx.answerCbQuery("\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430");

    try {
      await ctx.editMessageText("\u23F3 \u041f\u0440\u0438\u043c\u0435\u043d\u044f\u044e...");
      const result = await executeAction(intent, { dryRun: false });

      if (result.needsDeploy) {
        await deployChanges(result.commitMessage);
      }

      await ctx.editMessageText(`\u2705 \u0413\u043e\u0442\u043e\u0432\u043e!\n\n${result.summary}`);
      removePendingCommand(intentId);
    } catch (err) {
      await ctx.editMessageText(`\u274C \u041e\u0448\u0438\u0431\u043a\u0430: ${err.message}`);
    }
    await ctx.answerCbQuery();
  });

  // Отменить
  bot.action(/^cmd_cancel_(.+)$/, async (ctx) => {
    const intentId = ctx.match[1];
    removePendingCommand(intentId);
    await ctx.editMessageText("\u274C \u041e\u0442\u043c\u0435\u043d\u0435\u043d\u043e");
    await ctx.answerCbQuery();
  });

  // Выбор варианта заголовка
  bot.action(/^cmd_pick_title_(.+)_(\d+)$/, async (ctx) => {
    const intentId = ctx.match[1];
    const titleIndex = parseInt(ctx.match[2]);
    const intent = loadPendingCommand(intentId);
    if (!intent || !intent.suggestions) return ctx.answerCbQuery("\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e");

    const newTitle = intent.suggestions[titleIndex];
    if (!newTitle) return ctx.answerCbQuery("\u0412\u0430\u0440\u0438\u0430\u043d\u0442 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d");

    try {
      const article = getNewsArticle(intent.params.newsId, intent.params.newsTitle);
      const articleId = article.id || "latest";
      updateNewsField(articleId, "title", newTitle);
      updateSiteNews(articleId, { title: newTitle });
      deployChanges("fix: update title to " + newTitle.slice(0, 40));

      await ctx.editMessageText("\u2705 \u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d: \u00ab" + newTitle + "\u00bb");
      removePendingCommand(intentId);
    } catch (err) {
      await ctx.editMessageText("\u274c \u041e\u0448\u0438\u0431\u043a\u0430: " + err.message);
    }
    await ctx.answerCbQuery();
  });

  // Другой вариант
  bot.action(/^cmd_retry_(.+)$/, async (ctx) => {
    const intentId = ctx.match[1];
    const intent = loadPendingCommand(intentId);
    if (!intent) return ctx.answerCbQuery("\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430");

    intent.retryCount = (intent.retryCount || 0) + 1;
    const result = await executeAction(intent, { dryRun: true, retry: true });

    // Если suggest_news_titles — показать новые варианты как кнопки
    if (intent.intent === "suggest_news_titles" && result.suggestions) {
      const buttons = result.suggestions.map((title, i) => ([
        { text: (i + 1) + ". " + title.slice(0, 50), callback_data: "cmd_pick_title_" + intentId + "_" + i }
      ]));
      buttons.push([{ text: "\u274c \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c", callback_data: "cmd_cancel_" + intentId }]);
      buttons.push([{ text: "\uD83D\uDD04 \u0414\u0440\u0443\u0433\u0438\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u044b", callback_data: "cmd_retry_" + intentId }]);

      intent.suggestions = result.suggestions;
      savePendingCommand(intent);

      await ctx.editMessageText(
        "\uD83D\uDCDD *\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043a\u0430*\n\n\u0422\u0435\u043a\u0443\u0449\u0438\u0439: _" + result.oldValue + "_\n\n" + result.newValue,
        {
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: buttons },
        }
      );
      await ctx.answerCbQuery();
      return;
    }

    const preview = buildPreview(intent, result);

    await ctx.editMessageText(preview.text, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "\u2705 \u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c", callback_data: `cmd_apply_${intentId}` },
            { text: "\u274C \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c", callback_data: `cmd_cancel_${intentId}` },
          ],
          [
            { text: "\uD83D\uDD04 \u0415\u0449\u0451 \u0432\u0430\u0440\u0438\u0430\u043d\u0442", callback_data: `cmd_retry_${intentId}` },
          ],
        ],
      },
    });
    savePendingCommand(intent);
    await ctx.answerCbQuery();
  });
}

// Хранение pending commands
function loadPendingCommand(id) {
  try {
    const data = JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8"));
    return data[id] || null;
  } catch { return null; }
}

function savePendingCommand(intent) {
  let data = {};
  try { data = JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8")); } catch {}
  data[intent.id] = intent;
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2));
}

function removePendingCommand(id) {
  try {
    const data = JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8"));
    delete data[id];
    fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2));
  } catch {}
}

// Деплой изменений
function deployChanges(commitMessage) {
  const { execSync } = require("child_process");
  const safe = commitMessage.replace(/"/g, '\\"');
  try {
    execSync(`cd /var/www/activeplay-store && git add -A && git commit -m "${safe}" && git push`, { timeout: 30000 });
    console.log("[CMD] Deployed");
  } catch (err) {
    console.error(`[CMD] Deploy error: ${err.message}`);
    throw new Error("\u0414\u0435\u043f\u043b\u043e\u0439 \u043d\u0435 \u0443\u0434\u0430\u043b\u0441\u044f: " + err.message);
  }
}

function hasActivePreview() {
  try {
    const pendingPath = "/var/www/activeplay-store/agent/data/pending-news.json";
    const pending = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));
    return Array.isArray(pending) && pending.length > 0;
  } catch { return false; }
}

module.exports = { handleCommand, setupCommandHandlers, hasActivePreview };
