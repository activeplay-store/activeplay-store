'use client';

import Image from 'next/image';
import type { PreorderGame } from '@/data/preorders';

interface PreorderCardProps {
  preorder: PreorderGame;
  region: 'turkey' | 'ukraine';
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

function getCountdown(dateStr: string | null): { text: string; color: string } {
  if (!dateStr) return { text: 'Дата уточняется', color: '#9e9e9e' };
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

export default function PreorderCard({ preorder, region, onOrder }: PreorderCardProps) {
  const countdown = getCountdown(preorder.releaseDate);
  const regionKey = region === 'turkey' ? 'TR' : 'UA';
  const editions = preorder.editions[regionKey] || preorder.editions.TR || [];
  const platformStr = preorder.platforms.join(' / ');

  if (editions.length === 0) return null;

  return (
    <div className="flex-shrink-0 w-[260px] sm:w-auto rounded-xl overflow-hidden card-base group transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col">
      {/* Cover */}
      <div className="relative" style={{ aspectRatio: '3/4' }}>
        <Image
          src={preorder.coverUrl}
          alt={`Предзаказ ${preorder.name} ${platformStr} купить`}
          fill
          className="object-cover rounded-t-xl"
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          unoptimized
        />
        {/* Date badge */}
        {preorder.releaseDate && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold text-white"
            style={{ background: '#00C853' }}
          >
            {formatDate(preorder.releaseDate)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Countdown */}
        <p suppressHydrationWarning className="text-xs font-semibold mb-1" style={{ color: countdown.color }}>
          {countdown.text}
        </p>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1 leading-tight line-clamp-2 font-display" style={{ fontStyle: 'normal' }}>
          {preorder.name}
        </h3>

        {/* Genre + Platform badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          {preorder.genre && (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'rgba(0,212,255,0.12)', color: '#00D4FF' }}>
              {preorder.genre}
            </span>
          )}
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-[var(--text-muted)] w-fit">
            {platformStr}
          </span>
        </div>

        {/* Description */}
        {preorder.description && (
          <p className="text-[10px] text-[#94a3b8] opacity-70 leading-snug line-clamp-1 mb-1">{preorder.description}</p>
        )}

        {/* Spacer to push prices to bottom */}
        <div className="flex-1" />

        {/* Editions & prices */}
        <div className="text-sm text-[var(--text-secondary)] mb-3 space-y-0.5">
          {editions.map((ed) => (
            <div key={ed.name} className="flex justify-between items-center" style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
              <span className="text-gray-300 font-medium">{ed.name}:</span>
              <span className="text-white font-bold" style={{ fontSize: '13px' }}>
                {ed.clientPrice.toLocaleString('ru-RU')}&thinsp;₽
              </span>
            </div>
          ))}
        </div>

        {/* Order button */}
        <button
          onClick={onOrder}
          className="btn-primary text-sm w-full py-2.5"
        >
          Оформить предзаказ
        </button>
      </div>
    </div>
  );
}
