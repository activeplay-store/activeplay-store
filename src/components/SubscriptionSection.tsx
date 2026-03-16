'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import PlanCard from './PlanCard';
import MessengerPopup from './MessengerPopup';
import { psPlans, xboxPlans } from '@/data/subscriptions';
import type { Region, Period } from '@/data/subscriptions';

function DotIndicators({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex justify-center gap-2 mt-4 sm:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full transition-all ${
            i === active ? 'bg-[var(--accent)] w-4' : 'bg-white/20'
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
    <section id="subscriptions" className="relative z-10 pt-12 pb-10">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">
            PlayStation Plus
          </h2>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Region switcher */}
          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden">
            {([
              { value: 'turkey' as Region, label: '🇹🇷 Турция' },
              { value: 'ukraine' as Region, label: '🇺🇦 Украина' },
            ]).map((r) => (
              <button
                key={r.value}
                onClick={() => setPsRegion(r.value)}
                className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  psRegion === r.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Period switcher */}
          <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPsPeriod(p.value)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  psPeriod === p.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {p.label}
                {p.value === 12 && (
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-green)] text-black">
                    ВЫГОДНО
                  </span>
                )}
              </button>
            ))}
          </div>

          {psPeriod === 12 && (
            <span className="text-sm text-[var(--accent-green)] font-medium">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">
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
                className={`relative px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  xboxPeriod === p.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {p.label}
                {p.value === 12 && (
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-green)] text-black">
                    ВЫГОДНО
                  </span>
                )}
              </button>
            ))}
          </div>

          {xboxPeriod === 12 && (
            <span className="text-sm text-[var(--accent-green)] font-medium">
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
      </div>

      {/* ═══ EA Play ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[var(--bg-card)] border border-white/[0.06] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/platforms/ea-play.png"
              alt="EA Play"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
            <div>
              <h3 className="text-lg font-bold text-white" style={{ fontStyle: 'normal' }}>EA Play</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                FIFA, Battlefield, Need for Speed, The Sims и сотни других
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-extrabold text-white tabular-nums">1 990 ₽/год</span>
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
