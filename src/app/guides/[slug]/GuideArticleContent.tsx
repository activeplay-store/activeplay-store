'use client';

import { useState, useEffect } from 'react';
import { GUIDE_CATEGORIES, type GuideItem } from '@/data/guides';

interface Props {
  guide: GuideItem;
  relatedGuides: GuideItem[];
}

export default function GuideArticleContent({ guide, relatedGuides }: Props) {
  const [tocOpen, setTocOpen] = useState(false);

  // Default: open on desktop, closed on mobile
  useEffect(() => {
    setTocOpen(window.innerWidth >= 768);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-[720px] mx-auto">
      {/* TOC Accordion */}
      <div className="mb-10 rounded-lg border border-white/10 bg-white/5">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-300"
        >
          <span>📋 Содержание</span>
          <svg className={`w-4 h-4 transition-transform ${tocOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {tocOpen && (
          <div className="px-4 pb-4">
            <nav className="flex flex-col gap-2">
              {guide.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left text-sm py-1 px-2 rounded text-gray-400 hover:text-[#00D4FF] transition-colors"
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Sections */}
      {guide.sections.map((section) => (
        <div key={section.id} className="mb-10">
          <h2
            id={section.id}
            className="font-[family-name:var(--font-display)] font-bold text-xl sm:text-2xl text-white mb-4 scroll-mt-28"
          >
            {section.title}
          </h2>

          <div
            className="font-[family-name:var(--font-body)] text-base text-gray-300 leading-[1.7] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1.5 [&_strong]:text-white [&_a]:text-[#00D4FF] [&_a]:underline [&_a:hover]:text-white [&_table]:w-full [&_table]:mb-4 [&_th]:text-left [&_th]:py-2 [&_th]:px-3 [&_th]:bg-white/5 [&_th]:text-gray-300 [&_th]:text-sm [&_th]:font-semibold [&_td]:py-2 [&_td]:px-3 [&_td]:text-sm [&_td]:border-t [&_td]:border-white/5"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          {section.imageUrl && (
            <div className="my-6 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.imageUrl}
                alt={section.title}
                className="w-full object-cover rounded-xl"
                loading="lazy"
              />
            </div>
          )}

          {section.tip && (
            <div className="my-4 p-4 rounded-lg border-l-4 border-green-500 bg-green-500/5">
              <p className="text-sm text-gray-300 font-[family-name:var(--font-body)] leading-relaxed [&_a]:text-[#00D4FF] [&_a]:underline [&_a:hover]:text-white">
                <span className="font-semibold text-green-400">💡 Совет: </span>
                <span dangerouslySetInnerHTML={{ __html: section.tip }} />
              </p>
            </div>
          )}

          {section.warning && (
            <div className="my-4 p-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/5">
              <p className="text-sm text-gray-300 font-[family-name:var(--font-body)] leading-relaxed">
                <span className="font-semibold text-amber-400">⚠️ Важно: </span>
                {section.warning}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Tags */}
      {guide.tags && guide.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          {guide.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Telegram CTA */}
      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center">
        <p className="text-gray-300 text-sm mb-3">Обсудите этот гайд в нашем Telegram-канале</p>
        <a
          href="https://t.me/PS_PLUS_RUS"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-telegram text-white font-semibold text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Обсудить в Telegram
        </a>
      </div>

      {/* Useful links */}
      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
        <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
          Полезные ссылки
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
          <a href="/ps-plus-essential" className="text-gray-400 hover:text-[#00D4FF] transition-colors">→ PS Plus Essential</a>
          <a href="/ps-plus-extra" className="text-gray-400 hover:text-[#00D4FF] transition-colors">→ PS Plus Extra</a>
          <a href="/xbox-game-pass-ultimate" className="text-gray-400 hover:text-[#00D4FF] transition-colors">→ Game Pass Ultimate</a>
          <a href="/sale" className="text-gray-400 hover:text-[#00D4FF] transition-colors">→ Скидки PS Store</a>
          <a href="https://t.me/PS_PLUS_RUS" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00D4FF] transition-colors">→ Telegram канал</a>
        </div>
      </div>

      {/* Related guides — vertical cards, 3 columns */}
      {relatedGuides.length > 0 && (
        <div className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-white mb-6">
            Похожие <span className="text-[#00D4FF]">гайды</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedGuides.map((g) => {
              const gCat = GUIDE_CATEGORIES[g.category];
              return (
                <a
                  key={g.id}
                  href={`/guides/${g.slug}`}
                  className="group block rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#00D4FF]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] hover:-translate-y-0.5"
                >
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.coverUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-1.5"
                      style={{ backgroundColor: `${gCat.color}15`, color: gCat.color }}
                    >
                      {gCat.icon} {gCat.label}
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-[#00D4FF] transition-colors">
                      {g.title}
                    </h3>
                    <span className="text-[11px] text-gray-500">⏱ {g.readTime}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Help CTA */}
      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center">
        <p className="text-gray-300 text-base mb-2 font-semibold">Нужна помощь?</p>
        <p className="text-gray-400 text-sm mb-4">Напишите менеджеру — поможем разобраться!</p>
        <a
          href="https://t.me/activeplay1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-primary text-white font-semibold text-sm"
        >
          Написать менеджеру
        </a>
      </div>
    </div>
  );
}
