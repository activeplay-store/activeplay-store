'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import PlanCard from './PlanCard';
import MessengerPopup from './MessengerPopup';
import { psPlans, xboxPlans } from '@/data/subscriptions';
import type { Region, Period } from '@/data/subscriptions';
import { giftcards } from '@/data/giftcards';
import type { CardRegion } from '@/data/giftcards';

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
  const [psPeriod, setPsPeriod] = useState<Period>(1);
  const [cardRegion, setCardRegion] = useState<CardRegion>('turkey');
  const [selectedCard, setSelectedCard] = useState(0);
  const [xboxPeriod, setXboxPeriod] = useState<Period>(1);
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
            width={48}
            height={48}
            className="h-10 w-auto"
          />
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">
            PlayStation Plus
          </h2>
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
              onClick={() => setPsRegion('ukraine')}
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
            {periods.map((p) => (
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
            ))}
          </div>

          {psPeriod === 12 && (
            <span className="text-sm text-[var(--success)] font-medium">
              −35% от месячной цены
            </span>
          )}
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
            />
          ))}
        </div>
        <DotIndicators count={psPlans.length} active={psIndex} />

        {/* PS Plus trust line */}
        <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
          Все подписки — официальные. Активация на ваш существующий PSN-аккаунт
        </p>
      </div>

      {/* ═══ Карты пополнения PS Store ═══ */}
      <div style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '60px 0' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/images/platforms/playstation.png"
                alt="PlayStation Store"
                width={48}
                height={36}
                style={{ height: '36px', width: 'auto' }}
              />
              <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">
                Карты пополнения PS Store
              </h2>
            </div>

            {/* Region switcher */}
            <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-8 w-fit">
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
              <button
                onClick={() => { setCardRegion('ukraine'); setSelectedCard(0); }}
                className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  cardRegion === 'ukraine' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
                Украина
              </button>
            </div>

            {/* Dropdown + price + buy */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(Number(e.target.value))}
                className="cursor-pointer outline-none transition-colors focus:!border-[#00D4FF] w-full sm:w-auto"
                style={{
                  background: '#0C1A2E',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '18px',
                  height: '48px',
                  width: '200px',
                }}
              >
                {giftcards[cardRegion].map((card, i) => (
                  <option key={card.nominal} value={i}>{card.nominal}</option>
                ))}
              </select>

              <span className="price-display text-[36px] whitespace-nowrap" style={{ fontWeight: 800, color: '#00D4FF' }}>
                {giftcards[cardRegion][selectedCard]?.price.toLocaleString('ru-RU')}&nbsp;₽
              </span>

              <button
                onClick={() => {
                  const card = giftcards[cardRegion][selectedCard];
                  if (card) handleOrder(`Карта PS Store ${card.nominal}`, card.price);
                }}
                className="btn-primary whitespace-nowrap w-full sm:w-auto"
                style={{ height: '48px' }}
              >
                Купить
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-4">
              Официальные коды. Моментальная активация на PSN-аккаунт
            </p>
          </div>
        </div>
        <div className="section-divider" />
      </div>

      {/* ═══ Xbox Game Pass ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/images/platforms/xbox-game-pass.png"
            alt="Xbox Game Pass"
            width={48}
            height={48}
            className="h-10 w-auto"
          />
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text">
            Xbox Game Pass
          </h2>
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
            />
          ))}
        </div>
        <DotIndicators count={xboxPlans.length} active={xboxIndex} />

        {/* Xbox trust line */}
        <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
          Один регион, одна цена — выгоднее не найти
        </p>
      </div>

      {/* ═══ EA Play ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[var(--bg-card)] border border-white/[0.06] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/platforms/ea-play.png"
              alt="EA Play"
              width={52}
              height={52}
              className="rounded-xl"
              style={{ width: '52px', height: '52px' }}
            />
            <div>
              <h3 className="text-lg font-semibold text-white font-display" style={{ fontStyle: 'normal' }}>EA Play</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                FIFA, Battlefield, Need for Speed, The Sims и сотни других
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="price-display text-[28px] sm:text-[32px]">1 990 ₽/год</span>
            <button
              onClick={() => handleOrder('EA Play (1 год)', 1990)}
              className="btn-primary whitespace-nowrap"
            >
              Оформить
            </button>
          </div>
        </div>
      </div>

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
