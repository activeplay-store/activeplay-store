'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, useCallback } from 'react';
import { gamePass, type GamePassTier, type GamePassShowcaseGame } from '@/data/gamepass';
import MessengerPopup from '@/components/MessengerPopup';
import HowItWorks from '@/components/HowItWorks';
import TrustBlock from '@/components/TrustBlock';
import AntiFraudBlock from '@/components/AntiFraudBlock';
import essentialCatalog from '@/data/catalog-gamepass-essential.json';
import premiumCatalog from '@/data/catalog-gamepass-premium.json';
import ultimateCatalog from '@/data/catalog-gamepass-ultimate.json';

function GameCarousel({ games, planName }: { games: GamePassShowcaseGame[]; planName?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  const scroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused.current) return;
    el.scrollLeft += 1;
    // Loop: when scrolled past half (duplicated content), reset
    if (el.scrollLeft >= el.scrollWidth / 2) {
      el.scrollLeft = 0;
    }
  }, []);

  useEffect(() => {
    const id = setInterval(scroll, 30);
    return () => clearInterval(id);
  }, [scroll]);

  // Duplicate games for seamless loop
  const looped = [...games, ...games];

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      style={{ scrollBehavior: 'auto' }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
      onTouchStart={() => { isPaused.current = true; }}
      onTouchEnd={() => { isPaused.current = false; }}
    >
      {looped.map((game, i) => (
        <div key={i} className="flex-shrink-0 w-[180px] sm:w-[200px] group cursor-pointer">
          <div className="relative rounded-xl overflow-hidden aspect-[3/4] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/40">
            <img src={game.image} alt={game.title + (planName ? ' — доступна в Game Pass ' + planName : '')} loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <p className="absolute bottom-2 left-2 right-2 text-sm font-medium text-white">
              {game.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const featureIcons: Record<string, React.ReactNode> = {
  Gamepad2: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5l-3-3m0 0l-3 3m3-3v12M6.75 3h10.5a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0117.25 21H6.75a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 016.75 3z" />
    </svg>
  ),
  Gift: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Globe: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  Library: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.467.89 6.065 2.352m0-14.31A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.352m0-14.31v14.31" />
    </svg>
  ),
  Swords: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75l4.5 4.5m0 0l-4.5 4.5m4.5-4.5h12m-12 0V3.75m0 4.5v4.5M20.25 3.75l-4.5 4.5m4.5-4.5v4.5m0-4.5h-4.5m4.5 12l-4.5-4.5m4.5 4.5v-4.5m0 4.5h-4.5" />
    </svg>
  ),
  Joystick: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
    </svg>
  ),
  Play: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  ),
  Cloud: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  ),
  Tag: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  Star: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
};

const allTiers: GamePassTier[] = ['essential', 'premium', 'ultimate'];

const comparisonFeatures = [
  { label: 'Онлайн-мультиплеер (консоль)', essential: true, premium: true, ultimate: true },
  { label: 'Библиотека 65 игр', essential: true, premium: true, ultimate: true },
  { label: 'Каталог 280 игр', essential: false, premium: true, ultimate: true },
  { label: '500 игр (полный каталог)', essential: false, premium: false, ultimate: true },
  { label: 'Day One релизы (игры в день выхода)', essential: false, premium: false, ultimate: true },
  { label: 'EA Play', essential: false, premium: false, ultimate: true },
  { label: 'Ubisoft+ Classics', essential: false, premium: false, ultimate: true },
  { label: 'PC Game Pass', essential: false, premium: false, ultimate: true },
  { label: 'Облачный гейминг', essential: true, premium: true, ultimate: true },
  { label: 'Облачный 1440p + Smart TV', essential: false, premium: false, ultimate: true },
  { label: 'Скидки в Microsoft Store', essential: true, premium: true, ultimate: true },
];

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

interface GamePassSubscriptionPageProps {
  subscriptionId: GamePassTier;
}

export default function GamePassSubscriptionPage({ subscriptionId }: GamePassSubscriptionPageProps) {
  const plan = gamePass[subscriptionId];
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPlan, setPopupPlan] = useState('');
  const [popupPrice, setPopupPrice] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const catalog = subscriptionId === 'essential' ? essentialCatalog
    : subscriptionId === 'premium' ? premiumCatalog
    : ultimateCatalog;

  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogPlatform, setCatalogPlatform] = useState('all');
  const [catalogExpanded, setCatalogExpanded] = useState(false);

  const openOrder = (planName: string, price: number) => {
    setPopupPlan(planName);
    setPopupPrice(price);
    setPopupOpen(true);
  };

  const heroPrice = plan.prices.global[1];
  const tierAccent = plan.color === '#1E1E1E' ? '#00D4FF' : plan.color;

  const featureIconColors: Record<GamePassTier, { bg: string; text: string }> = {
    essential: { bg: 'rgba(16,124,16,0.15)', text: '#4ade80' },
    premium: { bg: 'rgba(0,120,212,0.15)', text: '#60a5fa' },
    ultimate: { bg: 'rgba(155,77,202,0.15)', text: '#c084fc' },
  };
  const iconColor = featureIconColors[subscriptionId];

  const ctaButtonText: Record<GamePassTier, string> = {
    essential: 'Купить Game Pass Essential',
    premium: 'Купить Game Pass Premium',
    ultimate: 'Купить Game Pass Ultimate',
  };

  const seoH1Subtitle: Record<GamePassTier, string> = {
    essential: ' (бывш. Core) — купить подписку для Xbox и ПК в России',
    premium: ' (бывш. Standard) — купить подписку с каталогом 280 игр для Xbox и ПК',
    ultimate: ' — Day One релизы + EA Play + Fortnite Crew + облачный гейминг 1440p',
  };

  const CtaButton = () => (
    <div className="text-center py-8 px-4 sm:px-6">
      <button
        onClick={() => openOrder(`Game Pass ${plan.name} (1 мес)`, heroPrice)}
        className="btn-primary text-lg px-10 py-4"
      >
        {ctaButtonText[subscriptionId]}
      </button>
    </div>
  );

  const trustBadges = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      text: 'С 2022 года',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      text: '52 000+ клиентов',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'За 5 минут',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      text: 'Поддержка 24/7',
    },
  ];

  const whyActivePlayItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      title: 'С 2022 года',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      title: '52 000+ клиентов',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Активация за 5 минут',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      title: 'Поддержка 24/7',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Безопасно',
    },
  ];

  const WhyActivePlaySection = () => (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">
          Почему покупают Game Pass {plan.name} в ActivePlay
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {whyActivePlayItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl" style={{ background: 'rgba(15,23,42,0.5)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: iconColor.bg, color: iconColor.text }}>
                {item.icon}
              </div>
              <p className="text-sm font-medium text-white">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const HeroSection = () => (
    <section className="relative overflow-hidden border-b border-white/[0.05]" style={{ paddingTop: '112px' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${plan.color}33 0%, transparent 65%), linear-gradient(180deg, #0A1628 0%, #060D18 100%)`,
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pb-8 pt-8 sm:pt-12">
        <img src="/images/platforms/xbox-game-pass.png" alt={`Логотип Game Pass ${plan.name}`} className="h-16 w-auto mx-auto mb-5" />
        <h1 className="text-5xl lg:text-7xl font-bold font-display mb-3" style={{ color: tierAccent }}>
          Game Pass {plan.name}
          <span className="block text-lg sm:text-xl font-normal text-gray-300 mt-2">
            Game Pass {plan.name}{seoH1Subtitle[subscriptionId]}
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
          {plan.description}
        </p>
        <p className="mb-6">
          <span className="price-display text-4xl sm:text-5xl" style={{ color: tierAccent }}>
            {formatPrice(heroPrice)} ₽
          </span>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}> /мес</span>
        </p>
        <button
          onClick={() => openOrder(`Game Pass ${plan.name} (1 мес)`, heroPrice)}
          className="btn-primary text-lg px-10 py-4 mb-4"
        >
          Купить Game Pass {plan.name}
        </button>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Активация за 5 минут &bull; Безопасная оплата &bull; Поддержка 24/7
        </p>
      </div>
    </section>
  );

  const TrustBadgesRow = () => (
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
  );

  const PricingSection = () => (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-2">
          Цены Game Pass {plan.name}{subscriptionId === 'essential' ? ' (бывш. Core)' : subscriptionId === 'premium' ? ' (бывш. Standard)' : ''} — выберите план
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>Xbox &bull; Глобальная подписка — цены в рублях</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {([1, 3, 12] as const).map((period) => {
            const price = plan.prices.global[period];
            const periodLabel = period === 1 ? '1 мес' : period === 3 ? '3 мес' : '12 мес';
            const savings = period === 12 ? plan.prices.global[1] * 12 - plan.prices.global[12] : 0;

            // Badge logic — only 12 months gets a badge
            let badge: string | null = null;
            if (period === 12) badge = 'МАКСИМАЛЬНАЯ ВЫГОДА';

            const hasBadge = !!badge;

            return (
              <div
                key={period}
                className="relative flex flex-col h-full cursor-pointer card-base"
                style={hasBadge ? { borderColor: 'rgba(0,212,255,0.4)' } : undefined}
                onClick={() => openOrder(`Game Pass ${plan.name} (${periodLabel})`, price)}
              >
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold uppercase whitespace-nowrap tracking-wide text-white" style={{ background: '#00D4FF' }}>
                    {badge}
                  </div>
                )}

                <div className="flex flex-col flex-1 justify-between p-6 sm:p-8 text-center">
                  <div>
                    <h3 className="text-base font-medium text-white mb-4" style={{ fontStyle: 'normal' }}>
                      {period === 1 ? '1 месяц' : period === 3 ? '3 месяца' : '12 месяцев'}
                    </h3>
                    <div className="mb-4">
                      <span className="price-display text-4xl sm:text-5xl text-white font-bold">
                        {formatPrice(price)} ₽
                      </span>
                    </div>
                    {savings > 0 && (
                      <p className="text-sm font-medium mb-2" style={{ color: '#4ade80' }}>
                        Экономия {formatPrice(savings)} ₽
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={(e) => { e.stopPropagation(); openOrder(`Game Pass ${plan.name} (${periodLabel})`, price); }}
                      className="btn-primary w-full py-3.5 rounded-xl"
                    >
                      Купить Game Pass {plan.name}
                    </button>
                    <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Менеджер ответит за 2–3 минуты
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Подписка для Xbox Series X|S, Xbox One, ПК{subscriptionId === 'ultimate' ? ', смартфонов и Smart TV' : ''}. Активация на ваш аккаунт Microsoft за 5 минут
        </p>
      </div>
    </section>
  );

  const FeaturesSection = () => (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">
          Что входит в Game Pass {plan.name}{subscriptionId === 'essential' ? ' — все преимущества подписки' : subscriptionId === 'premium' ? ' — 280 игр и Xbox-эксклюзивы' : ' — полный список бонусов на $56/мес'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plan.mainFeatures.map((feat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:border-white/20"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: iconColor.bg, color: iconColor.text }}
              >
                {featureIcons[feat.icon] || featureIcons.Gamepad2}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-[var(--text-muted)] mb-3">Также включено:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {plan.alsoIncludes.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm text-[var(--text-secondary)] bg-white/[0.04] border border-white/[0.08]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const ComparisonSection = () => (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">
          Сравнение Game Pass Essential, Premium и Ultimate — какой тариф выбрать
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left py-3 px-3 text-sm font-medium text-[var(--text-muted)]">Функция</th>
                {allTiers.map((tier) => {
                  const isCurrent = tier === subscriptionId;
                  const tierPlan = gamePass[tier];
                  const tierColors: Record<GamePassTier, string> = { essential: '#4ade80', premium: '#60a5fa', ultimate: '#c084fc' };
                  return (
                    <th key={tier} className="py-3 px-3 text-center" style={isCurrent ? { borderLeft: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)', borderTop: '1px solid rgba(0,212,255,0.3)' } : undefined}>
                      {isCurrent ? (
                        <span className="text-sm font-semibold" style={{ color: tierColors[tier] }}>{tierPlan.name}</span>
                      ) : (
                        <a href={`/${tierPlan.slug}`} className="text-sm font-semibold hover:underline transition-colors" style={{ color: tierColors[tier] }}>
                          {tierPlan.name}
                        </a>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feat, i) => {
                const isLast = i === comparisonFeatures.length - 1;
                return (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-sm text-[var(--text-secondary)]">{feat.label}</td>
                    {allTiers.map((tier) => {
                      const has = feat[tier];
                      const isCurrent = tier === subscriptionId;
                      return (
                        <td
                          key={tier}
                          className="py-3 px-3 text-center"
                          style={isCurrent ? { borderLeft: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)', ...(isLast ? { borderBottom: '1px solid rgba(0,212,255,0.3)' } : {}) } : undefined}
                        >
                          {has ? (
                            <span className="text-[var(--success)] text-base">&#10003;</span>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>&mdash;</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  const GameShowcaseHits = () => (
    <>
      {plan.showcaseGames?.hits && (
        <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">
              Игры в каталоге Game Pass {plan.name}{subscriptionId === 'premium' ? ' — топ-хиты Xbox и ПК' : subscriptionId === 'ultimate' ? ' — Day One хиты и AAA-классика' : ''}
            </h2>
            <GameCarousel games={plan.showcaseGames.hits} planName={plan.name} />

            {/* EA Play carousel — inside same section for Ultimate */}
            {subscriptionId === 'ultimate' && plan.showcaseGames?.dayOneGames && (
              <>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 mt-8">
                  Игры EA Play — в комплекте с Ultimate
                </h3>
                <GameCarousel games={plan.showcaseGames.dayOneGames} planName={plan.name} />
              </>
            )}
          </div>
        </section>
      )}
    </>
  );

  const NewReleasesShowcase = () => {
    if (subscriptionId !== 'premium' && subscriptionId !== 'ultimate') return null;
    if (!plan.showcaseGames?.newReleases) return null;
    return (
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Новые игры Game Pass {plan.name} — {plan.showcaseGames.newReleases.month.toLowerCase()}
          </h3>
          <GameCarousel games={plan.showcaseGames.newReleases.games} planName={plan.name} />
        </div>
      </section>
    );
  };

  const EaPlayShowcase = () => null; // EA Play carousel is now inside GameShowcaseHits for Ultimate

  const FaqSection = () => (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-8">
          Частые вопросы о Game Pass {plan.name}
        </h2>
        <div className="space-y-2">
          {plan.faq.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 min-h-[44px] text-left cursor-pointer transition-colors duration-200 hover:bg-white/[0.05]"
                >
                  <span className="text-base sm:text-lg font-medium text-white pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isOpen ? '500px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-5 pb-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const FinalCtaSection = () => (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">
          Готовы купить <span style={{ color: tierAccent }}>Game Pass {plan.name}</span>?
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Оформление за 5 минут &bull; Поддержка 24/7
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://t.me/activeplay1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 min-h-[48px] py-3 rounded-xl font-semibold text-white btn-telegram hover:brightness-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram
          </a>
          <a
            href="https://vk.com/activeplay"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 min-h-[48px] py-3 rounded-xl font-semibold text-white btn-vk hover:brightness-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
            </svg>
            VK
          </a>
          <button
            onClick={() => openOrder(`Game Pass ${plan.name} (1 мес)`, heroPrice)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 min-h-[48px] py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #00E676, #00C853)', boxShadow: '0 0 20px rgba(0,230,118,0.3)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Чат на сайте
          </button>
        </div>
      </div>
    </section>
  );

  const CatalogSection = () => {
    const filtered = catalog.games.filter((g: { title: string; platform: string[] }) => {
      const matchSearch = !catalogSearch || g.title.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchPlatform = catalogPlatform === 'all' || g.platform.includes(catalogPlatform);
      return matchSearch && matchPlatform;
    });
    const isSearching = catalogSearch.length > 0 || catalogPlatform !== 'all';
    const showExpanded = catalogExpanded || isSearching;

    return (
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6" style={{ background: 'rgba(10,21,37,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-4">
            Полный каталог Game Pass {plan.name} — {catalog.totalGames}+ игр
          </h2>
          <p className="text-sm text-center mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Последнее обновление: {catalog.lastUpdated.split('-').reverse().join('.')}
          </p>
          {subscriptionId === 'premium' && (
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>Каталог обновляется каждые 2 недели. Xbox-эксклюзивы появляются через ~12 месяцев после релиза</p>
          )}
          {subscriptionId === 'ultimate' && (
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>Включает каталоги Game Pass, EA Play и Ubisoft+ Classics. Новые игры каждые 2 недели + Day One релизы</p>
          )}
          {subscriptionId === 'essential' && <div className="mb-7" />}
          <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: 'rgba(15,23,42,0.5)' }}>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Найти игру в каталоге..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl text-sm text-white placeholder-white/30 bg-white/[0.06] border border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <div className="flex gap-2 flex-wrap">
                {['all', 'PC', 'Xbox'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setCatalogPlatform(p)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      catalogPlatform === p ? 'bg-[var(--brand)] text-white' : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]'
                    }`}
                  >
                    {p === 'all' ? 'Все' : p}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Найдено: {filtered.length} игр</p>
          </div>
          <div className="relative">
            <div className="transition-all duration-500 overflow-hidden" style={{ maxHeight: showExpanded ? `${filtered.length * 60}px` : '400px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filtered.map((game: { title: string; platform: string[] }, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <span className="text-sm text-white">{game.title}</span>
                    <div className="flex gap-1 ml-auto shrink-0">
                      {game.platform.map((p: string) => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.08] text-white/50">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!showExpanded && filtered.length > 15 && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a1528] to-transparent pointer-events-none" />
            )}
          </div>
          {!isSearching && filtered.length > 15 && (
            <button
              onClick={() => setCatalogExpanded(!catalogExpanded)}
              className="mt-4 mx-auto block text-sm font-medium text-[var(--brand)] hover:text-cyan-300 transition-colors"
            >
              {catalogExpanded ? 'Свернуть каталог ↑' : `Показать все ${catalog.totalGames} игр ↓`}
            </button>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      {/* 1. Hero */}
      <HeroSection />
      <TrustBadgesRow />
      {/* 2. Как купить */}
      <HowItWorks />
      {/* 3. Выберите план */}
      <PricingSection />
      {/* 4. Что входит */}
      <FeaturesSection />
      {/* 5. Сравнение */}
      <ComparisonSection />
      {/* 6. Game Showcase */}
      <GameShowcaseHits />
      <NewReleasesShowcase />
      <EaPlayShowcase />
      {/* 6.5 Полный каталог */}
      <CatalogSection />
      {/* 7. Почему ActivePlay */}
      <TrustBlock />
      <WhyActivePlaySection />
      <CtaButton />
      {/* 8. FAQ */}
      <FaqSection />
      <AntiFraudBlock />
      {/* 9. Финальный CTA */}
      <FinalCtaSection />
      <MessengerPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        planName={popupPlan}
        price={popupPrice}
      />
    </>
  );
}
