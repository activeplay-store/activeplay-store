'use client';

import { useState, useEffect } from 'react';
import MessengerPopup from '@/components/MessengerPopup';
import TrustBlock from '@/components/TrustBlock';
import AntiFraudBlock from '@/components/AntiFraudBlock';
import CurrencyCard from '@/components/CurrencyCard';
import { fcPointsNominals, vbucksNominals, apexNominals, genshinNominals, codNominals, gtaNominals, currencyFaq } from '@/data/gameCurrency';
import type { CurrencyNominal, CurrencyNominalEA } from '@/data/gameCurrency';

function fmt(n: number) { return n.toLocaleString('ru-RU'); }

/* ═══ Region Switcher ═══ */
function RegionSwitcher({ region, setRegion }: { region: 'turkey' | 'ukraine'; setRegion: (r: 'turkey' | 'ukraine') => void }) {
  return (
    <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden w-fit">
      <button onClick={() => setRegion('turkey')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'turkey' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
        <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
        Турция
      </button>
      <button onClick={() => setRegion('ukraine')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'ukraine' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
        <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
        Украина
      </button>
    </div>
  );
}

/* ═══ How It Works (currency-specific) ═══ */
function HowItWorksCurrency() {
  const steps = [
    { label: '01', title: 'Выбери валюту', desc: 'FC Points, V-Bucks, Apex Coins — выбери нужный товар', icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
    { label: '02', title: 'Нажми «Купить»', desc: 'Выбери мессенджер и напиши менеджеру', icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> },
    { label: '03', title: 'Оплати в рублях', desc: 'Переведи через СБП, карту или ЮMoney — без зарубежных карт', icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
    { label: '04', title: 'Играй через 5 мин', desc: 'Валюта зачислена, код доставлен — готово', highlight: true, icon: <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.421 48.421 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg> },
  ];

  return (
    <section className="relative z-10 pt-20 pb-20">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 20% 40%, rgba(0,212,255,0.06), transparent 50%), radial-gradient(circle at 80% 60%, rgba(0,100,255,0.05), transparent 50%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-14">
          Как купить игровую валюту
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch">
          {steps.map((step) => (
            <div
              key={step.label}
              className="relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(0,212,255,0.06) 0%, rgba(0,0,0,0.2) 100%)',
                border: step.highlight ? '1px solid rgba(0,212,255,0.35)' : '1px solid rgba(0,212,255,0.15)',
                backdropFilter: 'blur(8px)',
                boxShadow: step.highlight ? '0 0 25px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.02)' : '0 0 20px rgba(0,212,255,0.04), inset 0 0 20px rgba(0,212,255,0.02)',
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
  );
}

/* ═══ FAQ ═══ */
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

/* ═══ Generic Currency Section — matches FC Points layout (without Abel) ═══ */
function CurrencySection({ id, title, subtitle, seoText, note, nominals, region, setRegion, hasRegions, hasEaPlay, eaPlay, setEaPlay, buttonText, cardProps, logo, showManagerNote, onOrder }: {
  id: string; title: string; subtitle: string; seoText: string; note?: string;
  nominals: (CurrencyNominal | CurrencyNominalEA)[]; region: 'turkey' | 'ukraine'; setRegion: (r: 'turkey' | 'ukraine') => void;
  hasRegions: boolean; hasEaPlay?: boolean; eaPlay?: boolean; setEaPlay?: (v: boolean) => void;
  showManagerNote?: boolean;
  buttonText: string;
  cardProps: { name: string; game: string; gradient: string; accent: string; icon?: string };
  logo?: string;
  onOrder: (name: string, price: number) => void;
}) {
  const [sel, setSel] = useState(0);
  const n = nominals[sel];
  const isEA = hasEaPlay && eaPlay;
  const price = isEA
    ? (region === 'turkey' ? (n as CurrencyNominalEA).priceEaTR : (n as CurrencyNominalEA).priceEaUA)
    : (region === 'turkey' ? n.priceTR : n.priceUA);

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="section-divider mb-10" />
      {/* Header with logo */}
      <div className="flex items-center gap-3 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo && <img src={logo} alt="" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />}
        <div>
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">{title}</h2>
          <p className="text-[15px] text-[var(--text-secondary)]">{subtitle}</p>
        </div>
      </div>

      {/* Card + controls row — IDENTICAL to FC Points layout */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-start">
        {/* Card visual — same 250×180 as FC Points */}
        <div className="shrink-0 self-center sm:self-start">
          <CurrencyCard {...cardProps} nominal={n.displayValue} hit={n.hit} />
        </div>

        {/* Controls */}
        <div className="flex-1 w-full">
          {hasRegions && (
            <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
              <button onClick={() => setRegion('turkey')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'turkey' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
                Турция
              </button>
              <button onClick={() => setRegion('ukraine')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'ukraine' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
                Украина
              </button>
            </div>
          )}

          {hasEaPlay && setEaPlay && (
            <div className="flex rounded-[14px] bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
              <button onClick={() => setEaPlay(true)} className={`px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${eaPlay ? '' : 'text-[var(--text-secondary)] hover:text-white'}`} style={eaPlay ? { background: '#00E676', color: '#000' } : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/platforms/ea-play-sm.webp" alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 3 }} />
                С EA Play
              </button>
              <button onClick={() => setEaPlay(false)} className={`px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${!eaPlay ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                <span className="relative" style={{ width: 14, height: 14 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/platforms/ea-play-sm.webp" alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 3, opacity: 0.4 }} />
                </span>
                Без EA Play
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <select value={sel} onChange={e => setSel(Number(e.target.value))} className="cursor-pointer outline-none transition-all w-full sm:w-[220px] appearance-none pr-10 hover:border-[rgba(0,212,255,0.5)]" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '16px', height: '52px' }}>
                {nominals.map((nom, i) => <option key={nom.label} value={i}>{nom.label}{nom.hit ? ' ⭐' : ''}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <span className="price-display text-[32px] sm:text-[36px] whitespace-nowrap" style={{ fontWeight: 800, color: '#00D4FF' }}>{fmt(price)}&nbsp;₽</span>
          </div>

          {note && <p className="text-[10px] text-gray-600 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: note }} />}
        </div>
      </div>

      {/* Full-width buy button — same width as FC Points */}
      <div className="pt-3" style={{ maxWidth: '680px' }}>
        <button onClick={() => onOrder(`${n.label}`, price)} className="btn-primary w-full py-3.5 rounded-xl">
          {buttonText}
        </button>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">{seoText}</p>
        {showManagerNote && <p className="text-[11px] text-gray-500 text-center mt-2">Менеджер ответит за 2–3 минуты</p>}
      </div>
    </section>
  );
}

/* ═══ Sticky Anchor Nav ═══ */
function AnchorNav() {
  const [active, setActive] = useState('');
  const anchors = [
    { id: 'fc-points', label: 'FC Points' },
    { id: 'vbucks', label: 'V-Bucks' },
    { id: 'apex', label: 'Apex Coins' },
    { id: 'genshin', label: 'Genshin' },
    { id: 'cod', label: 'COD Points' },
    { id: 'gta', label: 'Shark Cards' },
    { id: 'faq', label: 'FAQ' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3, rootMargin: '-120px 0px 0px 0px' });
    anchors.forEach(a => { const el = document.getElementById(a.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sticky top-[100px] z-30 bg-[#060D18]/90 backdrop-blur-md border-b border-white/[0.06] py-2 px-4 overflow-x-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto flex gap-1 justify-center">
        {anchors.map(a => (
          <a key={a.id} href={`#${a.id}`} onClick={e => { e.preventDefault(); document.getElementById(a.id)?.scrollIntoView({ behavior: 'smooth' }); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${active === a.id ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function GameCurrencyPage() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const [fcRegion, setFcRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [vbRegion, setVbRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [apexRegion, setApexRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [codRegion, setCodRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [gtaRegion, setGtaRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [fcEaPlay, setFcEaPlay] = useState(false);
  const [apexEaPlay, setApexEaPlay] = useState(false);
  const [fcSel, setFcSel] = useState(6);
  const [genshinRegion, setGenshinRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const order = (n: string, p: number) => setPopup({ name: n, price: p });

  // FC Points price
  const fcNom = fcPointsNominals[fcSel];
  const fcNominal = fcNom.displayValue;
  const fcPrice = fcEaPlay
    ? (fcRegion === 'turkey' ? fcNom.priceEaTR : fcNom.priceEaUA)
    : (fcRegion === 'turkey' ? fcNom.priceTR : fcNom.priceUA);
  const fcRegionLabel = fcRegion === 'turkey' ? 'Турция' : 'Украина';
  const fcEaLabel = fcEaPlay ? 'с EA Play' : 'без EA Play';

  return (
    <>
      <main className="relative z-10">

        {/* ══════ HERO ══════ */}
        <section className="relative overflow-hidden border-b border-white/[0.05]" style={{ paddingTop: '112px' }}>
          <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(0,212,255,0.12) 0%, transparent 65%), linear-gradient(180deg, #0A1628 0%, #060D18 100%)' }} />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pb-16 pt-8 sm:pt-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-display mb-3" style={{ fontStyle: 'normal' }}>
              <span className="gradient-text">Купить игровую валюту в России</span>
              <span className="block text-lg sm:text-xl font-normal text-gray-300 mt-2">FC Points · V-Bucks · Apex Coins · COD Points · Genshin — оплата в рублях через СБП</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">Пополнение за 5 минут · Безопасная оплата · Поддержка 24/7</p>

            {/* Mini currency cards */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 max-w-3xl mx-auto">
              {[
                { id: 'fc-points', icon: '/images/covers/fc-points.webp', label: 'FC Points' },
                { id: 'vbucks', icon: '/images/currency/v-bucks.png', label: 'V-Bucks' },
                { id: 'apex', icon: '/images/currency/apex-coins.png', label: 'Apex Coins' },
                { id: 'genshin', icon: '/images/currency/genesis-crystals.png', label: 'Genshin' },
                { id: 'cod', icon: '/images/currency/cod-points.png', label: 'COD Points' },
                { id: 'gta', icon: '/images/currency/shark-cards.png', label: 'Shark Cards' },
              ].map((c) => (
                <button key={c.id} onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-[var(--brand)]/30 transition-all cursor-pointer" style={{ minWidth: '90px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.icon} alt={c.label} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  <span className="text-[11px] font-medium text-gray-300">{c.label}</span>
                </button>
              ))}
            </div>

            <button onClick={() => document.getElementById('fc-points')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-lg px-10 py-4 mb-4" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}>Выбрать валюту ↓</button>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Активация за 5 минут &bull; Безопасная оплата &bull; Поддержка 24/7</p>
          </div>
        </section>

        {/* Trust badges — icons like /ea-play */}
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

        {/* Sticky anchor nav */}
        <AnchorNav />

        {/* How to buy */}
        <HowItWorksCurrency />

        {/* ══════ FC POINTS — matches main page exactly ══════ */}
        <div style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="section-divider" />
          <section id="fc-points" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Grid: 2 rows × 2 cols on desktop; Abel spans both rows */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(auto,680px)_300px] gap-x-5 gap-y-0" style={{ alignItems: 'stretch' }}>

              {/* Row 1, Col 1: Header */}
              <div className="flex items-center gap-3 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/platforms/fc26-logo.webp" alt="FC 26" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                <div>
                  <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">FC Points (FIFA Points)</h2>
                  <p className="text-[15px] text-[var(--text-secondary)]">Купить FC Points для EA Sports FC 26 — донат Ultimate Team на PS5, Xbox и ПК</p>
                </div>
              </div>

              {/* Row 1–2, Col 2: Abel card spanning both rows */}
              <div className="abel-ambassador-card relative lg:row-span-2 rounded-[14px] bg-[#0a1628] flex flex-col items-center justify-center text-center px-5 py-6">
                {/* SVG border overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ borderRadius: 'inherit' }}>
                  <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="14" ry="14" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" pathLength="100" />
                  <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="14" ry="14" fill="none" stroke="#00D4FF" strokeWidth="2" pathLength="100" strokeDasharray="4 96" strokeLinecap="round" className="abel-dot" />
                </svg>
                <div
                  role="img"
                  aria-label="Даниил Abel Абельдяев — амбассадор ActivePlay, 5-кратный чемпион России по EA FC"
                  className="w-[120px] h-[120px] rounded-full border-2 border-cyan-400/40 mx-auto mb-4 flex-shrink-0 overflow-hidden"
                  style={{
                    backgroundImage: 'url(/images/abel.webp)',
                    backgroundSize: '350%',
                    backgroundPosition: '50% 6%',
                  }}
                />
                <div className="text-white font-bold text-[16px]">Даниил Abel Абельдяев</div>
                <div className="text-cyan-400 text-[12px] font-semibold mt-1.5">5-кратный чемпион России по EA FC · Стример</div>
                <p className="text-gray-400 text-[12px] italic mt-3 leading-relaxed">«Я пополняю баланс FC&nbsp;Points через ActivePlay и&nbsp;вам рекомендую&nbsp;— быстро, безопасно, дёшево»</p>
                <div className="text-[10px] text-gray-300 tracking-wider uppercase mt-3">Амбассадор ActivePlay</div>
              </div>

              {/* Row 2, Col 1: Purchase block */}
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                  {/* FC Points card — EXACT match of main page */}
                  <div className="shrink-0 self-center sm:self-start">
                    <div
                      className="w-[250px] h-[180px] flex flex-col items-center relative transition-transform duration-300 ease-in-out hover:scale-[1.03] overflow-hidden"
                      style={{
                        background: 'linear-gradient(180deg, #1A0D2E 0%, #0D0D1A 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,230,118,0.15)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,230,118,0.12), transparent 60%)' }} />
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 80%, rgba(139,0,255,0.08), transparent 50%)' }} />
                      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

                      {fcSel === 6 && (
                        <span className="absolute z-10 animate-fade-in-up" style={{ top: 34, right: 8, background: 'linear-gradient(135deg, #FF6B00, #FF3D00)', color: '#fff', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 5, letterSpacing: 1, boxShadow: '0 2px 6px rgba(255,61,0,0.25)' }}>Хит</span>
                      )}

                      <div className="w-full shrink-0 flex items-center justify-center relative z-10" style={{ height: '28px', background: 'linear-gradient(90deg, #00E676, #76FF03, #00E676)', borderRadius: '12px 12px 0 0', boxShadow: '0 2px 12px rgba(0,230,118,0.3)' }}>
                        <span className="font-bold uppercase whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '1px', color: '#000' }}>FC Points</span>
                      </div>

                      <div className="flex flex-col items-center flex-1 relative z-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/covers/fc-points.webp" alt="FC Points" style={{ width: '80px', height: 'auto', paddingTop: '6px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,230,118,0.35))' }} />
                        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,230,118,0.4), transparent)', margin: '6px auto', boxShadow: '0 0 8px rgba(0,230,118,0.15)' }} />
                        <span className="font-display" style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(180deg, #FFFFFF 0%, #90CAF9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: '0 0 20px rgba(144,202,249,0.2)' }}>{fcNominal}</span>
                      </div>

                      <span className="text-white uppercase shrink-0 relative z-10" style={{ fontSize: '8px', letterSpacing: '3px', opacity: 0.5, marginBottom: '10px' }}>EA Sports FC 26</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 w-full">
                    <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
                      <button onClick={() => { setFcRegion('turkey'); setFcSel(6); }} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${fcRegion === 'turkey' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                        <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
                        Турция
                      </button>
                      <button onClick={() => { setFcRegion('ukraine'); setFcSel(6); }} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${fcRegion === 'ukraine' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                        <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
                        Украина
                      </button>
                    </div>

                    <div className="flex rounded-[14px] bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
                      <button onClick={() => setFcEaPlay(true)} className={`px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${fcEaPlay ? '' : 'text-[var(--text-secondary)] hover:text-white'}`} style={fcEaPlay ? { background: '#00E676', color: '#000' } : undefined}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/platforms/ea-play-sm.webp" alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 3 }} />
                        С EA Play
                      </button>
                      <button onClick={() => setFcEaPlay(false)} className={`px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${!fcEaPlay ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                        <span className="relative" style={{ width: 14, height: 14 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/images/platforms/ea-play-sm.webp" alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 3, opacity: 0.4 }} />
                        </span>
                        Без EA Play
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative w-full sm:w-auto">
                        <select value={fcSel} onChange={(e) => setFcSel(Number(e.target.value))} className="cursor-pointer outline-none transition-all w-full sm:w-[220px] appearance-none pr-10 hover:border-[rgba(0,212,255,0.5)]" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '16px', height: '52px' }}>
                          {fcPointsNominals.map((n, i) => (
                            <option key={n.label} value={i}>{n.label}{n.hit ? ' ⭐' : ''}</option>
                          ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <span className="price-display text-[32px] sm:text-[36px] whitespace-nowrap" style={{ fontWeight: 800, color: '#00D4FF' }}>{fmt(fcPrice)}&nbsp;₽</span>
                    </div>

                    <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                      Официальные FC Points.<br/>
                      Пополнение через турецкий или украинский аккаунт за 5 минут
                    </p>
                  </div>
                </div>

                {/* Buy button */}
                <div className="pt-3">
                  <button onClick={() => order(`FC Points ${fcNom.label} (${fcRegionLabel}, ${fcEaLabel})`, fcPrice)} className="btn-primary w-full py-3.5 rounded-xl">
                    Купить FC Points
                  </button>
                </div>
              </div>

            </div>

            {/* SEO text under FC Points */}
            <p className="text-sm text-gray-500 mt-8 leading-relaxed max-w-4xl">FC Points (ФК Поинтс, ранее FIFA Points) — внутриигровая валюта EA Sports FC 26 для покупки паков Ultimate Team, кастомизации клуба и доступа к Draft-режимам. FC Points нельзя купить напрямую из России — платежи заблокированы с 2022 года. ActivePlay пополняет баланс FC Points через турецкий или украинский аккаунт PlayStation, Xbox и ПК за 5 минут. Оплата в рублях через СБП. С подпиской EA Play — дополнительная скидка 10% на все пакеты FC Points.</p>
          </section>
          <div className="section-divider" />
        </div>

        {/* ══════ V-BUCKS ══════ */}
        <CurrencySection id="vbucks" title="V-Bucks для Fortnite" subtitle="Купить В-Баксы для Fortnite — скины, боевой пропуск и косметика" seoText="V-Bucks (В-Баксы, вбаксы) — внутриигровая валюта Fortnite от Epic Games. Используется для покупки боевого пропуска, скинов, эмоций и косметических предметов. Прямая покупка из России заблокирована. ActivePlay пополняет V-Bucks через турецкий или украинский аккаунт PlayStation и Xbox за 5 минут. Оплата в рублях через СБП." note="Официальные V-Bucks для Fortnite.<br/>Пополнение через турецкий, украинский или индийский аккаунт за 5 минут" nominals={vbucksNominals} region={vbRegion} setRegion={setVbRegion} hasRegions buttonText="Купить V-Bucks" cardProps={{ name: 'V-BUCKS', game: 'FORTNITE', gradient: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)', accent: '#00D4FF', icon: '/images/currency/v-bucks.png' }} logo="/images/currency/fortnite-logo.png" onOrder={order} />

        {/* ══════ APEX COINS ══════ */}
        <CurrencySection id="apex" title="Apex Coins для Apex Legends" subtitle="Купить Апекс Коинс — паки, скины и боевой пропуск" seoText="Apex Coins (Апекс Коинс) — внутриигровая валюта Apex Legends от Electronic Arts. Используется для покупки паков Apex, скинов легенд, боевого пропуска и косметических предметов. Прямая покупка из России заблокирована. ActivePlay пополняет Apex Coins через турецкий или украинский аккаунт PlayStation и Xbox за 5 минут. Оплата в рублях через СБП. С подпиской EA Play — скидка 10%." note="Официальные Apex Coins от Electronic Arts.<br/>Пополнение через турецкий или украинский аккаунт за 5 минут" nominals={apexNominals} region={apexRegion} setRegion={setApexRegion} hasRegions hasEaPlay eaPlay={apexEaPlay} setEaPlay={setApexEaPlay} buttonText="Купить Apex Coins" cardProps={{ name: 'APEX COINS', game: 'APEX LEGENDS', gradient: 'linear-gradient(180deg, #d4c5a9 0%, #3a3a3a 100%)', accent: '#dc2626', icon: '/images/currency/apex-coins.png' }} logo="/images/currency/apex-legends-logo.png" onOrder={order} />

        {/* ══════ GENSHIN ══════ */}
        <CurrencySection id="genshin" title="Genesis Crystals для Genshin Impact" subtitle="Купить кристаллы Геншин Импакт — Primogems для гача-баннеров" seoText="Genesis Crystals (Кристаллы Генезиса, Генезис Кристаллы) — премиальная валюта Genshin Impact от HoYoverse. Конвертируются в Primogems (Примогемы) для крутки гача-баннеров и получения 5-звёздочных персонажей и оружия. Прямая покупка из России ограничена. ActivePlay пополняет кристаллы по UID вашего аккаунта — быстро, безопасно, без доступа к паролю. Оплата в рублях через СБП." note="Пополнение по UID аккаунта — без доступа к паролю.<br/>Оплата в рублях через СБП. Доставка за 5 минут" nominals={genshinNominals} region={genshinRegion} setRegion={setGenshinRegion} hasRegions buttonText="Купить Genesis Crystals" cardProps={{ name: 'GENESIS CRYSTALS', game: 'GENSHIN IMPACT', gradient: 'linear-gradient(135deg, #1a103d 0%, #0c4a6e 50%, #7dd3fc 100%)', accent: '#38bdf8', icon: '/images/currency/genesis-crystals.png' }} logo="/images/currency/genshin-impact-logo.png" onOrder={order} />

        {/* ══════ COD POINTS ══════ */}
        <CurrencySection id="cod" title="COD Points для Call of Duty" subtitle="Купить КОД Поинтс — боевой пропуск и скины для Warzone и Black Ops" seoText="COD Points (КОД Поинтс, CP) — внутриигровая валюта Call of Duty от Activision. Используется для покупки боевого пропуска, скинов операторов и оружия в Warzone и мультиплеере. Работает в Black Ops 7, Warzone и MW3. Прямая покупка из России заблокирована. ActivePlay пополняет COD Points через турецкий или украинский аккаунт PlayStation и Xbox за 5 минут. Оплата в рублях через СБП." note="Официальные COD Points от Activision.<br/>Пополнение через турецкий или украинский аккаунт за 5 минут" nominals={codNominals} region={codRegion} setRegion={setCodRegion} hasRegions buttonText="Купить COD Points" cardProps={{ name: 'COD POINTS', game: 'CALL OF DUTY', gradient: 'linear-gradient(180deg, #1e3a5f 0%, #0a0a0a 100%)', accent: '#f59e0b', icon: '/images/currency/cod-points.png' }} logo="/images/currency/call-of-duty-logo.png" onOrder={order} />

        {/* ══════ GTA SHARK CARDS ══════ */}
        <CurrencySection id="gta" title="Shark Cards для GTA Online" subtitle="Купить Карту Акулы GTA Online — игровые доллары GTA$" seoText="Shark Cards (Карты Акулы, Шарк Кард) — карты пополнения баланса GTA Online от Rockstar Games. Игровые доллары GTA$ для покупки недвижимости, транспорта и бизнесов. Работает в GTA V Online и GTA 6 Online. Прямая покупка из России заблокирована. ActivePlay пополняет баланс через турецкий или украинский аккаунт PlayStation и Xbox за 5 минут. Оплата в рублях через СБП." note="Официальные Shark Cards от Rockstar Games.<br/>Пополнение через турецкий или украинский аккаунт за 5 минут" nominals={gtaNominals} region={gtaRegion} setRegion={setGtaRegion} hasRegions buttonText="Купить Shark Card" cardProps={{ name: 'SHARK CARD', game: 'GTA ONLINE', gradient: 'linear-gradient(180deg, #166534 0%, #052e16 100%)', accent: '#22c55e', icon: '/images/currency/shark-cards.png' }} logo="/images/currency/gta-online-logo.png" showManagerNote onOrder={order} />

        {/* ══════ CTA ══════ */}
        <section className="text-center py-16 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">Не нашли нужную валюту?</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">Мы можем пополнить любую игровую валюту — просто напишите менеджеру. Minecoins Minecraft, гемы Brawl Stars, PUBG UC, донат Standoff 2 и любые другие игры.</p>
          <button onClick={() => order('Игровая валюта', 0)} className="btn-primary px-10 py-4 text-lg rounded-2xl">Написать менеджеру</button>
        </section>

        {/* ══════ FAQ ══════ */}
        <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text text-center mb-12">Частые вопросы</h2>
          <div className="card-base p-6 sm:p-8">
            {currencyFaq.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />)}
          </div>
        </section>

        <TrustBlock />
        <AntiFraudBlock />

        {/* JSON-LD: FAQPage */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: [...currencyFaq.map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })), { '@type': 'Question', name: 'Это легально? Аккаунт не заблокируют?', acceptedAnswer: { '@type': 'Answer', text: 'Да, полностью легально. Мы используем официальные подписки из турецкого и украинского PlayStation Store.' } }, { '@type': 'Question', name: 'Нужен ли VPN?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. После активации подписка работает без VPN.' } }, { '@type': 'Question', name: 'Как происходит оплата?', acceptedAnswer: { '@type': 'Answer', text: 'Переводом по СБП или картой Сбер, Тинькофф, Альфа.' } }]
        }) }} />

        {/* JSON-LD: BreadcrumbList */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games' },
            { '@type': 'ListItem', position: 2, name: 'Игровая валюта', item: 'https://activeplay.games/igrovaya-valyuta' }
          ]
        }) }} />

        {/* JSON-LD: Product schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { '@context': 'https://schema.org', '@type': 'Product', name: 'FC Points (EA Sports FC 26)', description: 'Внутриигровая валюта EA Sports FC 26 для покупки паков Ultimate Team', offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: 270, highPrice: 11000, offerCount: 8 } },
          { '@context': 'https://schema.org', '@type': 'Product', name: 'V-Bucks (Fortnite)', description: 'Внутриигровая валюта Fortnite для покупки боевого пропуска и скинов', offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: 650, highPrice: 5200, offerCount: 4 } },
          { '@context': 'https://schema.org', '@type': 'Product', name: 'Apex Coins (Apex Legends)', description: 'Валюта Apex Legends для покупки паков, скинов и боевого пропуска', offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: 1600, highPrice: 9000, offerCount: 3 } },
          { '@context': 'https://schema.org', '@type': 'Product', name: 'Genesis Crystals (Genshin Impact)', description: 'Премиальная валюта Genshin Impact, конвертируется в Primogems', offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: 400, highPrice: 12600, offerCount: 6 } },
          { '@context': 'https://schema.org', '@type': 'Product', name: 'COD Points (Call of Duty)', description: 'Валюта Call of Duty для боевого пропуска и скинов в Warzone', offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: 1050, highPrice: 9600, offerCount: 4 } },
          { '@context': 'https://schema.org', '@type': 'Product', name: 'Shark Cards (GTA Online)', description: 'Карты пополнения GTA Online для покупки недвижимости и транспорта', offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: 550, highPrice: 7000, offerCount: 5 } },
        ]) }} />
      </main>

      <MessengerPopup isOpen={!!popup} onClose={() => setPopup(null)} planName={popup?.name || ''} price={popup?.price || 0} />
    </>
  );
}
