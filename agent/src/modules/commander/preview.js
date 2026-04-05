function buildPreview(intent, currentState) {
  if (currentState?.skipPreview) {
    return { text: currentState.summary, noButtons: true };
  }

  const old = currentState?.oldValue || "\u2014";
  const newVal = currentState?.newValue || "\u2014";

  const oldShort = truncate(old, 300);
  const newShort = truncate(newVal, 300);

  let text = `\ud83d\udcdd *${escMd(intent.confirmation || "Подтвердите действие")}*\n\n`;
  text += `*Было:*\n${escMd(oldShort)}\n\n`;
  text += `*Стало:*\n${escMd(newShort)}`;

  return { text };
}

function truncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

function escMd(s) {
  if (!s) return s;
  return String(s).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\$1");
}

module.exports = { buildPreview };
