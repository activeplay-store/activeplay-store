# Задача: Модуль siteWriter — агент пишет deals.ts на сайт

## Контекст

- Агент: `D:\activeplay-store\agent\` → git push → автодеплой на сервер `/var/www/activeplay-store/agent/`
- Сайт (Next.js): `/var/www/activeplay-store/` — тот же git-репозиторий
- Данные парсера: `agent/data/games.json` (710 игр, TR+UA цены, Metacritic, hypeScore, RAWG данные)
- Целевой файл: `src/data/deals.ts` (сейчас тестовые данные, 55 игр)
- Обложки: `public/images/covers/deals/`
- Деплой: git push → webhook (порт 9000) → npm run build → pm2 restart

Страница `/sale` УЖЕ существует и работает с тестовыми данными. Нужно только заменить данные в deals.ts на реальные из парсера.

---

## Что создать

### Новый файл: `agent/src/modules/siteWriter.js`

Модуль который:
1. Читает `games.json`
2. Фильтрует игры со скидкой
3. Маппит в формат DealGame (TypeScript)
4. Генерирует строку файла `deals.ts`
5. Записывает в `src/data/deals.ts` (путь относительно корня репозитория)
6. Делает git add + commit + push

---

## Формат games.json (входные данные)

```json
{
  "updatedAt": "2026-03-26T00:02:00+03:00",
  "games": [
    {
      "name": "EA SPORTS FC 26 Ultimate Sürüm PS4 ve PS5",
      "id": "EP0006-PPSA21936_00-YOURFC26ULTIMATE",
      "slug": "ea-sports-fc-26",
      "hypeScore": 9,
      "metacritic": null,
      "releaseDate": "2025-09-26",
      "status": "released",
      "rawg": {
        "background_image": "https://media.rawg.io/media/games/xxx.jpg",
        "slug": "ea-sports-fc-26",
        "platforms": ["PlayStation 5", "PlayStation 4"]
      },
      "bestPrice": {
        "clientPrice": 2750,
        "amount": 1399,
        "type": "sale",
        "editionName": "Standard",
        "endDate": "2026-04-09",
        "discountPct": 71
      },
      "prices": {
        "TR": {
          "editions": [
            {
              "name": "Ultimate Edition",
              "basePrice": 4899,
              "salePrice": 1399,
              "clientPrice": 2750,
              "baseClientPrice": 9600,
              "endDate": "2026-04-09",
              "isPsPlus": false
            },
            {
              "name": "Standard",
              "basePrice": 2799,
              "salePrice": 1399,
              "psPlusPrice": 870,
              "clientPrice": 2750,
              "baseClientPrice": 5600,
              "clientPsPlusPrice": 2000,
              "endDate": "2026-04-09",
              "isPsPlus": true
            }
          ]
        },
        "UA": {
          "editions": [
            {
              "name": "Standard",
              "basePrice": 2799,
              "salePrice": 839,
              "clientPrice": 1700,
              "baseClientPrice": 5600,
              "endDate": "2026-04-09",
              "isPsPlus": false
            }
          ]
        }
      }
    }
  ]
}
```

**ВАЖНО:** Структура games.json может отличаться от примера выше. Прежде чем писать маппинг — прочитай реальный games.json на сервере или проверь первые 2-3 игры, чтобы понять точную структуру полей. Особенно проверь:
- Есть ли поле `slug` у игры (или только `id`)
- Есть ли поле `rawg.background_image`
- Есть ли поле `rawg.platforms`
- Формат полей `psPlusPrice`, `clientPsPlusPrice`, `isPsPlus` в editions
- Есть ли поле `bestPrice.discountPct`

---

## Формат deals.ts (выходной файл)

Файл должен экспортировать массив `dealsData` с типом `DealGame[]`:

```typescript
// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-26T03:15:00+03:00
// Игр со скидкой: 355 (TR), 372 (UA)
// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом

export interface DealGame {
  id: string;
  name: string;
  platforms: ('PS5' | 'PS4')[];
  coverUrl: string;
  releaseDate: string;
  prices: {
    TR?: {
      basePriceTRY: number;
      salePriceTRY: number;
      psPlusPriceTRY?: number;
      clientBasePrice: number;
      clientSalePrice: number;
      clientPsPlusPrice?: number;
    };
    UA?: {
      basePriceUAH: number;
      salePriceUAH: number;
      psPlusPriceUAH?: number;
      clientBasePrice: number;
      clientSalePrice: number;
      clientPsPlusPrice?: number;
    };
  };
  discountPct: number;
  saleEndDate?: string;
  hasPsPlusPrice: boolean;
}

export const dealsData: DealGame[] = [
  {
    id: "ea-sports-fc-26",
    name: "EA SPORTS FC 26",
    platforms: ["PS5", "PS4"],
    coverUrl: "https://media.rawg.io/media/games/xxx.jpg",
    releaseDate: "2025-09-26",
    prices: {
      TR: {
        basePriceTRY: 2799,
        salePriceTRY: 1399,
        psPlusPriceTRY: 870,
        clientBasePrice: 5600,
        clientSalePrice: 2750,
        clientPsPlusPrice: 2000,
      },
      UA: {
        basePriceUAH: 2799,
        salePriceUAH: 839,
        clientBasePrice: 5600,
        clientSalePrice: 1700,
      },
    },
    discountPct: 71,
    saleEndDate: "2026-04-09",
    hasPsPlusPrice: true,
  },
  // ... остальные игры
];
```

---

## Алгоритм маппинга (games.json → DealGame)

Для КАЖДОЙ игры из games.json:

### 1. Пропуск если нет скидки
Пропустить игру если:
- Нет `prices.TR` и нет `prices.UA`
- Ни одно издание не имеет `salePrice` ниже `basePrice`

### 2. Выбор лучшего издания для каждого региона
Для TR и UA отдельно — выбрать издание с **наибольшей экономией в рублях** (`baseClientPrice - clientPrice`). Это то издание, которое будет показано на сайте для данного региона.

### 3. Маппинг полей

```
id → game.slug || game.rawg?.slug || slugify(game.name)
name → game.name (ОЧИСТИТЬ от турецких/украинских суффиксов если возможно)
platforms → game.rawg?.platforms → маппить "PlayStation 5" → "PS5", "PlayStation 4" → "PS4". Если нет данных → ["PS5"]
coverUrl → game.rawg?.background_image || "" (пустая строка = fallback на градиент)
releaseDate → game.releaseDate || ""
prices.TR → из лучшего TR издания:
  basePriceTRY → edition.basePrice
  salePriceTRY → edition.salePrice
  psPlusPriceTRY → edition.psPlusPrice (только если isPsPlus === true)
  clientBasePrice → edition.baseClientPrice
  clientSalePrice → edition.clientPrice
  clientPsPlusPrice → edition.clientPsPlusPrice (только если isPsPlus)
prices.UA → аналогично из лучшего UA издания
discountPct → Math.round((1 - bestEdition.salePrice / bestEdition.basePrice) * 100)
saleEndDate → bestEdition.endDate
hasPsPlusPrice → true если хотя бы одно издание имеет isPsPlus === true и psPlusPrice
```

### 4. Фильтрация
Включить в deals.ts ТОЛЬКО игры где:
- `discountPct >= 10` (минимум 10% скидки)
- Хотя бы один регион (TR или UA) имеет данные

### 5. Сортировка
НЕ сортировать в deals.ts — сортировка по зонам происходит на клиенте (страница /sale). В deals.ts просто массив всех игр со скидкой.

### 6. Функция slugify (если нет slug)
```js
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

---

## Git-операции

После записи deals.ts — выполнить git push с сервера:

```js
const { execSync } = require('child_process');
const REPO_ROOT = '/var/www/activeplay-store';

function gitPush(filesChanged) {
  try {
    execSync('git add src/data/deals.ts', { cwd: REPO_ROOT });
    
    const msg = `data: обновление скидок (${filesChanged} игр)`;
    execSync(`git commit -m "${msg}"`, { cwd: REPO_ROOT });
    execSync('git push', { cwd: REPO_ROOT });
    
    console.log('[SiteWriter] ✅ Git push выполнен');
    return true;
  } catch (err) {
    console.error('[SiteWriter] ❌ Git push ошибка:', err.message);
    return false;
  }
}
```

**ВАЖНО:**
- Путь `REPO_ROOT` должен быть настраиваемым через config или .env
- Если git push упал — НЕ падать, просто логировать ошибку
- Если deals.ts не изменился (тот же контент) — НЕ коммитить (git diff проверка)

---

## Экспорт модуля

```js
module.exports = {
  // Основная функция — генерация и запись
  generateAndWrite,
  // () => { written: true/false, gamesCount: 355, pushed: true/false }
  
  // Только генерация строки (для тестирования)
  generateDealsTs,
  // (games) => string (содержимое файла)
};
```

---

## Интеграция в agent/src/index.js

Добавить вызов после парсинга в cron-задаче:

```js
const siteWriter = require('./modules/siteWriter');

// После runFullParse():
const writeResult = await siteWriter.generateAndWrite();
if (writeResult.written) {
  console.log(`[Agent] deals.ts обновлён: ${writeResult.gamesCount} игр`);
  if (writeResult.pushed) {
    notifier.sendAlert('site_updated', 
      `🌐 Сайт обновлён: ${writeResult.gamesCount} игр со скидкой`
    );
  }
}
```

Также добавить вызов после обновления курсов (пересчёт цен):
```js
// После currency.fetchAndSave():
// Если курс изменился — пересчитать и перезаписать deals.ts
if (rateChanged) {
  await siteWriter.generateAndWrite();
}
```

---

## Конфигурация

В `agent/src/config.js` добавить:

```js
siteWriter: {
  repoRoot: '/var/www/activeplay-store',
  dealsFile: 'src/data/deals.ts',
  minDiscountPct: 10,
  enabled: true,  // false = генерирует но не пишет и не пушит
}
```

---

## Обложки (MVP — внешние URL)

Для первой версии — НЕ скачивать обложки. Использовать `rawg.background_image` URL напрямую как `coverUrl`. Компонент на сайте уже имеет fallback на градиент при ошибке загрузки.

В будущем (отдельная задача): скачивать обложки в `public/images/covers/deals/`, оптимизировать размер, кешировать.

---

## Ограничения

- НЕ трогать компоненты сайта (TSX, CSS) — только `src/data/deals.ts`
- НЕ ставить новые npm-зависимости
- Чистый JS (агент), выход — TypeScript (deals.ts)
- НЕ менять существующие модули агента (currency, pricing, parsers) — только добавить siteWriter и интеграцию в index.js
- Логирование: `console.log` с префиксом `[SiteWriter]`

---

## Деплой

Это часть агента → деплоится через git:

```bash
cd D:\activeplay-store
git add agent/
git commit -m "feat: модуль siteWriter — агент пишет deals.ts"
git push
```

---

## Тестирование

После деплоя — на сервере:

```bash
ssh root@31.130.144.44
cd /var/www/activeplay-store/agent
node -e 'const sw = require("./src/modules/siteWriter"); sw.generateAndWrite().then(r => console.log(r))'
```

Ожидаемый результат:
- `{ written: true, gamesCount: 355, pushed: true }`
- Файл `src/data/deals.ts` обновлён реальными данными
- Git push → webhook → сайт пересобрался
- Страница https://activeplay.games/sale показывает реальные скидки

Также проверить:
- `git log --oneline -1` → последний коммит: "data: обновление скидок (355 игр)"
- Если запустить повторно без изменений → НЕ должен создавать пустой коммит
