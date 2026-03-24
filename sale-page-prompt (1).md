# Парсинг Metacritic + RAWG + формула скоринга скидок

## Контекст

- Агент: `D:\activeplay-store\agent\` → git → `/var/www/activeplay-store/agent/`
- Бот: `D:\activeplay-store\agent-bot\` → scp → `/home/activeplay/agent-bot/`
- RAWG API ключ: `d9ca3380009e448e8fb356b3837cafa2`
- games.json: `/var/www/activeplay-store/agent/data/games.json`

---

## ЧАСТЬ 1: АГЕНТ — RAWG парсер + releaseDate

### Новый файл: `agent/src/modules/parsers/rawg.js`

RAWG API — бесплатный, 20 000 запросов/месяц. Отдаёт: metacritic, ratings_count, released, genres, tags.

```js
const config = require('../../config');

const RAWG_KEY = 'd9ca3380009e448e8fb356b3837cafa2';
const BASE_URL = 'https://api.rawg.io/api';

/**
 * Поиск игры по названию и получение данных
 */
async function searchGame(gameName) {
  try {
    // Очистить название для поиска
    const cleanName = gameName
      .replace(/PS[45] & PS[45]/gi, '')
      .replace(/PS[45]/gi, '')
      .replace(/\s*(Digital\s+)?Deluxe/gi, '')
      .replace(/\s*Ultimate\s*Edition/gi, '')
      .replace(/\s*Standard\s*Edition/gi, '')
      .replace(/\s*GOTY/gi, '')
      .replace(/\s*Game of the Year/gi, '')
      .replace(/™|®/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanName || cleanName.length < 3) return null;

    const params = new URLSearchParams({
      key: RAWG_KEY,
      search: cleanName,
      page_size: '3',
      platforms: '187,18', // PS5 (187), PS4 (18)
      search_precise: 'true'
    });

    const response = await fetch(`${BASE_URL}/games?${params}`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('[RAWG] ⚠️ Rate limit — пауза');
        return null;
      }
      return null;
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    // Найти лучшее совпадение
    const result = data.results[0];

    return {
      metacritic: result.metacritic || null,
      ratingsCount: result.ratings_count || 0,
      released: result.released || null, // "2023-10-20"
      genres: (result.genres || []).map(g => g.name),
      rating: result.rating || null, // 0-5 user rating
      slug: result.slug
    };
  } catch (err) {
    console.log(`[RAWG] ⚠️ ${gameName}: ${err.message}`);
    return null;
  }
}

/**
 * Рассчитать hypeScore из данных RAWG
 * ratingsCount — косвенный показатель популярности
 */
function calculateHypeScore(ratingsCount, metacritic) {
  // ratingsCount:
  // 5000+ = мегахит (10)
  // 2000-4999 = крупная серия (7)
  // 500-1999 = известная (5)
  // 100-499 = нишевая (3)
  // <100 = неизвестная (1)
  let hype = 1;
  if (ratingsCount >= 5000) hype = 10;
  else if (ratingsCount >= 2000) hype = 7;
  else if (ratingsCount >= 500) hype = 5;
  else if (ratingsCount >= 100) hype = 3;

  // Бонус за высокий Metacritic (85+)
  if (metacritic && metacritic >= 85) hype = Math.max(hype, 7);
  if (metacritic && metacritic >= 90) hype = Math.max(hype, 10);

  return hype;
}

/**
 * Рассчитать freshness score из даты релиза
 */
function calculateFreshness(releasedDate) {
  if (!releasedDate) return 5; // среднее если неизвестно
  
  const released = new Date(releasedDate);
  const now = new Date();
  const monthsAgo = (now - released) / (1000 * 60 * 60 * 24 * 30);

  if (monthsAgo <= 12) return 10;    // до 1 года
  if (monthsAgo <= 24) return 7;     // 1-2 года
  if (monthsAgo <= 48) return 5;     // 2-4 года
  return 3;                          // 5+ лет
}

module.exports = { searchGame, calculateHypeScore, calculateFreshness };
```

### Обновить: `agent/src/config.js`

Добавить в блок parsers:
```js
rawg: {
  apiKey: 'd9ca3380009e448e8fb356b3837cafa2',
  endpoint: 'https://api.rawg.io/api',
  rateLimit: 1000 // 1 сек между запросами
},
```

### Обновить: `agent/src/modules/parsers/sony.js` — вытащить releaseDate

В функции `groupByGame()`, при создании новой записи игры, найти строку `releaseDate: null` и заменить на:

```js
releaseDate: product.releaseDate || product.localizedStoreDisplayClassification?.releaseDate || null,
```

Также в `sonyProductToGame()` если она используется — то же самое.

**Проверить что в `fetchCategory` ответ Sony содержит releaseDate.** Если нет — добавить дозапрос через `productRetrieveForCtasWithPrice` (он точно содержит releaseDate).

### Обновить: `agent/src/modules/parsers/index.js` — четвёртый проход (RAWG)

В функции `runFullParse()`, ПОСЛЕ объединения TR+UA данных, добавить:

```js
const rawg = require('./rawg');

// ПРОХОД 4: RAWG — Metacritic, hype, дата релиза
console.log('[Парсер] Проход 4: RAWG (Metacritic + hype)...');
let rawgEnriched = 0;

for (const game of allGames) {
  // Не дозапрашивать если уже есть данные
  if (game.metacritic && game.ratingsCount) continue;

  await sleep(1000); // RAWG rate limit

  const rawgData = await rawg.searchGame(game.name);
  if (rawgData) {
    game.metacritic = rawgData.metacritic;
    game.ratingsCount = rawgData.ratingsCount;
    game.hypeScore = rawg.calculateHypeScore(rawgData.ratingsCount, rawgData.metacritic);
    game.freshness = rawg.calculateFreshness(rawgData.released || game.releaseDate);
    
    // Если releaseDate пуст — взять из RAWG
    if (!game.releaseDate && rawgData.released) {
      game.releaseDate = rawgData.released;
    }
    
    rawgEnriched++;
  } else {
    // Дефолты для неизвестных игр
    game.hypeScore = game.hypeScore || 3;
    game.freshness = game.freshness || 5;
  }
}

console.log(`[Парсер] RAWG: обогащено ${rawgEnriched} игр`);
```

**ВАЖНО:** RAWG даёт 20 000 запросов/мес. При 230 играх и парсинге каждые 3 часа = 230 × 8 = 1840 запросов/день = 55 200/мес — это больше лимита!

**Решение:** кешировать RAWG данные. Если игра уже есть в games.json с metacritic и ratingsCount — не дозапрашивать. Дозапрашивать только НОВЫЕ игры (которых нет в старом games.json). Тогда ~10-30 запросов/день максимум.

```js
// Загрузить старые данные для кеширования RAWG
const oldData = loadGames();
const oldGameMap = new Map();
if (oldData && oldData.games) {
  for (const g of oldData.games) {
    if (g.metacritic || g.ratingsCount) {
      oldGameMap.set(g.id, { metacritic: g.metacritic, ratingsCount: g.ratingsCount, hypeScore: g.hypeScore, freshness: g.freshness, releaseDate: g.releaseDate });
    }
  }
}

for (const game of allGames) {
  // Сначала проверить кеш
  const cached = oldGameMap.get(game.id);
  if (cached && cached.metacritic) {
    game.metacritic = cached.metacritic;
    game.ratingsCount = cached.ratingsCount;
    game.hypeScore = cached.hypeScore;
    game.freshness = cached.freshness;
    if (!game.releaseDate) game.releaseDate = cached.releaseDate;
    continue; // Не дозапрашивать
  }

  // Новая игра — запрос RAWG
  await sleep(1000);
  const rawgData = await rawg.searchGame(game.name);
  // ... (код обогащения выше)
}
```

---

## ЧАСТЬ 2: БОТ — формула скоринга на реальных данных

### Переписать `agent-bot/commands/deals.js`

Формула:
```
БАЛЛ = (hypeScore × 0.40) + (discountScore × 0.30) + (savingScore × 0.20) + (freshness × 0.10)
```

Где:
- `hypeScore` — из games.json (1-10, рассчитан RAWG)
- `discountScore` — из процента скидки:
  - 65-100% → 10
  - 40-64% → 7
  - 20-39% → 4
  - <20% → 1
- `savingScore` — из экономии в рублях:
  - 7000₽+ → 10
  - 4000-6999₽ → 7
  - 2000-3999₽ → 5
  - <2000₽ → 3
- `freshness` — из games.json (1-10, рассчитан RAWG)

```js
function getDiscountScore(pct) {
  if (pct >= 65) return 10;
  if (pct >= 40) return 7;
  if (pct >= 20) return 4;
  return 1;
}

function getSavingScore(saving) {
  if (saving >= 7000) return 10;
  if (saving >= 4000) return 7;
  if (saving >= 2000) return 5;
  return 3;
}

// В цикле обработки каждой игры:
const hype = game.hypeScore || 3; // дефолт 3 если RAWG не ответил
const fresh = game.freshness || 5;
const discScore = getDiscountScore(realPct);
const savScore = getSavingScore(saving);
const totalScore = (hype * 0.40) + (discScore * 0.30) + (savScore * 0.20) + (fresh * 0.10);
```

Также показать Metacritic в выводе если есть:
```
1. Silent Hill 2 Dual Pack — Deluxe
   🔴 4800₽ вместо 12950₽ (−63%, экономия 8150₽)
   ⭐ MC: 87 | 📊 8.6 баллов
   ⏰ До 26.03.2026
```

Фильтр по Metacritic:
- `/скидки mc80` — только с Metacritic 80+
- Для карусели главной: Metacritic 65+ (как в спецификации)

---

## ЧАСТЬ 3: Формат games.json после обогащения

Каждая игра в games.json теперь содержит:

```json
{
  "id": "spider-man-2",
  "name": "Marvel's Spider-Man 2",
  "metacritic": 90,
  "ratingsCount": 5200,
  "hypeScore": 10,
  "freshness": 7,
  "releaseDate": "2023-10-20",
  "bestPrice": {
    "amount": 1730,
    "clientPrice": 3360,
    "type": "sale",
    "discountPct": 43,
    "basePrice": 2999
  },
  "prices": {
    "TR": { "editions": [...] },
    "UA": { "editions": [...] }
  }
}
```

---

## ДЕПЛОЙ

### Агент (git):
```bash
cd D:\activeplay-store
git add agent/
git commit -m "feat: RAWG Metacritic + hypeScore + формула скоринга"
git push
```

### Бот (scp):
```bash
scp -r D:\activeplay-store\agent-bot root@31.130.144.44:/home/activeplay/
```

### Сервер:
```bash
sed -i 's|/home/activeplay/activeplay-store/agent/data|/var/www/activeplay-store/agent/data|' /home/activeplay/agent-bot/.env
pm2 restart ap-agent ap-agent-bot
# Запустить парсинг вручную чтобы обогатить данные
curl http://localhost:3900/parse
# Подождать 5-10 минут, проверить логи
pm2 logs ap-agent --lines 30
```

## ТЕСТИРОВАНИЕ

1. Подождать пока парсинг завершится (5-10 мин)
2. `/скидки` → топ должен быть: FC26, Silent Hill, UFC, Like a Dragon, Spider-Man — не Train Sim
3. `/цена spider-man 2` → должен показать metacritic: 90
4. `/скидки mc80` → только игры с MC 80+
5. На сервере: `cat /var/www/activeplay-store/agent/data/games.json | python3 -m json.tool | grep -A3 metacritic | head -30` → проверить что metacritic заполнен

## ВАЖНЫЕ ОГРАНИЧЕНИЯ

1. RAWG: 20 000 запросов/мес. Кешировать обязательно.
2. Первый парсинг после обновления — долгий (~230 запросов RAWG × 1 сек = ~4 мин дополнительно). Следующие — быстрые (только новые игры).
3. Metacritic может быть null для совсем новых или нишевых игр — это нормально, ставим hypeScore по ratingsCount.
4. RAWG иногда не находит игру по турецкому названию — cleanName чистит максимально, но 5-10% потерь допустимы.
