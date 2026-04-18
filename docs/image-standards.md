# Стандарт обложек (guides / news — 16:9)

## Формат обложек гайдов и новостей

- **Размер: 1200×675, аспект 16:9 (1.778) — `aspect-video` в CSS**
- Формат: WebP, quality 82–85
- Вес: 100–200 KB
- Путь: `public/images/guides/<slug>.webp`
- Используется в двух местах:
  - карточка на `/guides` (контейнер `aspect-video` в [GuidesContent.tsx](src/app/guides/GuidesContent.tsx), `object-cover`)
  - карточка на `/news` (контейнер `aspect-video` в [NewsContent.tsx](src/app/news/NewsContent.tsx))
  - `openGraph.images[]` в metadata гайда (FB/Twitter/Telegram превью)

## Почему 16:9

- Контейнеры карточек в `/guides` и `/news` используют `aspect-video` (16:9).
- Любой другой аспект обложки → `object-cover` либо искажает пропорции (выглядит «сжато»), либо режет края.
- OG тег с 16:9 принимается Facebook/Twitter/Telegram без дополнительного кропа.

**Исторически** часть существующих обложек (ps-plus, gta6, ea-play, fc-points, xbox-game-pass) сохранены в 3:2 (600×400 или 1200×800) — они чуть кропятся сверху/низу в 16:9-контейнере (~6%), визуально это приемлемо. При замене/обновлении конвертить в 16:9.

## Конверсия из произвольного PNG в 16:9

Команда (из корня репо `D:/activeplay-store`):

```bash
node -e "
const sharp = require('sharp');
(async () => {
  const src = 'путь/к/исходнику.png';
  const dst = '.claude/worktrees/<worktree>/public/images/guides/<slug>.webp';
  const meta = await sharp(src).metadata();
  const tA = 16/9;
  const srcA = meta.width / meta.height;
  let opts;
  if (Math.abs(srcA - tA) < 0.02) {
    opts = { fit: 'fill' };
  } else if (srcA > tA) {
    // source wider — crop sides
    const cropW = Math.round(meta.height * tA);
    const cropLeft = Math.round((meta.width - cropW) / 2);
    await sharp(src).extract({ width: cropW, height: meta.height, left: cropLeft, top: 0 })
      .resize(1200, 675, { fit: 'fill' }).webp({ quality: 85 }).toFile(dst);
    return;
  } else {
    // source taller — crop top/bottom
    const cropH = Math.round(meta.width / tA);
    const cropTop = Math.round((meta.height - cropH) / 2);
    await sharp(src).extract({ width: meta.width, height: cropH, left: 0, top: cropTop })
      .resize(1200, 675, { fit: 'fill' }).webp({ quality: 85 }).toFile(dst);
    return;
  }
  await sharp(src).resize(1200, 675, opts).webp({ quality: 85 }).toFile(dst);
})();
"
```

Если итог > 200 KB, снижаем quality до 82, 80.

Если композиция смещена вправо/влево (не по центру), замени `cropLeft = Math.round((meta.width - cropW) / 2)` на `cropLeft = meta.width - cropW` (право) или `cropLeft = 0` (лево).

## Стандарт og:image

```ts
openGraph: {
  images: [{
    url: 'https://activeplay.games/images/guides/<slug>.webp',
    width: 1200,
    height: 675,
    alt: '<короткое описание>',
  }],
}
```
