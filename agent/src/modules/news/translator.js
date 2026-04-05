const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

const SYSTEM_PROMPT = `Ты редактор игрового новостного канала ActivePlay. Переведи и перепиши новость на русский.

СТИЛЬ:
- Пиши как рассказываешь другу: просто, живо, по делу
- Короткие предложения. Максимум 15 слов
- Без длинных тире (\u2014). Используй двоеточие, точку или запятую
- Без "похоже", "стоит отметить", "данный", "является", "в рамках"
- Без риторических вопро��ов ("Готовы ли геймеры?", "Сможет ли?")
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

- Текст пиши связными абзацами по 2-3 ��редложения. НЕ разбивай каждое предложение на отдельную строку
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

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'google/gemini-flash-1.5',
  'anthropic/claude-3.5-haiku',
];

// ═══════════════════════════════════════════════════════════════════
// ПРОМПТ С FEW-SHOT ПРИМЕРАМИ
// ═══════════════════════════════════════════════════════════════════

const FULL_ARTICLE_PROMPT = `Ты \u2014 главный редактор ActivePlay (activeplay.games), крупнейшего российского магазина игровых подписок. 52 000+ клиентов с 2022 года. Твоя задача \u2014 написать полноценную статью для сайта, а НЕ пост в Telegram.

ИСХОДНИК:
Заголовок: {title}
Текст: {translatedDescription}
Источник: {sourceName}

ДОПОЛНИТЕЛЬНЫЕ ФАКТЫ:
{enrichedContext}

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
СТРУКТУРА СТАТЬИ \u2014 СТРОГО 4 АБЗАЦА
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

Абзац 1 \u2014 ФАКТ (3-4 предложения):
Что случилось. Кто сообщил. Когда. Конкретные цифры и даты. Ни слова воды.

Абзац 2 \u2014 ДЕТАЛИ (4-5 предложений):
Подробности: жанр, механики, особенности геймплея, платформы, системные требования, цена, дата выхода. Если патч \u2014 что конкретно исправлено. Если анонс \u2014 что известно о проекте. Раскрой тему так, чтобы читатель понял, о чём речь, даже если не видел оригинал.

Абзац 3 \u2014 КОНТЕКСТ (3-4 предложения):
Почему это важно. Предыдущие игры студии. Сравнение с конкурентами. Что говорят критики или игроки. Metacritic если есть. Исторический контекст. Этот абзац отличает статью от пересказа \u2014 здесь твоя экспертиза.

Абзац 4 \u2014 ВОРОНКА (2-3 предложения):
Плавный переход к продукту ActivePlay. Упомяни конкретный продукт (PS Plus / Xbox Game Pass / EA Play) с конкретной ценой. Закончи призывом к действию.

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
СТИЛЬ ТЕКСТА
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

- Живой русский. Как компетентный человек рассказывает новость другу.
- Предложения: 12-18 слов. Максимум 22 слова. Никаких простыней.
- Абзацы разделяй ДВОЙНЫМ переводом строки.

ЗАПРЕЩЕНО:
- Канцеляризмы: \u00ABстоит отметить\u00BB, \u00ABпредставляет собой\u00BB, \u00ABв настоящее время\u00BB, \u00ABнельзя не упомянуть\u00BB, \u00ABданный проект\u00BB, \u00ABзаслуживает внимания\u00BB
- Штампы: \u00ABпорадует игроков\u00BB, \u00ABне оставит равнодушным\u00BB, \u00ABгеймеры в восторге\u00BB, \u00ABпроект обещает\u00BB
- Длинные тире (\u2014) в середине предложений
- Риторические вопросы
- Слово \u00ABгеймеры\u00BB (замена: \u00ABигроки\u00BB)
- Общие слова без конкретики: \u00ABмного\u00BB, \u00ABскоро\u00BB, \u00ABинтересный\u00BB, \u00ABкачественный\u00BB

ОБЯЗАТЕЛЬНО:
- Конкретные цифры: не \u00ABмного игр\u00BB, а \u00AB4 игры\u00BB; не \u00ABскоро\u00BB, а \u00AB6 апреля\u00BB
- Названия студий, разработчиков, предыдущих проектов
- Платформы и цены где известно

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
ЗАГОЛОВОК
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

SEO-формат. Конкретика. Название игры + суть новости.
Хорошо: \u00ABCrimson Desert: патч улучшил графику на PS5 Pro в режиме 30 FPS\u00BB
Хорошо: \u00ABSony удалила сотни игр из PS Store \u2014 что произошло и кого затронуло\u00BB
Плохо: \u00ABНовая игра скоро выйдет \u2014 вот что известно\u00BB
Плохо: \u00ABSony сделала важное изменение в магазине\u00BB

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
ДВА ЭТАЛОННЫХ ПРИМЕРА
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

ПРИМЕР 1:

Исходник: "ARC Raiders Flashpoint Early Access date announced for Steam, coming June 5 2026"

Эталонный текст:

Студия Embark Studios назначила дату раннего доступа ARC Raiders Flashpoint. Кооперативный PvE-шутер на троих выходит в Steam 5 июня 2026 года. Стоимость раннего доступа \u2014 299 шведских крон, около 2 500 рублей. На консолях игра появится позже.

ARC Raiders Flashpoint предлагает миссии против армии роботов в полуоткрытых локациях. Игроки выбирают один из нескольких классов, собирают лут и прокачивают снаряжение. Бои сочетают стрельбу с тактическим позицио��ированием. Разработчики обещают регулярные обновления и новый контент каждый сезон.

Embark Studios основали выходцы из DICE, работавшие над серией Battlefield. Первый трейлер ARC Raiders показали ещё в 2021 году как PvPvE-экстракшн. За пять лет концепция изменилась \u2014 теперь это чистый PvE-кооператив. Критики сравнивают проект с Deep Rock Galactic и Helldivers 2.

ARC Raiders Flashpoint выйдет на PS5 и Xbox Series позже в 2026 году. Оформить подписку PS Plus или Xbox Game Pass для доступа к новинкам можно в ActivePlay от 1 250 \u20BD/мес. Активация за 10 минут, оплата в рублях.

ПРИМЕР 2:

Исходник: "Sony removes hundreds of games from PS Store including Jesus Simulator"

Эталонный текст:

Sony провела масштабную чистку PlayStation Store. Компания удалила сотни игр с витрин PS4 и PS5. Среди удалённых проектов оказался Jesus Simulator и десятки других малоизвестных тайтлов. Точное количество удалённых игр Sony не называет.

Чистка затронула в основном низкокачественные проекты. Многие из них имели рейтинг ниже 2 звёзд и минимальное количество загрузок. Часть игр не обновлялась больше двух лет. Sony ужесточила требования к качеству ещё в 2024 году, когда ввела обязательную плату за регистрацию новых проектов.

Это уже третья волна удалений за 2026 год. В январе Sony убрала около 200 тайтлов, в марте \u2014 ещё 150. Игроки восприняли чистку положительно: PlayStation Store давно критиковали за засилье мусорных проектов. Аналогичную политику ведёт Valve в Steam.

Качественные игры из PS Store остаются доступны по подписке PS Plus. Каталог Extra включает сотни тайтлов с высокими оценками. Оформить PS Plus Extra можно в ActivePlay от 1 400 \u20BD/мес. 52 000+ клиентов с 2022 года.

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
ОПРЕДЕЛЕНИЕ ПЛАТФОРМЫ И CTA
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

Определи платформу по содержимому:
- Xbox/Game Pass/Microsoft \u2192 platform: "xbox"
- PlayStation/PS5/PS4/PS Plus/Sony \u2192 platform: "playstation"
- Nintendo/Switch \u2192 platform: "nintendo"
- Steam/PC/Epic \u2192 platform: "pc"
- Несколько платформ \u2192 platform: "multi"
- Невозможно определить \u2192 platform: "general"

CTA по платформе:
- xbox \u2192 ctaType: "gamepass", ctaText: "Xbox Game Pass", ctaLink: "/subscriptions"
- playstation (скидка/игра) \u2192 ctaType: "deals", ctaText: "Скидки PS Store", ctaLink: "/sale"
- playstation (подписка/каталог) \u2192 ctaType: "psplus", ctaText: "PS Plus от 1 250 \u20BD/мес", ctaLink: "/subscriptions"
- multi/general \u2192 ctaType: "general", ctaText: "Подписки от 1 250 \u20BD/мес", ctaLink: "/subscriptions"

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
ФОРМАТ ОТВЕТА
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

ОТВЕТ СТРОГО JSON (без backticks, без markdown, без пояснений):
{
  "category": "Новость",
  "platform": "playstation",
  "ctaType": "psplus",
  "ctaText": "PS Plus от 1 250 \u20BD/мес",
  "ctaLink": "/subscriptions",
  "site": {
    "title": "SEO-заголовок",
    "text": "Абзац1\\n\\nАбзац2\\n\\nАбзац3\\n\\nАбзац4",
    "metaDescription": "Meta description до 160 символов",
    "tags": ["PS5", "Sony", "PS Store"]
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
}

КРИТИЧНО: site.text должен содержать МИНИМУМ 1200 символов. Каждый абзац \u2014 минимум 3 предложения. Всего 4 абзаца разделённые \\n\\n.`;

// ═══ Валидация сгенерированной статьи ═══
function validateArticle(result) {
  const errors = [];
  const siteText = result?.site?.text || '';

  // 1. Длина текста
  if (siteText.length < 1200) {
    errors.push(`text_too_short: ${siteText.length} chars (min 1200)`);
  }

  // 2. Количество абзацев (разделённых \n\n)
  const paragraphs = siteText.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 4) {
    errors.push(`too_few_paragraphs: ${paragraphs.length} (need 4)`);
  }

  // 3. Каждый абзац минимум 2 предложения
  for (let i = 0; i < paragraphs.length; i++) {
    const sentences = paragraphs[i].split(/[.!?]+/).filter(s => s.trim().length > 5);
    if (sentences.length < 2) {
      errors.push(`paragraph_${i + 1}_too_short: ${sentences.length} sentences`);
    }
  }

  // 4. Заголовок
  if (!result?.site?.title || result.site.title.length < 15) {
    errors.push('missing_or_short_title');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ═══ Пост-обработка текста: чистка канцеляризмов и литеральных \n\n ═══
function postProcessText(text) {
  if (!text) return text;
  let processed = text;

  // 1. Фикс литеральных \n\n → реальные переводы строк
  processed = processed.replace(/\\n\\n/g, '\n\n');
  processed = processed.replace(/\\n/g, '\n');

  // 2. Удалить канцеляризм�� (авторемонт типичных паттернов LLM)
  const replacements = [
    [/стоит отметить,?\s*что\s*/gi, ''],
    [/нельзя не отметить,?\s*что\s*/gi, ''],
    [/нельзя не упомянуть,?\s*что\s*/gi, ''],
    [/представляет собой/gi, '\u2014'],
    [/является\s/gi, '\u2014 '],
    [/данн(ый|ая|ое|ые)\s/gi, 'этот '],
    [/осуществлять/gi, 'делать'],
    [/в настоящее время/gi, 'сейчас'],
    [/на сегодняшний день/gi, 'сейчас'],
    [/в рамках\s/gi, 'в '],
    [/не оставит равнодушн\S*/gi, 'заинтересует'],
    [/порадует геймеров/gi, ''],
    [/порадовать игроков/gi, ''],
    [/заслуживает\sвнимания/gi, 'важен'],
    [/геймер(ы|ов|ам|ами)\b/gi, (m) => m.replace(/геймер/i, 'игрок')],
  ];

  for (const [pattern, replacement] of replacements) {
    processed = processed.replace(pattern, replacement);
  }

  // 3. Двойные пробелы (FIX: только горизонтальные пробелы, не трогаем \n\n)
  processed = processed.replace(/ {2,}/g, ' ');
  // 4. Пробел перед точкой
  processed = processed.replace(/ +\./g, '.');
  // 5. Пустые предложения
  processed = processed.replace(/\.\s*\./g, '.');

  return processed.trim();
}

async function callOpenRouter(prompt, maxTokens = 4000) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not set');

  for (const model of OPENROUTER_MODELS) {
    try {
      console.log(`[NEWS] Generating full article via OpenRouter (${model})...`);

      const response = await axios.post(OPENROUTER_URL, {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens,
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://activeplay.games',
          'X-Title': 'ActivePlay News Agent',
        },
        timeout: 60000,
      });

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) {
        console.warn(`[NEWS] OpenRouter (${model}): empty response`);
        continue;
      }

      console.log(`[NEWS] OpenRouter OK via ${model}`);
      return content;
    } catch (err) {
      const status = err.response?.status || 0;
      const msg = err.response?.data?.error?.message || err.message;
      console.warn(`[NEWS] OpenRouter ${model} failed (${status}): ${msg.substring(0, 120)}`);

      // FIX: always try next model on any error (quota errors may come as non-429 status)
      continue;
    }
  }

  throw new Error('All OpenRouter models failed');
}

// ═══ Построение промпта ═══
function buildPrompt(article, enrichedContext) {
  const title = article.site?.title || article.title || '';
  const description = article.site?.text || article.description || '';
  const source = article.sourceName || '';
  const sourceUrl = article.link || article.sourceUrl || '';

  return FULL_ARTICLE_PROMPT
    .replace('{title}', title)
    .replace('{translatedDescription}', description.substring(0, 3000))
    .replace('{sourceName}', source)
    .replace('{sourceUrl}', sourceUrl)
    .replace('{enrichedContext}', enrichedContext || 'Нет дополнительных фактов.');
}

// ═══ Парсинг JSON из ответа LLM ═══
function parseLLMResponse(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.site?.text || !parsed.site?.title) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ═══ Подсчёт абзацев ═══
function countParagraphs(text) {
  if (!text) return 0;
  return text.split(/\n\n+/).filter(p => p.trim()).length;
}

// ═══ Генерация с валидацией и retry (до 3 попыток �� обратной связью) ═══
async function generateFullArticle(article, enrichedContext) {
  const MAX_RETRIES = 2; // итого до 3 попыток
  let lastResult = null;
  const basePrompt = buildPrompt(article, enrichedContext);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      let prompt = basePrompt;

      // Обратная связь на основе предыдущей попытки
      if (attempt > 0 && lastResult) {
        const validation = validateArticle(lastResult);
        const feedback = validation.errors.join('; ');
        prompt += `\n\nВНИМАНИЕ: Предыдущая попытка не прошла валидацию. Ошибки: ${feedback}. Исправь: каждый абзац минимум 3 предложения, всего 4 абзаца, минимум 1200 символов. Раскрой тему подробнее \u2014 добавь детали геймплея, контекст студии, сравнение с другими играми.`;
      } else if (attempt > 0) {
        prompt += '\n\nВНИМАНИЕ: предыдущий ответ не удалось распарсить. Ответь СТРОГО JSON без backticks. Минимум 1200 символов в site.text, 4 абзаца.';
      }

      const text = await callOpenRouter(prompt);
      const parsed = parseLLMResponse(text);

      if (!parsed) {
        console.error(`[NEWS] generateFullArticle: no valid JSON (attempt ${attempt + 1})`);
        lastResult = null;
        continue;
      }

      // Пос��-обработка текстов
      parsed.site.text = postProcessText(parsed.site.text);
      if (parsed.telegram?.text) parsed.telegram.text = postProcessText(parsed.telegram.text);
      if (parsed.vk?.text) parsed.vk.text = postProcessText(parsed.vk.text);

      // Гарантия воронки: если текст не содержит "ActivePlay" — дописать
      if (!parsed.site.text.includes('ActivePlay')) {
        const defaultFunnels = {
          playstation: '\n\nОформить PS Plus можно в ActivePlay от 1 250 \u20BD/мес. Активация за 10 минут, оплата в рублях.',
          xbox: '\n\nXbox Game Pass открывает доступ к сотням игр по подписке. Оформить можно в ActivePlay \u2014 быстро, из России, оплата в рублях.',
          multi: '\n\nПодписки PS Plus и Xbox Game Pass доступны в ActivePlay от 1 250 \u20BD/мес. 52 000+ клиентов с 2022 года.',
          pc: '\n\nXbox Game Pass PC доступен в ActivePlay. Сотни игр по подписке, оформление из России за 10 минут.',
          general: '\n\nИгровые подписки PS Plus, Xbox Game Pass и EA Play доступны в ActivePlay от 1 250 \u20BD/мес.',
        };
        const plat = parsed.platform || 'general';
        parsed.site.text += defaultFunnels[plat] || defaultFunnels.general;
        console.log(`[NEWS] Funnel appended (platform: ${plat})`);
      }

      // Валидация с детальным логированием
      const validation = validateArticle(parsed);
      const pars = countParagraphs(parsed.site.text);
      console.log(`[NEWS] Attempt ${attempt + 1}: text=${parsed.site.text?.length || 0} chars, paragraphs=${pars}, valid=${validation.valid}, errors=${JSON.stringify(validation.errors)}`);
      if (validation.valid) {
        console.log(`[NEWS] Article passed validation on attempt ${attempt + 1} (${parsed.site.text.length} chars, ${pars} paragraphs)`);
      } else {
        lastResult = parsed;
        if (attempt < MAX_RETRIES) continue;
        console.warn(`[NEWS] All retries exhausted, using last result (${parsed.site.text.length} chars, ${pars} paragraphs)`);
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
      console.error(`[NEWS] generateFullArticle error (attempt ${attempt + 1}): ${msg}`);
      if (attempt >= MAX_RETRIES) return lastResult;
    }
  }

  return lastResult;
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

Если заголовок хорош \u2014 верни его как есть.
Если можно улучшить \u2014 верни улучшенный вариант.

Ответь ТОЛЬКО заголовком, без пояснений.`;

  try {
    const result = await callOpenRouter(prompt, 200);
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

module.exports = { translateAndRewrite, generateFullArticle, checkHeadline, postProcessText, validateArticle };
