const { chatCompletion, parseJsonResponse } = require('../utils/aiClient');

/**
 * Глубокая проверка фактов в готовом тексте новости.
 * Получает текст + оригинал + RAWG данные, проверяет каждое утверждение.
 * Возвращает { hasErrors, errors, correctedTitle, correctedText } или null при ошибке.
 */
async function factCheckArticle(article) {
  // Источник правды: оригинал (до перевода) и обогащённый контекст
  const originalTitle = article.originalTitle || article.title || '';
  const originalText = article.originalText || article.description || '';
  const rawgInfo = article.rawgData
    ? (typeof article.rawgData === 'string' ? article.rawgData : JSON.stringify(article.rawgData, null, 2))
    : (article.enrichedContext || 'нет данных');

  const prompt = `Ты — факт-чекер игрового сайта. Проверь текст новости на фактические ошибки.

ОРИГИНАЛ (источник правды):
Заголовок: ${originalTitle}
Текст: ${(originalText || '').substring(0, 3000)}
Источник: ${article.sourceName || ''}

ДАННЫЕ RAWG (проверенные):
${rawgInfo}

ТЕКСТ ДЛЯ ПРОВЕРКИ:
Заголовок: ${article.site?.title || article.title}
Текст: ${article.site?.text || article.text || ''}

ПРОВЕРЬ КАЖДОЕ УТВЕРЖДЕНИЕ:

1. ДАТЫ — правильные ли даты выхода, анонсов, событий? Сверь с оригиналом. Если в оригинале нет даты — а в тексте она появилась, это галлюцинация. Убери.

2. ЧИСЛА — правильные ли версии игр (не путать 2024/2026/26), номера частей (не путать MW2/MW3), оценки Metacritic? Если Metacritic не упомянут в оригинале и не совпадает с RAWG данными — убери.

3. "ПОСЛЕДНЯЯ ИГРА СЕРИИ" — НИКОГДА не пиши какая игра последняя в серии. Твои данные устаревшие. Замени на "серия включает такие игры как X и Y" без слова "последняя".

4. ИМЕНА И НАЗВАНИЯ — правильно ли написаны студии, издатели, персонажи? Сверь с оригиналом.

5. ПЛАТФОРМЫ — если в оригинале сказано PS5, не добавляй PS4 от себя. Если в оригинале не указаны платформы — не придумывай.

6. ВНУТРЕННИЕ ПРОТИВОРЕЧИЯ — одно предложение говорит X, другое — не-X? Исправь.

7. ВЫДУМАННЫЕ ФАКТЫ — если утверждение НЕ следует из оригинала, НЕ подтверждается RAWG данными, и ты НЕ уверен на 100% — УБЕРИ его. Лучше короче и точно.

8. ИИ-СЛОП — "завоевала сердца миллионов", "покорила мир", "является знаковым событием". Замени на конкретику или убери.

9. ОЧЕВИДНЫЕ БАНАЛЬНОСТИ — "Metacritic ещё не оценил, так как не вышла", "подробности пока неизвестны", "точная дата не объявлена". Убери такие предложения — они не несут информации.

ОТВЕТ СТРОГО JSON:
{
  "hasErrors": true/false,
  "errors": [
    {"type": "дата/число/название/противоречие/выдумка/слоп", "original": "что написано", "fix": "как исправить", "reason": "почему это ошибка"}
  ],
  "correctedTitle": "исправленный заголовок или null если ок",
  "correctedText": "полный исправленный текст со всеми абзацами через \\n\\n, или null если ошибок нет"
}

Если ошибок нет — верни {"hasErrors": false, "errors": [], "correctedTitle": null, "correctedText": null}`;

  try {
    const startTime = Date.now();
    const result = await chatCompletion([
      { role: 'system', content: 'Ты — факт-чекер. Находишь и исправляешь фактические ошибки в тексте. Отвечай строго JSON.' },
      { role: 'user', content: prompt },
    ], { model: 'gpt-4o', temperature: 0.1, maxTokens: 4000 });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    let parsed;
    try {
      parsed = parseJsonResponse(result);
    } catch (parseErr) {
      // Fallback: ищем JSON блок вручную
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[FACTCHECK] No JSON in response');
        return null;
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    if (parsed.hasErrors && parsed.errors?.length > 0) {
      console.warn(`[FACTCHECK] ${parsed.errors.length} errors found (${elapsed}s):`);
      parsed.errors.forEach(e => console.warn(`  [${e.type}] "${e.original}" → "${e.fix}" (${e.reason})`));
    } else {
      console.log(`[FACTCHECK] No errors found (${elapsed}s)`);
    }

    return parsed;
  } catch (err) {
    console.error('[FACTCHECK] Error:', err.message);
    return null;
  }
}

module.exports = { factCheckArticle };
