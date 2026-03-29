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

КАТЕГОРИИ:
- "Новость" — официальный блог (PlayStation Blog, Xbox Wire, студия)
- "Хайп" — реакция игроков, комьюнити, Steam-отзывы, Reddit ("игроки разносят", "комьюнити обсуждает", "в Steam бомбят отзывами")
- "Инсайд" — инсайдеры (Dealabs, Schreier, Bloomberg, Jeff Grubb)
- "Слух" — слух без подтверждения, неизвестный источник
- "Анонс" — официальный анонс новой игры или контента
- "Обзор" — рецензия, обзор от журналиста

- Текст пиши связными абзацами по 2-3 предложения. НЕ разбивай каждое предложение на отдельную строку
- Разделяй абзацы двойным переносом строки (\n\n)
- Максимум 3 абзаца для telegram, максимум 4 для site

КАЧЕСТВО ЯЗЫКА:
- Пиши красивым литературным русским языком
- Никакой тавтологии. Не повторяй одно слово дважды в абзаце
- Используй синонимы: "игра" → "тайтл", "проект", "релиз". "Вышла" → "стартовала", "дебютировала", "появилась"
- Короткие предложения с прилагательными. Не больше 12-15 слов
- Без причастных и деепричастных оборотов. Без сложноподчинённых конструкций
- Без канцелярита: "осуществить", "данный", "является", "в рамках", "на сегодняшний день"
- Без тавтологии типа "игра... игра... игроков... игровой"
- Каждое предложение должно нести новую мысль или факт

ПРИМЕР ПЛОХОГО ТЕКСТА:
"Утечка раскрыла одну из игр, которая появится в PS Plus Essential в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen."
(тавтология: "игр" + "игрой", вялое начало)

ПРИМЕР ХОРОШЕГО ТЕКСТА:
"Dealabs слил апрельскую раздачу PS Plus Essential. Главный тайтл месяца: Lords of the Fallen в версии 2023 года. Не путать с оригиналом 2014-го: здесь другая студия, другой движок и совершенно другой уровень."
(без повторов, каждое предложение = новый факт)

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
  "category": "Новость/Анонс/Обзор/Слух/Инсайд/Хайп/Скидки/Гайд/Видео/Интервью",
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

// ====== PIPELINE V2: полная генерация текста с обогащённым контекстом ======

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const FULL_ARTICLE_PROMPT = `Ты — главный редактор новостного канала ActivePlay о видеоиграх. Аудитория — русскоязычные геймеры.

ЗАДАЧА: Написать новость на русский язык в трёх форматах (сайт, Telegram, VK).

ИСХОДНИК:
Заголовок: {title}
Текст: {translatedDescription}
Источник: {sourceName}

ДОПОЛНИТЕЛЬНЫЕ ФАКТЫ:
{enrichedContext}

═══════════════════════════════════════
ПРАВИЛА ЯЗЫКА (ОБЯЗАТЕЛЬНЫЕ):
═══════════════════════════════════════

1. Живой русский. Пишешь как рассказываешь другу, который тоже геймер.
2. Короткие предложения. Максимум 15 слов в предложении.
3. Без канцелярита. Запрещено: «стоит отметить», «данная информация», «важно подчеркнуть», «следует обратить внимание», «в рамках», «является», «осуществлять».
4. Без причастных и деепричастных оборотов. Вместо «вышедшая на прошлой неделе игра» — «игра вышла на прошлой неделе».
5. Без длинных тире в начале предложений.
6. Без риторических вопросов.
7. Конкретика. Если в патче 5 маунтов — назови их. Если продали 3 млн — напиши 3 млн.

═══════════════════════════════════════
СТРУКТУРА ТЕКСТА ДЛЯ САЙТА (3 блока):
═══════════════════════════════════════

БЛОК 1 — НОВОСТЬ ПОДРОБНО (60% текста)
Что случилось. Все детали из исходника и дополнительных фактов. Конкретные названия, цифры, механики, даты. Не пересказывай одним предложением — раскрывай.

БЛОК 2 — ОБЩИЙ КОНТЕКСТ (30% текста)
Что это за игра/консоль/подписка. Кто разработчик. Когда вышла. Сколько продали. На каких платформах. Почему это интересно. Для тех кто НЕ в теме — чтобы поняли зачем читать.

БЛОК 3 — ВОРОНКА (10% текста)
Если игра продаётся на ActivePlay — плавный переход: «{Название} доступна в магазине ActivePlay от {цена} рублей.» Если это подписка — упомянуть подписку. Если продукт не продаётся — пропустить этот блок.

ОБЩИЙ ОБЪЁМ текста для сайта: минимум 1000 знаков, оптимально 1500-2000. Абзацы разделяй двойным переносом строки.

═══════════════════════════════════════
ЗАГОЛОВОК ДЛЯ САЙТА:
═══════════════════════════════════════

- Включи название игры/продукта
- Включи самый яркий факт из новости
- Включи SEO-ключевики (патч, обновление, скидка, PS Plus, дата выхода — что подходит)
- Максимум 80 символов
- Без кликбейта, но с зацепкой
- НЕ добавляй категорию в заголовок

═══════════════════════════════════════
ФОРМАТ ОТВЕТА — СТРОГО JSON:
═══════════════════════════════════════

Ответь ТОЛЬКО JSON. Без маркдауна, без backticks, без пояснений.

{
  "category": "Новость|Анонс|Инсайд|Слух|Хайп",
  "site": {
    "title": "SEO-заголовок 60-80 символов",
    "text": "Полный текст, минимум 1000 знаков, абзацы через \\n\\n",
    "metaDescription": "Мета-описание 140-160 символов",
    "tags": ["тег1", "тег2", "тег3", "тег4", "тег5"]
  },
  "telegram": {
    "title": "Заголовок для TG (короче, ярче)",
    "text": "3-5 предложений, суть + зацепка. Макс 600 символов. Хэштеги в конце."
  },
  "vk": {
    "title": "Заголовок для VK",
    "text": "5-8 предложений, подробнее чем TG. Макс 1500 символов. Хэштеги в конце."
  },
  "gameSlug": "slug-игры-если-есть-на-сайте-или-null",
  "relatedProduct": "ps-plus-extra|ps-plus-essential|xbox-game-pass|ea-play|fc-points|null"
}`;

async function callGemini(prompt, maxTokens = 4000) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');

  const response = await axios.post(`${GEMINI_URL}?key=${key}`, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  }, {
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data?.candidates?.[0]?.content?.parts
    ?.map(p => p.text)
    .filter(Boolean)
    .join('') || '';
}

// Генерация полноценной статьи с обогащённым контекстом
async function generateFullArticle(article, enrichedContext) {
  const title = article.site?.title || article.title || '';
  const description = article.site?.text || article.description || '';
  const source = article.sourceName || '';

  const prompt = FULL_ARTICLE_PROMPT
    .replace('{title}', title)
    .replace('{translatedDescription}', description.substring(0, 3000))
    .replace('{sourceName}', source)
    .replace('{enrichedContext}', enrichedContext || 'Нет дополнительных фактов.');

  try {
    const text = await callGemini(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[NEWS] generateFullArticle: no JSON in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.site?.text || !parsed.site?.title) {
      console.error('[NEWS] generateFullArticle: missing required fields');
      return null;
    }

    // Лимиты
    if (parsed.telegram?.text?.length > 600) {
      parsed.telegram.text = parsed.telegram.text.substring(0, 597) + '...';
    }
    if (parsed.vk?.text?.length > 1500) {
      parsed.vk.text = parsed.vk.text.substring(0, 1497) + '...';
    }
    if (parsed.site.metaDescription?.length > 160) {
      parsed.site.metaDescription = parsed.site.metaDescription.substring(0, 157) + '...';
    }

    console.log(`[NEWS] Full article: ${parsed.site.title} (${parsed.site.text.length} chars)`);
    return parsed;
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`[NEWS] generateFullArticle error: ${msg}`);
    return null;
  }
}

// Проверка и улучшение заголовка (отдельный вызов)
async function checkHeadline(title, summary) {
  const prompt = `Проверь заголовок новости для игрового сайта ActivePlay.

Заголовок: ${title}
Тема новости: ${summary}

Критерии:
1. Есть конкретика (цифры, названия, даты)?
2. Есть SEO-ключевики по которым люди ищут?
3. Длина 60-80 символов?
4. Цепляет внимание?
5. Нет канцелярита?

Если заголовок хорош — верни его как есть.
Если можно улучшить — верни улучшенный вариант.

Ответь ТОЛЬКО заголовком, без пояснений.`;

  try {
    const result = await callGemini(prompt, 200);
    const cleaned = result.trim().replace(/^["']|["']$/g, '');
    if (cleaned && cleaned.length >= 20 && cleaned.length <= 120) {
      console.log(`[NEWS] Headline: "${title}" → "${cleaned}"`);
      return cleaned;
    }
    return title;
  } catch (err) {
    console.error(`[NEWS] checkHeadline error: ${err.message}`);
    return title;
  }
}

module.exports = { translateAndRewrite, generateFullArticle, checkHeadline };
