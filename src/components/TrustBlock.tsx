'use client';

import { useRef } from 'react';
import { reviews } from '@/data/reviews';

// Telegram icon
const TelegramIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// VK icon
const VKIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
  </svg>
);

export default function TrustBlock() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-12">
          Почему нам доверяют
        </h2>

        {/* Reviews carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 carousel-scroll"
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[300px] sm:w-[340px] card-base p-5"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-[var(--text-body)] mb-4 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center gap-3">
                  {/* Avatar — realistic photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={review.avatarImg}
                    alt={review.author}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white block">{review.author}</span>
                    <span className="text-xs text-[var(--brand)] block">{review.product}</span>
                  </div>
                </div>

                {/* Date + source */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs text-[var(--text-muted)]">{review.date}</span>
                  <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    {review.source === 'Telegram' ? <TelegramIcon /> : <VKIcon />}
                    Отзыв из {review.source}
                  </span>
                </div>
              </div>
            ))}
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
      </div>
    </section>
  );
}
