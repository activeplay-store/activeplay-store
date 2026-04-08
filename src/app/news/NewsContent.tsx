'use client';

import { useState, useMemo } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { NEWS_CATEGORIES, type NewsCategory, type NewsItem } from '@/data/news-types';
import newsJson from '@/data/news.json';
import { guidesData } from '@/data/guides';

/* ── Helpers ───────────────────────────────────────────────────────────── */

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Только что';
  if (diffHours < 24) return `${diffHours} ${pluralize(diffHours, 'час', 'часа', 'часов')} назад`;
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} ${pluralize(diffDays, 'день', 'дня', 'дней')} назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/* ── Constants ─────────────────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 6;
const ALL_CATEGORIES: ('all' | NewsCategory)[] = ['all', 'news', 'hype', 'insider', 'rumor', 'video', 'guide', 'review', 'announcement', 'interview', 'podcast'];
const CATEGORY_LABELS: Record<string, string> = {
  all: 'Все',
  news: 'Новости',
  hype: 'Хайп',
  insider: 'Инсайды',
  rumor: 'Слухи',
  video: 'Видео',
  guide: 'Гайды',
  review: 'Обзоры',
  announcement: 'Анонсы',
  interview: 'Интервью',
  podcast: 'Подкасты',
};

/* ── Component ─────────────────────────────────────────────────────────── */

export default function NewsContent() {
  const [activeCategory, setActiveCategory] = useState<'all' | NewsCategory>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Cast JSON to typed array
  const newsData = newsJson as unknown as NewsItem[];

  // Merge guides into news feed as "guide" category items
  const allItems = useMemo(() => {
    const guideNewsItems: NewsItem[] = guidesData.map((g) => ({
      id: `guide-${g.id}`,
      slug: g.slug,
      category: 'guide' as NewsCategory,
      title: g.title,
      content: g.excerpt,
      excerpt: g.excerpt,
      coverUrl: g.coverUrl,
      publishedAt: g.updatedDate || g.date,
      source: 'ActivePlay',
      author: g.author,
      tags: g.tags || [],
    }));
    return [...newsData, ...guideNewsItems].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [newsData]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return allItems;
    return allItems.filter((item) => item.category === activeCategory);
  }, [allItems, activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allItems.length };
    for (const item of allItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [allItems]);

  function getCardHref(item: NewsItem): string {
    // Guides always link to /guides/[slug]
    if (item.category === 'guide') return `/guides/${item.slug}`;
    return `/news/${item.slug}`;
  }

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-[900px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 font-mono mb-6">
          <a href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</a>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Новости</span>
        </div>

        {/* Heading */}
        <ScrollReveal>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-3xl sm:text-4xl mb-3">
            Новости <span className="text-[#00D4FF]">Gaming</span>
          </h1>
          <p className="text-gray-400 text-base mb-8 font-[family-name:var(--font-body)]">
            Главное из мира PlayStation, Xbox и PC — обновляется ежедневно
          </p>
        </ScrollReveal>

        {/* Filter Tabs */}
        <div className="overflow-x-auto scrollbar-hide border-b border-white/10 mb-8">
          <div className="flex gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
                className={`shrink-0 pb-2.5 text-sm font-semibold uppercase tracking-wide font-[family-name:var(--font-display)] whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {CATEGORY_LABELS[cat]} <span className="text-xs opacity-50">{categoryCounts[cat] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visible.map((item) => (
            <ScrollReveal key={item.id}>
              <a
                href={getCardHref(item)}
                className="group block rounded-xl bg-white/[0.03] overflow-hidden transition-all duration-300 hover:ring-1 hover:ring-[#00D4FF]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] hover:-translate-y-0.5"
              >
                {/* Cover */}
                <div className={`relative overflow-hidden ${item.category === 'podcast' ? 'aspect-square' : 'aspect-video'}`}>
                  {item.coverUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover scale-110 transition-transform duration-500 group-hover:scale-[1.15]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0a0f1a] to-[#1a1f2e] flex items-center justify-center">
                      <span className="text-4xl opacity-30">{NEWS_CATEGORIES[item.category]?.icon || '📰'}</span>
                    </div>
                  )}
                  {/* HOT badge */}
                  {item.hot && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold bg-red-500 text-white animate-pulse">
                      🔥 HOT
                    </span>
                  )}
                  {/* Video play overlay */}
                  {(item.category === 'video' || item.youtubeUrl) && item.category !== 'podcast' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur flex items-center justify-center group-hover:bg-[#00D4FF]/80 transition-colors">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Duration pill */}
                  {item.duration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono backdrop-blur-sm">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category badge */}
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2"
                    style={{
                      backgroundColor: `${NEWS_CATEGORIES[item.category].color}15`,
                      color: NEWS_CATEGORIES[item.category].color,
                      border: `1px solid ${NEWS_CATEGORIES[item.category].color}30`,
                    }}
                  >
                    {NEWS_CATEGORIES[item.category].icon} {NEWS_CATEGORIES[item.category].label}
                  </span>

                  {/* Title */}
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#00D4FF] transition-colors">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2 font-[family-name:var(--font-body)] mb-3">
                    {item.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                    <span>{formatRelativeDate(item.publishedAt)}</span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            Нет материалов в этой рубрике
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
              className="w-full py-3.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm text-[#00D4FF] font-semibold text-sm transition-all hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/10"
            >
              Загрузить ещё ↓
            </button>
          </div>
        )}

        {/* Telegram Banner */}
        <ScrollReveal className="mt-12">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center">
            <p className="text-gray-300 text-sm mb-3 font-[family-name:var(--font-body)]">
              Обсуждайте новости в нашем Telegram-канале — <span className="text-[#00D4FF]">3 100+ подписчиков</span>
            </p>
            <a
              href="https://t.me/PS_PLUS_RUS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-telegram text-white font-semibold text-sm transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Перейти в Telegram
            </a>
          </div>
        </ScrollReveal>

        {/* Bottom subscription banner */}
        <ScrollReveal className="mt-8">
          <div className="rounded-xl border border-[#00D4FF]/20 bg-[#00D4FF]/[0.03] p-5 text-center">
            <p className="text-gray-300 text-sm font-[family-name:var(--font-body)]">
              Подпишитесь на <a href="https://t.me/PS_PLUS_RUS" target="_blank" rel="noopener noreferrer" className="text-[#00D4FF] font-semibold hover:underline">@PS_PLUS_RUS</a> — горячие новости и скидки первыми
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
