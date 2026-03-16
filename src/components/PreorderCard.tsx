'use client';

import Image from 'next/image';
import type { Preorder } from '@/data/preorders';

interface PreorderCardProps {
  preorder: Preorder;
  onOrder: () => void;
}

export default function PreorderCard({ preorder, onOrder }: PreorderCardProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden group card-hover min-h-[340px] flex flex-col justify-end border border-white/[0.06]">
      {/* Background image */}
      <Image
        src={preorder.cover}
        alt={preorder.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, 50vw"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 overlay-gradient" />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {preorder.platforms.map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white backdrop-blur-sm"
            >
              {p}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-orange)] text-black">
            ПРЕДЗАКАЗ
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
          {preorder.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-1 line-clamp-1">
          {preorder.description}
        </p>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Дата выхода: {preorder.releaseDate}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
            {preorder.price.toLocaleString('ru-RU')} ₽
          </span>
          <button
            onClick={onOrder}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Предзаказать
          </button>
        </div>
      </div>
    </div>
  );
}
