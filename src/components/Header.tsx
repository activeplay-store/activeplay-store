'use client';

import { useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';

const megaMenuColumns = [
  {
    title: 'PlayStation',
    items: [
      { label: 'PS Plus Essential', href: '/ps-plus-essential' },
      { label: 'PS Plus Extra', href: '/ps-plus-extra' },
      { label: 'PS Plus Deluxe', href: '/ps-plus-deluxe' },
      { label: 'EA Play', href: '/ea-play' },
      { label: 'Карты PSN', href: '/#psn-cards' },
    ],
  },
  {
    title: 'Xbox',
    items: [
      { label: 'Game Pass Essential', href: '/xbox-game-pass-essential' },
      { label: 'Game Pass Premium', href: '/xbox-game-pass-premium' },
      { label: 'Game Pass Ultimate', href: '/xbox-game-pass-ultimate' },
    ],
  },
  {
    title: 'Игры',
    items: [
      { label: 'Предзаказы', href: '/#preorders' },
      { label: 'Горящие новинки', href: '/#hot-releases' },
      { label: 'Топ продаж', href: '/#top-sales' },
      { label: 'Скидки PS Store', href: '/sale' },
      { label: 'Игровая валюта', href: '/igrovaya-valyuta' },
    ],
  },
];

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '#subscriptions', hasSubmenu: true },
  { label: 'Новости', href: '/news' },
  { label: 'Гайды', href: '/guides' },
  { label: 'FAQ', href: '#faq' },
];

const messengerLinks = [
  {
    name: 'Чат на сайте',
    href: '#',
    isChat: true,
    className: 'bg-[#00E676] text-black hover:brightness-110',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me/activeplay2',
    className: 'btn-telegram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    name: 'VK',
    href: 'https://vk.com/im?sel=-214354347',
    className: 'btn-vk',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
      </svg>
    ),
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [mobileSubsOpen, setMobileSubsOpen] = useState(false);
  const activeSection = useActiveSection();

  const subscriptionSections = ['subscriptions', 'how-it-works'];
  const isSubsActive = subscriptionSections.includes(activeSection);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]" style={{ height: '100px' }}>
      <div className="max-w-7xl mx-auto h-full" style={{ padding: '0 40px' }}>
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/AP_WHITE.png"
              alt="ActivePlay"
              style={{ height: '90px', width: 'auto', objectFit: 'contain' }}
            />
          </a>

          {/* Desktop Nav — Tertiary style */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.hasSubmenu ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setSubsOpen(true)}
                  onMouseLeave={() => setSubsOpen(false)}
                >
                  <button
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${isSubsActive ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)] hover:text-[var(--brand)]'}`}
                  >
                    {link.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${subsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {subsOpen && (
                    <div className="absolute top-full -left-4 pt-2 z-50">
                      <div className="rounded-xl border border-cyan-500/10 p-6 shadow-2xl grid grid-cols-3 gap-8" style={{ background: '#0a1628', minWidth: '480px' }}>
                        {megaMenuColumns.map((col) => (
                          <div key={col.title}>
                            <h4 className="text-cyan-400 text-xs uppercase tracking-wider font-bold mb-3">{col.title}</h4>
                            <div className="flex flex-col gap-2">
                              {col.items.map((item) => (
                                <a key={item.label} href={item.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    (link.href === '#faq' && activeSection === 'faq') || (link.href === '/' && !activeSection)
                      ? 'text-[var(--brand)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--brand)]'
                  }`}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop Contact Button — Secondary */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setContactOpen(!contactOpen)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Написать нам
            </button>
            {/* Contact Modal Overlay */}
            {contactOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setContactOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 rounded-xl glass-card p-3 shadow-2xl z-50">
                  <div className="space-y-2">
                    {messengerLinks.map((m) =>
                      m.isChat ? (
                        <button
                          key={m.name}
                          onClick={() => { setContactOpen(false); window.loadChatwoot?.(); setTimeout(() => window.$chatwoot?.toggle('open'), 100); }}
                          className={`flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${m.className}`}
                        >
                          {m.icon}
                          {m.name}
                        </button>
                      ) : (
                        <a
                          key={m.name}
                          href={m.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all ${m.className}`}
                          onClick={() => setContactOpen(false)}
                        >
                          {m.icon}
                          {m.name}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile: Contact + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => { setContactOpen(!contactOpen); setMenuOpen(false); }}
              className="btn-secondary text-sm py-2 px-3"
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
            <div className="space-y-2.5">
              {messengerLinks.map((m) =>
                m.isChat ? (
                  <button
                    key={m.name}
                    onClick={() => { setContactOpen(false); window.loadChatwoot?.(); setTimeout(() => window.$chatwoot?.toggle('open'), 100); }}
                    className={`flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${m.className}`}
                  >
                    {m.icon}
                    {m.name}
                  </button>
                ) : (
                  <a
                    key={m.name}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all ${m.className}`}
                    onClick={() => setContactOpen(false)}
                  >
                    {m.icon}
                    {m.name}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden glass border-t border-white/[0.06]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.hasSubmenu ? (
                <div key={link.href}>
                  <button
                    onClick={() => setMobileSubsOpen(!mobileSubsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[var(--text-body)] hover:bg-white/5 hover:text-[var(--brand)] transition-colors"
                  >
                    {link.label}
                    <svg className={`w-4 h-4 transition-transform ${mobileSubsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileSubsOpen && (
                    <div className="ml-4 space-y-3 mt-2">
                      {megaMenuColumns.map((col) => (
                        <div key={col.title}>
                          <h4 className="text-cyan-400 text-xs uppercase tracking-wider font-bold mb-1">{col.title}</h4>
                          {col.items.map((item) => (
                            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="block px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors">
                              {item.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-lg text-[var(--text-body)] hover:bg-white/5 hover:text-[var(--brand)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
