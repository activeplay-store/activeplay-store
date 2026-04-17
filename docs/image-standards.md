# Стандарт обложек (guides / news / prefer-3:2)

## Формат обложек гайдов

- **Размер: 1200×800, аспект 3:2 (1.5)**
- Формат: WebP, quality 82–85
- Вес: 100–200 KB
- Путь: `public/images/guides/<slug>.webp`
- Используется в двух местах:
  - карточка на `/guides` (контейнер `aspect-[3/2]` в [GuidesContent.tsx](src/app/guides/GuidesContent.tsx), `object-cover`)
  - `openGraph.images[]` в metadata гайда (FB/Twitter/Telegram превью)

## Почему 3:2, а не 16:9 или 1.91:1

- Контейнер карточки гайда `aspect-[3/2]`. Любой другой аспект → `object-cover` резанёт стороны.
- FB/Twitter принимают 3:2 и сами кропят до 1.91:1 при необходимости — потеря минимальна.
- Все существующие обложки (ps-plus, gta6, ea-play, fc-points, xbox-game-pass) уже 3:2 — унифицировано.

## Конверсия из произвольного PNG

Команда (из корня репо):

```bash
node -e "
const sharp = require('sharp');
sharp('путь/к/исходнику.png')
  .resize(1200, 800, { fit: 'cover', position: sharp.strategy.attention })
  .webp({ quality: 85 })
  .toFile('public/images/guides/<slug>.webp');
"
```

Опции `fit`:
- `fit: 'fill'` — если исходник уже 3:2, просто ресайз.
- `fit: 'cover'` + `position: 'attention'` — умная обрезка (sharp ищет самую информативную часть).
- `fit: 'cover'` + `position: 'right'` — если композиция смещена вправо.

Если итог > 200 KB, снижаем quality до 82, 80.

## Стандарт og:image

```ts
openGraph: {
  images: [{
    url: 'https://activeplay.games/images/guides/<slug>.webp',
    width: 1200,
    height: 800,
    alt: '<короткое описание>',
  }],
}
```

## Карточки news

Картинки новостей приходят из внешних источников (RAWG / PS Blog / др.), не унифицируются на нашей стороне. Для новых локально-сгенерированных новостных обложек — тот же стандарт 3:2.
