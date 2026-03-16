'use client';

import { useState } from 'react';
import Image from 'next/image';

const navLinks = [
  { label: 'Подписки', href: '#subscriptions' },
  { label: 'Игры', href: '#games' },
  { label: 'Предзаказы', href: '#preorders' },
  { label: 'Как это работает', href: '#how-it-works' },
  { label: 'Новости', href: '#news' },
];

const messengerLinks = [
  {
    name: 'Telegram',
    href: 'https://t.me/activeplay1',
    className: 'btn-telegram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    name: 'VK',
    href: 'https://vk.com/activeplay',
    className: 'btn-vk',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
      </svg>
    ),
  },
  {
    name: 'Max',
    href: '#',
    className: 'btn-secondary',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    ),
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            {logoError ? (
              <span className="text-xl font-extrabold" style={{ fontStyle: 'normal' }}>
                <span className="text-white">ACTIVE</span>
                <span className="text-[var(--accent)]">PLAY</span>
              </span>
            ) : (
              <Image
                src="/images/logo/ActivePlay.png"
                alt="ActivePlay"
                width={140}
                height={36}
                className="h-9 w-auto"
                priority
                onError={() => setLogoError(true)}
              />
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Contact Button */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setContactOpen(!contactOpen)}
              className="btn-secondary text-sm"
            >
              Написать нам ▾
            </button>
            {/* Contact Modal Overlay */}
            {contactOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setContactOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 rounded-xl glass-card p-3 shadow-2xl z-50">
                  <p className="text-xs text-[var(--text-muted)] mb-2 px-2">Выберите мессенджер</p>
                  <div className="space-y-2">
                    {messengerLinks.map((m) => (
                      <a
                        key={m.name}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all ${m.className}`}
                        onClick={() => setContactOpen(false)}
                      >
                        {m.icon}
                        {m.name}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile: Contact + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => { setContactOpen(!contactOpen); setMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-sm font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              Написать
            </button>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => { setMenuOpen(!menuOpen); setContactOpen(false); }}
              aria-label="Меню"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Contact Modal */}
      {contactOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setContactOpen(false)} />
          <div className="fixed top-20 left-4 right-4 z-50 glass-card rounded-2xl p-5 shadow-2xl animate-fade-in-up">
            <p className="text-sm text-[var(--text-secondary)] mb-3">Выберите мессенджер для связи:</p>
            <div className="space-y-2.5">
              {messengerLinks.map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-bold text-white transition-all ${m.className}`}
                  onClick={() => setContactOpen(false)}
                >
                  {m.icon}
                  {m.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden glass border-t border-white/[0.06]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
