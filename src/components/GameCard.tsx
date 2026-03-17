'use client';

import Image from 'next/image';
import type { Game } from '@/data/games';

interface GameCardProps {
  game: Game;
  onBuy: () => void;
}

export default function GameCard({ game, onBuy }: GameCardProps) {
  return (
    <div className="flex-shrink-0 w-[240px] rounded-2xl bg-[var(--bg-card)] border border-white/[0.06] overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={game.cover}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          sizes="240px"
          loading="lazy"
        />
        {/* Discount badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-[var(--success)] text-black">
          −{game.discount}%
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="text-[15px] font-semibold text-white mb-2 line-clamp-1 font-display" style={{ fontStyle: 'normal' }}>{game.title}</h4>

        {/* Platform badges */}
        <div className="flex gap-1.5 mb-3">
          {game.platforms.map((p) => (
            <span
              key={p}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                p === 'PS'
                  ? 'bg-[var(--ps-blue)]/20 text-blue-400'
                  : 'bg-[var(--xbox-green)]/20 text-green-400'
              }`}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Prices */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[var(--text-muted)] line-through tabular-nums">
              {game.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-xs text-[var(--text-muted)]">в PS Store</span>
          </div>
          <span className="price-display text-[22px] !text-[var(--brand)]">
            {game.newPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        {/* Buy button — compact on desktop, full width on mobile */}
        <button
          onClick={onBuy}
          className="btn-primary py-2.5 text-sm w-full md:w-auto md:px-6"
        >
          Купить
        </button>
      </div>
    </div>
  );
}
