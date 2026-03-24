'use client';

import { useState, useEffect } from 'react';
import MessengerPopup from '@/components/MessengerPopup';

const catalogLinks = [
  { label: 'PS Plus подписки', href: '/ps-plus-essential' },
  { label: 'Xbox Game Pass', href: '/#xbox' },
  { label: 'EA Play', href: '/ea-play' },
  { label: 'Игровая валюта', href: '/igrovaya-valyuta' },
  { label: 'Игры со скидкой', href: '/sale' },
  { label: 'Предзаказы', href: '/#preorders' },
];

const iconTelegram = <svg className="shrink-0" width="18" height="18" fill="#00D4FF" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>;
const iconVK = <svg className="shrink-0" width="18" height="18" fill="#00D4FF" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>;
const iconYoutube = <svg className="shrink-0" width="18" height="18" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
const iconChat = <svg className="shrink-0" width="18" height="18" fill="none" stroke="#00D4FF" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;

const socialItems = [
  { label: 'Telegram @PS_PLUS_RUS', href: 'https://t.me/PS_PLUS_RUS', icon: iconTelegram },
  { label: 'VK vk.com/activeplay', href: 'https://vk.com/activeplay', icon: iconVK },
  { label: 'YouTube @activeplay2023', href: 'https://youtube.com/@activeplay2023', icon: iconYoutube },
];

const paymentMethods = ['СБП', 'Сбер', 'Тинькофф', 'Альфа'];

function WorkStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const check = () => {
      const msk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
      const h = msk.getHours();
      const m = msk.getMinutes();
      setOnline((h > 9 || (h === 9 && m >= 0)) && (h < 23 || (h === 23 && m <= 30)));
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${online ? 'bg-green-500' : 'bg-gray-500'}`} />;
}

export default function Footer() {
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);

  const openChat = () => {
    window.loadChatwoot?.();
    setTimeout(() => {
      window.$chatwoot?.toggle('open');
    }, 100);
  };

  return (
    <>
      <footer className="relative z-10 border-t border-white/[0.06] bg-[var(--bg-elevated)]">
        {/* Top: logo + description */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/AP_WHITE.png"
              alt="ActivePlay"
              style={{ height: '80px', width: 'auto' }}
            />
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              Игровой магазин подписок и цифровых товаров с 2022 года
            </p>
          </div>

          {/* Middle: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {/* Каталог */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 font-display" style={{ fontStyle: 'normal' }}>Каталог</h4>
              <ul className="space-y-2">
                {catalogLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Покупателю */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 font-display" style={{ fontStyle: 'normal' }}>Покупателю</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/#how-it-works" className="text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">
                    Как купить подписку
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setPopup({ name: 'Создание аккаунта PlayStation', price: 500 })}
                    className="text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors cursor-pointer text-left"
                  >
                    Создать аккаунт PlayStation
                  </button>
                </li>
                <li>
                  <a href="/#faq" className="text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/#reviews" className="text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">
                    Отзывы клиентов
                  </a>
                </li>
              </ul>
            </div>

            {/* Связаться с нами */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 font-display" style={{ fontStyle: 'normal' }}>Связаться с нами</h4>
              <ul className="space-y-2">
                {socialItems.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    onClick={openChat}
                    className="flex items-center gap-2 text-[14px] leading-relaxed transition-colors cursor-pointer text-left"
                    style={{ color: '#00D4FF' }}
                  >
                    {iconChat}
                    Чат на сайте
                  </button>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                    <WorkStatus />
                    График работы: 9:00–23:30 (МСК)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[14px] text-[var(--text-secondary)]">
              &copy; 2022&ndash;2026 ActivePlay. Будь в игре.
            </p>
            <div className="flex items-center gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-3 py-1 rounded-md bg-white/[0.06] text-[13px] font-semibold text-[var(--text-secondary)]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <MessengerPopup isOpen={!!popup} onClose={() => setPopup(null)} planName={popup?.name || ''} price={popup?.price || 0} />
    </>
  );
}
