// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: 2026-03-28T20:04:23.539Z

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
    id: 'news-1774728153215-k8b5',
    slug: 'lords-of-the-fallen-vozglavit-ps-plus-essential-v-aprele-2026',
    category: 'news' as NewsCategory,
    title: 'Lords of the Fallen возглавит PS Plus Essential в апреле 2026',
    excerpt: 'Утечка раскрыла одну из игр, которая появится в PS Plus Essential в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen.',
    content: `<p>Утечка раскрыла одну из игр, которая появится в PS Plus Essential в апреле.</p>
<p>По информации от Dealabs, главной игрой станет Lords of the Fallen.</p>
<p>Важно: речь о перезапуске 2023 года, а не об оригинальной игре 2014-го.</p>
<p>Это souls-like экшен с мрачным фэнтези и хардкорными боссами.</p>
<p>Разработчик: Hexworks.</p>
<p>У игры 73 балла на Metacritic.</p>
<p>Официальный анонс стоит ждать на следующей неделе.</p>`,
    coverUrl: '',
    date: '2026-03-28',
    source: 'Push Square',
    author: 'ActivePlay',
    tags: ["PS Plus", "Lords of the Fallen", "игры", "слухи", "анонс"],
    metaDescription: 'Утечка: Lords of the Fallen станет одной из бесплатных игр PS Plus Essential в апреле. Подробности и детали.',
  }
];
