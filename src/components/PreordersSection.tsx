'use client';

import { useState } from 'react';
import PreorderCard from './PreorderCard';
import MessengerPopup from './MessengerPopup';
import { preorderData } from '@/data/preorders';

const sortedPreorders = [...preorderData].sort((a, b) => {
  if (a.releaseDate && b.releaseDate) return a.releaseDate.localeCompare(b.releaseDate);
  if (a.releaseDate) return -1;
  if (b.releaseDate) return 1;
  return a.name.localeCompare(b.name);
});

export default function PreordersSection() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const [region, setRegion] = useState<'turkey' | 'ukraine'>('turkey');

  return (
    <section id="preorders" className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/platforms/preorders.png" alt="" width={40} height={40} className="w-10 h-10 object-contain mt-1" loading="lazy" decoding="async" />
          <div>
            <h2
              className="text-[26px] sm:text-[32px] md:text-[36px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #ffffff 30%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Предзаказы игр для PS5, PS4 и Xbox
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              Купить игру до релиза по лучшей цене — активация на аккаунт Турции или Украины
            </p>
          </div>
        </div>

        {/* Region switcher */}
        <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden mb-8 w-fit">
          <button
            onClick={() => setRegion('turkey')}
            className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              region === 'turkey'
                ? 'bg-[var(--brand)] text-white'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
            Турция
          </button>
          <button
            onClick={() => setRegion('ukraine')}
            className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              region === 'ukraine'
                ? 'bg-[var(--brand)] text-white'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
            Украина
          </button>
        </div>

        {/* Mobile: horizontal scroll / Desktop: 3-col grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
          {sortedPreorders.map((preorder) => {
            const regionKey = region === 'turkey' ? 'TR' : 'UA';
            const editions = preorder.editions[regionKey] || preorder.editions.TR || [];
            const firstPrice = editions[0]?.clientPrice || 0;
            return (
              <div key={preorder.id} className="snap-start">
                <PreorderCard
                  preorder={preorder}
                  region={region}
                  onOrder={() =>
                    setPopup({
                      name: `Хочу предзаказ ${preorder.name}`,
                      price: firstPrice,
                    })
                  }
                />
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-6 text-center">
          Цены в рублях по курсу ЦБ. Предзаказ и активация на турецкий или украинский PSN-аккаунт PS5 / PS4
        </p>
      </div>

      <MessengerPopup
        isOpen={!!popup}
        onClose={() => setPopup(null)}
        planName={popup?.name || ''}
        price={popup?.price || 0}
      />
    </section>
  );
}
