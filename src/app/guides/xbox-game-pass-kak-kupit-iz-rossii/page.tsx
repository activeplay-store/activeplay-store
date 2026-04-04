import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Xbox Game Pass из России — все тарифы и как купить | ActivePlay',
  description: 'Как купить Xbox Game Pass из России в 2026 году. Тарифы Essential, Premium и Ultimate: что входит, цены, отличия. Активация через подарочные карты, оплата СБП.',
  openGraph: {
    title: 'Xbox Game Pass из России — все тарифы и как купить',
    description: 'Полный гайд по Xbox Game Pass: Essential, Premium, Ultimate. Покупка из России, активация, цены.',
    type: 'article',
    url: 'https://activeplay.games/guides/xbox-game-pass-kak-kupit-iz-rossii',
    siteName: 'ActivePlay',
  },
};

/* --- helpers --- */
function Callout({ type, label, children }: { type: 'warn' | 'info' | 'danger'; label: string; children: React.ReactNode }) {
  const s = {
    warn:   { wrap: 'bg-[#EF9F27]/[0.06] border-[#EF9F27]/20 border-l-[#EF9F27]', lbl: 'text-[#EF9F27]', txt: 'text-[#d4a44a]', ico: '\u26A0\uFE0F' },
    info:   { wrap: 'bg-[#00D4FF]/[0.05] border-[#00D4FF]/15 border-l-[#00D4FF]', lbl: 'text-[#00D4FF]', txt: 'text-[#6eaad4]', ico: '\u2139\uFE0F' },
    danger: { wrap: 'bg-[#E24B4A]/[0.06] border-[#E24B4A]/15 border-l-[#E24B4A]', lbl: 'text-[#E24B4A]', txt: 'text-[#d47a7a]', ico: '\u26D4' },
  }[type];
  return (
    <div className={`${s.wrap} border border-l-[3px] rounded-2xl p-7 my-10`}>
      <div className={`${s.lbl} font-bold text-sm mb-2 flex items-center gap-2`}><span className="text-lg">{s.ico}</span>{label}</div>
      <p className={`${s.txt} text-base leading-relaxed m-0`}>{children}</p>
    </div>
  );
}
function Divider() { return <><div className="h-20" /><div className="h-px bg-gradient-to-r from-transparent via-[#107C10]/30 to-transparent" /><div className="h-20" /></>; }
function Accent() { return <div className="w-16 h-[3px] bg-gradient-to-r from-[#107C10] to-[#00D4FF] rounded-full mb-6" />; }

export default function GuideXboxGamePass() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ═══ HERO — зелёный Xbox-градиент ═══ */}
        <section className="relative overflow-hidden min-h-[480px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0a2a18] via-50% to-[#107C10]" />
          <div className="absolute top-[-100px] right-[-80px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,124,16,0.2)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-50px] left-[15%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,212,255,0.08)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link><span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link><span>/</span>
              <span className="text-white/50">Xbox Game Pass</span>
            </nav>
            <span className="inline-block bg-[#107C10] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">Xbox</span>
            <h1 className="font-rajdhani text-[44px] md:text-[52px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              Xbox Game Pass &mdash; <span className="text-[#107C10]">все тарифы</span> и покупка из России
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">Полный гайд по подписке Гейм Пасс: Essential, Premium, Ultimate. Как купить из России, чем отличаются тарифы и на чём можно сэкономить.</p>
            <div className="flex gap-6 mt-6 text-[13px] text-white/25"><span>8 мин чтения</span><span>Game Pass, Xbox, подписка</span></div>
          </div>
        </section>

        {/* ═══ CONTENT ═══ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          {/* --- Вступление --- */}
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Xbox Game Pass &mdash; это &laquo;Netflix от мира игр&raquo;. Фиксированная ежемесячная плата, каталог из 500+ игр, новинки Microsoft в день релиза. Call of Duty, Starfield, Forza, Halo, Diablo IV &mdash; всё входит в подписку.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Microsoft приостановила работу в России, и напрямую оплатить Гейм Пасс российской картой нельзя. Но подписка работает через подарочные карты Xbox. Активация занимает 5 минут, VPN для игры не нужен.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            В октябре 2025 года Microsoft провела масштабный ребрендинг: переименовала тарифы, изменила цены и добавила новые функции. Разберём, что и сколько стоит в 2026 году.
          </p>

          <Divider />

          {/* --- Три тарифа --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Три тарифа <span className="text-[#107C10]">Game Pass</span>
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">С октября 2025 года Game Pass Core стал Essential, Standard &mdash; Premium, а Ultimate подорожал до $30.</p>

          {/* Essential */}
          <Link href="/xbox-game-pass" className="block hover:opacity-90 transition-opacity">
            <h3 className="font-rajdhani text-[28px] font-extrabold text-[#107C10] mb-2 mt-10">Essential &mdash; мультиплеер и 50 игр</h3>
          </Link>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Бывший Game Pass Core. Базовый уровень за $10 в месяц. Онлайн-мультиплеер на Xbox, библиотека из 50+ игр, облачный гейминг и программа лояльности Rewards. Если вам нужен только онлайн с друзьями и небольшой каталог &mdash; этого достаточно.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-6">
            <div className="space-y-2 text-[15px]">
              {['Онлайн-мультиплеер на Xbox','50+ игр в каталоге','Облачный гейминг (избранные игры)','Скидки для подписчиков','Rewards \u2014 до $25/год бонусов'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#107C10]/50 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <Link href="/xbox-game-pass" className="block hover:opacity-90 transition-opacity">
            <h3 className="font-rajdhani text-[28px] font-extrabold text-[#00D4FF] mb-2 mt-10">Premium &mdash; 200+ игр на Xbox и ПК</h3>
          </Link>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Бывший Game Pass Standard. Средний тариф за $15 в месяц. Каталог расширяется до 200+ игр, впервые включая ПК-версии. Diablo IV, Hogwarts Legacy, Starfield &mdash; здесь. Игры первого дня от Microsoft выходят в Premium в течение года после релиза. Для большинства игроков &mdash; золотая середина.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-6">
            <div className="space-y-2 text-[15px]">
              {['200+ игр на Xbox и ПК','Онлайн-мультиплеер','Облачный гейминг','Новинки Microsoft \u2014 в течение года после релиза','Скидки и Rewards'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#00D4FF]/40 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>

          {/* Ultimate */}
          <Link href="/xbox-game-pass" className="block hover:opacity-90 transition-opacity">
            <h3 className="font-rajdhani text-[28px] font-extrabold text-[#F5C518] mb-2 mt-10">Ultimate &mdash; всё включено</h3>
          </Link>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Максимальный тариф &mdash; $30 в месяц. 400+ игр на Xbox, ПК и через облако. Новинки в день релиза. Call of Duty, Forza, Halo, все игры Activision Blizzard &mdash; в первый же день. Плюс Ubisoft+ Classics, Fortnite Crew, EA Play и приоритетный облачный гейминг в 1440p.
          </p>

          <div className="bg-white/[0.03] border border-[#F5C518]/20 rounded-2xl p-7 my-6 bg-gradient-to-b from-[#F5C518]/[0.03] to-transparent">
            <div className="space-y-2 text-[15px]">
              {['400+ игр: Xbox + ПК + облако','Новинки Microsoft/Activision Blizzard в день релиза','EA Play \u2014 каталог Electronic Arts (FIFA, Battlefield, NFS)','Ubisoft+ Classics (Assassin\u2019s Creed, Far Cry, Watch Dogs)','Fortnite Crew + 1000 V-Bucks ежемесячно','Облачный гейминг 1440p без бета-ограничений','Расширенные Rewards'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#F5C518]/40 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            70% пользователей Гейм Пасс в 2026 году выбирают Ultimate. Если играете на нескольких устройствах или хотите новинки в день выхода &mdash; альтернатив нет.
          </p>

          <Divider />

          {/* --- Сравнение --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Сравнение <span className="text-[#107C10]">тарифов</span> Game Pass
          </h2>
          <Accent />

          <div className="overflow-hidden rounded-2xl border border-white/[0.06] my-8">
            <div className="grid grid-cols-5 bg-white/[0.04]">
              <div className="p-4 text-[12px] text-[#6b7a8d] font-semibold border-r border-white/[0.06]">Функция</div>
              <div className="p-4 text-[12px] font-bold text-center text-[#107C10]">Essential<br/><span className="font-normal text-[#4a5a6a]">$10/мес</span></div>
              <div className="p-4 text-[12px] font-bold text-center text-[#00D4FF] border-x border-white/[0.06]">Premium<br/><span className="font-normal text-[#4a5a6a]">$15/мес</span></div>
              <div className="p-4 text-[12px] font-bold text-center text-[#F5C518] border-r border-white/[0.06]">Ultimate<br/><span className="font-normal text-[#4a5a6a]">$30/мес</span></div>
              <div className="p-4 text-[12px] font-bold text-center text-[#9aa8b8]">PC Game Pass<br/><span className="font-normal text-[#4a5a6a]">$16.5/мес</span></div>
            </div>
            {[
              { f: 'Каталог игр', e: '50+', p: '200+', u: '400+', pc: '400+' },
              { f: 'Платформы', e: 'Xbox', p: 'Xbox + ПК', u: 'Xbox + ПК + облако', pc: 'Только ПК' },
              { f: 'Онлайн-мультиплеер', e: '\u2713', p: '\u2713', u: '\u2713', pc: '\u2014' },
              { f: 'Новинки день-в-день', e: '\u2014', p: 'В течение года', u: '\u2713', pc: '\u2713' },
              { f: 'EA Play', e: '\u2014', p: '\u2014', u: '\u2713', pc: '\u2713' },
              { f: 'Ubisoft+ Classics', e: '\u2014', p: '\u2014', u: '\u2713', pc: '\u2014' },
              { f: 'Fortnite Crew', e: '\u2014', p: '\u2014', u: '\u2713', pc: '\u2014' },
              { f: 'Облачный гейминг', e: 'Избранные', p: '\u2713', u: '1440p приоритет', pc: '\u2014' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-5 ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'}`}>
                <div className="p-3 text-[12px] text-[#8896a5] border-r border-white/[0.06]">{row.f}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8]">{row.e}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8] border-x border-white/[0.06]">{row.p}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8] border-r border-white/[0.06]">{row.u}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8]">{row.pc}</div>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Покупка из России --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как купить <span className="text-[#107C10]">Game Pass</span> из России
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Microsoft Store не принимает российские карты. Ни Visa, ни Mastercard, ни &laquo;Мир&raquo;, ни СБП напрямую. Но подписка Xbox Game Pass доступна через подарочные карты и коды активации.
          </p>

          <div className="space-y-3 my-8">
            {[
              { t: 'Купите код Game Pass', d: 'У проверенного продавца. Оплата в рублях через СБП. Код приходит мгновенно.' },
              { t: 'Проверьте регион аккаунта', d: 'Регион кода должен совпадать с регионом аккаунта Microsoft. Регион можно сменить в настройках \u2014 это занимает минуту.' },
              { t: 'Активируйте код', d: 'Зайдите на redeem.microsoft.com, войдите в аккаунт, введите 25-значный код. Подписка активируется мгновенно.' },
              { t: 'Играйте', d: 'VPN для игры не нужен. Подписка работает на Xbox, ПК и через облако \u2014 зависит от тарифа.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#107C10]/20 hover:bg-[#107C10]/[0.01] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#107C10] to-[#00D4FF] flex items-center justify-center font-rajdhani text-lg font-extrabold text-white flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="font-bold text-white text-[15px] mb-1">{s.t}</div>
                  <div className="text-[14px] text-[#7a8a9a] leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <Callout type="info" label="Главное отличие от PlayStation">
            У Xbox регион аккаунта можно менять. Зашли в настройки account.microsoft.com, поменяли страну &mdash; готово. Не нужно создавать отдельный аккаунт, как в случае с PSN. И VPN для активации не требуется &mdash; коды вводятся через сайт.
          </Callout>

          <Divider />

          {/* --- Конвертация --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Конвертация Essential {'\u2192'} <span className="text-[#F5C518]">Ultimate</span>
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Классический способ сэкономить на Гейм Пасс Ультимейт. Суть: покупаете подписку Essential (или карты Xbox Live Gold, если ещё остались), а затем поверх активируете Ultimate. Оставшийся срок Essential конвертируется в Ultimate по определённому коэффициенту.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Точный коэффициент зависит от условий на момент конвертации. Обычно 3 месяца Essential превращаются в 2 месяца Ultimate. Итоговая стоимость &mdash; заметно ниже, чем прямая покупка Ultimate.
          </p>

          <Callout type="warn" label="Условия меняются">
            Microsoft периодически корректирует правила конвертации. Перед покупкой уточните актуальные условия у менеджера ActivePlay &mdash; мы следим за изменениями.
          </Callout>

          <Divider />

          {/* --- Xbox vs PS Plus --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Game Pass или <span className="text-[#00D4FF]">PS Plus</span> &mdash; что выбрать
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Вопрос платформы, а не подписки. Если у вас Xbox &mdash; Game Pass без вариантов. Если PS5 &mdash; PS Plus. Если играете на ПК &mdash; Game Pass PC или Ultimate.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Ключевое преимущество Game Pass &mdash; новинки в день релиза. Sony добавляет хиты в каталог PS Plus Extra через год{'\u2013'}два после выхода. Microsoft даёт доступ с первого дня. Call of Duty, Starfield, Indiana Jones &mdash; всё было в Game Pass в день релиза.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Преимущество PS Plus &mdash; каталог эксклюзивов Sony. God of War, Spider-Man, The Last of Us, Horizon &mdash; этого в Game Pass не будет никогда.
          </p>

          <Divider />

          {/* --- Какой тариф --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Какой тариф <span className="text-[#107C10]">выбрать</span>
          </h2>
          <Accent />

          <div className="space-y-4 my-8">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#107C10] mb-2">Essential &mdash; онлайн с друзьями</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Играете в пару онлайн-игр, покупаете новинки отдельно. Нужен мультиплеер и небольшой каталог. Самый бюджетный вариант.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#00D4FF] mb-2">Premium &mdash; большой каталог без переплаты</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Хотите каталог из 200+ игр и на Xbox, и на ПК. Не критично получать новинки в первый день. Золотая середина.</p>
            </div>
            <div className="bg-white/[0.03] border border-[#F5C518]/20 rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#F5C518] mb-2">Ultimate &mdash; максимум без компромиссов</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Новинки в день выхода, все платформы, EA Play, облачный гейминг. Играете на Xbox, ПК и хотите стриминг на телефон. 70% подписчиков выбирают его.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#9aa8b8] mb-2">PC Game Pass &mdash; только компьютер</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Консоли нет, играете только на ПК. Тот же каталог и новинки первого дня, но без консольных функций и облачного гейминга.</p>
            </div>
          </div>

          <Divider />

          {/* --- CTA --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Купить <span className="text-[#107C10]">Xbox Game Pass</span> в ActivePlay
          </h2>
          <Accent />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить Гейм Пасс из России дёшево и быстро &mdash; к нам. Оплата в рублях через СБП или карту &laquo;Мир&raquo;. Код приходит мгновенно. Активация &mdash; 5 минут.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            ActivePlay работает с 2022 года. Более 52 000 клиентов. Наши менеджеры помогут выбрать оптимальный тариф, подскажут по конвертации и активируют подписку Xbox Game Pass Ультимейт, Премиум или Эссеншиал на ваш аккаунт.
          </p>

          <div className="bg-gradient-to-br from-[#0a3a0a] via-[#107C10] to-[#00D4FF] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-4 relative">Xbox Game Pass</h3>
            <p className="text-white/60 text-[15px] mb-8 relative">52 000+ клиентов. Мгновенная выдача. Оплата СБП.</p>
            <div className="flex justify-center gap-6 md:gap-10 mb-8 relative flex-wrap">
              <div className="text-center">
                <div className="text-[12px] text-white/45 mb-1">Essential</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white">$10</div>
              </div>
              <div className="text-center">
                <div className="text-[12px] text-white/45 mb-1">Premium</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white">$15</div>
              </div>
              <div className="text-center">
                <div className="text-[12px] text-white/45 mb-1">Ultimate</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white">$30</div>
              </div>
            </div>
            <a href="https://t.me/activeplay1" className="inline-block bg-white text-[#107C10] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(16,124,16,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative">
              Написать менеджеру
            </a>
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {['Xbox Game Pass','Game Pass','гейм пасс','Ultimate','гейм пасс ультимейт','Essential','Premium','Xbox','подписка','из России','купить','СБП','PC Game Pass'].map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#107C10]/20 hover:text-[#107C10] transition-all cursor-default">{tag}</span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
