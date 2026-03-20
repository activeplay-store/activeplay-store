'use client';

import Image from 'next/image';
import type { Preorder } from '@/data/preorders';

interface PreorderCardProps {
  preorder: Preorder;
  onOrder: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function getCountdown(dateStr: string): { text: string; color: string } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const release = new Date(dateStr + 'T00:00:00');
  const diffMs = release.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return { text: 'уже вышла', color: '#00E676' };
  if (days === 1) return { text: 'через 1 день', color: '#00E676' };

  let word = 'дней';
  const lastTwo = days % 100;
  const lastOne = days % 10;
  if (lastTwo >= 11 && lastTwo <= 19) word = 'дней';
  else if (lastOne === 1) word = 'день';
  else if (lastOne >= 2 && lastOne <= 4) word = 'дня';

  const color = days < 14 ? '#00E676' : days < 30 ? '#FFD600' : '#9e9e9e';
  return { text: `через ${days} ${word}`, color };
}

export default function PreorderCard({ preorder, onOrder }: PreorderCardProps) {
  const countdown = getCountdown(preorder.releaseDate);
  const hasMultipleEditions = preorder.editions.length > 1;

  return (
    <div className="flex-shrink-0 w-[260px] sm:w-auto rounded-xl overflow-hidden card-base group transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col">
      {/* Cover */}
      <div className="relative" style={{ aspectRatio: '3/4' }}>
        <Image
          src={preorder.image}
          alt={`Предзаказ ${preorder.title} ${preorder.platform.replace(/\s*\/\s*/g, ' ')} купить`}
          fill
          className="object-cover rounded-t-xl"
          style={{ objectPosition: preorder.imagePosition || 'center top' }}
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          unoptimized
        />
        {/* Date badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold text-white"
          style={{ background: '#00C853' }}
        >
          {formatDate(preorder.releaseDate)}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Countdown */}
        <p className="text-xs font-semibold mb-1" style={{ color: countdown.color }}>
          {countdown.text}
        </p>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1 leading-tight line-clamp-2 font-display" style={{ fontStyle: 'normal' }}>
          {preorder.title}
        </h3>

        {/* Platform badge */}
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-[var(--text-muted)] mb-3">
          {preorder.platform}
        </span>

        {/* Editions & prices */}
        <div className="text-sm text-[var(--text-secondary)] mb-3">
          {hasMultipleEditions ? (
            <div className="space-y-0.5">
              {preorder.editions.map((ed) => (
                <div key={ed.name} className="flex justify-between items-center" style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                  <span className="text-[var(--text-muted)]">{ed.name}:</span>
                  <span className="price-display" style={{ fontSize: '13px' }}>
                    {ed.priceRUB_TR.toLocaleString('ru-RU')}&thinsp;₽
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="price-display text-lg">
              {preorder.editions[0].priceRUB_TR.toLocaleString('ru-RU')}&thinsp;₽
            </span>
          )}
        </div>

        {/* Single order button */}
        <button
          onClick={onOrder}
          className="btn-primary text-sm w-full py-2.5 mt-auto"
        >
          Оформить предзаказ
        </button>
      </div>
    </div>
  );
}
