'use client';

import { useState, useEffect } from 'react';

export default function PromoBadge() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('promo-badge-dismissed');
    if (wasDismissed) return;

    setDismissed(false);
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('promo-badge-dismissed', '1');
  };

  if (dismissed && !visible) return null;

  return (
    <div
      className={`fixed z-40 right-4 sm:right-6 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ bottom: '88px' }}
    >
      <div
        className="relative flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold text-white max-w-[320px]"
        style={{
          background: 'linear-gradient(135deg, #FF9100, #FF6D00)',
          boxShadow: '0 4px 20px rgba(255,109,0,0.3)',
        }}
      >
        <span className="leading-snug">
          🎁 Скидка 150₽ на первый заказ — напиши промокод <strong>FIRST</strong>
        </span>
        <button
          onClick={handleClose}
          className="shrink-0 ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white hover:bg-black/30 transition-colors text-xs"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
