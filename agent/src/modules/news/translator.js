const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const SYSTEM_PROMPT = `Ты — редактор новостного канала ActivePlay об игровой индустрии.
Переведи и перепиши новость на русский в ТРЁХ форматах.

ПРАВИЛА:
1. Тон: живой рассказчик, НЕ робот, НЕ канцелярия, НЕ "братан/го"
2. Если источник — инсайдер: "по данным инсайдера [имя]"
3. Не выдумывай факты
4. Определи категорию: Новость / Анонс / Обзор / Интервью / Гайд / Слух / Скидки / Видео

ОТВЕТ СТРОГО JSON (без backticks):
{
  "category": "...",
  "telegram": { "title": "...", "text": "... макс 800 символов, эмодзи, хэштеги" },
  "vk": { "title": "...", "text": "... макс 2000 символов, хэштеги" },
  "site": { "title": "...", "text": "... 5-8 предложений", "metaDescription": "... 150 символов", "tags": ["...", "..."] }
}`;

async function translateAndRewrite(article) {
  const userPrompt = `ИСХОДНИК:
Заголовок: ${article.title}
Текст: ${(article.description || '').substring(0, 3000)}
Источник: ${article.sourceName}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: `${SYSTEM_PROMPT}\n\n${userPrompt}` }
      ],
    });

    const text = response.content[0]?.text || '';

    // Парсинг JSON из ответа
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[NEWS] Translator: no JSON in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Валидация обязательных полей
    if (!parsed.telegram || !parsed.site) {
      console.error('[NEWS] Translator: missing required fields');
      return null;
    }

    // Обрезка по лимитам
    if (parsed.telegram.text && parsed.telegram.text.length > 800) {
      parsed.telegram.text = parsed.telegram.text.substring(0, 797) + '...';
    }
    if (parsed.vk && parsed.vk.text && parsed.vk.text.length > 2000) {
      parsed.vk.text = parsed.vk.text.substring(0, 1997) + '...';
    }
    if (parsed.site.metaDescription && parsed.site.metaDescription.length > 160) {
      parsed.site.metaDescription = parsed.site.metaDescription.substring(0, 157) + '...';
    }

    console.log(`[NEWS] Translated: ${parsed.site.title} [${parsed.category}]`);
    return parsed;
  } catch (err) {
    console.error(`[NEWS] Translator error: ${err.message}`);
    return null;
  }
}

module.exports = { translateAndRewrite };
