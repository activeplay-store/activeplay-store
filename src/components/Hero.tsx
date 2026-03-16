export default function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-28 pb-10 px-4 overflow-hidden">
      {/* Hero background gradient */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,112,209,0.12) 0%, rgba(75,45,142,0.06) 50%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 tracking-wide">
          Для российских геймеров с 2020 года
        </p>

        {/* Heading */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight mb-6 gradient-text"
        >
          Подписки PlayStation Plus
          <br className="hidden sm:block" /> и Xbox Game Pass для России
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
          Актуальные цены из турецкого PS Store. Автообновление курса каждые 3 часа.
          <br className="hidden sm:block" /> Оформление за 5 минут.
        </p>

        {/* CTA */}
        <a
          href="#subscriptions"
          className="btn-primary text-base sm:text-lg px-8 py-4 rounded-2xl"
        >
          Оформить подписку от 690 ₽/мес
        </a>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-[var(--text-secondary)]">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Оплата по СБП
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            5 мин оформление
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Гарантия возврата
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto">
          {[
            { value: '4+', label: 'года работы' },
            { value: '3 100+', label: 'клиентов' },
            { value: '5 мин', label: 'оформление' },
            { value: '24/7', label: 'поддержка' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl px-4 py-4 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">{stat.value}</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Price update indicator */}
        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-[var(--text-muted)]">
          <span className="pulse-dot" />
          Цены обновлены автоматически — курс ЦБ РФ
        </div>
      </div>
    </section>
  );
}
