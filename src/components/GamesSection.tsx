'use client';

import { useState, useRef } from 'react';
import GameCard from './GameCard';
import MessengerPopup from './MessengerPopup';
import { discountedGames } from '@/data/games';

type Filter = 'all' | 'PS' | 'Xbox';

export default function GamesSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = filter === 'all'
    ? discountedGames
    : discountedGames.filter((g) => g.platforms.includes(filter));

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="games" className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
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

          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden">
            {(['all', 'PS', 'Xbox'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {f === 'all' ? 'Все' : f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[var(--text-secondary)] mb-10 -mt-4">
          Купить игры PS Store и Xbox Store дёшево — скидки до 60% на хиты
        </p>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Arrows */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-card)] border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)] cursor-pointer"
            aria-label="Назад"
          >
            ◀
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-card)] border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)] cursor-pointer"
            aria-label="Вперёд"
          >
            ▶
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 carousel-scroll pl-6 pr-6 sm:pl-0 sm:pr-0"
          >
            {filtered.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onBuy={() => setPopup({ name: game.title, price: game.newPrice })}
              />
            ))}
          </div>
        </div>

        {/* Price update note */}
        <div className="flex items-center gap-2 mt-6 text-xs text-[var(--text-muted)]">
          <span className="pulse-dot" />
          Каталог обновляется автоматически — цены из PS Store и Xbox Store в рублях по курсу ЦБ
        </div>
      </div>

      <MessengerPopup
        isOpen={!!popup}
        onClose={() => setPopup(null)}
        planName={popup?.name || ''}
        price={popup?.price || 0}
      />
    </section>
  );
}
