const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

const SYSTEM_PROMPT = `Ты редактор новостного канала ActivePlay. Перепиши новость на русский.

ПРАВИЛА ЯЗЫКА:
- Пиши как рассказываешь другу: живо, просто, без канцелярита
- НЕ используй длинные тире (\u2014), заменяй на двоеточие, точку или перестраивай предложение
- НЕ используй конструкции "данный", "является", "осуществляет", "в рамках"
- Короткие предложения. Максимум 15 слов в предложении
- Заголовок: 5-8 слов, цепляющий, без двоеточий и тире
- Никаких риторических вопросов в конце ("Готовы ли геймеры?", "Сможет ли?")
- Не начинай текст со слова "Похоже"
- Если источник инсайдер: "по данным инсайдера [имя]"
- Не выдумывай факты

Категория: Новость / Анонс / Обзор / Интервью / Гайд / Слух / Скидки / Видео

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
    const response = await axios.post(OPENROUTER_URL, {
      model: MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });

    const text = response.data?.choices?.[0]?.message?.content || '';

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
    const status = err.response?.status || '';
    const body = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    console.error(`[NEWS] Translator error: ${status} ${body}`);
    return null;
  }
}

module.exports = { translateAndRewrite };
