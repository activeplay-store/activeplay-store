// ФАЙЛ: src/app/guides/kak-kupit-ps-plus-iz-rossii/page.tsx
// ЗАМЕНИТЬ ПОЛНОСТЬЮ существующий файл

import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Как купить PS Plus из России — пошаговая инструкция | ActivePlay',
  description: 'Как купить и активировать подписку ПС Плюс из России через турецкий или украинский аккаунт. Оплата через СБП, карту Мир. Цены от 1 250 руб/мес.',
  openGraph: {
    title: 'Как купить PS Plus из России — пошаговая инструкция',
    description: 'Полный гайд по покупке PlayStation Plus из России. Выбор региона, создание аккаунта, активация подписки.',
    type: 'article',
    url: 'https://activeplay.games/guides/kak-kupit-ps-plus-iz-rossii',
    siteName: 'ActivePlay',
  },
};

/* ─── данные ─── */
const REGIONS = [
  {
    code: 'TR', name: 'Турция', price: '5 800 \u20BD', flag: 'tr',
    gradient: 'from-[#E24B4A] to-[#c03030]',
    pros: ['Одни из самых низких цен в мире', 'Распродажи со скидками до 80%'],
    cons: ['Нужен VPN для регистрации', 'Турецкий IP для активации подписки'],
  },
  {
    code: 'UA', name: 'Украина', price: '5 000 \u20BD', flag: 'ua', best: true,
    gradient: 'from-[#0070D1] to-[#00D4FF]',
    pros: ['Самый дешёвый регион', 'Русский язык и озвучка', 'Цены не повышались с запуска'],
    cons: ['Украинский IP для активации'],
  },
  {
    code: 'IN', name: 'Индия', price: '~3 960 \u20BD', flag: 'in',
    gradient: 'from-[#EF9F27] to-[#d48020]',
    pros: ['Регистрация без VPN'],
    cons: ['Перебои с картами пополнения', 'Только английский язык', 'Цены не всегда ниже турецких'],
  },
];

const TIERS = [
  {
    name: 'Essential', sub: 'Мультиплеер + 3 игры/мес',
    price: '1 250', annual: '5 800', popular: false,
    features: ['Сетевой мультиплеер', '3 игры каждый месяц', 'Облачные сохранения'],
    href: '/ps-plus-essential',
  },
  {
    name: 'Extra', sub: 'Каталог 400+ игр',
    price: '1 400', annual: '9 500', popular: true,
    features: ['Всё из Essential', 'Каталог 400+ игр', 'God of War, Spider-Man, Hogwarts Legacy'],
    href: '/ps-plus-extra',
  },
  {
    name: 'Deluxe', sub: 'Классика + пробные версии',
    price: '1 550', annual: '10 750', popular: false,
    features: ['Всё из Extra', 'Классика PS1/PS2/PSP', 'Пробные версии новинок'],
    href: '/ps-plus-deluxe',
  },
];

const STEPS = [
  { title: 'Режим инкогнито', text: 'Откройте браузер. Для турецкого аккаунта включите VPN с турецким сервером. Для индийского VPN не нужен.' },
  { title: 'Регистрация на PSN', text: 'store.playstation.com \u2192 \u00ABСоздать аккаунт\u00BB. Выберите регион: Turkey, India или Ukraine. Регион фиксируется навсегда.' },
  { title: 'Адрес в стране', text: 'Любой отель с Google Maps. Турция: Istanbul, Kadik\u00F6y, 34710. Индия: Mumbai, Maharashtra, 400001.' },
  { title: 'Почта и пароль', text: 'Gmail или Outlook. Домен .ru \u2014 фактор риска при проверках Sony. Запишите дату рождения.' },
  { title: 'Двухфакторная аутентификация', text: 'Настройки \u2192 Безопасность \u2192 2FA. Включите и сохраните резервные коды.' },
];

const ERRORS = [
  { code: 'E-8210604A', desc: '\u00ABПроизошла ошибка\u00BB при оплате картой', fix: 'Используйте PSN-карты пополнения вместо прямой оплаты' },
  { code: 'E-82000134', desc: 'Код не подходит \u2014 регион карты \u2260 регион аккаунта', fix: 'Проверьте валюту: TRY для Турции, INR для Индии, UAH для Украины' },
  { code: 'E-82000138', desc: 'Кошелёк не пополняется', fix: 'Лимит: максимум 5 000 TRY. Перезагрузите консоль' },
  { code: 'WS-116367-4', desc: 'Аккаунт полностью заблокирован', fix: 'Причины: чарджбэк, купленный аккаунт. Пишите в поддержку региона' },
];

const TIPS = [
  'Создавайте аккаунт сами \u2014 не покупайте готовые у перекупщиков',
  'Используйте Gmail или Outlook, не mail.ru',
  'Включите двухфакторную аутентификацию',
  'Не используйте VPN при обычной игре',
  'Подождите 5\u20137 дней после регистрации перед первой покупкой',
  'Периодически играйте на иностранном аккаунте \u2014 зарабатывайте трофеи',
];

const TAGS = ['PS Plus', 'PlayStation', 'подписка', 'Турция', 'Украина', 'из России', 'СБП', 'пс плюс', 'купить', 'активировать'];

/* ─── компоненты-блоки ─── */
function Callout({ type, label, children }: { type: 'warn' | 'info' | 'danger'; label: string; children: React.ReactNode }) {
  const styles = {
    warn:   { bg: 'bg-[#EF9F27]/[0.06]', border: 'border-[#EF9F27]/20', accent: 'border-l-[#EF9F27]', label: 'text-[#EF9F27]', text: 'text-[#d4a44a]' },
    info:   { bg: 'bg-[#00D4FF]/[0.05]',  border: 'border-[#00D4FF]/15', accent: 'border-l-[#00D4FF]', label: 'text-[#00D4FF]', text: 'text-[#6eaad4]' },
    danger: { bg: 'bg-[#E24B4A]/[0.06]',  border: 'border-[#E24B4A]/15', accent: 'border-l-[#E24B4A]', label: 'text-[#E24B4A]', text: 'text-[#d47a7a]' },
  }[type];
  return (
    <div className={`${styles.bg} border ${styles.border} ${styles.accent} border-l-[3px] rounded-2xl p-7 my-10`}>
      <div className={`${styles.label} font-bold text-sm mb-2 flex items-center gap-2`}>
        <span className="text-lg">{type === 'warn' ? '\u26A0\uFE0F' : type === 'danger' ? '\u26D4' : '\u2139\uFE0F'}</span>
        {label}
      </div>
      <p className={`${styles.text} text-base leading-relaxed m-0`}>{children}</p>
    </div>
  );
}

function SectionDivider() {
  return (
    <>
      <div className="h-20" />
      <div className="h-px bg-gradient-to-r from-transparent via-[#00D4FF]/15 to-transparent" />
      <div className="h-20" />
    </>
  );
}

function AccentLine() {
  return <div className="w-16 h-[3px] bg-gradient-to-r from-[#00D4FF] to-[#0070D1] rounded-full mb-6" />;
}

/* ─── страница ─── */
export default function GuidePSPlus() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ══════ HERO ══════ */}
        <section className="relative overflow-hidden min-h-[480px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#081e3a] via-50% to-[#0070D1]" />
          <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,212,255,0.18)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-50px] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,112,209,0.12)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />

          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link>
              <span>/</span>
              <span className="text-white/50">PS Plus</span>
            </nav>

            <span className="inline-block bg-[#0070D1] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">
              PlayStation
            </span>

            <h1 className="font-rajdhani text-[48px] md:text-[56px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              Как купить <span className="text-[#00D4FF]">PS Plus</span> из&nbsp;России
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-xl">
              Полный гайд по покупке и активации подписки PlayStation&nbsp;Plus. Выбор региона, создание аккаунта, оплата через&nbsp;СБП.
            </p>

            <div className="flex gap-6 mt-6 text-[13px] text-white/25">
              <span>7 мин чтения</span>
              <span>PS Plus, подписка, СБП</span>
            </div>
          </div>
        </section>

        {/* ══════ CONTENT ══════ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          {/* --- Вступление --- */}
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            PS Store в России заморожен с марта 2022 года. Sony ушла, ликвидировала юрлицо, убрала страну из списка. Ни Visa, ни Mastercard, ни &laquo;Мир&raquo; &mdash; ничего не работает.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Подписка ПС Плюс по-прежнему доступна. Нужен аккаунт в другом регионе и специалисты, которые возьмут на себя активацию. Карта пополнения кошелька сама по себе ничего не решает.
          </p>

          <Callout type="warn" label="Главное заблуждение">
            Пополнил кошелёк &mdash; подписка твоя? Нет. Sony проверяет IP-адрес. Из России активировать PS Plus нельзя, даже если деньги на балансе. На этом спотыкаются тысячи людей.
          </Callout>

          <SectionDivider />

          {/* --- Регионы --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Какой регион <span className="text-[#00D4FF]">выбрать</span>
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">PlayStation &mdash; мультирегиональная система. На одной консоли могут быть аккаунты из любых стран мира.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {REGIONS.map((r) => (
              <div key={r.code} className={`bg-white/[0.03] border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden ${r.best ? 'border-[#00D4FF]/30 bg-gradient-to-b from-[#00D4FF]/[0.04] to-transparent' : 'border-white/[0.06] hover:border-white/[0.12]'}`}>
                {r.best && <div className="absolute top-4 right-4 bg-[#00D4FF] text-[#0A1628] text-[9px] font-extrabold tracking-wider px-3 py-1 rounded-md">ЛУЧШАЯ ЦЕНА</div>}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white text-[13px] font-extrabold mb-5`}>{r.code}</div>
                <div className="font-rajdhani text-[22px] font-extrabold text-white mb-1">{r.name}</div>
                <div className="text-[28px] font-extrabold text-[#00D4FF] mb-0.5">{r.price}</div>
                <div className="text-[13px] text-[#4a5a6a] mb-5">Essential / 12 месяцев</div>
                <div className="border-t border-white/[0.06] pt-4 space-y-1.5 text-[13px]">
                  {r.pros.map((p) => <div key={p} className="text-[#5DCAA5]">{'\u2713'} {p}</div>)}
                  {r.cons.map((c) => <div key={c} className="text-[#E07070]">{'\u2717'} {c}</div>)}
                </div>
              </div>
            ))}
          </div>

          <SectionDivider />

          {/* --- Цены --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Стоимость <span className="text-[#00D4FF]">ПС Плюс</span> в ActivePlay
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">Оплата в рублях через СБП или карту &laquo;Мир&raquo;. Активация за 10 минут.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((t) => (
              <div key={t.name} className={`border rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-0.5 relative ${t.popular ? 'border-[#00D4FF]/30 bg-gradient-to-b from-[#00D4FF]/[0.05] to-white/[0.01]' : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'}`}>
                {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-[#0A1628] text-[10px] font-extrabold tracking-wider px-5 py-1 rounded-full">ПОПУЛЯРНЫЙ</div>}
                <div className="font-rajdhani text-[22px] font-extrabold text-white">{t.name}</div>
                <div className="text-[12px] text-[#4a5a6a] mb-6">{t.sub}</div>
                <div className="text-[40px] font-extrabold text-[#00D4FF] leading-none">{t.price} {'\u20BD'}</div>
                <div className="text-[13px] text-[#4a5a6a] mt-1">в месяц</div>
                <div className="inline-block bg-[#5DCAA5]/10 text-[#5DCAA5] text-[13px] font-semibold px-4 py-1.5 rounded-lg mt-4">12 мес &mdash; {t.annual} {'\u20BD'}</div>
                <div className="text-left mt-5 pt-5 border-t border-white/[0.05] space-y-2">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-[#6b7a8d]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]/30 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href={t.href} className={`block mt-5 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${t.popular ? 'bg-[#00D4FF] text-[#0A1628] hover:bg-[#33ddff]' : 'border border-white/10 text-[#6b7a8d] hover:border-[#00D4FF] hover:text-[#00D4FF]'}`}>
                  {t.popular ? 'Выбрать Extra \u2192' : 'Подробнее \u2192'}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[14px] text-[#4a5a6a] mt-6">Украинский регион: Essential 12 мес &mdash; 5 000 {'\u20BD'} {'\u00B7'} Extra &mdash; 7 000 {'\u20BD'} {'\u00B7'} Deluxe &mdash; 8 000 {'\u20BD'}</p>

          <SectionDivider />

          {/* --- Почему нельзя самому --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Почему нельзя <span className="text-[#00D4FF]">активировать самому</span>
          </h2>
          <AccentLine />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Главный подводный камень. Человек покупает карту пополнения, закидывает деньги на кошелёк, заходит в PS Plus, нажимает &laquo;Купить&raquo; &mdash; и получает ошибку.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Sony проверяет IP-адрес при оформлении подписки. Не совпадает с регионом аккаунта &mdash; подписка не пройдёт. Деньги останутся на кошельке, но толку от них нет.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-10">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E24B4A] to-[#c03030] flex items-center justify-center text-white text-[11px] font-extrabold">TR</div>
                <span className="font-rajdhani text-lg font-bold text-white">Турция</span>
              </div>
              <p className="text-[14px] text-[#6b7a8d] leading-relaxed m-0">Нужен турецкий IP на консоли. Без него подписка не оформляется. Игры покупаются нормально &mdash; ограничение только на PS Plus.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0070D1] to-[#00D4FF] flex items-center justify-center text-white text-[11px] font-extrabold">UA</div>
                <span className="font-rajdhani text-lg font-bold text-white">Украина</span>
              </div>
              <p className="text-[14px] text-[#6b7a8d] leading-relaxed m-0">Та же история. Нужен украинский VPN или SIM-карта оператора. Без украинского интернета активация не проходит.</p>
            </div>
          </div>

          <Callout type="info" label="Решение">
            Обратитесь к специалистам с инфраструктурой нужного региона. В ActivePlay мы активируем подписки каждый день и знаем все ограничения.
          </Callout>

          <SectionDivider />

          {/* --- Создание аккаунта --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как создать <span className="text-[#00D4FF]">аккаунт PSN</span>
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">Новый email на Gmail, 5 минут и чистый браузер. Всё.</p>

          <div className="space-y-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#00D4FF]/15 hover:bg-[#00D4FF]/[0.01] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0070D1] to-[#00D4FF] flex items-center justify-center font-rajdhani text-lg font-extrabold text-white flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="font-bold text-white text-[15px] mb-1">{s.title}</div>
                  <div className="text-[14px] text-[#7a8a9a] leading-relaxed">{s.text}</div>
                </div>
              </div>
            ))}
          </div>

          <SectionDivider />

          {/* --- Привязка к PS5 --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Привязка аккаунта <span className="text-[#00D4FF]">к PS5</span>
          </h2>
          <AccentLine />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Созданный аккаунт нужно привязать к консоли. На PS5: Настройки {'\u2192'} Пользователи {'\u2192'} Добавить пользователя. Войдите с новыми данными.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Затем: Настройки {'\u2192'} Пользователи {'\u2192'} Другое {'\u2192'} Совместное использование консоли {'\u2192'} Включить. После этого все аккаунты на консоли получат доступ к играм PS Plus. Играйте со своего основного аккаунта &mdash; трофеи и сохранения работают.
          </p>

          <Callout type="info" label="Мультирегиональность">
            На одной консоли свободно уживаются аккаунты из разных стран. Это штатная функция PlayStation, не лазейка и не нарушение правил.
          </Callout>

          <SectionDivider />

          {/* --- Продление --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как продлить <span className="text-[#00D4FF]">подписку PS Plus</span>
          </h2>
          <AccentLine />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Продление ПС Плюс работает по тем же правилам. Подписка продлевается с даты окончания текущей. Купили год, пока два месяца остаётся &mdash; год добавится сверху.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Автопродление лучше отключить сразу. Оно требует карты региона, а её у вас нет. Без карты подписка просто закончится. Продлевайте заранее.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Те же ограничения по IP. Из России самостоятельно не продлить. Напишите в ActivePlay &mdash; продлим за 10 минут.
          </p>

          <SectionDivider />

          {/* --- Оплата СБП --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Оплата через <span className="text-[#00D4FF]">СБП и карту &laquo;Мир&raquo;</span>
          </h2>
          <AccentLine />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Напрямую с PlayStation Store ни СБП, ни &laquo;Мир&raquo; не работают. Sony не поддерживает российскую платёжную инфраструктуру.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Зато оба способа работают для оплаты подписок через российских продавцов. В ActivePlay вы платите в рублях через СБП &mdash; быстро, без комиссии, из любого банка. Вся работа с регионами, IP и активацией &mdash; на нашей стороне.
          </p>

          <SectionDivider />

          {/* --- Баны --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Баны аккаунтов &mdash; <span className="text-[#00D4FF]">мифы и реальность</span>
          </h2>
          <AccentLine />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            PlayStation &mdash; мультирегиональная платформа. Аккаунты из Бельгии, Аргентины и Турции на одной консоли &mdash; норма. Сам по себе иностранный регион не нарушает правил.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Волна банов в мае 2025 затронула аккаунты перекупщиков. Сотни аккаунтов с одного IP, одна карта на всех, продажа пачками. Sony засекла паттерн. Самостоятельно созданные аккаунты с нормальной историей &mdash; работают.
          </p>

          <Callout type="danger" label="Никогда не делайте чарджбэк">
            Возврат платежа через банк = моментальный перманентный бан аккаунта и консоли. Проблема с покупкой? Пишите в поддержку PlayStation, не в банк.
          </Callout>

          <h3 className="font-rajdhani text-2xl font-bold text-[#00D4FF] mt-10 mb-5">Как защитить аккаунт</h3>
          <div className="space-y-3 mb-10">
            {TIPS.map((tip) => (
              <div key={tip} className="flex items-start gap-3 text-[15px] text-[#8896a5]">
                <div className="w-5 h-5 rounded-full bg-[#5DCAA5]/15 border-[1.5px] border-[#5DCAA5] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#5DCAA5]" />
                </div>
                {tip}
              </div>
            ))}
          </div>

          <SectionDivider />

          {/* --- Ошибки --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Частые <span className="text-[#00D4FF]">ошибки</span> и решения
          </h2>
          <AccentLine />
          <div className="h-8" />

          <div className="space-y-3">
            {ERRORS.map((e) => (
              <div key={e.code} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-[#E24B4A]/20 transition-colors">
                <div className="font-mono text-[15px] font-bold text-[#E24B4A]">{e.code}</div>
                <div className="text-[14px] text-[#6b7a8d] mt-1">{e.desc}</div>
                <div className="text-[14px] text-[#5DCAA5] mt-2">{'\u2192'} {e.fix}</div>
              </div>
            ))}
          </div>

          <SectionDivider />

          {/* --- CTA финал --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как купить (продлить) <span className="text-[#00D4FF]">ПС Плюс</span> в ActivePlay
          </h2>
          <AccentLine />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить ПС Плюс дёшево и без головной боли &mdash; к нам. ActivePlay работает с 2022 года, через нас прошли более 52 000 клиентов.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Чтобы активировать ПС Плюс, не нужно разбираться с VPN и региональными блокировками. Наши менеджеры четыре года подряд работают с десятками тысяч клиентов. Знают каждый регион &mdash; Турцию, Украину, Индию.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Оформить или продлить подписку Плейстейшен Плюс Эссеншиал, Экстра или Делюкс &mdash; десять минут. Платите через СБП или карту &laquo;Мир&raquo;. Никаких рисков.
          </p>

          {/* CTA block */}
          <div className="bg-gradient-to-br from-[#0050a0] via-[#0070D1] to-[#00D4FF] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[32px] font-extrabold text-white mb-8 relative">
              Подписка PS Plus &mdash; от 1 250 {'\u20BD'}/мес
            </h3>
            <div className="flex justify-center gap-10 mb-8 relative flex-wrap">
              {[['Essential', '1 250'], ['Extra', '1 400'], ['Deluxe', '1 550']].map(([label, val]) => (
                <div key={label} className="text-center">
                  <div className="text-[12px] text-white/45 mb-1">{label}</div>
                  <div className="text-[28px] font-extrabold text-white">{val} {'\u20BD'}</div>
                </div>
              ))}
            </div>
            <p className="text-[15px] text-white/55 mb-8 relative">52 000+ клиентов с 2022 года. Гарантия активации.</p>
            <a href="https://t.me/activeplay1" className="inline-block bg-white text-[#0070D1] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative">
              Написать менеджеру
            </a>
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {TAGS.map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#00D4FF]/20 hover:text-[#00D4FF] transition-all cursor-default">
                {tag}
              </span>
            ))}
          </div>

        </div>
      </article>
      <Footer />
    </>
  );
}
