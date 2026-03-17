'use client';

import { useState } from 'react';
import PreorderCard from './PreorderCard';
import MessengerPopup from './MessengerPopup';
import { preorders } from '@/data/preorders';

export default function PreordersSection() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);

  return (
    <section id="preorders" className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text mb-8">
          Предзаказы
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {preorders.map((preorder) => (
            <PreorderCard
              key={preorder.id}
              preorder={preorder}
              onOrder={() =>
                setPopup({
                  name: `${preorder.title} (предзаказ)`,
                  price: preorder.price,
                })
              }
            />
          ))}
        </div>
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
