import Image from 'next/image';

const navLinks = [
  { label: 'Подписки', href: '#subscriptions' },
  { label: 'Игры', href: '#games' },
  { label: 'Предзаказы', href: '#preorders' },
  { label: 'Как это работает', href: '#how-it-works' },
  { label: 'Новости', href: '#news' },
];

const socialLinks = [
  { label: 'Telegram @PS_PLUS_RUS', href: 'https://t.me/PS_PLUS_RUS' },
  { label: 'VK vk.com/activeplay', href: 'https://vk.com/activeplay' },
  { label: 'YouTube @activeplay2023', href: 'https://youtube.com/@activeplay2023' },
];

const paymentMethods = ['СБП', 'Сбер', 'Тинькофф', 'Альфа'];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-[var(--bg-elevated)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & copyright */}
          <div>
            <Image
              src="/images/logo/ActivePlay.png"
              alt="ActivePlay"
              width={140}
              height={36}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-[var(--text-muted)]">
              &copy; 2020–2025 ActivePlay. Будь в игре.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Навигация</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Мы в соцсетях</h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Оплата</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] text-[13px] font-semibold text-[var(--text-secondary)]"
                >
                  {method}
                </span>
              ))}
            </div>
            <div className="space-y-1">
              <a href="#" className="block text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                Публичная оферта
              </a>
              <a href="#" className="block text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                Политика конфиденциальности
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
