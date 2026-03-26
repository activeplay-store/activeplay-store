'use client';

import { useState } from 'react';
import { hotReleases } from '@/data/hotReleases';
import type { HotRelease } from '@/data/hotReleases';
import MessengerPopup from './MessengerPopup';

/** Parse Russian date "27 февраля 2026" → Date */
function parseRuDate(s: string): Date | null {
  const months: Record<string, number> = { января:0, февраля:1, марта:2, апреля:3, мая:4, июня:5, июля:6, августа:7, сентября:8, октября:9, ноября:10, декабря:11 };
  const m = s.match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  if (!m) return null;
  const mo = months[m[2].toLowerCase()];
  if (mo === undefined) return null;
  return new Date(+m[3], mo, +m[1]);
}

function isWithin30Days(dateStr: string): boolean {
  const d = parseRuDate(dateStr);
  if (!d) return true; // keep if can't parse
  const now = new Date();
  now.setHours(0,0,0,0);
  const diff = (now.getTime() - d.getTime()) / (1000*60*60*24);
  return diff <= 30;
}

const filteredReleases = hotReleases.filter(g => isWithin30Days(g.releaseDate));

const btnLabels: Record<string, string> = {
  'monster-hunter-stories-3': 'Купить MH Stories 3',
};

const altTexts: Record<string, string> = {
  'resident-evil-requiem': 'Купить Resident Evil Requiem (Резидент Ивл Реквием) PS5 Xbox PC',
  'crimson-desert': 'Купить Crimson Desert (Кримсон Дезерт) PS5 Xbox PC',
  'nioh-3': 'Купить Nioh 3 (Ниох 3) PS5 PC',
  'monster-hunter-stories-3': 'Купить Monster Hunter Stories 3 (Монстер Хантер Сториз 3) PS5 Xbox Switch',
};

function MetacriticBadge({ score }: { score: number }) {
  const bg = score >= 85 ? '#66cc33' : score >= 75 ? '#ffcc33' : '#ff6633';
  return (
    <span className="flex flex-col items-center justify-center font-display font-bold text-white" style={{ background: bg, width: '28px', height: '28px', borderRadius: '5px', fontStyle: 'normal', fontSize: '10px' }}>
      <span className="leading-none">{score}</span>
      <span className="text-[5px] font-bold leading-none opacity-80">MC</span>
    </span>
  );
}

function PlatformBadges({ platforms }: { platforms: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {platforms.map((p) => (
        <span key={p} className="px-1.5 py-px rounded text-[9px] font-semibold uppercase opacity-70" style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>{p}</span>
      ))}
    </div>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
      <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
      В наличии
    </span>
  );
}

/* ── Hero card ── */

function HeroCard({ game, region }: { game: HotRelease; region: 'tr' | 'ua' }) {
  const editions = game.editions[region];
  const [sel, setSel] = useState(0);

  return (
    <div className="ap-card ap-card--hero group relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-[rgba(0,212,255,0.3)]" style={{ background: '#111827', border: '1px solid #1e293b' }}>
      {/* SVG animated border */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ borderRadius: 'inherit' }}>
        <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="12" ry="12" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
        <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="12" ry="12" fill="none" stroke="#00D4FF" strokeWidth="1.5" pathLength="100" strokeDasharray="6 94" strokeLinecap="round" className="ap-dash" />
      </svg>

      {/* Cover */}
      <div className="relative overflow-hidden" style={{ paddingTop: '48%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.cover} alt={altTexts[game.id] || game.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111827 0%, rgba(17,24,39,0.45) 35%, transparent 70%)' }} />

        {/* Hit badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold" style={{ background: '#ff6b35', color: '#fff' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M12 23c-3.6 0-8-2.4-8-7.7C4 12 7 8.3 7.7 7.5c.2-.2.4-.3.7-.2.2.1.4.3.4.6 0 .8.3 2.1 1.2 2.1.6 0 .8-.4.9-.7.3-1.1.3-2.8-.5-4.5-.2-.3-.1-.7.2-.9.2-.2.6-.2.8 0C13.3 5.5 20 11.3 20 15.3c0 5.3-4.4 7.7-8 7.7z"/></svg>
          ХИТ
        </div>

        {/* Metacritic — bottom right of cover */}
        <div className="absolute bottom-3 right-3"><MetacriticBadge score={game.metacritic} /></div>

        {/* Cover bottom info */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px]">
          <span className="text-gray-300">{game.releaseDate}</span>
          <span className="text-gray-500">•</span>
          <span className="text-[#00D4FF] font-semibold">{game.genre}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-4 pt-2 pb-2">
        {/* Title + status */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="text-[20px] font-bold text-white leading-tight font-display" style={{ fontStyle: 'normal' }}>{game.title}</h3>
          <StatusBadge />
        </div>

        {/* Platforms + desc */}
        <div className="flex items-center gap-2 mb-1">
          <PlatformBadges platforms={game.platforms} />
        </div>
        <p className="text-[12px] text-[#94a3b8] opacity-70 leading-snug mb-3 line-clamp-1">{game.description}</p>

        {/* BOTTOM: price + CTA */}
        <div>
          {/* Edition selectors */}
          <div className="flex gap-2 mb-2">
            {editions.map((ed, i) => (
              <button key={ed.name} onClick={() => setSel(i)} className="flex-1 rounded-lg px-2 py-1.5 text-left transition-all cursor-pointer" style={{ border: `1px solid ${i === sel ? '#00D4FF' : 'rgba(255,255,255,0.08)'}`, background: i === sel ? 'rgba(0,212,255,0.08)' : 'transparent' }}>
                <span className="block text-[9px] text-gray-500 uppercase tracking-wide">{ed.name}</span>
                <span className="block text-[18px] font-bold text-white font-display" style={{ fontStyle: 'normal' }}>{ed.priceRUB.toLocaleString('ru-RU')}&thinsp;₽</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <button className="btn-primary w-full py-3.5 rounded-xl whitespace-nowrap">
            Купить за {editions[sel].priceRUB.toLocaleString('ru-RU')}&thinsp;₽
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Compact card ── */

function CompactCard({ game, region, onClick }: { game: HotRelease; region: 'tr' | 'ua'; onClick: () => void }) {
  const editions = game.editions[region];
  const stdPrice = editions[0].priceRUB;
  const deluxe = editions.length > 1 ? editions[1] : null;

  return (
    <div onClick={onClick} className="ap-card ap-card--compact group relative flex flex-1 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(0,212,255,0.3)] hover:shadow-[0_4px_16px_rgba(0,212,255,0.1)]" style={{ background: '#111827', border: '1px solid #1e293b' }}>
      {/* Cover with right-to-left overlay */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '150px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.cover} alt={altTexts[game.id] || game.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: '50% 30%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 30%, rgba(17,24,39,0.5) 70%, rgba(17,24,39,0.9) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,24,39,0.7) 0%, transparent 50%)' }} />
        {/* Metacritic — bottom right */}
        <div className="absolute bottom-2 right-2"><MetacriticBadge score={game.metacritic} /></div>
        {/* Status — bottom left */}
        <div className="absolute bottom-2 left-2"><StatusBadge /></div>
      </div>

      {/* Content — compact */}
      <div className="flex-1 flex flex-col min-w-0 px-3 py-2">
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-[#00D4FF] font-semibold">{game.genre}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-500">{game.releaseDate}</span>
        </div>
        <h3 className="text-[15px] font-bold text-white leading-tight font-display mt-0.5" style={{ fontStyle: 'normal', overflowWrap: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{game.title}</h3>

        <div className="mt-1"><PlatformBadges platforms={game.platforms} /></div>
        <p className="text-[10px] text-[#94a3b8] opacity-70 leading-snug line-clamp-1 mt-1">{game.description}</p>

        {/* Price + CTA */}
        <div className="mt-auto pt-1">
          <div className="mb-1">
            <span className="text-[18px] font-bold text-white font-display" style={{ fontStyle: 'normal' }}>от {stdPrice.toLocaleString('ru-RU')}&thinsp;₽</span>
            {deluxe && (
              <span className="text-[11px] text-gray-500 ml-2">Deluxe — {deluxe.priceRUB.toLocaleString('ru-RU')}&thinsp;₽</span>
            )}
          </div>
          <button className="btn-primary w-full py-2.5 rounded-xl text-sm whitespace-nowrap">
            {btnLabels[game.id] || `Купить ${game.title}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ── */

export default function HotReleases() {
  const [region, setRegion] = useState<'tr' | 'ua'>('tr');
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const hero = filteredReleases[0];
  const rest = filteredReleases.slice(1);

  if (!hero) return null;

  return (
    <section id="hot-releases" className="relative z-10 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/fire.webp" alt="" width={72} height={72} className="object-contain" style={{width: '72px', height: '72px'}} />
            <div>
              <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">Новинки игр для PS5 и Xbox — март 2026</h2>
              <p className="text-[var(--text-secondary)] text-[15px]">Купить хиты 2026 для PS5, Xbox и PC — активация на турецком, украинском аккаунте</p>
            </div>
          </div>

          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden w-fit mt-4">
            <button onClick={() => setRegion('tr')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'tr' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
              <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
              Турция
            </button>
            <button onClick={() => setRegion('ua')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'ua' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
              <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
              Украина
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="ap-cards grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <HeroCard game={hero} region={region} />
          <div className="flex flex-col gap-4">
            {rest.map((game) => (
              <CompactCard key={game.id} game={game} region={region} onClick={() => setPopup({ name: game.title, price: game.editions[region][0].priceRUB })} />
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-6 text-center">
          Игры уже доступны. Покупка и активация на ваш PSN-аккаунт за 5 минут
        </p>
      </div>

      <MessengerPopup isOpen={!!popup} onClose={() => setPopup(null)} planName={popup?.name || ''} price={popup?.price || 0} />
    </section>
  );
}
