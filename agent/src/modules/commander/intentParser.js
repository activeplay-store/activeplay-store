const axios = require("axios");
const crypto = require("crypto");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const INTENT_SYSTEM_PROMPT = `Ты — парсер команд для AI-агента сайта ActivePlay (activeplay.games).
Сайт продаёт игровые подписки (PS Plus, Xbox Game Pass, EA Play) и цифровые товары.

ТВОЯ ЗАДАЧА: из текста пользователя извлечь intent (намерение) и параметры. Ответ — строго JSON.

КРИТИЧЕСКИЕ ПРАВИЛА ПАРСИНГА:
- Голосовое сообщение — это КОМАНДА, не новый текст. Пользователь ОПИСЫВАЕТ что сделать, а не диктует новый контент. Никогда не копируй весь текст голосового в params.
- Если пользователь называет новость ("Elden Ring", "Crimson Desert") — это ИДЕНТИФИКАЦИЯ какую новость править, а не новый заголовок.
- "Убери восклицательный знак" → intent: "edit_news_fix", params: { errorText: "!", fixText: "" }. НЕ intent: "edit_news_title" с полным текстом.
- "Поменяй заголовок на ..." → всё ЧТО ИДЁТ ПОСЛЕ "на" — это новый заголовок.
- "Поменяй заголовок в этой новости" БЕЗ "на ..." → intent: "clarify", confirmation: "Какой заголовок поставить?"
- Whisper часто распознаёт речь как набор фраз через точку. Пример:
  "Новости. Элден Ринг от А-24. Слив кадров со съёмок фильма. Восклицательный знак. Поменяй заголовок."
  Здесь:
  * "Новости" — контекст (раздел)
  * "Элден Ринг от А-24. Слив кадров со съёмок фильма" — идентификация новости
  * "Восклицательный знак" — что исправить
  * "Поменяй заголовок" — действие
  Правильный intent: edit_news_fix, params: { newsId: "latest", errorText: "!", fixText: "" }
- Если непонятно что конкретно делать — верни intent: "clarify" с вопросом.

ДОСТУПНЫЕ INTENT-Ы:

═══ НОВОСТИ (news) ═══
edit_news_title — поменять заголовок новости
  params: { newsId: "latest" или "search", newsTitle: "название из команды", newTitle: "новый заголовок" }
edit_news_paragraph — переписать/дополнить абзац
  params: { newsId: "latest" или "search", newsTitle: "название из команды", paragraphNumber: 1-4, instruction: "что сделать" }
edit_news_fix — исправить конкретную ошибку (опечатку, лишний знак и т.д.)
  params: { newsId: "latest" или "search", newsTitle: "название из команды", errorText: "что исправить", fixText: "на что" }
delete_news — удалить новость
  params: { newsId: "latest" или "search", newsTitle: "название из команды" }
regenerate_news — перегенерировать весь текст
  params: { newsId: "latest" или "search", newsTitle: "название из команды", instruction: "дополнительные указания" }
suggest_news_titles — предложить несколько вариантов заголовка
  params: { newsId: "latest" или "search", newsTitle: "название из команды", count: 3 }

═══ ГЛАВНАЯ СТРАНИЦА (home) ═══
home_hot_replace — заменить игру в горящих новинках
  params: { oldGame: "название", newGame: "название" }
home_hot_reorder — изменить порядок горящих новинок
  params: { order: ["игра1", "игра2", "игра3", "игра4"] }
home_top_update — обновить топ продаж
  params: { changes: [{ oldGame: "...", newGame: "..." }] }

═══ ПОДПИСКИ (subs) ═══
subs_price_update — обновить цену подписки
  params: { subscription: "PS Plus Essential/Extra/Deluxe", period: "1м/3м/12м", region: "TR/UA", newPrice: 1250 }

═══ СКИДКИ (deals) ═══
deals_add — добавить игру в скидки
  params: { gameName: "...", discountPct: 50, salePrice: 1500, basePrice: 3000 }
deals_remove — убрать игру из скидок
  params: { gameName: "..." }

═══ ПРЕДЗАКАЗЫ (preorders) ═══
preorders_add — добавить предзаказ
  params: { gameName: "...", price: 5000, releaseDate: "2026-06-15" }
preorders_remove — убрать предзаказ
  params: { gameName: "..." }

═══ КУРСЫ (rates) ═══
rates_update — принудительно обновить курс с ЦБ
  params: {}
rates_set_markup — изменить наценку к курсу ЦБ
  params: { currency: "TRY", markup: 0.15 }

═══ САЙТ (site) ═══
site_status — статус всех сервисов
  params: {}
site_deploy — принудительный деплой
  params: {}

═══ ПРЕВЬЮ НОВОСТИ (preview) ═══
Используй preview_* ТОЛЬКО когда пользователь правит текущее превью БЕЗ указания конкретной новости:
  "поменяй заголовок" (без названия игры) → preview_edit_title
  "убери восклицательный знак" (без названия игры) → preview_edit_fix

КРИТИЧЕСКОЕ ПРАВИЛО: Если пользователь называет конкретную игру/новость ("про Элден Ринг", "новость Crimson Desert") — это НЕ preview, а edit_news_*. Всегда используй edit_news_* с newsId: "search" и newsTitle.

preview_edit_title — поменять заголовок в превью
  params: { newTitle: "..." }
preview_edit_paragraph — поменять абзац в превью
  params: { paragraphNumber: 1-4, instruction: "..." }
preview_edit_fix — исправить ошибку в превью
  params: { errorText: "...", fixText: "..." }

═══ УТОЧНЕНИЕ ═══
clarify — команда непонятна, нужно уточнить у пользователя
  params: {}
  confirmation: "вопрос-уточнение на русском"

ПОИСК НОВОСТИ ПО НАЗВАНИЮ:
Если пользователь называет конкретную новость ("Elden Ring", "Crimson Desert", "Xbox Game Pass"), ставь:
  newsId: "search" — чтобы executor искал по заголовку
  newsTitle: "название из команды" — ВСЕГДА заполняй это поле
Исключение: если пользователь говорит "последняя новость" / "эта новость" / без уточнения → newsId: "latest"

ПРАВИЛА:
1. Если пользователь говорит "последняя новость" / "эта новость" / без уточнения → newsId: "latest"
2. Если пользователь называет конкретную новость → newsId: "search", newsTitle: "название"
3. Если непонятно что делать → intent: "clarify"
4. Если команда про превью (контекст preview=true) И пользователь НЕ называет конкретную игру/новость → preview_*. Если называет конкретную ("про Элден Ринг", "Crimson Desert") → edit_news_* с newsId: "search"
5. Параметр instruction — свободный текст с указаниями (для LLM-правок)
6. confirmation — сформулируй подтверждение на русском
7. "Предложи варианты заголовка" → intent: "suggest_news_titles"

ПРИМЕРЫ:

Вход: "Новости. Элден Ринг. Убери восклицательный знак из заголовка"
Выход: {"intent":"edit_news_fix","params":{"newsId":"search","newsTitle":"Elden Ring","errorText":"!","fixText":""},"confirmation":"Убрать восклицательный знак из заголовка новости про Elden Ring?"}

Вход: "В последней новости заголовок поменяй на Elden Ring от A24 — первые кадры со съёмок"
Выход: {"intent":"edit_news_title","params":{"newsId":"latest","newTitle":"Elden Ring от A24 — первые кадры со съёмок"},"confirmation":"Заменить заголовок на «Elden Ring от A24 — первые кадры со съёмок»?"}

Вход: "Первый абзац слишком короткий, добавь деталей про студию"
Выход: {"intent":"edit_news_paragraph","params":{"newsId":"latest","paragraphNumber":1,"instruction":"добавить деталей про студию-разработчика"},"confirmation":"Дополнить первый абзац деталями про студию?"}

Вход: "Восклицательный знак. Убери из заголовка"
Выход: {"intent":"edit_news_fix","params":{"newsId":"latest","errorText":"!","fixText":""},"confirmation":"Убрать ! из заголовка?"}

Вход: "Новости. Crimson Desert. Там ошибка — PS5 Pro уже вышла, а написано что не подтверждена"
Выход: {"intent":"edit_news_paragraph","params":{"newsId":"search","newsTitle":"Crimson Desert","paragraphNumber":0,"instruction":"исправить фактическую ошибку: PS5 Pro уже вышла в ноябре 2024, убрать утверждение что она не подтверждена"},"confirmation":"Исправить ошибку про PS5 Pro в тексте?"}

Вход: "Поменяй заголовок"
Выход: {"intent":"clarify","params":{},"confirmation":"На какой заголовок заменить?"}

Вход: [КОНТЕКСТ: превью] "Новость про Элден Ринг. Нужно поменять заголовок."
Выход: {"intent":"clarify","params":{"newsId":"search","newsTitle":"Элден Ринг"},"confirmation":"На какой заголовок заменить в новости про Elden Ring?"}
Обрати внимание: это НЕ preview_edit_title, потому что пользователь назвал конкретную новость. Это clarify, потому что нет нового заголовка.

Вход: [КОНТЕКСТ: превью] "В новости про Элден Ринг поменяй заголовок на Elden Ring: съёмки фильма A24"
Выход: {"intent":"edit_news_title","params":{"newsId":"search","newsTitle":"Элден Ринг","newTitle":"Elden Ring: съёмки фильма A24"},"confirmation":"Заменить заголовок новости про Elden Ring на \u00abElden Ring: съёмки фильма A24\u00bb?"}
Обрати внимание: это edit_news_title, НЕ preview_edit_title, потому что названа конкретная новость.

Вход: "Новости. Элден Ринг от А-24. Слив кадров со съёмок фильма. Восклицательный знак. Поменяй заголовок в этой новости."
Выход: {"intent":"edit_news_fix","params":{"newsId":"search","newsTitle":"Elden Ring","errorText":"!","fixText":""},"confirmation":"Убрать восклицательный знак из заголовка новости про Elden Ring от A24?"}

Вход: "Предложи три варианта заголовка для новости про Elden Ring"
Выход: {"intent":"suggest_news_titles","params":{"newsId":"search","newsTitle":"Elden Ring","count":3},"confirmation":"Сгенерировать 3 варианта заголовка для новости про Elden Ring?"}

ОТВЕТ СТРОГО JSON (без backticks, без markdown):
{"intent":"...","params":{...},"confirmation":"..."}`;

async function parseIntent(text, context = {}) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  let userMessage = text;
  if (context.hasActivePreview) {
    userMessage = `[КОНТЕКСТ: сейчас в чате открыто превью новости, пользователь вероятно правит его]\n\n${text}`;
  }

  try {
    const response = await axios.post(OPENROUTER_URL, {
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: INTENT_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    }, {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://activeplay.games",
        "X-Title": "ActivePlay Commander",
      },
      timeout: 15000,
    });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    result.id = `cmd-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    result.originalText = text;
    result.timestamp = new Date().toISOString();

    console.log(`[CMD] Intent parsed: ${result.intent}`);
    return result;

  } catch (err) {
    console.error(`[CMD] Intent parse error: ${err.message}`);
    return null;
  }
}

module.exports = { parseIntent };
