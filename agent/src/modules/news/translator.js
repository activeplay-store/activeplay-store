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
- "Хайп" — реакция игроков, комьюнити, Steam-отзывы, Reddit
- "Инсайд" — инсайдеры (Dealabs, Schreier, Bloomberg, Jeff Grubb)
- "Слух" — слух без подтверждения, неизвестный источник
- "Анонс" — официальный анонс новой игры или контента
- "Обзор" — рецензия, обзор от журналиста

- Текст пиши связными абзацами по 2-3 предложения. НЕ разбивай каждое предложение на отдельную строку
- Разделяй абзацы двойным переносом строки (\\n\\n)
- Максимум 3 абзаца для telegram, максимум 4 для site

КАЧЕСТВО ЯЗЫКА:
- Пиши красивым литературным русским языком
- Никакой тавтологии. Не повторяй одно слово дважды в абзаце
- Используй синонимы: "игра" → "тайтл", "проект", "релиз". "Вышла" → "стартовала", "дебютировала", "появилась"
- Короткие предложения с прилагательными. Не больше 12-15 слов
- Без причастных и деепричастных оборотов. Без сложноподчинённых конструкций
- Без канцелярита: "осуществить", "данный", "является", "в рамках", "на сегодняшний день"
- Каждое предложение должно нести новую мысль или факт

ЗАГОЛОВОК:
- 5-10 слов, по ключам, SEO-дружелюбный
- Называй игру/продукт + что произошло
- Без двоеточий и тире в заголовке
- НЕ добавляй категорию в заголовок

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

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[NEWS] Translator: no JSON in response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.telegram || !parsed.site) {
      console.error('[NEWS] Translator: missing required fields');
      return null;
    }

    // Лимиты
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

const FULL_ARTICLE_PROMPT = `Ты — главный редактор ActivePlay, крупнейшего российского магазина игровых подписок (PS Plus, Xbox Game Pass, EA Play). 52 000+ клиентов с 2022 года.

ЗАДАЧА: переведи и перепиши новость для сайта activeplay.games. Каждая новость = воронка в продажу.

ИСХОДНИК:
Заголовок: {title}
Текст: {translatedDescription}
Источник: {sourceName}

ДОПОЛНИТЕЛЬНЫЕ ФАКТЫ:
{enrichedContext}

═══════════════════════════════════════
СТРУКТУРА ТЕКСТА ДЛЯ САЙТА (строго 4 абзаца, разделённые двойным переводом строки):
═══════════════════════════════════════

Абзац 1 — ФАКТ: что произошло, кто сообщил, когда. Конкретика, цифры, даты. Без воды.

Абзац 2 — ДЕТАЛИ: подробности новости. Жанр, геймплей, особенности. Если анонс — что известно о проекте. Если скидки — какие игры, какие %, до какого числа.

Абзац 3 — КОНТЕКСТ: почему это важно. Отсылки к предыдущим играм разработчика, сравнение с конкурентами, что говорят критики/игроки. Живой анализ, не пересказ пресс-релиза.

Абзац 4 — ВОРОНКА: плавный переход к продукту ActivePlay. Если Xbox — «оформить Xbox Game Pass можно через ActivePlay». Если PlayStation — «подписка PS Plus доступна в ActivePlay от 1 250 рублей в месяц». Если мультиплатформа — предложить оба варианта. Конкретная цена, конкретный продукт.

ОБЩИЙ ОБЪЁМ текста для сайта: минимум 1000 знаков, оптимально 1500-2000. Абзацы разделяй двойным переносом строки.

═══════════════════════════════════════
ПРАВИЛА ЯЗЫКА (ОБЯЗАТЕЛЬНЫЕ):
═══════════════════════════════════════

- Живой русский, как компетентный человек рассказывает новость
- Короткие предложения: 12-15 слов максимум
- БЕЗ канцеляризмов: НЕ «данная информация свидетельствует», НЕ «стоит отметить что», НЕ «представляет собой»
- БЕЗ длинных тире в середине предложений
- БЕЗ риторических вопросов
- БЕЗ слов: «геймеры», «проект обещает», «порадовать игроков», «не оставит равнодушным»
- Конкретика вместо общих слов: не «много игр», а «4 игры»; не «скоро», а «6 апреля»
- Без причастных и деепричастных оборотов
- Каждое предложение = новая мысль или факт

═══════════════════════════════════════
ЗАГОЛОВОК ДЛЯ САЙТА:
═══════════════════════════════════════

- SEO-формат с конкретикой, 60-80 символов
- НЕ кликбейт, НЕ вопрос
- Хорошо: «Borderlands 4 получит DLC Mad Ellie — первые подробности»
- Плохо: «Новая игра скоро выйдет — вот что известно»
- НЕ добавляй категорию в заголовок

═══════════════════════════════════════
ОПРЕДЕЛИ ПЛАТФОРМУ:
═══════════════════════════════════════

- Если в тексте Xbox, Game Pass, Microsoft → platform: "xbox"
- Если PlayStation, PS5, PS4, PS Plus, Sony → platform: "playstation"
- Если Nintendo, Switch → platform: "nintendo"
- Если Steam, PC, Epic → platform: "pc"
- Если несколько платформ → platform: "multi"
- Если невозможно определить → platform: "general"

═══════════════════════════════════════
ОПРЕДЕЛИ CTA:
═══════════════════════════════════════

- xbox → ctaType: "gamepass", ctaText: "Xbox Game Pass", ctaLink: "/subscriptions"
- playstation (скидка/конкретная игра) → ctaType: "deals", ctaText: "Скидки PS Store", ctaLink: "/sale"
- playstation (подписка/каталог) → ctaType: "psplus", ctaText: "PS Plus от 1 250 руб/мес", ctaLink: "/subscriptions"
- nintendo → ctaType: "general", ctaText: "Подписки и игры", ctaLink: "/subscriptions"
- pc → ctaType: "general", ctaText: "Xbox Game Pass PC", ctaLink: "/subscriptions"
- multi → ctaType: "general", ctaText: "Подписки от 1 250 руб/мес", ctaLink: "/subscriptions"
- general → ctaType: "deals", ctaText: "Скидки на игры", ctaLink: "/sale"

═══════════════════════════════════════
ПРИМЕР ЭТАЛОННОГО ТЕКСТА:
═══════════════════════════════════════

Заголовок: "ARC Raiders Flashpoint выходит в ранний доступ — кооперативный шутер от бывших разработчиков Battlefield"

Текст:
"Студия Embark Studios объявила дату раннего доступа ARC Raiders Flashpoint. Кооперативный шутер на троих появится в Steam 5 июня 2026 года. Ценник — 299 шведских крон (около 2 500 рублей).

Embark Studios основали бывшие разработчики DICE, работавшие над серией Battlefield. ARC Raiders Flashpoint предлагает PvE-миссии против армии роботов. Игроки исследуют полуоткрытые локации, собирают лут и прокачивают персонажей.

Первый трейлер ARC Raiders показали ещё в 2021 году. Тогда проект выглядел как PvPvE-экстракшн. За пять лет концепция изменилась — теперь это чистый PvE-кооператив. Критики отмечают сходство с Deep Rock Galactic и Helldivers 2.

ARC Raiders Flashpoint выйдет на PS5, Xbox Series и PC. Оформить подписку PS Plus или Xbox Game Pass можно в ActivePlay — от 1 250 рублей в месяц. Игра входит в каталог Game Pass с первого дня."

═══════════════════════════════════════
ФОРМАТ ОТВЕТА — СТРОГО JSON:
═══════════════════════════════════════

Ответь ТОЛЬКО JSON. Без маркдауна, без backticks, без пояснений.

{
  "category": "Новость|Анонс|Инсайд|Слух|Хайп",
  "platform": "xbox|playstation|nintendo|pc|multi|general",
  "ctaType": "gamepass|psplus|deals|general",
  "ctaText": "Текст кнопки CTA",
  "ctaLink": "/subscriptions или /sale",
  "site": {
    "title": "SEO-заголовок 60-80 символов",
    "text": "Полный текст, минимум 1000 знаков, 4 абзаца через \\n\\n",
    "metaDescription": "Мета-описание 140-160 символов",
    "tags": ["тег1", "тег2", "тег3", "тег4", "тег5"]
  },
  "telegram": {
    "title": "Заголовок для TG (короче, ярче)",
    "text": "3-5 предложений, суть + зацепка. Макс 800 символов. Хэштеги в конце."
  },
  "vk": {
    "title": "Заголовок для VK",
    "text": "5-8 предложений, подробнее чем TG. Макс 2000 символов. Хэштеги в конце."
  },
  "gameSlug": "slug-игры-если-есть-на-сайте-или-null",
  "relatedProduct": "ps-plus-extra|ps-plus-essential|xbox-game-pass|ea-play|fc-points|null"
}`;

// ═══ Пост-обработка текста: чистка канцеляризмов и литеральных \n\n ═══
function postProcessText(text) {
  if (!text) return text;
  let processed = text;

  // 1. Фикс литеральных \n\n → реальные переводы строк
  processed = processed.replace(/\\n\\n/g, '\n\n');
  processed = processed.replace(/\\n/g, '\n');

  // 2. Удалить канцеляризмы (авторемонт типичных паттернов Gemini)
  const replacements = [
    [/стоит отметить,?\s*что/gi, ''],
    [/нельзя не отметить,?\s*что/gi, ''],
    [/представляет собой/gi, '\u2014'],
    [/является/gi, '\u2014'],
    [/данн(ый|ая|ое|ые)\s/gi, 'этот '],
    [/осуществлять/gi, 'делать'],
    [/в настоящее время/gi, 'сейчас'],
    [/на сегодняшний день/gi, 'сейчас'],
    [/в рамках/gi, 'в'],
    [/не оставит равнодушн\S*/gi, 'заинтересует'],
    [/порадует геймеров/gi, ''],
    [/порадовать игроков/gi, ''],
  ];

  for (const [pattern, replacement] of replacements) {
    processed = processed.replace(pattern, replacement);
  }

  // 3. Убрать двойные пробелы после замен
  processed = processed.replace(/  +/g, ' ').trim();

  // 4. Убрать пустые предложения (. . или  .)
  processed = processed.replace(/\.\s*\./g, '.').trim();

  return processed;
}

const GEMINI_URL_LITE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

async function callGemini(prompt, maxTokens = 4000) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');

  const models = [
    { url: GEMINI_URL, name: 'gemini-2.0-flash' },
    { url: GEMINI_URL_LITE, name: 'gemini-2.0-flash-lite' },
  ];

  for (const model of models) {
    try {
      const response = await axios.post(`${model.url}?key=${key}`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
      }, {
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' },
      });

      const result = response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .filter(Boolean)
        .join('') || '';

      if (result) {
        console.log(`[NEWS] Gemini OK via ${model.name}`);
        return result;
      }
    } catch (err) {
      const status = err.response?.status || 0;
      const msg = err.response?.data?.error?.message || err.message;
      console.warn(`[NEWS] ${model.name} failed (${status}): ${msg.substring(0, 120)}`);

      // Only fallback on quota/rate errors (429) or server errors (5xx)
      if (status === 429 || status >= 500) {
        console.log(`[NEWS] Trying fallback model...`);
        continue;
      }
      // For other errors (400, 403, etc.) — throw immediately
      throw err;
    }
  }

  throw new Error('All Gemini models failed');
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

  const MIN_CHARS = 800;
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const retryHint = attempt > 1
        ? '\n\nВНИМАНИЕ: предыдущий текст был слишком коротким. Нужно минимум 1000 символов для site.text. Раскрой тему подробнее, добавь контекст и детали.'
        : '';

      const text = await callGemini(prompt + retryHint);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[NEWS] generateFullArticle: no JSON in response');
        if (attempt < MAX_ATTEMPTS) continue;
        return null;
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.site?.text || !parsed.site?.title) {
        console.error('[NEWS] generateFullArticle: missing required fields');
        if (attempt < MAX_ATTEMPTS) continue;
        return null;
      }

      // Пост-обработка текстов
      parsed.site.text = postProcessText(parsed.site.text);
      if (parsed.telegram?.text) parsed.telegram.text = postProcessText(parsed.telegram.text);
      if (parsed.vk?.text) parsed.vk.text = postProcessText(parsed.vk.text);

      // Гарантия воронки: если текст не содержит "ActivePlay" — дописать
      if (!parsed.site.text.includes('ActivePlay')) {
        const defaultFunnels = {
          playstation: '\n\nОформить подписку PS Plus для доступа к сотням игр можно в ActivePlay. Цены от 1 250 \u20BD/мес, активация за 10 минут.',
          xbox: '\n\nXbox Game Pass открывает доступ к сотням игр по подписке. Оформить можно в ActivePlay \u2014 быстро, из России, оплата в рублях.',
          multi: '\n\nПодписки PS Plus и Xbox Game Pass доступны в ActivePlay от 1 250 \u20BD/мес. Более 52 000 клиентов с 2022 года.',
          pc: '\n\nXbox Game Pass PC доступен в ActivePlay. Сотни игр по подписке, оформление из России за 10 минут.',
          general: '\n\nПодписки PS Plus и Xbox Game Pass доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
        };
        const plat = parsed.platform || 'general';
        const funnel = defaultFunnels[plat] || defaultFunnels.general;
        parsed.site.text += funnel;
        console.log(`[NEWS] Funnel appended (platform: ${plat})`);
      }

      // Валидация длины
      if (parsed.site.text.length < MIN_CHARS) {
        console.log(`[NEWS] Text too short (${parsed.site.text.length} chars, need ${MIN_CHARS}), attempt ${attempt}/${MAX_ATTEMPTS}`);
        if (attempt < MAX_ATTEMPTS) continue;
        console.warn(`[NEWS] Accepting short text (${parsed.site.text.length} chars) after ${MAX_ATTEMPTS} attempts`);
      }

      // Лимиты
      if (parsed.telegram?.text?.length > 800) {
        parsed.telegram.text = parsed.telegram.text.substring(0, 797) + '...';
      }
      if (parsed.vk?.text?.length > 2000) {
        parsed.vk.text = parsed.vk.text.substring(0, 1997) + '...';
      }
      if (parsed.site.metaDescription?.length > 160) {
        parsed.site.metaDescription = parsed.site.metaDescription.substring(0, 157) + '...';
      }

      console.log(`[NEWS] Full article: ${parsed.site.title} (${parsed.site.text.length} chars, platform: ${parsed.platform || 'unknown'}, cta: ${parsed.ctaType || 'none'})`);
      return parsed;
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      console.error(`[NEWS] generateFullArticle error (attempt ${attempt}): ${msg}`);
      if (attempt >= MAX_ATTEMPTS) return null;
    }
  }

  return null;
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
      console.log(`[NEWS] Headline: "${title}" \u2192 "${cleaned}"`);
      return cleaned;
    }
    return title;
  } catch (err) {
    console.error(`[NEWS] checkHeadline error: ${err.message}`);
    return title;
  }
}

module.exports = { translateAndRewrite, generateFullArticle, checkHeadline, postProcessText };
