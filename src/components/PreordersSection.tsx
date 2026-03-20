'use client';

import { useState } from 'react';
import PreorderCard from './PreorderCard';
import MessengerPopup from './MessengerPopup';
import { preorders } from '@/data/preorders';

const sortedPreorders = [...preorders].sort(
  (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
);

export default function PreordersSection() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);

  return (
    <section id="preorders" className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-[26px] sm:text-[32px] md:text-[36px] font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #ffffff 30%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Предзаказы игр для PS5, PS4 и Xbox
        </h2>
        <p className="text-[var(--text-secondary)] mb-10">
          Купить игру до релиза по лучшей цене — активация на аккаунт Турции, Украины или Индии
        </p>

        {/* Mobile: horizontal scroll / Desktop: 3-col grid with equal height */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
          {sortedPreorders.map((preorder) => (
            <div key={preorder.id} className="snap-start">
              <PreorderCard
                preorder={preorder}
                onOrder={() =>
                  setPopup({
                    name: `Хочу предзаказ ${preorder.title}`,
                    price: preorder.editions[0].priceRUB_TR,
                  })
                }
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-6 text-center">
          Цены в рублях по курсу ЦБ. Предзаказ и активация на турецкий PSN-аккаунт PS5 / PS4
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
