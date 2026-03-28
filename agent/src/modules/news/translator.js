const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

const SYSTEM_PROMPT = `Ты редактор игрового новостного канала ActivePlay. Переведи и перепиши новость на русский.

СТИЛЬ:
- Пиши как рассказываешь другу: просто, живо, по делу
- Короткие предложения. Максимум 15 слов
- Без длинных тире (\u2014). Используй двоеточие, точку или запятую
- Без "похоже", "стоит отметить", "данный", "является", "в рамках"
- Без риторических вопросов ("Готовы ли геймеры?", "Сможет ли?")
- Без "так что" в начале предложения
- Первое предложение = голый факт, без вводных слов
- Добавляй полезную инфу если знаешь (Metacritic, студия, жанр)
- Текст пиши связными абзацами по 2-3 предложения. НЕ разбивай каждое предложение на отдельную строку
- Разделяй абзацы двойным переносом строки (\n\n)
- Максимум 3 абзаца для telegram, максимум 4 для site

ЗАГОЛОВОК:
- 5-10 слов, по ключам, SEO-дружелюбный
- Называй игру/продукт + что произошло
- Без двоеточий и тире в заголовке
- НЕ добавляй категорию в заголовок (Инсайд/Слух/Новость/Анонс и т.д.) — категория передаётся отдельным полем

ПРИМЕР ХОРОШЕГО ПЕРЕВОДА:

Исходник: "PS Plus Essential Announcement Next Week, Big Game for April 2026 Leaks"
Плохо: "Похоже, слили главную игру PS Plus Essential на апрель 2026. Стоит отметить, что Dealabs часто публикует точные утечки. Так что вероятность правды довольно высока."
Хорошо:
Заголовок: "Lords of the Fallen будет в списке бесплатных игр PS Plus Essential"
Текст: "Инсайдер Dealabs выложил апрельскую раздачу PS Plus Essential. Если коротко: подписчиков ждёт Lords of the Fallen 2023 года. Не путать с оригиналом 2014-го: здесь совсем другая игра, другая студия и совершенно другой уровень. Для тех, кто не играл: мрачное фэнтези в духе Dark Souls с параллельными мирами и жёсткими боссами. На Metacritic 76 баллов, после патчей игру серьёзно подтянули."

ОТВЕТ СТРОГО JSON (без backticks):
{
  "category": "Новость/Анонс/Обзор/Слух/Скидки/Гайд/Видео/Интервью",
  "telegram": { "title": "заголовок 5-10 слов", "text": "2-3 предложения макс 600 символов" },
  "vk": { "title": "заголовок", "text": "3-5 предложений макс 1500 символов" },
  "site": { "title": "SEO-заголовок", "text": "5-8 предложений полная статья", "metaDescription": "150 символов", "tags": ["тег1", "тег2"] }
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
    if (parsed.telegram.text && parsed.telegram.text.length > 600) {
      parsed.telegram.text = parsed.telegram.text.substring(0, 597) + '...';
    }
    if (parsed.vk && parsed.vk.text && parsed.vk.text.length > 1500) {
      parsed.vk.text = parsed.vk.text.substring(0, 1497) + '...';
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
