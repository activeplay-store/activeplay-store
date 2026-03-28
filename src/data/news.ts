// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: 2026-03-28T20:04:23.539Z

export type NewsCategory = 'news' | 'insider' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

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
  insider:      { label: 'Инсайд',   color: '#FF9500', icon: '🔍' },
  video:        { label: 'Видео',     color: '#FF4D6A', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#A855F7', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F59E0B', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};

export const newsData: NewsItem[] = [
  {
    id: 'news-1774728153215-k8b5',
    slug: 'lords-of-the-fallen-vozglavit-ps-plus-essential-v-aprele-2026',
    category: 'insider' as NewsCategory,
    title: 'Lords of the Fallen возглавит PS Plus Essential в апреле 2026',
    excerpt: 'Dealabs слил апрельскую раздачу PS Plus Essential. Главный тайтл: Lords of the Fallen 2023 года.',
    content: `<p>Dealabs слил апрельскую раздачу PS Plus Essential. Главный тайтл месяца: Lords of the Fallen в версии 2023 года. Не путать с оригиналом 2014-го: здесь другая студия, другой движок и совершенно другой масштаб.</p>
<p>Мрачное фэнтези в духе Dark Souls с параллельными мирами и жёсткими боссами. Студия Hexworks серьёзно подтянула проект после релиза. На Metacritic 73 балла.</p>
<p>Официальный анонс Sony ожидается на следующей неделе.</p>`,
    coverUrl: '/images/news/news-1774728153215-k8b5.jpg',
    date: '2026-03-28',
    source: 'Push Square',
    author: 'ActivePlay',
    tags: ["PS Plus", "Lords of the Fallen", "игры", "слухи", "анонс"],
    metaDescription: 'Утечка: Lords of the Fallen станет одной из бесплатных игр PS Plus Essential в апреле. Подробности и детали.',
  }
];
