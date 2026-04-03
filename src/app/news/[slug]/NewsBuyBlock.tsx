'use client';

import { useState } from 'react';
import MessengerPopup from '@/components/MessengerPopup';
import type { NewsCta } from '@/data/news-types';

interface Props {
  cta: NewsCta;
}

export default function NewsBuyBlock({ cta }: Props) {
  const [popupOpen, setPopupOpen] = useState(false);

  const numericPrice = typeof cta.price === 'number' ? cta.price : parseInt(String(cta.price).replace(/\D/g, ''), 10) || 0;

  return (
    <>
      <div className="bg-[#0d1f3c] border border-cyan-500/30 rounded-xl p-6 mt-8">
        <h3 className="text-white text-lg font-bold">{cta.title}</h3>
        {cta.description && <p className="text-gray-400 text-sm mt-1">{cta.description}</p>}
        <div className="flex items-center gap-3 mt-3">
          {cta.price && <span className="text-cyan-400 text-2xl font-bold">{typeof cta.price === 'number' ? `${cta.price.toLocaleString('ru-RU')} ₽` : cta.price}</span>}
          {cta.oldPrice && <span className="text-gray-500 line-through text-lg">{typeof cta.oldPrice === 'number' ? `${cta.oldPrice.toLocaleString('ru-RU')} ₽` : cta.oldPrice}</span>}
          {cta.discount && cta.discount > 0 && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-bold">-{cta.discount}%</span>}
        </div>
        <button
          onClick={() => setPopupOpen(true)}
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg px-6 py-3 mt-4 transition-colors cursor-pointer"
        >
          {cta.buttonText || `${cta.title} →`}
        </button>
      </div>

      <MessengerPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        planName={cta.title}
        price={numericPrice}
      />
    </>
  );
}
