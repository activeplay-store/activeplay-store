'use client';

import { useState } from 'react';

const faqItems = [
  {
    q: 'Это легально? Аккаунт не заблокируют?',
    a: 'Да, полностью легально. Мы используем официальные подписки из турецкого и украинского PlayStation Store. Sony не блокирует аккаунты за региональные покупки — это подтверждено годами работы и тысячами активаций.',
  },
  {
    q: 'Что если подписка не активируется?',
    a: 'Вернём деньги в течение 24 часов. За 4+ года работы процент неудачных активаций — менее 0.5%. Если что-то пойдёт не так, менеджер решит вопрос в реальном времени.',
  },
  {
    q: 'Нужен ли VPN?',
    a: 'Нет. После активации подписка работает на вашем аккаунте без VPN. Все игры скачиваются и запускаются напрямую.',
  },
  {
    q: 'Как происходит оплата?',
    a: 'Переводом по СБП или картой (Сбер, Тинькофф, Альфа). Оплата напрямую менеджеру — без посредников и комиссий.',
  },
  {
    q: 'Сколько времени занимает активация?',
    a: 'В среднем 5 минут. Пишете менеджеру в Telegram или VK, оплачиваете, получаете доступ. Работаем 24/7.',
  },
  {
    q: 'Могу ли я продлить подписку позже?',
    a: 'Да, продление оформляется точно так же — пишете менеджеру, оплачиваете, продлеваем. Многие наши клиенты продлевают уже 2-3 года подряд.',
  },
  {
    q: 'Можно ли активировать на существующий аккаунт?',
    a: 'Да, подписка активируется на ваш текущий PSN или Xbox аккаунт. Создавать новый не нужно. Все ваши игры, сохранения и друзья останутся на месте.',
  },
  {
    q: 'Есть ли автопродление?',
    a: 'Нет, автопродление не подключается. Когда подписка заканчивается, вы сами решаете — продлевать или нет. Напишите менеджеру, и мы продлим за 5 минут.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group transition-colors duration-200 hover:bg-[rgba(0,212,255,0.03)] rounded-lg"
        style={{ padding: '20px 0' }}
      >
        <span className="text-[15px] font-semibold text-white group-hover:text-[var(--brand)] transition-colors">
          {q}
        </span>
        <span
          className="shrink-0 flex items-center justify-center text-sm font-bold transition-all duration-300"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.3)',
            color: 'var(--brand)',
            fontSize: '24px',
            lineHeight: 1,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '300px' : '0',
          opacity: open ? 1 : 0,
        }}
      >
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed pb-5">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative z-10 pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-12">
          Частые вопросы
        </h2>

        <div className="card-base p-6 sm:p-8">
          {faqItems.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
