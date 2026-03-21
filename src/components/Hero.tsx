'use client';

import { useState, useEffect } from 'react';
import MessengerPopup from './MessengerPopup';

export default function Hero() {
  const [popup, setPopup] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative flex items-center justify-center pt-28 pb-4 px-4 overflow-hidden" style={{ background: 'radial-gradient(ellipse 70% 50% at 75% 20%, rgba(0,212,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(0,112,209,0.06) 0%, transparent 60%), #0A1628' }}>
      {/* Animated gradient mesh — floating color spots */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            top: '-10%',
            right: '-5%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-5%',
            left: '-10%',
            width: '550px',
            height: '550px',
            background: 'radial-gradient(circle, rgba(0,112,209,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float2 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '30%',
            left: '50%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(107,47,160,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float3 28s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 tracking-wide">
          Игровой магазин подписок и цифровых товаров
        </p>

        {/* Heading — Rajdhani 700, 52px desktop / 32px mobile */}
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] font-bold leading-tight mb-6 gradient-text">
          PS Plus и Game Pass —
          <br className="hidden sm:block" /> купить по самой низкой цене в России
        </h1>

        {/* Subtitle — Inter 400, 16px */}
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          Активация за 5 минут · Без VPN · Без банов · Оплата в рублях через СБП
        </p>

        {/* CTA — Primary button */}
        <button
          onClick={() => setPopup(true)}
          className="btn-primary btn-pulse text-base sm:text-lg px-8 py-4 rounded-2xl"
        >
          Оформить заказ
        </button>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto">
          {[
            { value: 'С 2022', label: 'года' },
            { value: '50 000+', label: 'клиентов' },
            { value: '5 мин', label: 'оформление' },
            { value: 'Гарантия', label: 'активации' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl px-4 py-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums font-display">{stat.value}</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Price update indicator */}
        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-[var(--text-muted)]">
          <span className="pulse-dot" />
          Цены обновляются автоматически
        </div>
      </div>

      <MessengerPopup
        isOpen={popup}
        onClose={() => setPopup(false)}
        planName="Заказ с главной"
        price={0}
      />
    </section>
  );
}
