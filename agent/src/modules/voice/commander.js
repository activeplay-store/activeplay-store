const axios = require('axios');

async function parseCommand(text) {
  const prompt = `Ты AI-помощник агента ActivePlay. Тебе пришла голосовая команда от владельца магазина.

Определи тип команды и верни JSON.

КОМАНДЫ:
1. Редактирование новости: "поменяй заголовок", "измени первый абзац", "убери последнее предложение", "замени текст на...", "поменяй в тексте..."
2. Публикация: "опубликуй в телеграм", "опубликуй на сайт", "опубликуй везде"
3. Запрос: "покажи курс", "статус"
4. Управление: "запусти парсинг", "запусти новости"

Для редактирования определи:
- field: "title" (заголовок), "paragraph_N" (конкретный абзац, N = номер 1-4), "content" (весь текст), "last_paragraph" (последний абзац)
- instruction: что именно нужно сделать (краткая инструкция для AI-редактора)

Текст команды: "${text.replace(/"/g, '\\"')}"

ОТВЕТ СТРОГО JSON:`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 15000 }
    );
    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = content.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('[VOICE] Commander error:', err.message);
    return null;
  }
}

// Применить редактирование к тексту с помощью AI
async function applyEdit(originalText, field, instruction) {
  let targetText = originalText;
  let prefix = '';
  let suffix = '';

  // Если редактируем конкретный абзац — извлечь его
  const paragraphs = originalText.split(/\n\n+/);
  const paragraphMatch = field.match(/^paragraph_(\d+)$/);

  if (paragraphMatch) {
    const idx = parseInt(paragraphMatch[1]) - 1;
    if (idx >= 0 && idx < paragraphs.length) {
      targetText = paragraphs[idx];
      prefix = paragraphs.slice(0, idx).join('\n\n');
      suffix = paragraphs.slice(idx + 1).join('\n\n');
    }
  } else if (field === 'last_paragraph') {
    targetText = paragraphs[paragraphs.length - 1];
    prefix = paragraphs.slice(0, -1).join('\n\n');
    suffix = '';
  } else if (field === 'first_paragraph' || field === 'paragraph_1') {
    targetText = paragraphs[0];
    prefix = '';
    suffix = paragraphs.slice(1).join('\n\n');
  }

  const prompt = `Ты редактор текста. Отредактируй текст по инструкции.

ТЕКСТ:
${targetText}

ИНСТРУКЦИЯ: ${instruction}

ПРАВИЛА:
- Сохрани стиль и тональность
- НЕ добавляй ничего лишнего
- Верни ТОЛЬКО отредактированный текст, без пояснений и кавычек`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 15000 }
    );
    const editedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = editedText.trim();

    if (!cleaned) return null;

    // Собрать обратно
    if (paragraphMatch || field === 'last_paragraph' || field === 'first_paragraph' || field === 'paragraph_1') {
      const parts = [prefix, cleaned, suffix].filter(p => p.trim());
      return parts.join('\n\n');
    }

    return cleaned;
  } catch (err) {
    console.error('[VOICE] applyEdit error:', err.message);
    return null;
  }
}

module.exports = { parseCommand, applyEdit };
