'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlanCard from './PlanCard';
import MessengerPopup from './MessengerPopup';
import { psPlans, xboxPlans } from '@/data/subscriptions';
import type { Region, Period } from '@/data/subscriptions';
import { giftcards } from '@/data/giftcards';

function DotIndicators({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex justify-center gap-2 mt-4 sm:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full transition-all ${
            i === active ? 'bg-[var(--brand)] w-4' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function useScrollIndex(ref: React.RefObject<HTMLDivElement | null>) {
  const [index, setIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const cardWidth = 280 + 20; // min-w + gap
    const newIndex = Math.round(el.scrollLeft / cardWidth);
    setIndex(Math.min(newIndex, 2));
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [ref, handleScroll]);

  return index;
}

export default function SubscriptionSection() {
  const [psRegion, setPsRegion] = useState<Region>('turkey');
  const [psPeriod, setPsPeriod] = useState<Period>(12);
  const [cardRegion, setCardRegion] = useState<'turkey' | 'india'>('turkey');
  const [selectedCard, setSelectedCard] = useState(5);
  const [xboxPeriod, setXboxPeriod] = useState<Period>(12);
  const [eaRegion, setEaRegion] = useState<'turkey' | 'ukraine' | 'india'>('turkey');
  const [eaPeriod, setEaPeriod] = useState<1 | 12>(12);
  const [eaProPeriod, setEaProPeriod] = useState<1 | 12>(12);
  const [fcRegion, setFcRegion] = useState<'turkey' | 'ukraine'>('turkey');
  const [fcEaPlay, setFcEaPlay] = useState(true);
  const [fcSelected, setFcSelected] = useState(4);
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);

  const psScrollRef = useRef<HTMLDivElement>(null);
  const xboxScrollRef = useRef<HTMLDivElement>(null);
  const psIndex = useScrollIndex(psScrollRef);
  const xboxIndex = useScrollIndex(xboxScrollRef);

  const periods: { value: Period; label: string }[] = [
    { value: 1, label: '1 мес' },
    { value: 3, label: '3 мес' },
    { value: 12, label: '12 мес' },
  ];

  const handleOrder = (planName: string, price: number) => {
    setPopup({ name: planName, price });
  };

  return (
    <section id="subscriptions" className="relative z-10 pt-20 pb-20">
      {/* ═══ PlayStation Plus ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/images/platforms/ps-plus.png"
            alt="PS Plus"
            width={32}
            height={32}
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
          <div>
            <Link href="/ps-plus-essential" className="hover:opacity-80 transition-opacity cursor-pointer">
              <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">
                Подписка PlayStation Plus (PS Plus)
              </h2>
            </Link>
            <p className="text-[15px] text-[var(--text-secondary)]">Купить PS Plus для PS5 / PS4 — мультиплеер, каталог игр, облачное хранилище</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Region switcher */}
          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setPsRegion('turkey')}
              className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                psRegion === 'turkey'
                  ? 'bg-[var(--brand)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
              Турция
            </button>
            <button
              onClick={() => { setPsRegion('ukraine'); setPsPeriod(12); }}
              className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                psRegion === 'ukraine'
                  ? 'bg-[var(--brand)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
              Украина
            </button>
          </div>

          {/* Period switcher */}
          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden">
            {periods.map((p) => {
              // Ukraine only has 12-month plans
              if (psRegion === 'ukraine' && p.value !== 12) return null;
              return (
                <button
                  key={p.value}
                  onClick={() => setPsPeriod(p.value)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center ${
                    psPeriod === p.value
                      ? 'bg-[var(--brand)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  {p.label}
                  {p.value === 12 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--success)] text-black uppercase leading-none">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {psPeriod === 12 && (
            <span className="text-sm text-[var(--success)] font-medium">
              −35% от месячной цены
            </span>
          )}

          {/* Create PS account CTA */}
          <button
            onClick={() => handleOrder('Создание аккаунта PlayStation', 500)}
            className="px-4 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-xl"
            style={{ border: '1px solid #00D4FF', color: '#00D4FF', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#00D4FF'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00D4FF'; }}
          >
            Создать аккаунт PlayStation
          </button>
        </div>

        {/* Cards — mobile: horizontal swipe carousel; desktop: grid */}
        <div
          ref={psScrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pl-1 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:snap-none sm:pl-0"
        >
          {psPlans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              period={psPeriod}
              region={psRegion}
              platform="ps"
              onOrder={handleOrder}
              href={`/ps-plus-${plan.name.toLowerCase()}`}
            />
          ))}
        </div>
        <DotIndicators count={psPlans.length} active={psIndex} />

        {/* PS Plus trust line */}
        <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
          Все подписки — официальные. Активация на ваш PSN-аккаунт Турции, Индии или Украины за 5 минут
        </p>
      </div>

      {/* ═══ Карты пополнения PS Store ═══ */}
      <div id="psn-cards" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <Image
              src="/images/platforms/playstation.png"
              alt="PlayStation Store"
              width={32}
              height={32}
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <div>
              <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">
                Карты пополнения PSN / PlayStation Store
              </h2>
              <p className="text-[15px] text-[var(--text-secondary)]">Купить подарочную карту PSN для турецкого и индийского аккаунта — моментальная доставка кода</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: PSN gift card */}
            <div className="shrink-0">
              <div
                className="w-[250px] h-[180px] flex flex-col items-center relative transition-transform duration-300 ease-in-out hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(180deg, #0055C4 0%, #002D7A 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,85,196,0.3)',
                }}
              >
                {/* Hit badge */}
                {((cardRegion === 'turkey' && selectedCard === 5) || (cardRegion === 'india' && selectedCard === 4)) && (
                  <span className="absolute z-10 animate-fade-in-up" style={{ top: 34, right: 8, background: '#FF6B00', color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6, letterSpacing: 1 }}>Хит</span>
                )}
                {/* Yellow top field with title */}
                <div className="w-full shrink-0 flex items-center justify-center" style={{ height: '28px', background: '#FFCC00', borderRadius: '12px 12px 0 0' }}>
                  <span className="font-bold uppercase whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '1px', color: '#000' }}>
                    PlayStation Gift Card
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/platforms/ps-logo-white.png"
                    alt="PlayStation"
                    style={{ width: '80px', height: 'auto', paddingTop: '14px' }}
                  />
                  <div style={{ width: '50px', height: '1px', background: 'rgba(255,255,255,0.3)', margin: '10px auto' }} />
                  <span className="text-white font-bold font-display" style={{ fontSize: '32px', lineHeight: 1.1 }}>
                    {giftcards[cardRegion][selectedCard]?.nominal || ''}
                  </span>
                </div>

                {/* Bottom subtle label */}
                <span className="text-white uppercase shrink-0" style={{ fontSize: '8px', letterSpacing: '2px', opacity: 0.5, marginBottom: '10px' }}>
                  Digital Code
                </span>
              </div>
            </div>

            {/* Right: controls */}
            <div className="flex-1 w-full">
              {/* Region switcher — only Turkey & India */}
              <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-6 w-fit">
                <button
                  onClick={() => { setCardRegion('turkey'); setSelectedCard(0); }}
                  className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    cardRegion === 'turkey' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
                  Турция
                </button>
                <button
                  onClick={() => { setCardRegion('india'); setSelectedCard(0); }}
                  className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    cardRegion === 'india' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="white" rx="2"/><rect width="20" height="4.67" fill="#FF9933" rx="2"/><rect y="9.33" width="20" height="4.67" fill="#138808" rx="2"/><circle cx="10" cy="7" r="1.8" fill="none" stroke="#000080" strokeWidth="0.5"/></svg>
                  Индия
                </button>
              </div>

              {/* Dropdown + price + buy */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(Number(e.target.value))}
                    className="cursor-pointer outline-none transition-all w-full sm:w-[220px] appearance-none pr-10 hover:border-[rgba(0,212,255,0.5)]"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      color: 'white',
                      fontSize: '16px',
                      height: '52px',
                    }}
                  >
                    {giftcards[cardRegion].map((card, i) => (
                      <option key={card.nominal} value={i}>{card.nominal}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>

                <span className="price-display text-[32px] sm:text-[36px] whitespace-nowrap" style={{ fontWeight: 800, color: '#00D4FF' }}>
                  {giftcards[cardRegion][selectedCard]?.price.toLocaleString('ru-RU')}&nbsp;₽
                </span>

                <button
                  onClick={() => {
                    const card = giftcards[cardRegion][selectedCard];
                    if (card) handleOrder(`Карта PS Store ${card.nominal}`, card.price);
                  }}
                  className="btn-primary whitespace-nowrap w-full sm:w-auto"
                  style={{ height: '52px' }}
                >
                  Купить код
                </button>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mt-4">
                Официальные цифровые коды PSN. Пополнение кошелька PlayStation в рублях через СБП
              </p>
            </div>
          </div>
        </div>
        <div className="section-divider" />
      </div>

      {/* ═══ Xbox Game Pass ═══ */}
      <div id="xbox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/images/platforms/xbox-game-pass.png"
            alt="Xbox Game Pass"
            width={32}
            height={32}
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
          <div>
            <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">
              Подписка Xbox Game Pass (Гейм Пасс)
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">Купить Game Pass для Xbox Series X|S, Xbox One и ПК</p>
          </div>
        </div>

        {/* Period switcher */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setXboxPeriod(p.value)}
                className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center ${
                  xboxPeriod === p.value
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {p.label}
                {p.value === 12 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--success)] text-black uppercase leading-none">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          {xboxPeriod === 12 && (
            <span className="text-sm text-[var(--success)] font-medium">
              −35% от месячной цены
            </span>
          )}
        </div>

        {/* Cards */}
        <div
          ref={xboxScrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pl-1 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:snap-none sm:pl-0"
        >
          {xboxPlans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              period={xboxPeriod}
              platform="xbox"
              onOrder={handleOrder}
              href={`/xbox-game-pass-${plan.name.toLowerCase()}`}
            />
          ))}
        </div>
        <DotIndicators count={xboxPlans.length} active={xboxIndex} />

        {/* Xbox trust line */}
        <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
          Подписка для Xbox и ПК. Активация на ваш аккаунт Microsoft за 5 минут
        </p>
      </div>

      {/* ═══ EA Play ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 mt-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/images/platforms/ea-play.png" alt="EA Play" className="rounded-lg" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <Link href="/ea-play" className="hover:opacity-80 transition-opacity"><h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">Подписка EA Play (ЕА Плей)</h2></Link>
            <p className="text-[15px] text-[var(--text-secondary)]">Купить EA Play для PlayStation, Xbox и ПК — каталог игр EA Sports, Battlefield, The Sims</p>
          </div>
        </div>

        {/* Two cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* ── EA Play (Console) ── */}
          <div className="relative flex flex-col card-base">
            <div className="h-1 rounded-t-2xl" style={{ background: '#FF4747' }} />
            <div className="flex flex-col flex-1 p-6">
              {/* Title */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[18px] font-semibold font-display" style={{ color: '#FF4747', fontStyle: 'normal' }}>EA Play</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-4">PlayStation / Xbox</p>

              {/* Switchers — fixed height area for alignment */}
              <div style={{ minHeight: '68px' }}>
              {/* Region switcher */}
              <div className="flex rounded-lg bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
                <button
                  onClick={() => { setEaRegion('turkey'); }}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    eaRegion === 'turkey' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
                  Турция
                </button>
                <button
                  onClick={() => { setEaRegion('ukraine'); }}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    eaRegion === 'ukraine' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
                  Украина
                </button>
                <button
                  onClick={() => { setEaRegion('india'); setEaPeriod(12); }}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    eaRegion === 'india' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  <svg width="16" height="11" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="white" rx="2"/><rect width="20" height="4.67" fill="#FF9933" rx="2"/><rect y="9.33" width="20" height="4.67" fill="#138808" rx="2"/><circle cx="10" cy="7" r="1.8" fill="none" stroke="#000080" strokeWidth="0.5"/></svg>
                  Индия
                </button>
              </div>

              {/* Period switcher */}
              <div className="flex rounded-lg bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-4 w-fit">
                {eaRegion !== 'india' && (
                  <button
                    onClick={() => setEaPeriod(1)}
                    className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      eaPeriod === 1 ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    1 мес
                  </button>
                )}
                <button
                  onClick={() => setEaPeriod(12)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    eaPeriod === 12 ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  12 мес
                </button>
              </div>
              </div>

              {/* Price */}
              {(() => {
                const eaPrices: Record<string, Record<number, number>> = {
                  turkey: { 1: 1200, 12: 4500 },
                  ukraine: { 1: 900, 12: 3000 },
                  india: { 12: 4700 },
                };
                const price = eaPrices[eaRegion]?.[eaPeriod];
                const regionLabel = eaRegion === 'turkey' ? 'Турция' : eaRegion === 'ukraine' ? 'Украина' : 'Индия';
                const periodLabel = eaPeriod === 1 ? '1 мес' : '12 мес';
                const savings = eaPeriod === 12 && eaRegion !== 'india' ? eaPrices[eaRegion][1] * 12 - eaPrices[eaRegion][12] : 0;
                return (
                  <>
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="price-display text-[36px] sm:text-[48px]">{price?.toLocaleString('ru-RU')}</span>
                        <span className="text-base text-[var(--text-secondary)]">₽ / {periodLabel}</span>
                      </div>
                      {savings > 0 && (
                        <p className="text-sm text-[var(--success)] font-medium mt-1">Экономия {savings.toLocaleString('ru-RU')} ₽ за год</p>
                      )}
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {['Каталог игр EA: FC, Battlefield, Apex, Sims', 'Скидка 10% на все покупки в EA Store', 'Ранний доступ к новинкам (до 10 часов)', 'Награды и бонусный контент каждый месяц', 'Работает на PS5, PS4, Xbox и ПК'].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[15px] text-[var(--text-secondary)]">
                          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="#FF4747" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleOrder(`EA Play (${periodLabel}, ${regionLabel})`, price)}
                      className="btn-primary w-full py-3.5 rounded-xl"
                    >
                      Купить EA Play для PlayStation и Xbox
                    </button>
                    <p className="text-xs text-[var(--text-muted)] text-center mt-2">Менеджер ответит за 2–3 минуты</p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* ── EA Play Pro (PC) ── */}
          <div className="relative flex flex-col card-base">
            <div className="h-1 rounded-t-2xl" style={{ background: '#FF6B00' }} />
            <div className="flex flex-col flex-1 p-6">
              {/* Title */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[18px] font-semibold font-display" style={{ color: '#FF6B00', fontStyle: 'normal' }}>EA Play Pro</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-4">Только в EA app · ПК</p>

              {/* Switchers — fixed height area for alignment */}
              <div style={{ minHeight: '68px' }}>
              {/* Period switcher */}
              <div className="flex rounded-lg bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-4 w-fit">
                <button
                  onClick={() => setEaProPeriod(1)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    eaProPeriod === 1 ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  1 мес
                </button>
                <button
                  onClick={() => setEaProPeriod(12)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    eaProPeriod === 12 ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  12 мес
                </button>
              </div>
              </div>

              {/* Price */}
              {(() => {
                const proPrice = eaProPeriod === 1 ? 2000 : 12500;
                const periodLabel = eaProPeriod === 1 ? '1 мес' : '12 мес';
                const savings = eaProPeriod === 12 ? 2000 * 12 - 12500 : 0;
                return (
                  <>
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="price-display text-[36px] sm:text-[48px]">{proPrice.toLocaleString('ru-RU')}</span>
                        <span className="text-base text-[var(--text-secondary)]">₽ / {periodLabel}</span>
                      </div>
                      {savings > 0 && (
                        <p className="text-sm text-[var(--success)] font-medium mt-1">Экономия {savings.toLocaleString('ru-RU')} ₽ за год</p>
                      )}
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {['Полные премиум-издания в день выхода', 'Вся библиотека EA без ограничений', 'Скидка 10% на все покупки EA', 'Награды и эксклюзивный контент', 'Только ПК (через EA app и Steam)'].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[15px] text-[var(--text-secondary)]">
                          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="#FF6B00" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleOrder(`EA Play Pro (${periodLabel}, ПК)`, proPrice)}
                      className="btn-primary w-full py-3.5 rounded-xl"
                    >
                      Купить EA Play Pro для ПК
                    </button>
                    <p className="text-xs text-[var(--text-muted)] text-center mt-2">Менеджер ответит за 2–3 минуты</p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* EA Play trust line */}
        <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
          Официальная подписка Electronic Arts. Активация на ваш аккаунт PSN, Xbox или EA за 5 минут
        </p>
      </div>

      {/* ═══ FC Points ═══ */}
      {(() => {
        const fcNominals = [1050, 1600, 2800, 5900, 12000, 18500];
        const fcPrices: Record<string, Record<string, number[]>> = {
          turkey:  { ea: [1400, 1900, 2800, 4500, 8000, 11600],  no: [1500, 2000, 2900, 4900, 8700, 13000] },
          ukraine: { ea: [1700, 2200, 3200, 5300, 8800, 12500],  no: [1800, 2300, 3500, 5800, 9800, 14000] },
        };
        const priceKey = fcEaPlay ? 'ea' : 'no';
        const price = fcPrices[fcRegion][priceKey][fcSelected];
        const nominal = fcNominals[fcSelected];
        const regionLabel = fcRegion === 'turkey' ? 'Турция' : 'Украина';
        const eaLabel = fcEaPlay ? 'с EA Play' : 'без EA Play';

        return (
          <div style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="section-divider" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {/* Grid: 2 rows × 2 cols on desktop; Abel spans both rows */}
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(auto,680px)_300px] gap-x-5 gap-y-0" style={{alignItems: 'stretch'}}>

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
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{borderRadius: 'inherit'}}>
                    {/* Static base border */}
                    <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="14" ry="14" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" pathLength="100" />
                    {/* Animated moving dot */}
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
                    {/* FC Points card — ORIGINAL, untouched */}
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
                        {/* Glow layers */}
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,230,118,0.12), transparent 60%)' }} />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 80%, rgba(139,0,255,0.08), transparent 50%)' }} />
                        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

                        {/* Hit badge */}
                        {fcSelected === 4 && (
                          <span className="absolute z-10 animate-fade-in-up" style={{ top: 34, right: 8, background: 'linear-gradient(135deg, #FF6B00, #FF3D00)', color: '#fff', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 5, letterSpacing: 1, boxShadow: '0 2px 6px rgba(255,61,0,0.25)' }}>Хит</span>
                        )}

                        {/* Green top bar */}
                        <div className="w-full shrink-0 flex items-center justify-center relative z-10" style={{ height: '28px', background: 'linear-gradient(90deg, #00E676, #76FF03, #00E676)', borderRadius: '12px 12px 0 0', boxShadow: '0 2px 12px rgba(0,230,118,0.3)' }}>
                          <span className="font-bold uppercase whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '1px', color: '#000' }}>FC Points</span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center flex-1 relative z-10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/images/covers/fc-points.webp" alt="FC Points" style={{ width: '80px', height: 'auto', paddingTop: '6px', objectFit: 'contain' as const, filter: 'drop-shadow(0 4px 12px rgba(0,230,118,0.35))' }} />
                          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,230,118,0.4), transparent)', margin: '6px auto', boxShadow: '0 0 8px rgba(0,230,118,0.15)' }} />
                          <span className="font-display" style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(180deg, #FFFFFF 0%, #90CAF9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: '0 0 20px rgba(144,202,249,0.2)' }}>{nominal.toLocaleString('ru-RU')}</span>
                        </div>

                        <span className="text-white uppercase shrink-0 relative z-10" style={{ fontSize: '8px', letterSpacing: '3px', opacity: 0.5, marginBottom: '10px' }}>EA Sports FC 26</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 w-full">
                      <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
                        <button onClick={() => { setFcRegion('turkey'); setFcSelected(0); }} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${fcRegion === 'turkey' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                          <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
                          Турция
                        </button>
                        <button onClick={() => { setFcRegion('ukraine'); setFcSelected(0); }} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${fcRegion === 'ukraine' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                          <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
                          Украина
                        </button>
                      </div>

                      <div className="flex rounded-[14px] bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-3 w-fit">
                        <button onClick={() => setFcEaPlay(true)} className={`px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${fcEaPlay ? '' : 'text-[var(--text-secondary)] hover:text-white'}`} style={fcEaPlay ? { background: '#00E676', color: '#000' } : undefined}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/images/platforms/ea-play.png" alt="" style={{ width: 14, height: 14, objectFit: 'contain' as const, borderRadius: 3 }} />
                          С EA Play
                        </button>
                        <button onClick={() => setFcEaPlay(false)} className={`px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${!fcEaPlay ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                          <span className="relative" style={{ width: 14, height: 14 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/platforms/ea-play.png" alt="" style={{ width: 14, height: 14, objectFit: 'contain' as const, borderRadius: 3, opacity: 0.4 }} />
                          </span>
                          Без EA Play
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative w-full sm:w-auto">
                          <select value={fcSelected} onChange={(e) => setFcSelected(Number(e.target.value))} className="cursor-pointer outline-none transition-all w-full sm:w-[220px] appearance-none pr-10 hover:border-[rgba(0,212,255,0.5)]" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '16px', height: '52px' }}>
                            {fcNominals.map((n, i) => (
                              <option key={n} value={i}>{n.toLocaleString('ru-RU')} Points</option>
                            ))}
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                        <span className="price-display text-[32px] sm:text-[36px] whitespace-nowrap" style={{ fontWeight: 800, color: '#00D4FF' }}>{price.toLocaleString('ru-RU')}&nbsp;₽</span>
                      </div>

                      <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                        Официальные FC Points.<br/>
                        Пополнение через турецкий, украинский или индийский аккаунт за 5 минут
                      </p>
                    </div>
                  </div>

                  {/* Кнопка */}
                  <div className="pt-3">
                    <button onClick={() => handleOrder(`FC Points ${nominal} (${regionLabel}, ${eaLabel})`, price)} className="btn-primary w-full py-3.5 rounded-xl">
                      Купить FC Points
                    </button>
                  </div>
                </div>

              </div>
            </div>
            <div className="section-divider" />
          </div>
        );
      })()}

      {/* Messenger Popup */}
      <MessengerPopup
        isOpen={!!popup}
        onClose={() => setPopup(null)}
        planName={popup?.name || ''}
        price={popup?.price || 0}
      />
    </section>
  );
}
