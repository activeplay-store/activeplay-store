'use client';

import { useState, useMemo } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import CTABlock from '@/components/CTABlock';
import MessengerPopup from '@/components/MessengerPopup';
import TrustBlock from '@/components/TrustBlock';
import AntiFraudBlock from '@/components/AntiFraudBlock';
import { dealsData, type DealGame } from '@/data/deals';

function formatPlatforms(platforms: string[]): string {
  const hasPS4 = platforms.some(p => p.includes('PS4'));
  const hasPS5 = platforms.some(p => p.includes('PS5'));
  if (hasPS4 && !hasPS5) return 'PS5 / PS4';
  if (hasPS5 && hasPS4) return 'PS5 / PS4';
  if (hasPS5) return 'PS5';
  return platforms.join(' / ');
}

/* ── Types ─────────────────────────────────────────────────────────────── */

type Region = 'TR' | 'UA';
type Platform = 'all' | 'PS5' | 'PS4';
type PriceRange = 'all' | 'low' | 'mid' | 'high';
type Zone = 'red' | 'yellow' | 'green' | 'fresh';

interface FaqItem { q: string; a: string; }
interface SaleContentProps { faqItems: FaqItem[]; }

/* ── Zone config ───────────────────────────────────────────────────────── */

const zoneConfig: { key: Zone; title: string; range: string; color: string; dotClass: string }[] = [
  { key: 'red', title: 'Суперцена — скидки от 65% до 90% на игры PS5 и PS4', range: '65-90%', color: '#EF4444', dotClass: 'bg-red-500' },
  { key: 'yellow', title: 'Большая скидка — от 40% до 64% на игры PS5 и PS4', range: '40-64%', color: '#EAB308', dotClass: 'bg-yellow-500' },
  { key: 'green', title: 'Скидка — от 20% до 39% на игры PS5 и PS4', range: '20-39%', color: '#22C55E', dotClass: 'bg-green-500' },
  { key: 'fresh', title: 'Скидки на новые игры PS5 — релизы 2025–2026 со скидкой', range: '', color: '#00D4FF', dotClass: 'bg-cyan-400' },
];


/* ── Trust badges (same as SubscriptionPage) ───────────────────────────── */

const trustBadges = [
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    text: 'С 2022 года',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    text: '52 000+ клиентов',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    text: 'За 5 минут',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
    text: 'Поддержка 24/7',
  },
];

/* ── Helpers ────────────────────────────────────────────────────────────── */

function getBestDiscount(game: DealGame): number {
  const tr = game.prices.TR;
  if (!tr) return game.discountPct;
  const bestSale = tr.psPlusPriceTRY ?? tr.salePriceTRY;
  return Math.round((1 - bestSale / tr.basePriceTRY) * 100);
}

function getDiscountZone(game: DealGame): 'red' | 'yellow' | 'green' | null {
  const disc = getBestDiscount(game);
  if (disc >= 65) return 'red';
  if (disc >= 40) return 'yellow';
  if (disc >= 20) return 'green';
  return null;
}

function isFresh(game: DealGame): boolean {
  if (!game.releaseDate) return false;
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  const ageMs = Date.now() - new Date(game.releaseDate).getTime();
  return ageMs <= ONE_YEAR_MS && getBestDiscount(game) >= 10;
}

function getClientPrices(game: DealGame, region: Region) {
  const p = region === 'TR' ? game.prices.TR : game.prices.UA;
  if (!p) return null;
  const bestSale = p.clientPsPlusPrice ?? p.clientSalePrice;
  return { base: p.clientBasePrice, sale: p.clientSalePrice, plus: p.clientPsPlusPrice, best: bestSale, hasPsPlus: !!p.clientPsPlusPrice };
}

function fmt(n: number): string {
  return n.toLocaleString('ru-RU');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function formatReleaseDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

function getDiscountBadgeColor(discountPct: number): string {
  if (discountPct >= 65) return '#EF4444';
  if (discountPct >= 40) return '#EAB308';
  if (discountPct >= 20) return '#22C55E';
  return '#00D4FF';
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function SaleContent({ faqItems }: SaleContentProps) {
  const [region, setRegion] = useState<Region>('TR');
  const [platform, setPlatform] = useState<Platform>('all');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [search, setSearch] = useState('');
  const [popup, setPopup] = useState({ open: false, name: '', price: 0 });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return dealsData.filter((game) => {
      if (platform !== 'all' && !game.platforms.includes(platform as 'PS5' | 'PS4')) return false;
      const prices = getClientPrices(game, region);
      if (!prices) return false;
      if (priceRange === 'low' && prices.sale >= 1000) return false;
      if (priceRange === 'mid' && (prices.sale < 1000 || prices.sale > 3000)) return false;
      if (priceRange === 'high' && prices.sale <= 3000) return false;
      if (search && !game.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [region, platform, priceRange, search]);

  const grouped = useMemo(() => {
    const map: Record<Zone, DealGame[]> = { red: [], yellow: [], green: [], fresh: [] };
    filtered.forEach((g) => {
      // Discount zones (red/yellow/green)
      const z = getDiscountZone(g);
      if (z) map[z].push(g);
      // Fresh zone — independent, game can appear in both its discount zone AND fresh
      if (isFresh(g)) map.fresh.push(g);
    });
    // Sort by saving in rubles (descending) — biggest savings first, using best price (PS Plus if available)
    const saving = (g: DealGame) => { const p = getClientPrices(g, region); return p ? p.base - p.best : 0; };
    const bySaving = (a: DealGame, b: DealGame) => saving(b) - saving(a);
    map.red.sort(bySaving);
    map.yellow.sort(bySaving);
    map.green.sort(bySaving);
    map.fresh.sort(bySaving);
    return map;
  }, [filtered, region]);

  const totalCount = filtered.length;
  const maxPct = filtered.reduce((max, g) => Math.max(max, g.discountPct), 0);

  function openPopup(name: string, price: number) {
    setPopup({ open: true, name, price });
  }

  /* ── Pill ─────────────────────────────────────────────────────────────── */

  function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button onClick={onClick} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-[#00D4FF] text-black' : 'border border-white/20 text-white/70 hover:border-white/40'}`}>
        {children}
      </button>
    );
  }

  /* ── GameCard ─────────────────────────────────────────────────────────── */

  function FallbackCover({ name }: { name: string }) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1a1a3e] to-[#0a0a2e] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background gamepad icon */}
        <svg className="absolute opacity-[0.06] w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #00D4FF 25%, transparent 25%, transparent 75%, #00D4FF 75%), linear-gradient(45deg, #00D4FF 25%, transparent 25%, transparent 75%, #00D4FF 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
        <span className="relative text-[#00D4FF] text-lg font-bold text-center px-6 leading-tight">{name}</span>
        <span className="relative text-white/20 text-xs mt-2">PlayStation</span>
      </div>
    );
  }

  function GameCard({ game }: { game: DealGame }) {
    const [imgError, setImgError] = useState(false);
    const prices = getClientPrices(game, region);
    if (!prices) return null;
    const saving = prices.base - prices.best;
    const bestDisc = getBestDiscount(game);

    return (
      <div className="bg-[var(--bg-card)] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="relative aspect-[4/5]">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={game.coverUrl} alt={`Купить ${game.name} ${formatPlatforms(game.platforms)} со скидкой ${game.discountPct}%`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]" style={{ objectPosition: 'center top' }} loading="lazy" onError={() => setImgError(true)} />
          ) : (
            <FallbackCover name={game.name} />
          )}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-lg text-white text-sm font-bold" style={{ background: getDiscountBadgeColor(bestDisc) }}>
            -{bestDisc}%
          </span>
          {prices.hasPsPlus && (
            <span className="absolute top-3 right-3 bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-2 py-1 rounded">PS Plus</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-lg mb-1 font-rajdhani">{game.name}</h3>
          <p className="text-white/50 text-sm mb-1">{formatPlatforms(game.platforms)}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white/40 line-through text-sm">{fmt(prices.base)} руб.</span>
            {prices.hasPsPlus && prices.sale < prices.base && (
              <span className="text-white/30 line-through text-xs">{fmt(prices.sale)} руб.</span>
            )}
            <span className="text-white text-xl font-bold">{fmt(prices.best)} руб.</span>
          </div>
          <p className="text-[#22C55E] text-sm mb-1">Экономия: {fmt(saving)} руб.</p>
          {prices.hasPsPlus && (
            <p className="text-[#F5A623] text-xs mb-1">
              Цена для подписчиков PS Plus
              <a href="/ps-plus-essential" className="ml-1 text-[#00D4FF] hover:underline">Оформить PS Plus &rarr;</a>
            </p>
          )}
          {game.saleEndDate && <p className="text-white/40 text-xs mb-3">До {formatDate(game.saleEndDate)}</p>}
          <button onClick={() => openPopup(game.name, prices.best)} className="btn-primary py-2.5 text-sm w-full">
            Купить
          </button>
        </div>
      </div>
    );
  }

  /* ── CompactRow ──────────────────────────────────────────────────────── */

  function CompactRow({ game }: { game: DealGame }) {
    const prices = getClientPrices(game, region);
    if (!prices) return null;
    const saving = prices.base - prices.best;
    const bestDisc = getBestDiscount(game);

    return (
      <div className="flex items-center justify-between py-3 px-4 odd:bg-white/[0.03] rounded-lg">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-white text-xs font-bold px-2 py-1 rounded shrink-0" style={{ background: getDiscountBadgeColor(bestDisc) }}>-{bestDisc}%</span>
          {prices.hasPsPlus && <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs px-1.5 py-0.5 rounded shrink-0">PS+</span>}
          <div className="min-w-0">
            <span className="text-white font-medium text-sm truncate block">{game.name}</span>
            <span className="text-gray-500 text-xs">{formatPlatforms(game.platforms)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="line-through text-gray-500 text-sm hidden sm:inline">{fmt(prices.base)} руб.</span>
          <span className="text-white font-bold">{fmt(prices.best)} руб.</span>
          <span className="text-green-400 text-sm hidden md:inline">-{fmt(saving)} руб.</span>
          <button onClick={() => openPopup(game.name, prices.best)} className="btn-primary py-2 text-sm px-4">
            Купить
          </button>
        </div>
      </div>
    );
  }

  /* ── ZoneSection ─────────────────────────────────────────────────────── */

  function ZoneSection({ zone, games }: { zone: typeof zoneConfig[number]; games: DealGame[] }) {
    const [expanded, setExpanded] = useState(false);
    if (games.length === 0) return null;
    const showcaseCount = Math.min(6, games.length);
    const showcase = games.slice(0, showcaseCount);
    const catalog = games.slice(showcaseCount);

    return (
      <ScrollReveal>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className={`inline-block w-3 h-3 rounded-full ${zone.dotClass}`}></span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-rajdhani">{zone.title}</h2>
              {zone.range && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: zone.color + '20', color: zone.color }}>
                  {zone.range}
                </span>
              )}
              <span className="text-white/40 text-sm ml-auto">{games.length} игр</span>
            </div>
            <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            {catalog.length > 0 && (
              <div>
                <p className="text-white/40 text-sm mb-3">Ещё {catalog.length} игр:</p>
                {/* All rows in DOM for SEO, hidden via CSS */}
                <div className={`space-y-1 transition-all ${!expanded ? 'max-h-[360px] overflow-hidden' : ''}`}>
                  {catalog.map((game) => (
                    <CompactRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}
            {catalog.length > 6 && !expanded && (
              <div className="text-center mt-6">
                <button onClick={() => setExpanded(true)} className="px-6 py-2.5 rounded-lg border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all text-sm">
                  Показать все ({catalog.length})
                </button>
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>
    );
  }

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.05]" style={{ paddingTop: '112px' }}>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(0,212,255,0.2) 0%, transparent 65%), linear-gradient(180deg, #0A1628 0%, #060D18 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pb-8 pt-8 sm:pt-12">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)' }}>
            <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold font-display mb-3" style={{ color: '#00D4FF' }}>
            Скидки PS Store — распродажа игр PS5 и PS4
            <span className="block text-lg sm:text-xl font-normal text-gray-300 mt-2">
              Игры PS Store Турция и Украина со скидкой — купить из России в рублях
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
            Актуальные акции и распродажи PlayStation Store. Оплата через СБП, активация за 5 минут
          </p>
        </div>
      </section>

      {/* Trust badges (same as SubscriptionPage) */}
      <div className="relative z-10 py-4 px-4 sm:px-6 border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>{badge.icon}</span>
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. How to buy — same style as HowItWorks on Essential */}
      <section className="relative z-10 pt-20 pb-20">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 20% 40%, rgba(0,212,255,0.06), transparent 50%), radial-gradient(circle at 80% 60%, rgba(0,100,255,0.05), transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-14">
            Как купить игру со скидкой
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch">
            {[
              { label: '01', title: 'Выбери игру со скидкой', desc: 'Найди нужную игру в каталоге скидок и нажми «Купить»', icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
              { label: '02', title: 'Нажми «Купить»', desc: 'Выбери мессенджер и напиши менеджеру', icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> },
              { label: '03', title: 'Оплати в рублях', desc: 'Переведи через СБП, карту или ЮMoney — без зарубежных карт', icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
              { label: '04', title: 'Играй через 5 мин', desc: 'Игра активирована на твоём аккаунте — готово', highlight: true, icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.421 48.421 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg> },
            ].map((step) => (
              <div
                key={step.label}
                className="relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,212,255,0.06) 0%, rgba(0,0,0,0.2) 100%)',
                  border: step.highlight ? '1px solid rgba(0,212,255,0.35)' : '1px solid rgba(0,212,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: step.highlight
                    ? '0 0 25px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.02)'
                    : '0 0 20px rgba(0,212,255,0.04), inset 0 0 20px rgba(0,212,255,0.02)',
                }}
              >
                <span className="absolute font-display font-black select-none pointer-events-none" style={{ fontSize: '72px', opacity: 0.07, top: '10px', right: '15px', lineHeight: 1, color: '#fff' }}>{step.label}</span>
                <div className="relative z-10 mb-4 flex items-center justify-center gap-1" style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.4))' }}>
                  {step.icon}
                  {step.highlight && <span className="text-lg">&#9889;</span>}
                </div>
                <h3 className="relative z-10 text-[16px] font-semibold text-white mb-2 font-display" style={{ fontStyle: 'normal' }}>{step.title}</h3>
                <p className="relative z-10 text-[var(--text-secondary)]" style={{ fontSize: '13px', lineHeight: 1.4 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Region toggle */}
      <div className="py-6 text-center">
        <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
          <button onClick={() => setRegion('TR')} className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-lg font-semibold transition-all ${region === 'TR' ? 'bg-[#00D4FF] text-black' : 'text-white/70 hover:text-white'}`}>
            <svg className="w-5 h-4 rounded-sm" viewBox="0 0 30 20"><rect fill="#E30A17" width="30" height="20"/><circle cx="13" cy="10" r="6" fill="white"/><circle cx="14.5" cy="10" r="4.8" fill="#E30A17"/><polygon fill="white" points="18,10 15.5,11.2 16.1,8.5 14,7 16.7,6.8"/></svg> Турция
          </button>
          <button onClick={() => setRegion('UA')} className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-lg font-semibold transition-all ${region === 'UA' ? 'bg-[#00D4FF] text-black' : 'text-white/70 hover:text-white'}`}>
            <svg className="w-5 h-4 rounded-sm" viewBox="0 0 30 20"><rect fill="#005BBB" width="30" height="10"/><rect fill="#FFD500" y="10" width="30" height="10"/></svg> Украина
          </button>
        </div>
      </div>

      {/* 4. Sticky filters */}
      <div className="sticky top-[100px] z-30 bg-[#060D18]/90 backdrop-blur-xl border-b border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3 items-center">
          <Pill active={platform === 'all'} onClick={() => setPlatform('all')}>Все</Pill>
          <Pill active={platform === 'PS5'} onClick={() => setPlatform('PS5')}>PS5</Pill>
          <Pill active={platform === 'PS4'} onClick={() => setPlatform('PS4')}>PS4</Pill>
          <span className="w-px h-6 bg-white/10 hidden sm:block" />
          <Pill active={priceRange === 'all'} onClick={() => setPriceRange('all')}>Любая цена</Pill>
          <Pill active={priceRange === 'low'} onClick={() => setPriceRange('low')}>До 1 000 руб.</Pill>
          <Pill active={priceRange === 'mid'} onClick={() => setPriceRange('mid')}>1 000 - 3 000 руб.</Pill>
          <Pill active={priceRange === 'high'} onClick={() => setPriceRange('high')}>От 3 000 руб.</Pill>
          <span className="w-px h-6 bg-white/10 hidden sm:block" />
          <input type="text" placeholder="Поиск по названию..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#00D4FF]/50 w-48" />
          <span className="text-sm text-white/50 ml-auto">Найдено: {totalCount} игр</span>
        </div>
      </div>

      {/* 5-8. Zone sections */}
      {zoneConfig.map((zone) => (
        <ZoneSection key={zone.key} zone={zone} games={grouped[zone.key]} />
      ))}

      {totalCount === 0 && (
        <section className="py-24 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-white/50 text-lg">По вашим фильтрам ничего не найдено. Попробуйте изменить параметры.</p>
          </div>
        </section>
      )}

      {/* Catalog caption */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-white/30 text-xs text-center">Каталог обновляется каждую среду — цены из PS Store Турция и Украина в рублях по курсу ЦБ</p>
      </div>

      {/* 9. FAQ */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center font-rajdhani mb-12">Частые вопросы о скидках PS Store</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                    <span className="text-white font-medium pr-4">{item.q}</span>
                    <svg className={`w-5 h-5 text-white/50 shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {faqOpen === i && (
                    <div className="px-6 pb-4">
                      <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 10. SEO */}
      <ScrollReveal>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white/30 text-sm leading-relaxed space-y-4">
              <h2 className="text-white/40 text-base font-semibold font-rajdhani">Скидки PS Store - выгодные цены на игры PlayStation в России</h2>
              <p>PlayStation Store регулярно проводит масштабные распродажи, во время которых цены на популярные игры PS5 и PS4 снижаются на 20-90%. ActivePlay помогает купить игры PS5 из России по ценам PS Store Турция и Украина. Все цены в рублях — без пересчётов лир и гривен. Благодаря разнице в региональном ценообразовании Sony, стоимость игр в Турции и Украине значительно ниже, чем в Европе или США.</p>
              <p>На нашей странице скидок вы найдёте актуальный каталог игр с действующими акциями. Мы группируем предложения по зонам: красная зона - максимальные скидки от 65%, где ААА-тайтлы можно купить за 800-1500 рублей; жёлтая зона - солидные скидки 40-64% на хиты последних лет; зелёная зона - скидки 20-39% на относительно свежие релизы. Отдельно выделяем свежие тайтлы - новинки последнего года с первыми скидками.</p>
              <p>Процесс покупки максимально простой: выбираете игру, пишете нам в Telegram или чат на сайте, оплачиваете через СБП и получаете активацию на свой аккаунт за 5 минут. Мы не запрашиваем пароль от вашего PSN - активация происходит безопасно через пополнение кошелька нужного региона. Каждая купленная игра навсегда остаётся на вашем аккаунте - это полноценная цифровая покупка, а не аренда или подписка.</p>
              <p>Каталог обновляется каждую неделю вместе с новыми акциями PlayStation Store. Следите за обновлениями и не пропускайте лучшие предложения. Среди постоянных хитов распродаж - God of War Ragnarok, Spider-Man 2, Elden Ring, Hogwarts Legacy, Cyberpunk 2077 и десятки других популярных тайтлов. Подписывайтесь на наш Telegram-канал, чтобы первыми узнавать о новых скидках и эксклюзивных предложениях ActivePlay.</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 11. Reviews */}
      <TrustBlock />

      {/* 12. Why ActivePlay */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">
            Почему покупают игры в ActivePlay
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>, title: 'С 2022 года' },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, title: '52 000+ клиентов' },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, title: 'Активация за 5 минут' },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>, title: 'Поддержка 24/7' },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, title: 'Безопасно' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl" style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }}>
                  {item.icon}
                </div>
                <p className="text-sm font-medium text-white">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Anti-fraud */}
      <AntiFraudBlock />

      {/* 14. Final CTA */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">
            Готовы купить <span style={{ color: '#00D4FF' }}>игру со скидкой</span>?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Оформление за 5 минут &bull; Поддержка 24/7
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://t.me/activeplay2" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 min-h-[48px] py-3 rounded-xl font-semibold text-white btn-telegram hover:brightness-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
              Telegram
            </a>
            <a href="https://vk.com/im?sel=-214354347" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 min-h-[48px] py-3 rounded-xl font-semibold text-white btn-vk hover:brightness-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" /></svg>
              VK
            </a>
            <button onClick={() => { const cw = (window as any).$chatwoot; if (cw) cw.toggle('open'); }} className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 min-h-[48px] py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110" style={{ background: 'linear-gradient(135deg, #00E676, #00C853)', boxShadow: '0 0 20px rgba(0,230,118,0.3)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              Чат на сайте
            </button>
          </div>
        </div>
      </section>

      {/* MessengerPopup */}
      <MessengerPopup isOpen={popup.open} onClose={() => setPopup({ open: false, name: '', price: 0 })} planName={popup.name} price={popup.price} />
    </>
  );
}
