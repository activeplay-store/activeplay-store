'use client';

import Image from 'next/image';
import type { Game } from '@/data/games';

interface GameCardProps {
  game: Game;
  onBuy: () => void;
}

export default function GameCard({ game, onBuy }: GameCardProps) {
  return (
    <div className="flex-shrink-0 w-[240px] rounded-xl bg-[var(--bg-card)] border border-white/[0.06] overflow-hidden card-hover cursor-pointer group">
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={game.cover}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="240px"
          loading="lazy"
        />
        {/* Discount badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--accent-green)] text-black">
          −{game.discount}%
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="text-[15px] font-bold text-white mb-2 line-clamp-1">{game.title}</h4>

        {/* Platform badges */}
        <div className="flex gap-1.5 mb-3">
          {game.platforms.map((p) => (
            <span
              key={p}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                p === 'PS'
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'bg-green-600/20 text-green-400'
              }`}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-extrabold text-[var(--accent)] tabular-nums">
            {game.newPrice.toLocaleString('ru-RU')} ₽
          </span>
          <span className="text-sm text-[var(--text-muted)] line-through tabular-nums">
            {game.oldPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        {/* Buy button */}
        <button
          onClick={onBuy}
          className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          Купить
        </button>
      </div>
    </div>
  );
}
