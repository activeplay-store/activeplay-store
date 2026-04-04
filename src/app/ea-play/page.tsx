'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import MessengerPopup from '@/components/MessengerPopup';
import TrustBlock from '@/components/TrustBlock';
import AntiFraudBlock from '@/components/AntiFraudBlock';
import HowItWorks from '@/components/HowItWorks';
import { eaPlayFaq } from '@/data/eaPlayFaq';
import { eaPlayGames, eaPlayProGames, eaPlayGenreFilters, eaPlayProGenreFilters } from '@/data/eaPlayGames';
import type { EAPlayGame } from '@/data/eaPlayGames';
import { getGameCover } from '@/lib/game-covers';

/* ═══ Game Carousel (identical to PS Plus Extra) ═══ */
interface ShowcaseGame { title: string; image: string }

function GameCarousel({ games, label }: { games: ShowcaseGame[]; label?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const scroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused.current) return;
    el.scrollLeft += 1;
    if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
  }, []);
  useEffect(() => { const id = setInterval(scroll, 30); return () => clearInterval(id); }, [scroll]);
  const looped = [...games, ...games];
  return (
    <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollBehavior: 'auto' }} onMouseEnter={() => { isPaused.current = true; }} onMouseLeave={() => { isPaused.current = false; }} onTouchStart={() => { isPaused.current = true; }} onTouchEnd={() => { isPaused.current = false; }}>
      {looped.map((game, i) => (
        <div key={i} className="flex-shrink-0 w-[180px] sm:w-[200px] group cursor-pointer">
          <div className="relative rounded-xl overflow-hidden aspect-[3/4] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={game.image}
              alt={`${game.title} — EA Play${label ? ' ' + label : ''}`}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = 'flex'; }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-[#1a1a3e] to-[#0a0a2e] items-center justify-center p-3" style={{ display: 'none' }}>
              <span className="text-white/80 text-sm font-medium text-center leading-tight">{game.title}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <p className="absolute bottom-2 left-2 right-2 text-sm font-medium text-white">{game.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ Showcase — covers from game-covers.ts ═══ */

/* ═══ Pricing data ═══ */
const eaPrices: Record<string, Record<number, number>> = {
  turkey: { 1: 1200, 12: 4500 },
  ukraine: { 1: 900, 12: 3000 },
  india: { 12: 4700 },
};
const proP: Record<number, number> = { 1: 2000, 12: 12500 };

/* ═══ Helpers ═══ */
function fmt(n: number) { return n.toLocaleString('ru-RU'); }

/* ═══ Reusable: Region Switcher with SVG flags ═══ */
function RegionSwitcher({ region, setRegion, includeIndia }: { region: string; setRegion: (r: 'turkey' | 'ukraine' | 'india') => void; includeIndia?: boolean }) {
  const regions = includeIndia ? (['turkey', 'ukraine', 'india'] as const) : (['turkey', 'ukraine'] as const);
  const flags: Record<string, React.ReactNode> = {
    turkey: <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>,
    ukraine: <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>,
    india: <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="white" rx="2"/><rect width="20" height="4.67" fill="#FF9933" rx="2"/><rect y="9.33" width="20" height="4.67" fill="#138808" rx="2"/><circle cx="10" cy="7" r="1.8" fill="none" stroke="#000080" strokeWidth="0.5"/></svg>,
  };
  const labels: Record<string, string> = { turkey: 'Турция', ukraine: 'Украина', india: 'Индия' };
  return (
    <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden w-fit">
      {regions.map((r) => (
        <button key={r} onClick={() => setRegion(r)} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === r ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
          {flags[r]} {labels[r]}
        </button>
      ))}
    </div>
  );
}

/* ═══ Reusable: FAQ Accordion ═══ */
function FaqItem({ q, a, open, toggle }: { q: string; a: string; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={toggle} className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group hover:bg-[rgba(0,212,255,0.03)] rounded-lg" style={{ padding: '20px 0', minHeight: '44px' }}>
        <span className="text-[15px] font-semibold text-white group-hover:text-[var(--brand)] transition-colors">{q}</span>
        <span className="shrink-0 flex items-center justify-center font-bold transition-all duration-300" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--brand)', fontSize: 24, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? 500 : 0, opacity: open ? 1 : 0 }}>
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
}

/* ═══ Reusable: Game Catalog ═══ */
function GameCatalog({ games, filters, title }: { games: EAPlayGame[]; filters: { key: string; label: string }[]; title: string }) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const sorted = games.slice().sort((a, b) => a.title.localeCompare(b.title));
  const filtered = sorted.filter(g => (genre === 'all' || g.genre === genre) && (!search || g.title.toLowerCase().includes(search.toLowerCase())));
  const isSearching = search.length > 0 || genre !== 'all';
  const showAll = expanded || isSearching;
  return (
    <div className="rounded-2xl py-12 sm:py-16 px-4 sm:px-8" style={{ background: 'rgba(10,21,37,0.5)' }}>
      <h2 className="text-2xl sm:text-3xl font-bold font-display text-center mb-2" style={{ fontStyle: 'normal' }}>{title}</h2>
      <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>Каталог обновляется раз в месяц</p>
      <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: 'rgba(15,23,42,0.5)' }}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input type="text" placeholder="Найти игру в каталоге..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-h-[44px] px-4 py-2 rounded-xl text-sm text-white placeholder-white/30 bg-white/[0.06] border border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent" />
          <div className="flex flex-wrap gap-2">
            {filters.map(f => <button key={f.key} onClick={() => setGenre(f.key)} className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${genre === f.key ? 'bg-[var(--brand)] text-white' : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white'}`}>{f.label}</button>)}
          </div>
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Найдено: {filtered.length} игр</p>
      </div>
      <div className="relative">
        <div className="transition-all duration-500 overflow-hidden" style={{ maxHeight: showAll ? filtered.length * 60 : 400 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map(g => (
              <div key={g.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-sm text-white truncate flex-1">{g.title}</span>
                <div className="flex gap-1 shrink-0">{g.platform.map(p => <span key={p} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-white/60">{p}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
        {!showAll && <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,21,37,0.9))' }} />}
      </div>
      {!isSearching && <div className="text-center mt-6"><button onClick={() => setExpanded(!expanded)} className="text-sm font-medium text-[var(--brand)] hover:text-cyan-400 transition-colors cursor-pointer">{expanded ? 'Свернуть список' : `Показать все ${games.length} игр`}</button></div>}
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function EAPlayPage() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const [region, setRegion] = useState<'turkey' | 'ukraine' | 'india'>('turkey');
  const [proP1, setProP1] = useState<1 | 12>(12);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const order = (n: string, p: number) => setPopup({ name: n, price: p });

  const prices = eaPrices[region];
  const regionLabel = region === 'turkey' ? 'Турция' : region === 'ukraine' ? 'Украина' : 'Индия';
  const periods = region === 'india' ? [12] : [1, 12];

  // Pro catalog
  const proAll = [...eaPlayGames.map(g => ({ ...g, platform: ['PC'] })), ...eaPlayProGames];
  const proDe = proAll.filter((g, i, a) => a.findIndex(x => x.title === g.title) === i);

  // Showcase carousels — all games with Steam CDN covers
  const allEaShowcase: ShowcaseGame[] = eaPlayGames.map(g => ({ title: g.title, image: getGameCover(g.id) }));
  const allProShowcase: ShowcaseGame[] = eaPlayGames.map(g => ({ title: g.title, image: getGameCover(g.id) }));

  return (
    <>
      <main className="relative z-10">

        {/* ══════ HERO (identical to PS Plus Essential/Extra) ══════ */}
        <section className="relative overflow-hidden border-b border-white/[0.05]" style={{ paddingTop: '112px' }}>
          <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(255,71,71,0.2) 0%, transparent 65%), linear-gradient(180deg, #0A1628 0%, #060D18 100%)' }} />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pb-16 pt-8 sm:pt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/platforms/ea-play-sm.webp" alt="Логотип EA Play" className="h-16 w-auto mx-auto mb-5" />
            <h1 className="text-5xl lg:text-7xl font-bold font-display mb-3" style={{ color: '#FF4747', fontStyle: 'normal' }}>
              Подписка EA Play (ЕА Плей)
              <span className="block text-lg sm:text-xl font-normal text-gray-300 mt-2">
                Для PlayStation, Xbox и ПК — 64 игры от Electronic Arts
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
              Пробные версии новинок до 10 часов · Скидка 10% на покупки EA · Награды каждый месяц
            </p>
            <p className="mb-6">
              <span className="price-display text-4xl sm:text-5xl" style={{ color: '#FF4747' }}>900 ₽</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}> /мес</span>
            </p>
            <button onClick={() => order('EA Play (12 мес, Украина)', 3000)} className="btn-primary text-lg px-10 py-4 mb-4">Оформить подписку EA Play</button>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Активация за 5 минут &bull; Безопасная оплата &bull; Поддержка 24/7
            </p>
          </div>
        </section>

        {/* ══════ TRUST BADGES (identical to PS Plus) ══════ */}
        <div className="relative z-10 py-4 px-4 sm:px-6 border-b border-white/[0.05]">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8">
            {[
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, text: 'С 2022 года' },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, text: '52 000+ клиентов' },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'За 5 минут' },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>, text: 'Поддержка 24/7' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{b.icon}</span>
                <span className="text-sm font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ HOW TO BUY ══════ */}
        <HowItWorks />

        {/* ══════ PRICING: EA PLAY (CONSOLES) ══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-center mb-2" style={{ fontStyle: 'normal' }}>Выберите план EA Play</h2>
          <p className="text-sm text-center text-[var(--text-secondary)] mb-6">PlayStation / Xbox • Цены зависят от региона</p>

          <div className="flex justify-center mb-8">
            <RegionSwitcher region={region} setRegion={(r) => { setRegion(r); }} includeIndia />
          </div>

          <div className={`grid gap-5 max-w-3xl mx-auto ${periods.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-md'}`}>
            {periods.map(p => {
              const price = prices[p];
              const savings = p === 12 && region !== 'india' ? prices[1] * 12 - prices[12] : 0;
              const isBest = p === 12;
              const label = p === 1 ? '1 месяц' : '12 месяцев';
              return (
                <div key={p} className={`relative card-base rounded-2xl p-6 flex flex-col ${isBest ? 'ring-2 ring-[var(--brand)]' : ''}`}>
                  {isBest && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase text-black whitespace-nowrap" style={{ background: '#00D4FF' }}>Максимальная выгода</span>}
                  <p className="text-lg font-semibold text-white mb-1 font-display" style={{ fontStyle: 'normal' }}>{label}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="price-display text-4xl">{fmt(price)}</span>
                    <span className="text-sm text-[var(--text-secondary)]">₽</span>
                  </div>
                  {savings > 0 && <p className="text-sm text-[var(--success)] font-medium mb-3">Экономия {fmt(savings)} ₽ за год</p>}
                  <button onClick={() => order(`EA Play (${label}, ${regionLabel})`, price)} className="btn-primary w-full py-3.5 rounded-xl mt-auto">Оформить подписку EA Play</button>
                  <p className="text-xs text-[var(--text-muted)] text-center mt-2">Менеджер ответит за 2–3 минуты</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════ FEATURES: EA PLAY ══════ */}
        <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">Что входит в EA Play</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.467.89 6.065 2.352m0-14.31A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.352m0-14.31v14.31" /></svg>, title: '64 игры EA без ограничений', desc: 'Безлимитный доступ к Battlefield, Star Wars, Need for Speed, Mass Effect, Dead Space, The Sims, EA SPORTS FC' },
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Ранний доступ к новинкам', desc: 'Играйте в новые игры EA за 10 часов до релиза. Прогресс сохраняется при покупке полной версии' },
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>, title: 'Скидка 10% + награды', desc: '10% на все покупки EA (игры, DLC, FC Points, Apex Coins). Ежемесячные награды для FC 26, Apex, Battlefield, NHL' },
              ].map(f => (
                <div key={f.title} className="glass-card rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:border-white/20">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,71,71,0.1)', color: '#FF4747' }}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SHOWCASE: EA PLAY ══════ */}
        <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">Игры в каталоге EA Play</h2>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Хиты каталога</h3>
            <GameCarousel games={allEaShowcase} label="каталог" />
          </div>
        </section>

        {/* ══════ CATALOG: EA PLAY ══════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
          <GameCatalog games={eaPlayGames} filters={eaPlayGenreFilters} title={`Полный каталог EA Play — ${eaPlayGames.length} игры`} />
        </section>

        {/* ══════ DIVIDER ══════ */}
        <div className="section-divider" />

        {/* ══════ HERO: EA PLAY PRO ══════ */}
        <section className="text-center py-16 sm:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/platforms/ea-play-sm.webp" alt="EA Play Pro" className="w-12 h-12 object-contain rounded-xl" />
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,107,0,0.15)', color: '#FF6B00' }}>PRO</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold font-display mb-2" style={{ fontStyle: 'normal', color: '#FF6B00' }}>Подписка EA Play Pro (ЕА Плей Про)</h2>
            <p className="text-lg text-white/80 font-medium mb-2">Купить премиум-подписку для ПК — все новинки EA с первого дня</p>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              {proDe.length} игр • Premium-издания • Без ограничений по времени • Только через EA App
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="price-display text-5xl sm:text-6xl">2 000</span>
              <span className="text-xl text-[var(--text-secondary)]">₽ / мес</span>
            </div>
            <button onClick={() => order('EA Play Pro (12 мес, ПК)', 12500)} className="btn-primary text-lg px-10 py-4 mb-4">Купить EA Play Pro</button>
            <p className="text-xs text-[var(--text-muted)]">Только ПК (EA App) • Активация за 5 минут</p>
          </div>
        </section>

        {/* ══════ PRICING: EA PLAY PRO ══════ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-center mb-6" style={{ fontStyle: 'normal' }}>Цены EA Play Pro для ПК — выберите план</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([1, 12] as const).map(p => {
              const price = proP[p];
              const savings = p === 12 ? 2000 * 12 - 12500 : 0;
              const label = p === 1 ? '1 месяц' : '12 месяцев';
              return (
                <div key={p} className={`relative card-base rounded-2xl p-6 flex flex-col ${p === 12 ? 'ring-2 ring-[var(--brand)]' : ''}`}>
                  {p === 12 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase text-black whitespace-nowrap" style={{ background: '#00D4FF' }}>Максимальная выгода</span>}
                  <p className="text-lg font-semibold text-white mb-1 font-display" style={{ fontStyle: 'normal' }}>{label}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="price-display text-4xl">{fmt(price)}</span>
                    <span className="text-sm text-[var(--text-secondary)]">₽</span>
                  </div>
                  {savings > 0 && <p className="text-sm text-[var(--success)] font-medium mb-3">Экономия {fmt(savings)} ₽ за год</p>}
                  <button onClick={() => order(`EA Play Pro (${label}, ПК)`, price)} className="btn-primary w-full py-3.5 rounded-xl mt-auto">Купить EA Play Pro</button>
                  <p className="text-xs text-[var(--text-muted)] text-center mt-2">Менеджер ответит за 2–3 минуты</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════ FEATURES: EA PLAY PRO ══════ */}
        <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">Что входит в EA Play Pro</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, title: 'Все новинки EA с первого дня', desc: 'FC 26, Battlefield 6, NHL 26 — полный доступ без 10-часового лимита, в Premium-издании со всеми DLC' },
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.467.89 6.065 2.352m0-14.31A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.352m0-14.31v14.31" /></svg>, title: `${proDe.length} игр — полная библиотека`, desc: 'Всё из EA Play + ПК-эксклюзивы: Command & Conquer, Crysis, SimCity, SPORE, Star Wars классика' },
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>, title: 'Premium-издания + скидка 10%', desc: 'Deluxe и Ultimate версии новинок. Скидка на все покупки EA. Расширенные ежемесячные награды' },
              ].map(f => (
                <div key={f.title} className="glass-card rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:border-white/20">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,107,0,0.1)', color: '#FF6B00' }}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SHOWCASE: EA PLAY PRO ══════ */}
        <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">Игры в каталоге EA Play Pro</h2>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Хиты каталога</h3>
            <GameCarousel games={allProShowcase} label="Pro каталог" />
          </div>
        </section>

        {/* ══════ CATALOG: EA PLAY PRO ══════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
          <GameCatalog games={proDe} filters={eaPlayProGenreFilters} title={`Каталог EA Play Pro — ${proDe.length} игр`} />
        </section>

        {/* ══════ COMMON BLOCKS ══════ */}
        <div className="section-divider" />

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text text-center mb-12">Частые вопросы об EA Play</h2>
          <div className="card-base p-6 sm:p-8">
            {eaPlayFaq.map((item, i) => <FaqItem key={i} q={item.question} a={item.answer} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />)}
          </div>
        </section>

        {/* SEO text — small gray */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-sm text-gray-500 leading-relaxed space-y-2">
            <p>Купить EA Play в России — оплата через СБП, активация на аккаунт PlayStation, Xbox или EA за 5 минут. EA Play открывает доступ к 64 играм EA: Battlefield, Star Wars, Need for Speed, Dead Space, Mass Effect, FC 26. Цена от 900 ₽/мес.</p>
            <p>EA Play Pro — 144 игры для ПК через EA App. Все новинки EA в день выхода в Premium-издании. Купить через ActivePlay — оплата через СБП, Сбер, Тинькофф. Годовая подписка экономит до 55%.</p>
          </div>
        </section>

        {/* Reviews */}
        <TrustBlock />

        {/* Anti-fraud */}
        <AntiFraudBlock />

        {/* Final CTA */}
        <section className="text-center py-16 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">Готовы купить EA Play?</h2>
          <p className="text-[var(--text-secondary)] mb-8">Выберите удобный способ связи — менеджер ответит за 2–3 минуты</p>
          <button onClick={() => order('EA Play', 4500)} className="btn-primary px-10 py-4 text-lg rounded-2xl">Купить EA Play</button>
        </section>

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [...eaPlayFaq.map(i => ({ '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.shortAnswer } })), { '@type': 'Question', name: 'Это легально? Аккаунт не заблокируют?', acceptedAnswer: { '@type': 'Answer', text: 'Да, полностью легально. Мы используем официальные подписки из турецкого и украинского PlayStation Store.' } }, { '@type': 'Question', name: 'Нужен ли VPN?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. После активации подписка работает без VPN.' } }, { '@type': 'Question', name: 'Как происходит оплата?', acceptedAnswer: { '@type': 'Answer', text: 'Переводом по СБП или картой Сбер, Тинькофф, Альфа.' } }] }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: 'EA Play', image: 'https://activeplay.games/images/platforms/ea-play-sm.webp', brand: { '@type': 'Brand', name: 'Electronic Arts' }, offers: [{ '@type': 'Offer', name: 'EA Play 12 мес (Украина)', priceCurrency: 'RUB', price: '3000', availability: 'https://schema.org/InStock' }, { '@type': 'Offer', name: 'EA Play Pro 12 мес (ПК)', priceCurrency: 'RUB', price: '12500', availability: 'https://schema.org/InStock' }] }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games' }, { '@type': 'ListItem', position: 2, name: 'EA Play', item: 'https://activeplay.games/ea-play' }] }) }} />
      </main>

      <MessengerPopup isOpen={!!popup} onClose={() => setPopup(null)} planName={popup?.name || ''} price={popup?.price || 0} />
    </>
  );
}
