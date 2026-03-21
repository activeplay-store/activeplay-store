# PageSpeed-оптимизация activeplay.games — Промпт для Claude Code

## КОНТЕКСТ

Сайт activeplay.games (Next.js 16 + Tailwind CSS) показывает на Lighthouse:
- **Desktop: 92** — ок
- **Mobile: 56** — плохо, нужно поднять до 80+

Главные проблемы по мобильному отчёту:
- **LCP 4.3с** (красная зона, нужно <2.5с)
- **TTI 24с** (катастрофа)
- **TBT 1090мс** (красная зона)
- **Total page weight: 7.5 MB** (из них 4.6 MB — картинки)

Тяжёлые ресурсы:
- `fire.png` — 2031 KB
- `monster-hunter-stories-3.jpg` — 1016 KB
- `abel.png` — 969 KB
- `nioh-3.jpg` — 367 KB
- `fc-points.png` — 241 KB
- Chatwoot widget CSS: `widget-D2HVDe1n.css` — 790 KB
- Chatwoot widget JS: `index-D5MLxyAz.js` — 317 KB (121 KB unused)
- Chatwoot JS: `_plugin-vue_export-helper` — 168 KB (109 KB unused)

Main thread breakdown (mobile): Style & Layout 2156мс, Script Eval 1184мс, Other 2772мс.

## ПРАВИЛА ПРОЕКТА

- Используем стандартный `<img>` тег (НЕ next/image) — это осознанное решение, НЕ менять
- Фото Abel (abel.png) используется как background-image с `backgroundSize: '350%'`, `backgroundPosition: '50% 21%'` — НЕ трогать позиционирование
- Шрифты: Rajdhani (display) + Inter (body)
- Бренд-цвет: #00D4FF
- Chatwoot виджет подключён через компонент `ChatWidget.tsx`, website_token: `CRRDuUyh65jLcZ9S25C4mA1C`
- Деплой: git push → автодеплой через webhook

---

## ЗАДАЧА 1 — Оптимизация картинок (САМЫЙ БОЛЬШОЙ ЭФФЕКТ)

**Цель:** уменьшить вес картинок с 4.6 MB до ~800 KB без потери визуального качества.

### Шаги:

1. **Установи `sharp`** (если ещё не установлен как production-зависимость):
```bash
npm install sharp
```

2. **Создай скрипт `scripts/optimize-images.mjs`** который:
   - Сканирует `public/images/` рекурсивно
   - Конвертирует все `.png` и `.jpg` файлы в `.webp` формат
   - Сохраняет WebP-версии рядом с оригиналами (например `fire.png` → `fire.webp`)
   - Качество WebP: 80 для фото (jpg), 85 для графики (png)
   - Для больших картинок (>1200px шириной) — ресайз до max 1200px по ширине
   - Для обложек игр (в `covers/`) — ресайз до max 600px по ширине
   - НЕ удалять оригиналы (оставить как fallback)
   - Вывести отчёт: имя файла, оригинальный размер → новый размер

3. **Добавь npm-скрипт** в `package.json`:
```json
"optimize-images": "node scripts/optimize-images.mjs"
```

4. **Обнови все `<img>` теги на сайте**, добавив:
   - Атрибут `loading="lazy"` на ВСЕ картинки КРОМЕ hero-секции (первый экран)
   - Атрибут `decoding="async"` на все картинки
   - Явные `width` и `height` атрибуты (чтобы браузер зарезервировал место и не было CLS)
   - Замени `.png` / `.jpg` расширения на `.webp` в `src`
   - Добавь `<picture>` с fallback для старых браузеров:
   ```jsx
   <picture>
     <source srcSet="/images/covers/game.webp" type="image/webp" />
     <img src="/images/covers/game.jpg" alt="..." loading="lazy" decoding="async" width="600" height="338" />
   </picture>
   ```

5. **Hero-секция** — первая крупная картинка (LCP-элемент):
   - БЕЗ `loading="lazy"` (она должна грузиться сразу)
   - Добавь `fetchpriority="high"`
   - Добавь `<link rel="preload">` в `<Head>` для этой картинки:
   ```jsx
   <link rel="preload" as="image" type="image/webp" href="/images/hero-image.webp" />
   ```

6. **Фото Abel** (`abel.png`, 969 KB) — используется как CSS background-image:
   - Конвертируй в WebP
   - В CSS/стилях замени путь на `.webp`
   - Позиционирование (`backgroundSize: '350%'`, `backgroundPosition: '50% 21%'`) — НЕ трогать!

### Ожидаемый результат:
- `fire.png` 2031 KB → ~150-200 KB (WebP)
- `abel.png` 969 KB → ~100-150 KB (WebP)
- `monster-hunter-stories-3.jpg` 1016 KB → ~80-120 KB (WebP + resize)
- Общий вес картинок: ~800 KB вместо 4600 KB

---

## ЗАДАЧА 2 — Ленивая загрузка Chatwoot виджета (ВТОРОЙ ПО ЭФФЕКТУ)

**Цель:** убрать ~1.3 MB (790 KB CSS + 500+ KB JS) из критического пути загрузки.

### Текущее состояние:
Chatwoot загружается через компонент `ChatWidget.tsx` сразу при рендере страницы. Его скрипт тянет Vue.js-приложение целиком: CSS 790 KB + JS 500+ KB. 99% пользователей не откроют чат при первом визите.

### Шаги:

1. **Найди компонент `ChatWidget.tsx`** (или как он называется — компонент, который инжектит Chatwoot скрипт)

2. **Замени немедленную загрузку на отложенную.** Chatwoot должен загружаться ТОЛЬКО при одном из условий:
   - Пользователь проскроллил 50% страницы
   - Пользователь кликнул на кнопку чата / написать нам
   - Прошло 15 секунд после загрузки страницы (fallback)

3. **Примерная реализация:**
```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function ChatWidget() {
  const loaded = useRef(false);

  const loadChatwoot = () => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://chat.activeplay.games/packs/js/sdk.js';
    script.defer = true;
    script.async = true;
    script.onload = () => {
      window.chatwootSettings = {
        position: 'right',
        type: 'standard',
        launcherTitle: 'Написать нам',
      };
      window.chatwootSDK?.run({
        websiteToken: 'CRRDuUyh65jLcZ9S25C4mA1C',
        baseUrl: 'https://chat.activeplay.games',
      });
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    // Загрузить через 15 секунд как fallback
    const timer = setTimeout(loadChatwoot, 15000);

    // Или по скроллу 50%
    const handleScroll = () => {
      if (window.scrollY > document.body.scrollHeight * 0.5) {
        loadChatwoot();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
```

4. **Проверь:** убедись, что кнопка «Написать нам» в header/footer тоже триггерит `loadChatwoot()` при клике, если виджет ещё не загружен. Если на сайте есть `MessengerPopup` — он должен работать независимо от Chatwoot.

### Ожидаемый результат:
- Убрано ~1.3 MB из начальной загрузки
- TBT уменьшится на ~200-400мс
- TTI улучшится значительно

---

## ЗАДАЧА 3 — Preload шрифтов и минорные оптимизации

### Шаги:

1. **Preload шрифтов** — добавь в `_document.tsx` или `layout.tsx`:
```jsx
<link rel="preload" href="/fonts/rajdhani-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
<link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
```
(Уточни реальные пути к шрифтам из `public/fonts/` или из Google Fonts)

2. **Если шрифты грузятся с Google Fonts** — добавь `<link rel="preconnect">`:
```jsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

3. **DNS-prefetch для Chatwoot** (поскольку теперь он грузится лениво):
```jsx
<link rel="dns-prefetch" href="https://chat.activeplay.games" />
```

4. **Проверь `next.config.ts`** — убедись что включена компрессия:
```js
compress: true,
```

5. **Добавь `font-display: swap`** к @font-face правилам (если есть кастомные шрифты), чтобы текст показывался сразу, не дожидаясь загрузки шрифтов.

---

## ПОРЯДОК ВЫПОЛНЕНИЯ

Делай задачи СТРОГО по порядку, одну за другой:
1. Сначала ЗАДАЧА 1 (картинки) — запусти скрипт, обнови теги
2. Потом ЗАДАЧА 2 (Chatwoot) — переделай ChatWidget.tsx
3. Потом ЗАДАЧА 3 (шрифты + мелочи)

После каждой задачи — покажи что изменилось (какие файлы, что было → что стало).

## ЧЕГО НЕ ДЕЛАТЬ

- НЕ переключаться на `next/image` — оставляем `<img>`
- НЕ трогать позиционирование фото Abel
- НЕ удалять оригинальные файлы картинок (только добавить WebP-версии)
- НЕ менять дизайн, стили, цвета — только техническая оптимизация
- НЕ трогать Chatwoot на сервере — только клиентскую загрузку виджета
