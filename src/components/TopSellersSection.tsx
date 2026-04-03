'use client';

import { useState } from 'react';
import Image from 'next/image';
import MessengerPopup from './MessengerPopup';
import { topSellers } from '@/data/top-sellers';
import type { TopSellerGame } from '@/data/top-sellers';

const badgeColors: Record<number, { bg: string; color: string; border: string }> = {
  1: { bg: 'rgba(255,215,0,0.85)', color: '#000', border: 'rgba(255,215,0,0.3)' },
  2: { bg: 'rgba(192,192,192,0.8)', color: '#000', border: 'rgba(192,192,192,0.2)' },
  3: { bg: 'rgba(205,127,50,0.8)', color: '#000', border: 'rgba(205,127,50,0.2)' },
};

function GameCard({ game, onClick, isHero, region }: { game: TopSellerGame; onClick: () => void; isHero?: boolean; region: 'tr' | 'ua' }) {
  const badge = badgeColors[game.rank];
  const isTop3 = game.rank <= 3;
  const price = region === 'tr' ? game.priceTR : game.priceUA;

  return (
    <div
      onClick={onClick}
      className={`group rounded-xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 ${isHero ? 'lg:col-span-2' : ''}`}
      style={{
        height: '360px',
        background: '#0a1628',
        border: `1px solid ${isTop3 ? (badge?.border || 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {/* Cover */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <Image
          src={game.image}
          alt={`Купить ${game.title} ${game.platform}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: 'center top', borderRadius: '12px 12px 0 0' }}
          sizes={isHero ? '(max-width: 768px) 100vw, 40vw' : '(max-width: 768px) 50vw, 20vw'}
          loading="lazy"
          unoptimized
        />
        {/* Minimal bottom gradient for text readability */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(7,16,30,0.6) 0%, rgba(7,16,30,0) 30%)' }} />

        {/* Rank badge — compact */}
        <span
          className="absolute z-10 font-display font-bold"
          style={{
            top: '8px',
            left: '8px',
            background: badge?.bg || 'rgba(0,200,83,0.85)',
            color: badge?.color || '#fff',
            fontSize: isHero ? '14px' : '11px',
            fontWeight: 800,
            fontStyle: 'normal',
            padding: isHero ? '4px 12px' : '3px 8px',
            borderRadius: '6px',
          }}
        >
          #{game.rank}
        </span>
      </div>

      {/* Info — unified for all cards */}
      <div className="px-3 pt-2 pb-3 flex flex-col shrink-0">
        <h3 className={`text-white font-display font-bold leading-tight line-clamp-1 ${isHero ? 'text-[20px]' : 'text-[14px]'}`} style={{ fontStyle: 'normal' }}>
          {game.title}
        </h3>
        <span className={`text-[#00D4FF] ${isHero ? 'text-xs' : 'text-[10px]'} mt-0.5`}>{game.genre}</span>

        <p className={`font-display font-bold mt-2 text-white ${isHero ? 'text-[24px]' : 'text-[22px]'}`} style={{ fontStyle: 'normal' }}>
          {price > 0 ? <>{price.toLocaleString('ru-RU')}&thinsp;₽</> : <span className="text-gray-400 text-base">Цена уточняется</span>}
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="btn-primary w-full rounded-lg mt-2 whitespace-nowrap text-sm"
          style={{ height: '44px', fontWeight: 600 }}
        >
          Купить
        </button>
      </div>
    </div>
  );
}

export default function TopSellersSection() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const [region, setRegion] = useState<'tr' | 'ua'>('tr');

  const openPopup = (game: TopSellerGame) => {
    const price = region === 'tr' ? game.priceTR : game.priceUA;
    setPopup({ name: `Хочу купить ${game.title}`, price });
  };

  const row1Hero = topSellers.games[0];
  const row1Rest = topSellers.games.slice(1, 4);
  const row2 = topSellers.games.slice(4);

  return (
    <section id="top-sales" className="relative z-10" style={{ background: '#0C1A2E', paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/top.webp" alt="" width={64} height={64} className="w-16 h-16 object-contain flex-shrink-0 mt-1" />
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
              Самые продаваемые игры PS5 — {topSellers.month.toLowerCase()}
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              Топ-10 продаж PS Store Europe — купить популярные игры для PS5 дёшево
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

        {/* Row 1: #1 (span 2) + #2, #3, #4 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          <GameCard game={row1Hero} onClick={() => openPopup(row1Hero)} isHero region={region} />
          {row1Rest.map((g) => (
            <GameCard key={g.rank} game={g} onClick={() => openPopup(g)} region={region} />
          ))}
        </div>

        {/* Row 2: #5–#10 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {row2.map((g) => (
            <GameCard key={g.rank} game={g} onClick={() => openPopup(g)} region={region} />
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-8 text-center">
          Источник: {topSellers.source} · Обновляется ежемесячно · Цены из PS Store
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
