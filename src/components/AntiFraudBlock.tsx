const ShieldIcon = () => (
  <svg className="w-8 h-8 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const VKIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.778 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
  </svg>
);

const BotIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>
);

const accounts = [
  { handle: '@activeplay1', href: 'https://t.me/activeplay1' },
  { handle: '@activeplay2', href: 'https://t.me/activeplay2' },
  { handle: '@activeplay3', href: 'https://t.me/activeplay3' },
  { handle: '@activeplay4', href: 'https://t.me/activeplay4' },
];

export default function AntiFraudBlock() {
  return (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-6 sm:p-8 border"
          style={{
            background: 'rgba(6,13,24,0.8)',
            borderColor: 'rgba(245,158,11,0.2)',
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <ShieldIcon />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display" style={{ fontStyle: 'normal' }}>
                Остерегайтесь мошенников
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Мы заботимся о вашей безопасности
              </p>
            </div>
          </div>

          {/* Warning text */}
          <p className="text-sm text-[var(--text-body)] mb-5 leading-relaxed">
            Мы никогда не пишем первыми. Если вам написал кто-то от имени ActivePlay — это мошенник.
          </p>

          {/* Official accounts */}
          <p className="text-sm font-medium text-white mb-3">Наши официальные аккаунты:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {accounts.map((acc) => (
              <a
                key={acc.handle}
                href={acc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--brand)] hover:bg-white/[0.04] transition-colors"
              >
                <TelegramIcon />
                {acc.handle}
              </a>
            ))}
          </div>

          <div className="space-y-2 mb-5">
            <a
              href="https://t.me/ActivePlayTelegramBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--brand)] hover:bg-white/[0.04] transition-colors"
            >
              <BotIcon />
              Бот: @ActivePlayTelegramBot
            </a>
            <a
              href="https://vk.com/activeplay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--brand)] hover:bg-white/[0.04] transition-colors"
            >
              <VKIcon />
              VK: vk.com/activeplay
            </a>
          </div>

          {/* Payment note */}
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Оплату принимаем только по реквизитам, указанным менеджером в переписке.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
