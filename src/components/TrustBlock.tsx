'use client';

import { reviews } from '@/data/reviews';

// Telegram icon
const TelegramIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// Duplicate for seamless loop
const doubled = [...reviews, ...reviews];

// Duration: 22 cards × 18s = 396s for one full set to scroll past
const DURATION = `${reviews.length * 18}s`;

export default function TrustBlock() {
  return (
    <section className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-12">
          Почему нам доверяют
        </h2>

        {/* Reviews carousel — always scrolling, no pause */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[var(--bg-base)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[var(--bg-base)] to-transparent" />

          <div
            className="trust-carousel-track flex gap-4 w-max"
            style={{ animation: `trustScroll ${DURATION} linear infinite` }}
          >
            {doubled.map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="flex-shrink-0 w-[300px] sm:w-[340px] card-base p-5 overflow-hidden"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review text — static, clamped to 5 lines max */}
                <p className="text-sm text-[var(--text-body)] mb-4 leading-relaxed line-clamp-5">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center gap-3 mt-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={review.avatarImg}
                    alt={review.author}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white block">{review.author}</span>
                    <span className="text-xs text-[#00D4FF] block">{review.product}</span>
                  </div>
                </div>

                {/* Date + source */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs text-[var(--text-muted)]">{review.date}</span>
                  <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <TelegramIcon />
                    Отзыв из Telegram
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="https://t.me/PS_PLUS_RUS"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tertiary text-sm"
          >
            Читать все отзывы &rarr;
          </a>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Более 500 отзывов в нашем Telegram-канале
          </p>
        </div>
      </div>
    </section>
  );
}
