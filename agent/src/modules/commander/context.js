const fs = require("fs");
const path = require("path");

const CONTEXT_FILE = path.join(__dirname, "../../../data/commander-context.json");
const CONTEXT_TTL = 10 * 60 * 1000; // 10 минут

function getContext(chatId) {
  try {
    const data = JSON.parse(fs.readFileSync(CONTEXT_FILE, "utf-8"));
    const ctx = data[String(chatId)];
    if (!ctx) return null;

    // Проверить TTL
    if (Date.now() - ctx.timestamp > CONTEXT_TTL) {
      clearContext(chatId);
      return null;
    }
    return ctx;
  } catch { return null; }
}

function setContext(chatId, contextData) {
  let data = {};
  try { data = JSON.parse(fs.readFileSync(CONTEXT_FILE, "utf-8")); } catch {}

  data[String(chatId)] = {
    ...contextData,
    timestamp: Date.now(),
  };

  fs.writeFileSync(CONTEXT_FILE, JSON.stringify(data, null, 2));
}

function clearContext(chatId) {
  try {
    const data = JSON.parse(fs.readFileSync(CONTEXT_FILE, "utf-8"));
    delete data[String(chatId)];
    fs.writeFileSync(CONTEXT_FILE, JSON.stringify(data, null, 2));
  } catch {}
}

module.exports = { getContext, setContext, clearContext };
