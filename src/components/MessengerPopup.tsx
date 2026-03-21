'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

// $chatwoot type is declared globally in ChatWidget.tsx

interface MessengerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
}

/**
 * Generate a product code from the human-readable plan name + price.
 * Examples:
 *   "PS Plus Extra (1 мес, Турция)" + 1490 → "psplus_extra_1m_turkey_1490"
 *   "Xbox Game Pass Ultimate (3 мес)" + 3990 → "xbox_gamepass_ultimate_3m_global_3990"
 *   "EA Play (1 год)" + 1990 → "eaplay_basic_12m_global_1990"
 *   "Карта PS Store 1000 TL" + 2900 → "psstore_1000tl_turkey_2900"
 */
function generateProductCode(planName: string, price: number): string {
  const name = planName.toLowerCase();

  // PS Store gift cards: "карта ps store 1000 tl"
  if (name.startsWith('карта ps store')) {
    const nominalMatch = planName.match(/(\d+)\s*(TL|INR|UAH)/i);
    if (nominalMatch) {
      const nominal = nominalMatch[1] + nominalMatch[2].toLowerCase();
      const currencyToRegion: Record<string, string> = { tl: 'turkey', inr: 'india', uah: 'ukraine' };
      const region = currencyToRegion[nominalMatch[2].toLowerCase()] || 'turkey';
      return `psstore_${nominal}_${region}_${price}`;
    }
    return `psstore_card_global_${price}`;
  }

  // EA Play: "ea play (1 год)"
  if (name.startsWith('ea play')) {
    return `eaplay_basic_12m_global_${price}`;
  }

  // PS Plus: "ps plus extra (1 мес, турция)"
  if (name.startsWith('ps plus')) {
    const tierMatch = name.match(/ps plus (\w+)/);
    const tier = tierMatch ? tierMatch[1] : 'essential';
    const periodMatch = name.match(/(\d+)\s*мес/);
    const period = periodMatch ? `${periodMatch[1]}m` : '1m';
    const region = name.includes('украина') ? 'ukraine' : 'turkey';
    return `psplus_${tier}_${period}_${region}_${price}`;
  }

  // Xbox Game Pass: "xbox game pass ultimate (3 мес)"
  if (name.startsWith('xbox game pass')) {
    const tierMatch = name.match(/xbox game pass (\w+)/);
    const tier = tierMatch ? tierMatch[1] : 'core';
    const periodMatch = name.match(/(\d+)\s*мес/);
    const period = periodMatch ? `${periodMatch[1]}m` : '1m';
    return `xbox_gamepass_${tier}_${period}_global_${price}`;
  }

  // Preorders / games: fallback
  return `game_${name.replace(/[^a-zа-я0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')}_${price}`;
}

const telegramIcon = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const vkIcon = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
  </svg>
);

const chatIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

function QuickOrderForm({ product }: { product: string }) {
  const [contactValue, setContactValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!contactValue.trim()) return;
    try {
      await fetch('https://chat.activeplay.games/api/v1/accounts/1/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api_access_token': '9Kw1x6XXKcXQJkY9D7snD2sY' },
        body: JSON.stringify({
          contact: { name: contactValue.trim(), identifier: contactValue.trim() },
          message: { content: `Быстрый заказ с сайта: ${product || 'Общий запрос'} — контакт: ${contactValue.trim()}` },
        }),
      });
      setSubmitted(true);
    } catch {
      window.open('https://t.me/activeplay1', '_blank');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-cyan-400 text-lg font-bold mb-1">Заявка отправлена!</div>
        <p className="text-gray-400 text-sm">Менеджер напишет вам в течение 5 минут</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mt-4 mb-3">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-xs">или оставьте заявку</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-400 text-xs">Менеджер сам напишет вам — укажите куда</p>
        <input
          type="text"
          placeholder="Telegram, VK или номер телефона"
          value={contactValue}
          onChange={(e) => setContactValue(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
        />
        <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors cursor-pointer">
          Отправить заявку
        </button>
      </div>
    </>
  );
}

export default function MessengerPopup({ isOpen, onClose, planName, price }: MessengerPopupProps) {
  if (!isOpen) return null;

  const productCode = generateProductCode(planName, price);
  const humanReadable = `${planName} — ${price.toLocaleString('ru-RU')} \u20BD`;

  const telegramHref = `https://t.me/ActivePlayStoreBot?start=${productCode}`;
  const vkHref = `https://vk.me/activeplay?ref=${productCode}`;

  const openChat = () => {
    onClose();
    // Ensure Chatwoot is loaded before trying to open
    window.loadChatwoot?.();
    setTimeout(() => {
      const cw = window.$chatwoot;
      if (cw) {
        cw.toggle('open');
        const msg = `Хочу оформить: ${humanReadable}`;
        if (typeof cw.sendMessage === 'function') {
          setTimeout(() => cw.sendMessage(msg), 500);
        } else {
          window.dispatchEvent(new CustomEvent('chatwoot:send-message', { detail: { message: msg } }));
        }
      }
    }, 100);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass-card rounded-2xl p-6 sm:p-8 max-w-md w-full animate-fade-in-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-1 font-display" style={{ fontStyle: 'normal' }}>{planName}</h3>
        <p className="price-display text-[28px] !text-[var(--brand)] mb-6">{price.toLocaleString('ru-RU')} ₽</p>

        <div className="space-y-3 mb-6">
          {/* Chat on site */}
          <button
            onClick={openChat}
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-semibold text-black transition-all cursor-pointer"
            style={{ background: '#00E676' }}
          >
            {chatIcon}
            Чат на сайте
          </button>

          {/* Telegram */}
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-semibold text-white transition-all btn-telegram"
          >
            {telegramIcon}
            Telegram
          </a>

          {/* VK */}
          <a
            href={vkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-semibold text-white transition-all btn-vk"
          >
            {vkIcon}
            VK
          </a>
        </div>

        {/* Quick order form */}
        <QuickOrderForm product={humanReadable} />

        {/* Mini timeline */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">✅</span>
            <div>
              <p className="text-sm font-medium text-white">Шаг 1: Напишите менеджеру</p>
              <p className="text-xs text-[var(--text-muted)]">сейчас</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">⏱</span>
            <div>
              <p className="text-sm font-medium text-white">Шаг 2: Оплатите по СБП</p>
              <p className="text-xs text-[var(--text-muted)]">~1 мин</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">🎮</span>
            <div>
              <p className="text-sm font-medium text-white">Шаг 3: Получите подписку</p>
              <p className="text-xs text-[var(--text-muted)]">~3 мин</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          Среднее время от заявки до активации — 5 минут
        </p>
      </div>
    </div>,
    document.body
  );
}
