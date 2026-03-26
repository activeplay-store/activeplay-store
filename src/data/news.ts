export type NewsCategory = 'news' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  content?: string;
  coverUrl: string;
  date: string;
  source?: string;
  author?: string;
  tags?: string[];
  youtubeUrl?: string;
  duration?: string;
  hot?: boolean;
  pinned?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; color: string; icon: string }> = {
  news:         { label: 'Новость',   color: '#00D4FF', icon: '📰' },
  video:        { label: 'Видео',     color: '#FF4D6A', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#A855F7', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F59E0B', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};

export const newsData: NewsItem[] = [
  {
    id: 'n1',
    slug: 'sony-anonsirovala-ps6-specifikacii',
    category: 'news',
    title: 'Sony раскрыла первые спецификации PlayStation 6',
    excerpt: 'Компания Sony официально подтвердила разработку PlayStation 6 и поделилась первыми техническими характеристиками консоли нового поколения.',
    content: `<p>Sony Interactive Entertainment впервые официально раскрыла информацию о PlayStation 6. На закрытой презентации для разработчиков компания представила первые спецификации будущей консоли.</p>
<p>По словам представителей Sony, PS6 получит кастомный процессор на архитектуре AMD Zen 6, поддержку трассировки лучей нового поколения и SSD с пропускной способностью до 20 ГБ/с. Консоль будет полностью обратно совместима с библиотекой PS5.</p>
<p>«Мы создаём платформу, которая стирает границу между играми и реальностью», — заявил Марк Черни, ведущий архитектор PlayStation. Ожидается, что полная презентация PS6 состоится в конце 2026 года.</p>
<p>Аналитики отмечают, что Sony делает ставку на облачные технологии и ИИ-генерацию контента. Цена консоли пока не объявлена, но инсайдеры говорят о диапазоне $599–$699.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=450&fit=crop',
    date: '2026-03-25',
    source: 'PlayStation Blog',
    author: 'ActivePlay',
    tags: ['PS6', 'Sony', 'консоли', 'анонс'],
    hot: true,
    pinned: true,
  },
  {
    id: 'n2',
    slug: 'ps-plus-april-2026-igry',
    category: 'news',
    title: 'PS Plus апрель 2026 — список игр месяца',
    excerpt: 'Sony объявила список бесплатных игр PS Plus Essential на апрель 2026. В подборку вошли три крупных тайтла для PS5 и PS4.',
    content: `<p>Sony PlayStation официально анонсировала список игр, которые будут доступны подписчикам PS Plus Essential в апреле 2026 года.</p>
<p>В подборку вошли:</p>
<ul>
<li><strong>Stellar Blade: Complete Edition</strong> (PS5) — дополненная версия экшена от Shift Up</li>
<li><strong>Lies of P: DLC Edition</strong> (PS5/PS4) — souls-like с Пиноккио, включая DLC</li>
<li><strong>Need for Speed: Underground Remastered</strong> (PS5) — ремастер культовой гонки</li>
</ul>
<p>Игры станут доступны для скачивания с 1 апреля 2026 года. Напоминаем, что для получения игр необходима активная подписка PS Plus Essential или выше.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=800&h=450&fit=crop',
    date: '2026-03-24',
    source: 'PlayStation Blog',
    author: 'ActivePlay',
    tags: ['PS Plus', 'бесплатные игры', 'апрель 2026'],
  },
  {
    id: 'n3',
    slug: 'obzor-ghost-of-yotei',
    category: 'video',
    title: 'Ghost of Yōtei — первый геймплей и впечатления',
    excerpt: 'Разбираем 20 минут геймплея Ghost of Yōtei от Sucker Punch. Новый открытый мир, женский протагонист и улучшенная боевая система.',
    content: `<p>Sucker Punch Productions показали первый продолжительный геймплей Ghost of Yōtei — сиквела Ghost of Tsushima. В этом видео мы разбираем все ключевые моменты.</p>
<p>Игра переносит действие в Хоккайдо 1603 года. Главная героиня Ацу использует новые виды оружия, включая нагинату и кусаригаму. Открытый мир стал ещё больше и разнообразнее.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
    date: '2026-03-23',
    source: 'ActivePlay',
    author: 'ActivePlay',
    tags: ['Ghost of Yōtei', 'PS5', 'геймплей', 'Sucker Punch'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '18:34',
  },
  {
    id: 'n4',
    slug: 'intervyu-razrabotchik-astro-bot',
    category: 'interview',
    title: 'Интервью с Team Asobi: будущее Astro Bot и VR на PS5',
    excerpt: 'Поговорили с Николя Дусе о планах Team Asobi после успеха Astro Bot, новых DLC и перспективах PlayStation VR2.',
    content: `<p>После триумфа Astro Bot на The Game Awards 2025 мы связались с Николя Дусе, руководителем Team Asobi, чтобы обсудить будущее франшизы.</p>
<p>«Astro Bot — это только начало. У нас есть амбициозные планы на DLC и новые проекты», — рассказал Дусе. Он также подтвердил, что команда экспериментирует с PlayStation VR2 и рассматривает возможность создания VR-режима для Astro Bot.</p>
<p>На вопрос о потенциальном сиквеле Дусе ответил уклончиво, но намекнул, что «вселенная Astro Bot будет расширяться в неожиданных направлениях».</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
    date: '2026-03-22',
    source: 'ActivePlay',
    author: 'ActivePlay',
    tags: ['Astro Bot', 'Team Asobi', 'интервью', 'PS VR2'],
  },
  {
    id: 'n5',
    slug: 'xbox-game-pass-mart-2026-dobavleniya',
    category: 'announcement',
    title: 'Xbox Game Pass — 8 новых игр в конце марта 2026',
    excerpt: 'Microsoft добавляет восемь новых игр в Game Pass, включая долгожданный инди-хит и два AAA-тайтла. Рассказываем, что появится в каталоге.',
    content: `<p>Microsoft анонсировала вторую волну пополнения Game Pass в марте 2026. В каталог добавляются восемь игр для консолей, PC и облака.</p>
<p>Главные добавления:</p>
<ul>
<li><strong>Avowed</strong> (день первый) — RPG от Obsidian Entertainment</li>
<li><strong>Citizen Sleeper 2: Starward Vector</strong> — продолжение инди-хита</li>
<li><strong>Like a Dragon: Pirate Yakuza</strong> — спин-офф серии Yakuza</li>
</ul>
<p>Все игры станут доступны с 28 марта 2026 года.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=450&fit=crop',
    date: '2026-03-21',
    source: 'Xbox Wire',
    author: 'ActivePlay',
    tags: ['Xbox', 'Game Pass', 'Avowed', 'инди'],
  },
  {
    id: 'n6',
    slug: 'podcast-itogi-gdc-2026',
    category: 'podcast',
    title: 'Подкаст #47: Итоги GDC 2026 — тренды индустрии',
    excerpt: 'Обсуждаем главные анонсы и тренды GDC 2026: нейросети в геймдеве, новые движки и будущее мобильного гейминга.',
    content: `<p>В новом выпуске подкаста ActivePlay обсуждаем итоги Game Developers Conference 2026.</p>
<p>Главные темы выпуска:</p>
<ul>
<li>ИИ в геймдеве — угроза или инструмент?</li>
<li>Unreal Engine 6 — первые демонстрации</li>
<li>Мобильный гейминг: AAA-игры на смартфонах</li>
<li>Облачный стриминг: прорыв или стагнация?</li>
</ul>`,
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=450&fit=crop',
    date: '2026-03-20',
    source: 'ActivePlay',
    author: 'ActivePlay',
    tags: ['подкаст', 'GDC 2026', 'индустрия'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '1:12:45',
  },
  {
    id: 'n7',
    slug: 'obzor-final-fantasy-7-rebirth-pc',
    category: 'review',
    title: 'Final Fantasy VII Rebirth на PC — обзор порта',
    excerpt: 'Square Enix наконец выпустила PC-версию Final Fantasy VII Rebirth. Разбираем производительность, графику и качество порта.',
    content: `<p>Спустя год после консольного релиза Final Fantasy VII Rebirth добралась до PC. Мы протестировали порт на разных конфигурациях и готовы поделиться впечатлениями.</p>
<p>Графика на максимальных настройках выглядит потрясающе — текстуры высокого разрешения, улучшенное освещение и стабильные 60 FPS на RTX 4070 в 1440p. Поддержка DLSS 4 и FSR 4 позволяет комфортно играть и на более слабом железе.</p>
<p>Из минусов — требовательность к оперативной памяти (рекомендуется 32 ГБ) и объём установки в 150 ГБ. В целом порт заслуживает оценки <strong>8/10</strong> — отличная игра с достойной PC-адаптацией.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
    date: '2026-03-19',
    source: 'ActivePlay',
    author: 'ActivePlay',
    tags: ['Final Fantasy VII', 'PC', 'обзор', 'Square Enix'],
  },
  {
    id: 'n8',
    slug: 'days-of-play-2026-daty-skidki',
    category: 'announcement',
    title: 'Days of Play 2026 — даты и первые скидки',
    excerpt: 'Sony подтвердила проведение акции Days of Play 2026. Ожидаются скидки на PS Plus, игры и аксессуары PlayStation.',
    content: `<p>Sony объявила даты проведения ежегодной акции Days of Play 2026. Распродажа стартует 29 мая и продлится до 12 июня.</p>
<p>В рамках акции ожидаются:</p>
<ul>
<li>Скидка 25% на подписку PS Plus (все уровни)</li>
<li>Скидки до 80% на игры в PS Store</li>
<li>Специальные предложения на DualSense и PS VR2</li>
<li>Бесплатные онлайн-выходные (мультиплеер без PS Plus)</li>
</ul>
<p>Следите за обновлениями — мы опубликуем полный список скидок в день старта акции.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
    date: '2026-03-18',
    source: 'PlayStation Blog',
    author: 'ActivePlay',
    tags: ['Days of Play', 'распродажа', 'PS Plus', 'скидки'],
    hot: true,
  },
  {
    id: 'n9',
    slug: 'video-sravnenie-ps-plus-xbox-game-pass-2026',
    category: 'video',
    title: 'PS Plus vs Xbox Game Pass в 2026 — что выгоднее?',
    excerpt: 'Подробное сравнение PS Plus и Xbox Game Pass в 2026 году: цены, каталоги, эксклюзивы и выгода для российских геймеров.',
    content: `<p>Вечный вопрос геймеров — что лучше, PS Plus или Game Pass? В этом видео мы сравниваем обе подписки по всем параметрам в 2026 году.</p>
<p>Спойлер: однозначного ответа нет, но мы поможем выбрать лучший вариант именно для вас.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=450&fit=crop',
    date: '2026-03-17',
    source: 'ActivePlay',
    author: 'ActivePlay',
    tags: ['PS Plus', 'Game Pass', 'сравнение'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '24:15',
  },
  {
    id: 'n10',
    slug: 'nintendo-switch-2-cena-data',
    category: 'news',
    title: 'Nintendo Switch 2 — официальная цена и дата выхода',
    excerpt: 'Nintendo наконец объявила цену и дату релиза Switch 2. Консоль выйдет летом 2026 года по цене $399.',
    content: `<p>Nintendo провела специальную презентацию Nintendo Direct, на которой раскрыла все детали о Switch 2.</p>
<p>Консоль получит 8-дюймовый OLED-дисплей с поддержкой 1080p, процессор NVIDIA T239, 12 ГБ оперативной памяти и поддержку 4K при подключении к док-станции. Стартовая цена составит $399 (ожидаемая цена в России — около 45 000 рублей).</p>
<p>Дата выхода — 5 июня 2026 года. На старте будут доступны Mario Kart World, The Legend of Zelda и Metroid Prime 4.</p>`,
    coverUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=450&fit=crop',
    date: '2026-03-16',
    source: 'Nintendo',
    author: 'ActivePlay',
    tags: ['Nintendo', 'Switch 2', 'консоли', 'анонс'],
  },
];
