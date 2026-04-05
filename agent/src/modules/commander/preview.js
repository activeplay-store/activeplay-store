function buildPreview(intent, currentState) {
  if (currentState?.skipPreview) {
    return { text: currentState.summary, noButtons: true };
  }

  const old = currentState?.oldValue || "\u2014";
  const newVal = currentState?.newValue || "\u2014";

  // For full-text regeneration, show much more text so editor can evaluate quality
  const isFullRewrite = intent.intent === 'regenerate_news' || currentState?.field === 'full_text';
  const maxOld = isFullRewrite ? 200 : 300;
  const maxNew = isFullRewrite ? 3500 : 300;

  const oldShort = truncate(old, maxOld);
  let newShort = truncate(newVal, maxNew);

  let text = `\ud83d\udcdd *${escMd(intent.confirmation || "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435")}*\n\n`;
  text += `*\u0411\u044b\u043b\u043e:*\n${escMd(oldShort)}\n\n`;
  text += `*\u0421\u0442\u0430\u043b\u043e:*\n${escMd(newShort)}`;

  // Telegram 4096 char limit safety
  if (text.length > 4000) {
    const safeLen = Math.max(300, maxNew - (text.length - 3900));
    newShort = truncate(newVal, safeLen);
    text = `\ud83d\udcdd *${escMd(intent.confirmation || "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435")}*\n\n`;
    text += `*\u0411\u044b\u043b\u043e:*\n${escMd(oldShort)}\n\n`;
    text += `*\u0421\u0442\u0430\u043b\u043e:*\n${escMd(newShort)}`;
  }

  return { text };
}

function truncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

function escMd(s) {
  if (!s) return s;
  return String(s).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

module.exports = { buildPreview };
