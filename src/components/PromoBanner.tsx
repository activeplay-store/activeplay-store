'use client';

export default function PromoBanner() {
  const handleOrder = () => {
    window.open('https://t.me/activeplay1', '_blank');
  };

  return (
    <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-auto max-w-7xl rounded-2xl my-6" style={{ maxHeight: '160px' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/covers/gta-6.png"
          alt="GTA 6"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,13,24,0.92)] via-[rgba(6,13,24,0.7)] to-[rgba(6,13,24,0.4)]" />
      </div>

      {/* Content — compact promo strip */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 sm:px-8 py-5 sm:py-6">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--warning)] text-black mb-2 tracking-wide">
            ПРЕДЗАКАЗ
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white font-display" style={{ fontStyle: 'normal' }}>
            GTA 6 — 26 сентября 2025
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Самая ожидаемая игра десятилетия
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="price-display text-[24px] sm:text-[28px]">
            7 990 ₽
          </span>
          <button
            onClick={handleOrder}
            className="btn-primary whitespace-nowrap text-sm px-5 py-2.5"
          >
            Предзаказать
          </button>
        </div>
      </div>
    </section>
  );
}
