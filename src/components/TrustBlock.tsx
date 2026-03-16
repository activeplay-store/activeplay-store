'use client';

import { useRef } from 'react';
import { reviews } from '@/data/reviews';

const guarantees = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Гарантия возврата',
    text: 'Если подписка не активировалась, вернём деньги за 24 часа',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Оформление за 5 минут',
    text: 'Средняя скорость обработки заказа нашим менеджером',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Безопасная оплата',
    text: 'СБП, Сбер, Тинькофф, Альфа-Банк — проверенные методы',
  },
];

const paymentMethods = ['СБП', 'Сбер', 'Тинькофф', 'Альфа'];

export default function TrustBlock() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative z-10 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text text-center mb-12">
          Почему нам доверяют
        </h2>

        {/* Reviews carousel */}
        <div className="relative mb-12">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 carousel-scroll"
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[300px] sm:w-[340px] rounded-xl bg-[var(--bg-card)] border border-white/[0.06] p-5"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-[var(--text-primary)] mb-4 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{review.author}</span>
                  <span className="text-xs text-[var(--text-muted)]">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
            Реальные отзывы наших клиентов
          </p>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {guarantees.map((g) => (
            <div
              key={g.title}
              className="rounded-xl bg-[var(--bg-card)] border border-white/[0.06] p-6 text-center card-hover"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--primary)]/10 text-[var(--accent)] mb-4">
                {g.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-2">{g.title}</h4>
              <p className="text-sm text-[var(--text-secondary)]">{g.text}</p>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {paymentMethods.map((method) => (
            <div
              key={method}
              className="px-5 py-2.5 rounded-lg bg-[var(--bg-card)] border border-white/[0.06] text-sm font-medium text-[var(--text-secondary)]"
            >
              {method}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
