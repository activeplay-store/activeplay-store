'use client';

import Image from 'next/image';

export default function PromoBanner() {
  const handleOrder = () => {
    window.open('https://t.me/activeplay1', '_blank');
  };

  return (
    <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-auto max-w-7xl rounded-2xl my-4">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/covers/gta-6.png"
          alt="GTA 6"
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,13,24,0.92)] via-[rgba(6,13,24,0.7)] to-[rgba(6,13,24,0.4)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-10 py-8 sm:py-10">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-orange)] text-black mb-3">
            ПРЕДЗАКАЗ
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            GTA 6 — 26 сентября 2025
          </h3>
          <p className="text-[var(--text-secondary)] mt-1">
            Самая ожидаемая игра десятилетия
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            7 990 ₽
          </span>
          <button
            onClick={handleOrder}
            className="btn-primary whitespace-nowrap"
          >
            Предзаказать
          </button>
        </div>
      </div>
    </section>
  );
}
