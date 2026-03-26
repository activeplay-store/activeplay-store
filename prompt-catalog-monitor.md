# Задача: Мониторинг каталогов PS Plus — Essential, Extra, Deluxe, Game Trials, EA Play

## Контекст

- Агент: `D:\activeplay-store\agent\`
- На сервере: `/var/www/activeplay-store/agent/`
- Данные: `agent/data/`
- PM2: `ap-agent`, порт 3900
- Бот: `ap-agent-bot`, порт 4000, алерты через POST http://localhost:4000/alert
- Timezone: Europe/Moscow
- Sony GraphQL парсер: `agent/src/modules/parsers/sony.js` (уже работает)
- Notifier: `agent/src/modules/notifier.js` (уже работает)

## UUID категорий PS Store (одинаковые для TR и UA)

```js
const CATALOG_UUIDS = {
  gameCatalog: '3a7006fe-e26f-49fe-87e5-4473d7ed0fb2',  // Extra — 500+ игр
  classics: '8056ad23-7f30-485c-a628-b99f9d5aec5d',      // Deluxe Classics
  // Essential — нет UUID категории, парсится через pushsquare + PS Blog
};
```

---

## Что создать

### 1. Новый файл: `agent/src/modules/catalogMonitor.js`

Единый модуль мониторинга всех каталогов.

#### Данные каталогов — хранение

Файлы в `agent/data/catalogs/`:

```
catalogs/
  essential.json     — текущие 3-4 ежемесячные игры
  extra.json         — полный каталог Extra (500+ игр)
  classics.json      — каталог Deluxe Classics
  trials.json        — Game Trials (пробные версии)
  eaplay.json        — EA Play каталог
```

Формат каждого файла:
```json
{
  "updatedAt": "2026-04-07T20:15:00+03:00",
  "month": "2026-04",
  "games": [
    {
      "id": "lords-of-the-fallen",
      "name": "Lords of the Fallen",
      "platforms": ["PS5"],
      "addedAt": "2026-04-07"
    }
  ]
}
```

#### Основные функции

```js
// ===== ESSENTIAL =====

async function checkEssential() {
  // Essential не имеет UUID-категории в PS Store
  // Парсим: pushsquare.com/guides/all-ps-plus-games
  // или blog.playstation.com (ищем пост "PlayStation Plus Monthly Games")
  // 
  // Алгоритм:
  // 1. Загрузить текущий essential.json
  // 2. Парсить источник (pushsquare)
  // 3. Сравнить: новые игры vs текущие
  // 4. Если есть изменения → алерт + вернуть diff
  
  const current = loadCatalog('essential');
  const fresh = await parseEssentialSource();
  
  const added = fresh.filter(g => !current.games.find(c => c.id === g.id));
  const removed = current.games.filter(g => !fresh.find(f => f.id === g.id));
  
  if (added.length === 0 && removed.length === 0) {
    console.log('[Каталог] Essential — без изменений');
    return { changed: false };
  }
  
  // Алерт
  const addedNames = added.map(g => g.name).join(', ');
  const removedNames = removed.map(g => g.name).join(', ');
  
  await notifier.sendAlert('catalog_update',
    `📦 Essential обновлён!\n➕ ${addedNames}\n➖ ${removedNames}`
  );
  
  // Сохранить новый каталог
  saveCatalog('essential', { 
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: fresh 
  });
  
  return { changed: true, added, removed };
}


// ===== EXTRA =====

async function checkExtra() {
  // Парсим Sony GraphQL категорию gameCatalog
  const sony = require('./parsers/sony');
  const current = loadCatalog('extra');
  
  // Парсить каталог Extra через Sony GraphQL
  const freshTR = await sony.fetchCategoryGames(CATALOG_UUIDS.gameCatalog, 'TR');
  // Не нужно парсить ВСЕ 500+ игр — достаточно первые 50 (новые всегда сверху)
  
  const currentIds = new Set(current.games.map(g => g.id));
  const added = freshTR.filter(g => !currentIds.has(g.id));
  const removedIds = new Set(freshTR.map(g => g.id));
  const removed = current.games.filter(g => !removedIds.has(g.id));
  
  if (added.length === 0 && removed.length === 0) {
    console.log('[Каталог] Extra — без изменений');
    return { changed: false };
  }
  
  await notifier.sendAlert('catalog_update',
    `📦 Extra обновлён!\n➕ ${added.length} игр добавлено\n➖ ${removed.length} игр удалено\n\nНовые: ${added.slice(0, 10).map(g => g.name).join(', ')}${added.length > 10 ? '...' : ''}`
  );
  
  // Мёрж: добавить новые, убрать удалённые
  const merged = [...current.games.filter(g => removedIds.has(g.id)), ...added.map(g => ({ ...g, addedAt: new Date().toISOString().split('T')[0] }))];
  
  saveCatalog('extra', {
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: merged
  });
  
  return { changed: true, added, removed };
}


// ===== DELUXE CLASSICS =====

async function checkClassics() {
  // Аналогично Extra, но UUID = classics
  const sony = require('./parsers/sony');
  const current = loadCatalog('classics');
  
  const freshTR = await sony.fetchCategoryGames(CATALOG_UUIDS.classics, 'TR');
  
  const currentIds = new Set(current.games.map(g => g.id));
  const added = freshTR.filter(g => !currentIds.has(g.id));
  const removedIds = new Set(freshTR.map(g => g.id));
  const removed = current.games.filter(g => !removedIds.has(g.id));
  
  if (added.length === 0 && removed.length === 0) {
    console.log('[Каталог] Classics — без изменений');
    return { changed: false };
  }
  
  await notifier.sendAlert('catalog_update',
    `📦 Deluxe Classics обновлён!\n➕ ${added.length} игр\n➖ ${removed.length} игр\n\nНовые: ${added.map(g => g.name).join(', ')}`
  );
  
  saveCatalog('classics', {
    updatedAt: new Date().toISOString(),
    month: getCurrentMonth(),
    games: [...current.games.filter(g => removedIds.has(g.id)), ...added.map(g => ({ ...g, addedAt: new Date().toISOString().split('T')[0] }))]
  });
  
  return { changed: true, added, removed };
}


// ===== GAME TRIALS (Deluxe) =====

async function checkTrials() {
  // Источник: allkeyshop.com или Sony GraphQL
  // Пока заглушка — в будущем парсер allkeyshop
  // Game Trials меняются редко (1-2 в месяц)
  
  console.log('[Каталог] Game Trials — проверка (заглушка)');
  return { changed: false };
}


// ===== EA PLAY =====

async function checkEAPlay() {
  // Источник: Sony GraphQL (EA Play каталог есть в PS Store)
  // EA Play меняется редко — раз в квартал
  // Пока заглушка
  
  console.log('[Каталог] EA Play — проверка (заглушка)');
  return { changed: false };
}
```

#### Функция парсинга Essential

```js
async function parseEssentialSource() {
  // Вариант 1: pushsquare.com/guides/all-ps-plus-games
  // Вариант 2: Sony GraphQL — нет прямой категории для Essential monthly
  //
  // Реализация: пока ручной ввод через бота (/essential set Game1, Game2, Game3)
  // В будущем: парсинг pushsquare автоматически
  //
  // НО: в день релиза можно проверить что появилось в PS Store:
  // - поиск по названиям из анонса
  // - проверка что они стали "бесплатными" (PS Plus)
  
  // Для первой версии — читаем из essential.json (обновляется через бота)
  return loadCatalog('essential').games || [];
}
```

#### Вспомогательные функции

```js
const fs = require('fs');
const path = require('path');
const config = require('../config');
const notifier = require('./notifier');

const DATA_DIR = path.join(config.agent?.dataPath || path.join(__dirname, '..', '..', 'data'), 'catalogs');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadCatalog(name) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return { updatedAt: null, month: null, games: [] };
  }
}

function saveCatalog(name, data) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[Каталог] ${name} сохранён: ${data.games.length} игр`);
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7); // "2026-04"
}
```

#### Экспорт

```js
module.exports = {
  checkEssential,
  checkExtra,
  checkClassics,
  checkTrials,
  checkEAPlay,
  
  // Проверить все каталоги (Extra + Classics + Trials + EA Play)
  async checkAllExtra() {
    const results = {};
    results.extra = await checkExtra();
    results.classics = await checkClassics();
    results.trials = await checkTrials();
    results.eaplay = await checkEAPlay();
    return results;
  },
  
  // Загрузить каталог (для бота)
  loadCatalog,
  saveCatalog,
};
```

---

### 2. Обновить `agent/src/index.js` — календарный крон

Заменить текущие заглушки каталогов на рабочий крон с календарём.

```js
const catalogMonitor = require('./modules/catalogMonitor');

// ===== КАЛЕНДАРЬ PS PLUS =====
const PS_PLUS_CALENDAR = {
  essential: {
    announce: ['2026-04-01','2026-04-29','2026-05-27','2026-07-01','2026-07-29','2026-08-26','2026-09-30','2026-10-28','2026-11-25','2026-12-30','2027-01-28','2027-02-24'],
    release:  ['2026-04-07','2026-05-05','2026-06-02','2026-07-07','2026-08-04','2026-09-01','2026-10-06','2026-11-03','2026-12-01','2027-01-05','2027-02-02','2027-03-02']
  },
  extra: {
    announce: ['2026-04-15','2026-05-13','2026-06-10','2026-07-15','2026-08-12','2026-09-09','2026-10-14','2026-11-11','2026-12-09','2027-01-13','2027-02-10','2027-03-10'],
    release:  ['2026-04-21','2026-05-19','2026-06-16','2026-07-21','2026-08-18','2026-09-15','2026-10-20','2026-11-17','2026-12-15','2027-01-19','2027-02-16','2027-03-16']
  }
};

function getTodayMoscow() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Moscow' }); // "2026-04-07"
}

function isCalendarDay(type, event) {
  const today = getTodayMoscow();
  return PS_PLUS_CALENDAR[type]?.[event]?.includes(today);
}
```

#### Крон-задачи (добавить к существующим)

```js
// ===== 18:00 МСК — Анонсы (день анонса) =====
// cron: '0 18 * * *' (Europe/Moscow)
async function checkAnnouncements() {
  const today = getTodayMoscow();
  
  if (PS_PLUS_CALENDAR.essential.announce.includes(today)) {
    console.log('[Каталог] Сегодня анонс Essential — сканируем...');
    await notifier.sendAlert('catalog_announce', 
      '📢 Сегодня день анонса PS Plus Essential!\nМониторим PlayStation Blog и pushsquare...'
    );
    // В будущем: автопарсинг pushsquare
  }
  
  if (PS_PLUS_CALENDAR.extra.announce.includes(today)) {
    console.log('[Каталог] Сегодня анонс Extra/Deluxe — сканируем...');
    await notifier.sendAlert('catalog_announce',
      '📢 Сегодня день анонса PS Plus Extra/Deluxe!\nМониторим PlayStation Blog и pushsquare...'
    );
  }
}

// ===== 20:00 МСК — Релиз каталогов (день релиза) =====
// cron: '0 20 * * *' (Europe/Moscow)
async function checkCatalogRelease() {
  const today = getTodayMoscow();
  
  if (PS_PLUS_CALENDAR.essential.release.includes(today)) {
    console.log('[Каталог] Сегодня релиз Essential — парсим каталог...');
    const result = await catalogMonitor.checkEssential();
    if (!result.changed) {
      console.log('[Каталог] Essential — пока без изменений, повтор в 22:00');
    }
  }
  
  if (PS_PLUS_CALENDAR.extra.release.includes(today)) {
    console.log('[Каталог] Сегодня релиз Extra/Deluxe — парсим каталоги...');
    const result = await catalogMonitor.checkAllExtra();
    if (!result.extra?.changed && !result.classics?.changed) {
      console.log('[Каталог] Extra/Deluxe — пока без изменений, повтор в 22:00');
    }
  }
}

// ===== 22:00 МСК — Повторная проверка (если 20:00 не сработал) =====
// cron: '0 22 * * *' (Europe/Moscow)
async function checkCatalogRetry() {
  const today = getTodayMoscow();
  
  if (PS_PLUS_CALENDAR.essential.release.includes(today)) {
    const current = catalogMonitor.loadCatalog('essential');
    // Проверяем: обновилось ли сегодня?
    if (!current.updatedAt || !current.updatedAt.startsWith(today)) {
      console.log('[Каталог] Essential — повторная проверка 22:00...');
      await catalogMonitor.checkEssential();
    }
  }
  
  if (PS_PLUS_CALENDAR.extra.release.includes(today)) {
    const current = catalogMonitor.loadCatalog('extra');
    if (!current.updatedAt || !current.updatedAt.startsWith(today)) {
      console.log('[Каталог] Extra — повторная проверка 22:00...');
      await catalogMonitor.checkAllExtra();
    }
  }
}
```

#### Регистрация в cron (node-cron)

```js
// Добавить к существующим крон-задачам:

// Анонсы: 18:00 и 20:00 МСК
cron.schedule('0 18 * * *', checkAnnouncements, { timezone: 'Europe/Moscow' });
cron.schedule('0 20 * * *', () => {
  checkAnnouncements(); // повторный скан анонсов
  checkCatalogRelease(); // + проверка релизов
}, { timezone: 'Europe/Moscow' });

// Релизы: 22:00 МСК (повтор если 20:00 не сработал)
cron.schedule('0 22 * * *', checkCatalogRetry, { timezone: 'Europe/Moscow' });
```

---

### 3. Команды бота для управления каталогами

В `agent-bot/commands/index.js` добавить обработку:

```
/каталог essential          — показать текущие игры Essential
/каталог extra              — статистика Extra (сколько игр, когда обновлялся)
/каталог classics           — статистика Classics
/каталог проверка           — ручной запуск проверки всех каталогов
```

Создать файл `agent-bot/commands/catalog.js`:

```js
const { getAgentData } = require('../utils/agentData');
const fs = require('fs');
const path = require('path');

const CATALOGS_DIR = path.join(process.env.AGENT_DATA_PATH || '/var/www/activeplay-store/agent/data', 'catalogs');

function loadCatalog(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CATALOGS_DIR, `${name}.json`), 'utf8'));
  } catch {
    return { games: [], updatedAt: null };
  }
}

async function handle(ctx, text) {
  const arg = (text || '').replace(/^\/каталог\s*/i, '').replace(/^каталог\s*/i, '').trim().toLowerCase();
  
  if (arg === 'essential' || arg === '') {
    const data = loadCatalog('essential');
    if (!data.games.length) {
      return ctx.reply('📦 Essential: каталог пуст\n\nИгры появятся после первого обновления.');
    }
    const lines = data.games.map((g, i) => `${i + 1}. ${g.name} (${g.platforms?.join(', ') || 'PS5'})`);
    return ctx.reply(`📦 PS Plus Essential\nОбновлено: ${data.updatedAt || 'нет данных'}\n\n${lines.join('\n')}`);
  }
  
  if (arg === 'extra') {
    const data = loadCatalog('extra');
    return ctx.reply(`📦 PS Plus Extra\nИгр в каталоге: ${data.games.length}\nОбновлено: ${data.updatedAt || 'нет данных'}`);
  }
  
  if (arg === 'classics' || arg === 'deluxe') {
    const data = loadCatalog('classics');
    return ctx.reply(`📦 Deluxe Classics\nИгр в каталоге: ${data.games.length}\nОбновлено: ${data.updatedAt || 'нет данных'}`);
  }
  
  if (arg === 'проверка' || arg === 'check') {
    await ctx.reply('🔍 Запуск проверки каталогов...');
    // POST к агенту для ручного запуска
    try {
      const resp = await fetch('http://localhost:3900/check-catalogs');
      const result = await resp.json();
      return ctx.reply(`✅ Проверка завершена\nEssential: ${result.essential?.changed ? 'обновлён' : 'без изменений'}\nExtra: ${result.extra?.changed ? 'обновлён' : 'без изменений'}\nClassics: ${result.classics?.changed ? 'обновлён' : 'без изменений'}`);
    } catch (err) {
      return ctx.reply(`❌ Ошибка: ${err.message}`);
    }
  }
  
  return ctx.reply('📦 Каталоги:\n/каталог essential\n/каталог extra\n/каталог classics\n/каталог проверка');
}

module.exports = { handle };
```

---

### 4. HTTP endpoint в агенте для ручной проверки

В `agent/src/index.js` добавить endpoint:

```js
app.get('/check-catalogs', async (req, res) => {
  try {
    const essential = await catalogMonitor.checkEssential();
    const allExtra = await catalogMonitor.checkAllExtra();
    res.json({ essential, ...allExtra });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### 5. Нужна функция `sony.fetchCategoryGames(uuid, region)`

В `agent/src/modules/parsers/sony.js` — проверить, есть ли функция которая парсит целую категорию по UUID и возвращает список игр (id, name, platforms). Если нет — добавить.

Эта функция уже используется для скидок (deals, preorders). Нужно убедиться что она работает и для каталогов Extra/Classics. UUID каталогов:

```
Extra (gameCatalog): 3a7006fe-e26f-49fe-87e5-4473d7ed0fb2
Classics (Deluxe):   8056ad23-7f30-485c-a628-b99f9d5aec5d
```

Если парсер сейчас не умеет парсить эти категории — добавить поддержку. Формат вызова:
```js
const games = await sony.fetchCategoryGames('3a7006fe-e26f-49fe-87e5-4473d7ed0fb2', 'TR');
// → [{ id: 'game-slug', name: 'Game Name', platforms: ['PS5'] }, ...]
```

---

## Ограничения

- НЕ ставить новые npm-зависимости
- Чистый JS
- Логирование: `[Каталог]` префикс
- Game Trials и EA Play — пока заглушки, реализация позже
- Essential автопарсинг pushsquare — пока заглушка, в первой версии обновляется через бота вручную или после анонса
- Крон НЕ затирать существующие задачи (парсинг скидок 3:00 МСК, курс 10:00/17:00 МСК) — добавить новые рядом

## Деплой

### Агент (git):
```bash
cd D:\activeplay-store
git add agent/
git commit -m "feat: мониторинг каталогов PS Plus"
git push
```

### Бот (scp):
```bash
scp -r D:\activeplay-store\agent-bot root@31.130.144.44:/home/activeplay/
ssh root@31.130.144.44
sed -i 's|/home/activeplay/activeplay-store/agent/data|/var/www/activeplay-store/agent/data|' /home/activeplay/agent-bot/.env
pm2 restart ap-agent-bot
```

## Тестирование

```bash
# На сервере
ssh root@31.130.144.44

# Проверить что каталоги создаются
curl http://localhost:3900/check-catalogs

# В Telegram
/каталог essential
/каталог extra
/каталог проверка
```
