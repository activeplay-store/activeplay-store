'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import MessengerPopup from './MessengerPopup';
import { discountGames, toRubTR, toRubUA } from '@/data/discounts';
import type { DiscountGame } from '@/data/discounts';

function badgeColor(discount: number): string {
  if (discount >= 65) return '#EF4444';
  if (discount >= 40) return '#EAB308';
  return '#22C55E';
}

function DiscountCard({ game, region, onBuy }: { game: DiscountGame; region: 'tr' | 'ua'; onBuy: () => void }) {
  const oldPrice = region === 'tr' ? toRubTR(game.tr.oldTRY) : toRubUA(game.ua.oldUAH);
  const newPrice = region === 'tr' ? toRubTR(game.tr.newTRY) : toRubUA(game.ua.newUAH);

  return (
    <div className="flex-shrink-0 w-[200px] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer" style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Cover — fixed height for uniform cards */}
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.cover} alt={`Купить ${game.title} PS5 со скидкой ${game.discount}%`} className="w-full h-full object-cover" style={{ objectPosition: 'center top', borderRadius: '12px 12px 0 0' }} loading="lazy" />
        {/* Discount badge — top right */}
        <span className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ background: badgeColor(game.discount) }}>
          -{game.discount}%
        </span>
        {/* End date badge — bottom left */}
        <span className="absolute bottom-2 left-2 text-[10px] font-bold rounded" style={{ background: '#00D4FF', color: '#0A0E17', padding: '4px 8px' }}>
          до {game.endDate}
        </span>
      </div>

      {/* Info */}
      <div className="px-3 pt-2 pb-3 flex flex-col flex-1">
        <h4 className="text-white font-display font-bold text-[13px] leading-tight line-clamp-2" style={{ fontStyle: 'normal' }}>
          {game.title}
        </h4>
        <span className="text-gray-500 text-[10px] mt-0.5">{game.edition}</span>

        {/* Prices */}
        <div className="mt-auto pt-2">
          <span className="text-[#6B7280] line-through text-xs block">{oldPrice.toLocaleString('ru-RU')}&thinsp;₽</span>
          <span className="text-white font-bold text-[18px] font-display" style={{ fontStyle: 'normal' }}>{newPrice.toLocaleString('ru-RU')}&thinsp;₽</span>
        </div>

        <button onClick={(e) => { e.stopPropagation(); onBuy(); }} className="btn-primary w-full rounded-lg mt-2 text-sm whitespace-nowrap" style={{ height: '40px', fontWeight: 600 }}>
          Купить
        </button>
      </div>
    </div>
  );
}

export default function GamesSection() {
  const [region, setRegion] = useState<'tr' | 'ua'>('tr');
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll right, pause on hover
  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || paused) return;
    // If near the end, jump back to start seamlessly
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
      el.scrollLeft = 0;
    } else {
      el.scrollLeft += 1;
    }
  }, [paused]);

  useEffect(() => {
    const id = setInterval(autoScroll, 30);
    return () => clearInterval(id);
  }, [autoScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -440 : 440, behavior: 'smooth' });
    }
  };

  // Duplicate games for infinite loop
  const doubled = [...discountGames, ...discountGames];

  return (
    <section id="games" className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" className="flex-shrink-0">
            <circle cx="12" cy="4" r="3" fill="#EF4444" style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.6))' }} />
            <circle cx="12" cy="12" r="3" fill="#EAB308" style={{ filter: 'drop-shadow(0 0 4px rgba(234,179,8,0.6))' }} />
            <circle cx="12" cy="20" r="3" fill="#22C55E" style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }} />
          </svg>
          <div>
            <h2
              className="text-[26px] sm:text-[32px] md:text-[36px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #ffffff 30%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Игры со скидкой для PS5, PS4 и Xbox
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              Mega March Sale 2026 — скидки до 85% на хиты PS Store
            </p>
          </div>
        </div>

        {/* Region switcher */}
        <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden w-fit mb-8">
          <button onClick={() => setRegion('tr')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'tr' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
            <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
            Турция
          </button>
          <button onClick={() => setRegion('ua')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'ua' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
            <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
            Украина
          </button>
        </div>

        {/* Carousel with auto-scroll */}
        <div
          className="relative group/carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button onClick={() => scroll('left')} className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-card)] border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)] cursor-pointer" aria-label="Назад">◀</button>
          <button onClick={() => scroll('right')} className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-card)] border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)] cursor-pointer" aria-label="Вперёд">▶</button>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 items-stretch">
            {doubled.map((game, idx) => {
              const price = region === 'tr' ? toRubTR(game.tr.newTRY) : toRubUA(game.ua.newUAH);
              return (
                <DiscountCard
                  key={`${game.id}-${idx}`}
                  game={game}
                  region={region}
                  onBuy={() => setPopup({ name: `${game.title} (${game.edition})`, price })}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs text-[var(--text-muted)]">
          <span className="pulse-dot" />
          Цены пересчитаны по курсу ЦБ. Акция Mega March Sale действует до 26 марта 2026
        </div>
      </div>

      <MessengerPopup isOpen={!!popup} onClose={() => setPopup(null)} planName={popup?.name || ''} price={popup?.price || 0} />
    </section>
  );
}
