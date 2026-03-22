'use client';

const steps = [
  {
    number: 1,
    label: '01',
    title: 'Выбери подписку или игру',
    description: 'PS Plus, Game Pass, EA Play, карты PSN — выбери нужный товар',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: 2,
    label: '02',
    title: 'Нажми «Оформить» / «Купить»',
    description: 'Выбери мессенджер и напиши менеджеру',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    number: 3,
    label: '03',
    title: 'Оплати в рублях',
    description: 'Переведи через СБП, карту или ЮMoney — без зарубежных карт',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    number: 4,
    label: '04',
    title: 'Играй через 5 мин',
    description: 'Подписка активна, код доставлен — готово',
    highlight: true,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.421 48.421 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 pt-20 pb-20">
      {/* Background glow spots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 20% 40%, rgba(0,212,255,0.06), transparent 50%), radial-gradient(circle at 80% 60%, rgba(0,100,255,0.05), transparent 50%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-14">
          Как купить подписку или пополнить аккаунт
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch">
          {steps.map((step) => {
            const isHighlight = 'highlight' in step && step.highlight;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,212,255,0.06) 0%, rgba(0,0,0,0.2) 100%)',
                  border: isHighlight ? '1px solid rgba(0,212,255,0.35)' : '1px solid rgba(0,212,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: isHighlight
                    ? '0 0 25px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.02)'
                    : '0 0 20px rgba(0,212,255,0.04), inset 0 0 20px rgba(0,212,255,0.02)',
                }}
              >
                {/* Background number */}
                <span
                  className="absolute font-display font-black select-none pointer-events-none"
                  style={{ fontSize: '72px', opacity: 0.07, top: '10px', right: '15px', lineHeight: 1, color: '#fff' }}
                >
                  {step.label}
                </span>

                {/* Icon */}
                <div className="relative z-10 mb-4 flex items-center justify-center gap-1" style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.4))' }}>
                  {step.icon}
                  {isHighlight && <span className="text-lg">&#9889;</span>}
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-[16px] font-semibold text-white mb-2 font-display" style={{ fontStyle: 'normal' }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-[var(--text-secondary)]" style={{ fontSize: '13px', lineHeight: 1.4 }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
