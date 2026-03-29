export type NewsCategory = 'news' | 'hype' | 'insider' | 'rumor' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

export interface NewsCta {
  title: string;
  description?: string;
  price?: number | string;
  oldPrice?: number | string;
  discount?: number;
  url: string;
  buttonText: string;
  gameId?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  metaDescription?: string;
  coverUrl: string;
  tags: string[];
  category: NewsCategory;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  author?: string;
  gameId?: string | null;
  relatedProduct?: string | null;
  cta?: NewsCta | null;
  cta2?: NewsCta | null;
  youtubeUrl?: string;
  duration?: string;
  hot?: boolean;
  pinned?: boolean;
}

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; color: string; icon: string }> = {
  news:         { label: 'Новость',   color: '#00D4FF', icon: '📰' },
  hype:         { label: 'Хайп',      color: '#FF4D6A', icon: '🔥' },
  insider:      { label: 'Инсайд',    color: '#A855F7', icon: '🕵️' },
  rumor:        { label: 'Слух',      color: '#F59E0B', icon: '🤫' },
  video:        { label: 'Видео',     color: '#EF4444', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#818CF8', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F97316', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};
