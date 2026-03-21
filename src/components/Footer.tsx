const catalogLinks = [
  { label: 'PS Plus подписки', href: '#subscriptions' },
  { label: 'Xbox Game Pass', href: '#subscriptions' },
  { label: 'EA Play', href: '#subscriptions' },
  { label: 'Игры со скидкой', href: '#games' },
  { label: 'Предзаказы', href: '#preorders' },
];

const infoLinks = [
  { label: 'Как это работает', href: '#how-it-works' },
  { label: 'Новости', href: '#news' },
  { label: 'Публичная оферта', href: '#' },
  { label: 'Политика конфиденциальности', href: '#' },
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
      {/* Top: logo + description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo/AP_WHITE.png"
            alt="ActivePlay"
            style={{ height: '32px', width: 'auto' }}
          />
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Игровые подписки для России с 2022 года
          </p>
        </div>

        {/* Middle: 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Catalog */}
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

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 font-display" style={{ fontStyle: 'normal' }}>Информация</h4>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
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

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 font-display" style={{ fontStyle: 'normal' }}>Мы в соцсетях</h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
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
  );
}
