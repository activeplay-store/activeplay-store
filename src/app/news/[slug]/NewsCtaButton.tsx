'use client';

import { useState } from 'react';
import MessengerPopup from '@/components/MessengerPopup';
import type { NewsCta } from '@/data/news-types';

interface Props {
  cta: NewsCta;
}

export default function NewsCtaButton({ cta }: Props) {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);

  const priceNum = typeof cta.price === 'number' ? cta.price : parseInt(String(cta.price || 0), 10) || 0;
  const label = cta.buttonText || (priceNum > 0 ? `Купить за ${priceNum} ₽` : cta.title);

  return (
    <>
      <button
        type="button"
        onClick={() => setPopup({ name: cta.title, price: priceNum })}
        className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg px-6 py-3 mt-4 transition-colors cursor-pointer"
      >
        {label}
      </button>
      <MessengerPopup
        isOpen={!!popup}
        planName={popup?.name || ''}
        price={popup?.price || 0}
        onClose={() => setPopup(null)}
      />
    </>
  );
}
