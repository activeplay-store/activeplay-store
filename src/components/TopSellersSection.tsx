'use client';

import { useState } from 'react';
import Image from 'next/image';
import MessengerPopup from './MessengerPopup';
import { topSellers } from '@/data/top-sellers';
import type { TopSellerGame } from '@/data/top-sellers';

function rankStyle(rank: number): { color: string; fontSize: string; fontWeight: number; opacity?: number } {
  if (rank <= 3) {
    const colors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
    return { color: colors[rank], fontSize: '16px', fontWeight: 800 };
  }
  return { color: '#fff', fontSize: '14px', fontWeight: 700, opacity: 0.7 };
}

function GameCard({ game, onClick }: { game: TopSellerGame; onClick: () => void }) {
  const badge = rankStyle(game.rank);

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[160px] sm:w-auto rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.04)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Cover */}
      <div className="relative" style={{ aspectRatio: '3/4' }}>
        <Image
          src={game.image}
          alt={`Купить ${game.title} ${game.platform}`}
          fill
          className="object-cover"
          style={{ objectPosition: 'center top', borderRadius: '12px 12px 0 0' }}
          sizes="(max-width: 640px) 160px, 20vw"
          loading="lazy"
          unoptimized
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)' }}
        />
        {/* Rank badge */}
        <span
          className="absolute z-10"
          style={{
            top: '8px',
            left: '8px',
            background: '#00C853',
            color: '#fff',
            fontSize: badge.fontSize,
            fontWeight: badge.fontWeight,
            padding: '5px 12px',
            borderRadius: '8px',
          }}
        >
          #{game.rank}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4
          className="text-white line-clamp-1 font-display"
          style={{ fontStyle: 'normal', fontSize: '14px', fontWeight: 700, lineHeight: 1.3, marginTop: '8px' }}
        >
          {game.title}
        </h4>
        <p className="mb-2" style={{ color: 'rgba(0, 212, 255, 0.7)', fontSize: '13px', fontWeight: 700 }}>
          {game.priceRUB.toLocaleString('ru-RU')}&thinsp;₽
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="btn-primary py-2 text-xs w-full"
        >
          Купить
        </button>
      </div>
    </div>
  );
}

export default function TopSellersSection() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);

  const openPopup = (game: TopSellerGame) => {
    setPopup({ name: `Хочу купить ${game.title}`, price: game.priceRUB });
  };

  return (
    <section className="relative z-10" style={{ background: '#0C1A2E', paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-[26px] sm:text-[32px] md:text-[36px] font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #ffffff 30%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Самые продаваемые игры PS5 — февраль 2026
        </h2>
        <p className="text-[var(--text-secondary)] mb-10">
          Топ-10 продаж PS Store Europe — купить популярные игры для PS5 дёшево
        </p>

        {/* Desktop: 5-col grid, 2 rows / Mobile: horizontal scroll */}
        <div
          className="flex overflow-x-auto scrollbar-hide pb-4 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0"
          style={{ gap: '20px', rowGap: '28px' }}
        >
          {topSellers.games.map((game) => (
            <GameCard key={game.rank} game={game} onClick={() => openPopup(game)} />
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-8 text-center">
          Источник: {topSellers.source} · Обновляется ежемесячно · Цены из PS Store Турция
        </p>
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
