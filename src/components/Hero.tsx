'use client';

import { useEffect } from 'react';

export default function Hero() {
  useEffect(() => {
    const onScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative flex items-center justify-center pt-28 pb-4 px-4 overflow-hidden">
      {/* Blurred game art background */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: 'url(/images/covers/gta-6.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          filter: 'blur(80px)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Animated gradient mesh — three floating color spots */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            top: '-10%',
            right: '-5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '0%',
            left: '-10%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(0,112,209,0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '30%',
            left: '50%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(107,47,160,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float3 30s ease-in-out infinite',
          }}
        />
      </div>

      {/* Hero background gradient — parallax */}
      <div
        className="absolute inset-0 z-0 hero-parallax-bg"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.10) 0%, rgba(75,45,142,0.06) 50%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 tracking-wide">
          Для российских геймеров с 2020 года
        </p>

        {/* Heading — Rajdhani 700, 52px desktop / 32px mobile */}
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] font-bold leading-tight mb-6 gradient-text">
          PS Plus и Game Pass —
          <br className="hidden sm:block" /> самые низкие цены в России
        </h1>

        {/* Subtitle — Inter 400, 16px */}
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
          Активация за 5 минут, без VPN, без банов.
          <br className="hidden sm:block" /> Цены из официального магазина PS Store.
        </p>

        {/* CTA — Primary button */}
        <a
          href="#subscriptions"
          className="btn-primary text-base sm:text-lg px-8 py-4 rounded-2xl"
        >
          Оформить PS Plus от 690 ₽/мес
        </a>

        {/* Trust line under CTA */}
        <p className="text-sm text-[var(--text-muted)] mt-4">
          Оплата по СБП и картой &bull; Гарантия возврата &bull; Менеджер ответит за 2 минуты
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto">
          {[
            { value: '50 000+', label: 'клиентов' },
            { value: 'С 2020', label: 'года' },
            { value: '5 мин', label: 'оформление' },
            { value: '100%', label: 'гарантия возврата' },
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
          Цены обновлены автоматически
        </div>
      </div>
    </section>
  );
}
