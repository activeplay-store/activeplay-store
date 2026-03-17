export default function SeoTextBlock() {
  return (
    <section className="relative z-10 pt-16 pb-16" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-10">
          Подписки PlayStation Plus и Xbox Game Pass в&nbsp;России — ActivePlay
        </h2>

        <div className="text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          <h3 className="text-[20px] font-semibold text-white font-display mt-0 mb-3" style={{ fontStyle: 'normal' }}>
            Как купить PS Plus в России в 2025–2026 году
          </h3>
          <p className="mb-6">
            С 2022 года российские пользователи потеряли возможность оплачивать подписки PlayStation Plus
            и Xbox Game Pass напрямую. ActivePlay решает эту проблему — мы оформляем подписки через
            турецкий и украинский регионы PlayStation Store по актуальным ценам. Курс пересчитывается
            автоматически по данным ЦБ РФ каждые 3 часа.
          </p>

          <h3 className="text-[20px] font-semibold text-white font-display mt-8 mb-3" style={{ fontStyle: 'normal' }}>
            Тарифы PS Plus — Essential, Extra и Deluxe
          </h3>
          <p className="mb-6">
            <a href="#ps-essential" className="text-[var(--brand)] hover:underline">PlayStation Plus Essential</a> — базовая подписка с онлайн-мультиплеером и 2–3 бесплатными играми
            каждый месяц. <a href="#ps-extra" className="text-[var(--brand)] hover:underline">PS Plus Extra</a> добавляет каталог из 400+ игр, включая Ubisoft+ Classics и хиты
            дня первого. PS Plus Deluxe — максимальный тариф с классическим каталогом, пробными версиями
            игр и стримингом из облака. Все тарифы доступны на 1, 3 и 12 месяцев.
          </p>

          <h3 className="text-[20px] font-semibold text-white font-display mt-8 mb-3" style={{ fontStyle: 'normal' }}>
            Xbox Game Pass — Core, Standard и Ultimate
          </h3>
          <p className="mb-6">
            Xbox Game Pass Core включает онлайн-мультиплеер и ежемесячные игры. Game Pass Standard
            открывает каталог сотен игр с хитами дня первого. <a href="#xbox-ultimate" className="text-[var(--brand)] hover:underline">Game Pass Ultimate</a> — это полный пакет:
            EA Play, облачный гейминг на любом устройстве и PC Game Pass в комплекте.
          </p>

          <h3 className="text-[20px] font-semibold text-white font-display mt-8 mb-3" style={{ fontStyle: 'normal' }}>
            Почему выбирают ActivePlay
          </h3>
          <p className="mb-6">
            Мы работаем с 2020 года. Среднее время оформления подписки — 5 минут. Оплата по СБП или
            картой любого российского банка. Гарантия возврата средств если подписка не активировалась.
            Поддержка 24/7 в Telegram и VK.
          </p>

          <h3 className="text-[20px] font-semibold text-white font-display mt-8 mb-3" style={{ fontStyle: 'normal' }}>
            Безопасность и легальность
          </h3>
          <p>
            Мы используем официальные подписки из турецкого и украинского PlayStation Store. Sony не
            блокирует аккаунты за региональные покупки. Подписка активируется на ваш существующий PSN
            или Xbox аккаунт, VPN не требуется.
          </p>
        </div>
      </div>
    </section>
  );
}
