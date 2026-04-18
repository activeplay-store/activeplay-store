'use client';

import { useState, useMemo } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { guidesData, GUIDE_CATEGORIES, type GuideCategory } from '@/data/guides';

/* ── Constants ─────────────────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 6;
const ALL_CATEGORIES: ('all' | GuideCategory)[] = ['all', 'playstation', 'xbox', 'ea', 'ea-fc', 'pc', 'payment', 'general'];
const CATEGORY_LABELS: Record<string, string> = {
  all: 'Все',
  playstation: 'PlayStation',
  xbox: 'Xbox',
  ea: 'EA',
  'ea-fc': 'EA FC',
  pc: 'ПК',
  payment: 'Оплата',
  general: 'Общее',
};

/* ── Component ─────────────────────────────────────────────────────────── */

export default function GuidesContent() {
  const [activeCategory, setActiveCategory] = useState<'all' | GuideCategory>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filtered = useMemo(() => {
    const items = activeCategory === 'all' ? guidesData : guidesData.filter((g) => g.category === activeCategory);
    return [...items].sort((a, b) => {
      const diff = new Date(b.updatedDate || b.date).getTime() - new Date(a.updatedDate || a.date).getTime();
      if (diff !== 0) return diff;
      return Number(b.id.replace('g', '')) - Number(a.id.replace('g', ''));
    });
  }, [activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: guidesData.length };
    for (const g of guidesData) counts[g.category] = (counts[g.category] || 0) + 1;
    return counts;
  }, []);

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-[900px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 font-mono mb-6">
          <a href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</a>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Гайды</span>
        </div>

        {/* Heading */}
        <ScrollReveal>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-3xl sm:text-4xl mb-3">
            Гайды и <span className="text-[#00D4FF]">инструкции</span>
          </h1>
          <p className="text-gray-400 text-base mb-8 font-[family-name:var(--font-body)]">
            Пошаговые руководства по покупке подписок и игр из России — с картинками и видео
          </p>
        </ScrollReveal>

        {/* Filter Tabs */}
        <div className="overflow-x-auto scrollbar-hide border-b border-white/10 mb-8">
          <div className="flex gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
                  className={`shrink-0 pb-2.5 text-sm font-semibold uppercase tracking-wide font-[family-name:var(--font-display)] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {CATEGORY_LABELS[cat]} <span className="text-xs opacity-50">{categoryCounts[cat] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guide Cards — horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col gap-4">
          {visible.map((guide) => {
            const cat = GUIDE_CATEGORIES[guide.category];
            return (
              <ScrollReveal key={guide.id}>
                <a
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col sm:flex-row rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#00D4FF]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] hover:-translate-y-0.5"
                >
                  {/* Cover */}
                  <div className="sm:w-[300px] sm:shrink-0 aspect-video overflow-hidden bg-[#0A1628]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={guide.coverUrl}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      {/* Category badge */}
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                          border: `1px solid ${cat.color}30`,
                        }}
                      >
                        {cat.icon} {cat.label}
                      </span>

                      {/* Title */}
                      <h2 className="font-[family-name:var(--font-display)] font-bold text-white text-lg leading-snug line-clamp-2 mb-2 group-hover:text-[#00D4FF] transition-colors">
                        {guide.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-[family-name:var(--font-body)] mb-3">
                        {guide.excerpt}
                      </p>
                    </div>

                    {/* Meta & Tags */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>📅 {new Date(guide.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span>·</span>
                        <span>⏱ {guide.readTime}</span>
                        {guide.updatedDate && (
                          <>
                            <span>·</span>
                            <span className="text-green-400">🔄 Обновлено: {new Date(guide.updatedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                          </>
                        )}
                      </div>

                      {/* Tags */}
                      {guide.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {guide.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-gray-400 border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            Нет гайдов в этой категории
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

        {/* Help block */}
        <ScrollReveal className="mt-12">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center">
            <p className="text-gray-300 text-base mb-2 font-[family-name:var(--font-body)] font-semibold">
              Не нашли ответ?
            </p>
            <p className="text-gray-400 text-sm mb-4 font-[family-name:var(--font-body)]">
              Напишите нам — поможем разобраться!
            </p>
            <a
              href="https://t.me/activeplay1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-telegram text-white font-semibold text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Написать менеджеру
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
