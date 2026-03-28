const axios = require('axios');

async function executeCommand(text) {
  const prompt = `Ты AI-помощник агента ActivePlay. Тебе пришла голосовая команда от владельца магазина.

Определи тип команды и верни JSON:

КОМАНДЫ:
1. Редактирование новости: "поменяй заголовок на ...", "убери последнее предложение", "добавь абзац ..."
2. Публикация: "опубликуй в телеграм", "опубликуй на сайт", "опубликуй везде"
3. Запрос данных: "покажи курс", "сколько стоит ...", "покажи скидки", "покажи новости"
4. Управление: "запусти парсинг", "покажи статус", "перезапусти агент"
5. Новости: "запусти новости", "покажи топ новостей"

Если команда про редактирование — верни { "action": "edit_news", "field": "title|content|excerpt", "value": "новое значение", "newsSlug": "slug если понятно какая новость" }
Если публикация — { "action": "publish", "targets": ["telegram", "site", "vk"], "newsSlug": "..." }
Если запрос данных — { "action": "query", "type": "rates|price|deals|news|status", "query": "..." }
Если управление — { "action": "control", "command": "parse|restart|status" }
Если новости — { "action": "news", "command": "fetch|top" }

Текст команды: "${text}"

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

module.exports = { executeCommand };
