// src/app/guides/kak-kupit-ps-plus-iz-rossii/page.tsx
// Гайд №1: Как купить PS Plus из России
// ActivePlay — activeplay.games

import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Как купить PS Plus из России — пошаговая инструкция | ActivePlay',
  description: 'Как купить и активировать подписку ПС Плюс из России через турецкий или украинский аккаунт. Оплата через СБП, карту Мир. Цены, инструкция, подводные камни.',
  openGraph: {
    title: 'Как купить PS Plus из России — пошаговая инструкция',
    description: 'Полный гайд по покупке PlayStation Plus из России. Выбор региона, создание аккаунта, активация подписки. Цены от 1 250 ₽/мес.',
    type: 'article',
    url: 'https://activeplay.games/guides/kak-kupit-ps-plus-iz-rossii',
    siteName: 'ActivePlay',
  },
};

/* flag emoji as constants to avoid Windows/CI encoding issues */
const FLAG_TR = '\u{1F1F9}\u{1F1F7}';
const FLAG_UA = '\u{1F1FA}\u{1F1E6}';
const FLAG_IN = '\u{1F1EE}\u{1F1F3}';

export default function GuidePSPlus() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <article className="min-h-screen bg-[#0A1628]">

          {/* ===== HERO ===== */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0a2a4a] to-[#0070D1]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,212,255,0.12)_0%,transparent_70%)]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(0,112,209,0.15)_0%,transparent_70%)]" />

            <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
              {/* Хлебные крошки */}
              <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
                <a href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</a>
                <span>/</span>
                <a href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</a>
                <span>/</span>
                <span className="text-white/60">PS Plus из России</span>
              </nav>

              <span className="inline-block bg-[#0070D1]/30 text-[#00D4FF] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#00D4FF]/20 mb-6">
                PlayStation
              </span>

              <h1 className="font-rajdhani text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Как купить <span className="text-[#00D4FF]">PS Plus</span> из России
              </h1>

              <p className="text-lg text-white/60 max-w-xl leading-relaxed mb-8">
                Полный гайд по покупке и активации подписки PlayStation Plus.
                Выбор региона, создание аккаунта, оплата через СБП.
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-white/40">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  7 мин чтения
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  PS Plus, подписка, СБП
                </span>
              </div>
            </div>
          </section>

          {/* ===== CONTENT ===== */}
          <div className="max-w-3xl mx-auto px-6 pb-20">

            {/* --- Вступление --- */}
            <div className="py-12 border-b border-white/5">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                PS Store в России заморожен с марта 2022 года. Sony ушла, ликвидировала юрлицо, убрала страну из списка.
                Российские карты не принимаются — ни Visa, ни Mastercard, ни «Мир».
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Но подписка ПС Плюс по-прежнему доступна. Нужен аккаунт в другом регионе и
                специалисты, которые помогут с активацией. Сама по себе покупка карты пополнения
                ничего не решает — об этом ниже.
              </p>

              {/* Callout — главное заблуждение */}
              <div className="bg-[#EF9F27]/[0.07] border-l-[3px] border-[#EF9F27] rounded-r-xl p-5 my-8">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#EF9F27]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span className="text-[#EF9F27] font-semibold text-sm">Главное заблуждение</span>
                </div>
                <p className="text-[#FAC775] text-sm leading-relaxed">
                  Пополнил кошелёк — подписка твоя? Нет. Sony проверяет IP-адрес.
                  Из России активировать PS Plus нельзя, даже если деньги на балансе есть.
                  Именно на этом спотыкаются тысячи людей, начитавшись устаревших гайдов.
                </p>
              </div>
            </div>

            {/* --- Регионы --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-2">
                Какой регион <span className="text-[#00D4FF]">выбрать</span>
              </h2>
              <p className="text-gray-400 mb-8">PlayStation — мультирегиональная система. На одной консоли уживаются аккаунты из любых стран.</p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Турция */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E24B4A]/10 flex items-center justify-center">
                      <span className="text-lg">{FLAG_TR}</span>
                    </div>
                    <div className="font-rajdhani text-xl font-bold text-white">Турция</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00D4FF] mb-1">5 800 ₽</div>
                  <div className="text-xs text-gray-500 mb-4">Essential / 12 месяцев</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[#5DCAA5]">{'\u2713'} Одни из самых низких цен в мире</div>
                    <div className="text-[#5DCAA5]">{'\u2713'} Распродажи со скидками до 80%</div>
                    <div className="text-[#F09595]">{'\u2717'} VPN для регистрации</div>
                    <div className="text-[#F09595]">{'\u2717'} Турецкий IP для активации подписки</div>
                  </div>
                </div>

                {/* Украина — лучший */}
                <div className="bg-white/[0.03] border border-[#00D4FF]/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#00D4FF] text-[#0A1628] text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    ЛУЧШАЯ ЦЕНА
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0070D1]/10 flex items-center justify-center">
                      <span className="text-lg">{FLAG_UA}</span>
                    </div>
                    <div className="font-rajdhani text-xl font-bold text-white">Украина</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00D4FF] mb-1">5 000 ₽</div>
                  <div className="text-xs text-gray-500 mb-4">Essential / 12 месяцев</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[#5DCAA5]">{'\u2713'} Самый дешёвый регион</div>
                    <div className="text-[#5DCAA5]">{'\u2713'} Русский язык и озвучка</div>
                    <div className="text-[#5DCAA5]">{'\u2713'} Цены не повышались с запуска</div>
                    <div className="text-[#F09595]">{'\u2717'} Украинский IP для активации</div>
                  </div>
                </div>

                {/* Индия */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EF9F27]/10 flex items-center justify-center">
                      <span className="text-lg">{FLAG_IN}</span>
                    </div>
                    <div className="font-rajdhani text-xl font-bold text-white">Индия</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00D4FF] mb-1">~3 960 ₽</div>
                  <div className="text-xs text-gray-500 mb-4">Essential / 12 месяцев</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[#5DCAA5]">{'\u2713'} Регистрация без VPN</div>
                    <div className="text-[#F09595]">{'\u2717'} Перебои с картами пополнения</div>
                    <div className="text-[#F09595]">{'\u2717'} Только английский язык</div>
                    <div className="text-[#F09595]">{'\u2717'} Цены не всегда ниже турецких</div>
                  </div>
                </div>
              </div>
            </section>

            {/* --- Цены --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-2">
                Стоимость <span className="text-[#00D4FF]">ПС Плюс</span> в ActivePlay
              </h2>
              <p className="text-gray-400 mb-8">Оплата в рублях через СБП или карту «Мир». Активация за 10 минут.</p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Essential */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center">
                  <div className="font-rajdhani text-lg font-bold text-white mb-1">Essential</div>
                  <div className="text-[11px] text-gray-500 mb-6">Мультиплеер + 3 игры/мес</div>
                  <div className="text-3xl font-bold text-[#00D4FF]">1 250 ₽</div>
                  <div className="text-xs text-gray-500 mb-2">в месяц</div>
                  <div className="text-sm text-[#5DCAA5] mb-6">12 мес — 5 800 ₽</div>
                  <div className="border-t border-white/5 pt-4 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Сетевой мультиплеер
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      3 бесплатных игры каждый месяц
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Облачные сохранения
                    </div>
                  </div>
                </div>

                {/* Extra — featured */}
                <div className="bg-[#00D4FF]/[0.04] border border-[#00D4FF]/30 rounded-2xl p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-[#0A1628] text-[10px] font-bold px-4 py-1 rounded-full">
                    ПОПУЛЯРНЫЙ
                  </div>
                  <div className="font-rajdhani text-lg font-bold text-white mb-1">Extra</div>
                  <div className="text-[11px] text-gray-500 mb-6">Каталог 400+ игр</div>
                  <div className="text-3xl font-bold text-[#00D4FF]">1 400 ₽</div>
                  <div className="text-xs text-gray-500 mb-2">в месяц</div>
                  <div className="text-sm text-[#5DCAA5] mb-6">12 мес — 9 500 ₽</div>
                  <div className="border-t border-white/5 pt-4 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Всё из Essential
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Каталог 400+ игр
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      God of War, Spider-Man, Hogwarts Legacy
                    </div>
                  </div>
                </div>

                {/* Deluxe */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center">
                  <div className="font-rajdhani text-lg font-bold text-white mb-1">Deluxe</div>
                  <div className="text-[11px] text-gray-500 mb-6">Классика + пробные версии</div>
                  <div className="text-3xl font-bold text-[#00D4FF]">1 550 ₽</div>
                  <div className="text-xs text-gray-500 mb-2">в месяц</div>
                  <div className="text-sm text-[#5DCAA5] mb-6">12 мес — 10 750 ₽</div>
                  <div className="border-t border-white/5 pt-4 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Всё из Extra
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Классика PS1, PS2, PSP
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/40" />
                      Пробные версии новинок
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Украинский регион дешевле: Essential 12 мес — 5 000 ₽, Extra — 7 000 ₽, Deluxe — 8 000 ₽
              </p>
            </section>

            {/* --- Создание аккаунта --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-2">
                Как создать <span className="text-[#00D4FF]">иностранный аккаунт</span> PSN
              </h2>
              <p className="text-gray-400 mb-8">Понадобится новый email на Gmail или Outlook и 5 минут времени.</p>

              <div className="space-y-4">
                {[
                  { num: '1', title: 'Режим инкогнито', text: 'Откройте браузер. Для турецкого аккаунта включите VPN с турецким сервером. Для индийского VPN не нужен.' },
                  { num: '2', title: 'Регистрация на PSN', text: 'Перейдите на store.playstation.com \u2192 \u00ABСоздать аккаунт\u00BB. Выберите регион: Turkey, India или Ukraine. Регион фиксируется навсегда.' },
                  { num: '3', title: 'Адрес в стране', text: 'Найдите любой отель на Google Maps. Турция: Istanbul, Kad\u0131k\u00f6y, 34710. Индия: Mumbai, Maharashtra, 400001.' },
                  { num: '4', title: 'Почта и пароль', text: 'Используйте Gmail или Outlook. Домен .ru — фактор риска при проверках Sony. Придумайте надёжный пароль и запишите дату рождения.' },
                  { num: '5', title: 'Двухфакторная аутентификация', text: 'Настройки аккаунта \u2192 Безопасность \u2192 Двухэтапная верификация. Включите и сохраните резервные коды в надёжном месте.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 items-start bg-white/[0.02] rounded-xl p-5 border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#0070D1]/20 border border-[#0070D1]/40 flex items-center justify-center font-rajdhani text-base font-bold text-[#00D4FF] flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm mb-1">{step.title}</div>
                      <div className="text-gray-400 text-sm leading-relaxed">{step.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- Привязка к консоли --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-6">
                Привязка аккаунта <span className="text-[#00D4FF]">к PS5</span>
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                Созданный аккаунт нужно привязать к консоли. На PS5: Настройки → Пользователи → Добавить пользователя.
                Войдите с новыми данными.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Затем: Настройки → Пользователи → Другое → Совместное использование консоли → Включить.
                После этого все аккаунты на консоли получат доступ к играм PS Plus. Играйте со своего
                основного аккаунта — трофеи и сохранения работают.
              </p>

              <div className="bg-[#00D4FF]/[0.06] border-l-[3px] border-[#00D4FF] rounded-r-xl p-5 my-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#00D4FF]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  <span className="text-[#00D4FF] font-semibold text-sm">Мультирегиональность</span>
                </div>
                <p className="text-[#85B7EB] text-sm leading-relaxed">
                  На одной консоли свободно уживаются аккаунты из разных стран.
                  Это штатная функция PlayStation, не лазейка и не нарушение правил.
                </p>
              </div>
            </section>

            {/* --- Почему нельзя самому --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-6">
                Почему нельзя <span className="text-[#00D4FF]">активировать самому</span>
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                Главный подводный камень. Человек покупает карту пополнения, закидывает деньги
                на кошелёк, заходит в PS Plus, нажимает «Купить» — и получает ошибку.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Sony проверяет IP-адрес при оформлении подписки. Если он не совпадает с регионом
                аккаунта — подписка не активируется. Деньги при этом остаются на кошельке, но толку от них нет.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{FLAG_TR}</span>
                    <span className="font-rajdhani font-bold text-white">Турция</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Нужен турецкий IP на консоли. Без него подписка не оформляется.
                    Игры покупаются без проблем — ограничение только на PS Plus.
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{FLAG_UA}</span>
                    <span className="font-rajdhani font-bold text-white">Украина</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Та же история. Нужен украинский VPN или SIM-карта оператора.
                    Без украинского интернета активация не проходит.
                  </p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Об этом не пишут 90% гайдов в интернете. Правильный путь — обратиться к специалистам
                с инфраструктурой нужного региона. В ActivePlay мы активируем подписки каждый день.
              </p>
            </section>

            {/* --- Продление --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-6">
                Как продлить <span className="text-[#00D4FF]">подписку PS Plus</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Продление ПС Плюс работает по тем же правилам, что и первая покупка.
                Подписка продлевается с даты окончания текущей. Купили год, пока ещё два
                месяца остаётся — год добавится сверху.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Автопродление лучше отключить сразу. Оно требует карты региона, а её у вас нет.
                Без карты подписка просто закончится. Продлевайте заранее, чтобы не потерять
                доступ к играм из каталога.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Те же ограничения по IP. Из России самостоятельно не продлить.
                Напишите в ActivePlay — продлим за 10 минут.
              </p>
            </section>

            {/* --- Оплата СБП --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-6">
                Оплата через <span className="text-[#00D4FF]">СБП и карту «Мир»</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Напрямую с PlayStation Store ни СБП, ни «Мир» не работают. Sony не поддерживает
                российскую платёжную инфраструктуру.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Зато оба способа работают для оплаты подписок через российских продавцов.
                В ActivePlay вы платите в рублях через СБП — быстро, без комиссии, из любого банка.
                Вся работа с регионами, IP и активацией — на нашей стороне.
              </p>
            </section>

            {/* --- Баны --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-6">
                Баны аккаунтов — <span className="text-[#00D4FF]">мифы и реальность</span>
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                PlayStation — мультирегиональная платформа. На одной консоли могут быть аккаунты
                из Бельгии, Аргентины и Турции одновременно. Сам по себе иностранный регион —
                не нарушение правил.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Волна банов в мае 2025 затронула аккаунты перекупщиков. Они создавали сотни аккаунтов
                с одного IP, привязывали одну карту, продавали пачками. Sony засекла паттерн и заблокировала
                всю цепочку. Самостоятельно созданные аккаунты с нормальной историей — работают.
              </p>

              <div className="bg-[#E24B4A]/[0.07] border-l-[3px] border-[#E24B4A] rounded-r-xl p-5 my-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#E24B4A]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span className="text-[#E24B4A] font-semibold text-sm">Никогда не делайте чарджбэк</span>
                </div>
                <p className="text-[#F09595] text-sm leading-relaxed">
                  Возврат платежа через банк = моментальный перманентный бан аккаунта и консоли.
                  Проблема с покупкой? Пишите в поддержку PlayStation, а не в банк.
                </p>
              </div>

              <h3 className="font-rajdhani text-xl font-bold text-[#00D4FF] mt-8 mb-4">Как защитить аккаунт</h3>
              <div className="space-y-3">
                {[
                  'Создавайте аккаунт сами — не покупайте готовые у перекупщиков',
                  'Используйте Gmail или Outlook, не mail.ru',
                  'Включите двухфакторную аутентификацию',
                  'Не используйте VPN при обычной игре',
                  'Подождите 5\u20137 дней после регистрации перед первой покупкой',
                  'Периодически играйте на иностранном аккаунте — зарабатывайте трофеи',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-[#5DCAA5] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {tip}
                  </div>
                ))}
              </div>
            </section>

            {/* --- Ошибки --- */}
            <section className="py-12 border-b border-white/5">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-8">
                Частые <span className="text-[#00D4FF]">ошибки</span> и решения
              </h2>

              <div className="space-y-3">
                {[
                  { code: 'E-8210604A', desc: '«Произошла ошибка» при оплате картой', fix: 'Используйте PSN-карты пополнения вместо прямой оплаты' },
                  { code: 'E-82000134', desc: 'Код не подходит — регион карты \u2260 регион аккаунта', fix: 'Проверьте валюту: TRY для Турции, INR для Индии, UAH для Украины' },
                  { code: 'E-82000138', desc: 'Кошелёк не пополняется', fix: 'Лимит: максимум 5 000 TRY. Перезагрузите консоль' },
                  { code: 'WS-116367-4', desc: 'Аккаунт полностью заблокирован', fix: 'Причины: чарджбэк, купленный аккаунт. Обращайтесь в поддержку региона' },
                ].map((err) => (
                  <div key={err.code} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <div className="font-mono text-sm font-semibold text-[#E24B4A]">{err.code}</div>
                    <div className="text-sm text-gray-400 mt-1">{err.desc}</div>
                    <div className="text-sm text-[#5DCAA5] mt-1">{'\u2192'} {err.fix}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- CTA --- */}
            <section className="py-12">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-6">
                Как купить (продлить) <span className="text-[#00D4FF]">ПС Плюс</span> в ActivePlay
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                Купить ПС Плюс дёшево и без головной боли — к нам. ActivePlay работает с 2022 года,
                через нас прошли более 52 000 клиентов. Оформляем и продлеваем подписку PlayStation Plus каждый день.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Чтобы активировать ПС Плюс, не нужно разбираться с VPN, прокси и региональными
                блокировками. Наши менеджеры работают с десятками тысяч клиентов четыре года подряд.
                Они знают все нюансы активации в каждом регионе — Турция, Украина, Индия.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                Оформить или продлить ПС Плюс Эссеншиал, Экстра или Делюкс — дело десяти минут.
                Платите в рублях через СБП или карту «Мир». Получаете работающую подписку
                Плейстейшен Плюс на свой аккаунт. Никаких рисков.
              </p>

              {/* CTA block */}
              <div className="bg-gradient-to-br from-[#0070D1] to-[#00D4FF] rounded-2xl p-8 text-center">
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-6">Подписка PS Plus — от 1 250 ₽/мес</h3>

                <div className="flex justify-center gap-8 mb-6 flex-wrap">
                  <div className="text-center">
                    <div className="text-[11px] text-white/60">Essential</div>
                    <div className="text-xl font-bold text-white">1 250 ₽</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-white/60">Extra</div>
                    <div className="text-xl font-bold text-white">1 400 ₽</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-white/60">Deluxe</div>
                    <div className="text-xl font-bold text-white">1 550 ₽</div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-6">52 000+ клиентов с 2022 года. Гарантия активации.</p>

                <a
                  href="https://t.me/activeplay1"
                  className="inline-block bg-white text-[#0070D1] font-bold text-base px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Написать менеджеру
                </a>
              </div>
            </section>

            {/* --- Теги --- */}
            <div className="flex flex-wrap gap-2 pt-4 pb-8 border-t border-white/5">
              {['PS Plus', 'PlayStation', 'подписка', 'Турция', 'Украина', 'из России', 'СБП', 'пс плюс', 'купить', 'инструкция'].map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
