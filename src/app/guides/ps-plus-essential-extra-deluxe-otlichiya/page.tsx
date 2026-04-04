import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PS Plus Essential, Extra и Deluxe — отличия и какой выбрать | ActivePlay',
  description: 'Чем отличается PS Plus Essential от Extra и Deluxe. Сравнение всех уровней подписки ПС Плюс: что входит, какие игры, цены в 2026 году и какой тариф выбрать.',
  openGraph: {
    title: 'PS Plus Essential, Extra и Deluxe — отличия и какой выбрать',
    description: 'Разница между PS Plus Essential, Extra и Deluxe. Подробное сравнение тарифов PlayStation Plus.',
    type: 'article',
    url: 'https://activeplay.games/guides/ps-plus-essential-extra-deluxe-otlichiya',
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
function Divider() { return <><div className="h-20" /><div className="h-px bg-gradient-to-r from-transparent via-[#00D4FF]/15 to-transparent" /><div className="h-20" /></>; }
function Accent() { return <div className="w-16 h-[3px] bg-gradient-to-r from-[#00D4FF] to-[#0070D1] rounded-full mb-6" />; }

export default function GuidePSPlusTiers() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden min-h-[480px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0c1f3d] via-50% to-[#4a1080]" />
          <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(180,100,255,0.15)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-40px] left-[15%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,212,255,0.1)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link><span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link><span>/</span>
              <span className="text-white/50">PS Plus уровни</span>
            </nav>
            <span className="inline-block bg-[#0070D1] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">PlayStation</span>
            <h1 className="font-rajdhani text-[44px] md:text-[52px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              PS Plus Essential, Extra и Deluxe &mdash; <span className="text-[#00D4FF]">чем отличаются</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">Какой уровень подписки ПС Плюс выбрать. Что входит в каждый тариф, в чём разница и за что стоит переплачивать.</p>
            <div className="flex gap-6 mt-6 text-[13px] text-white/25"><span>8 мин чтения</span><span>PS Plus, Essential, Extra, Deluxe</span></div>
          </div>
        </section>

        {/* ═══ CONTENT ═══ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          {/* --- Вступление --- */}
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            У PlayStation Plus три уровня подписки: Essential, Extra и Deluxe. Названия красивые, но что за ними стоит &mdash; понимает не каждый. Люди переплачивают за Extra, хотя играют в две игры в год. Или сидят на Essential и не знают, что за пару сотен рублей сверху получили бы каталог из четырёхсот хитов.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Разберём каждый тариф: что конкретно входит, чем отличается пс плюс эссеншиал от экстра и делюкс, и какой уровень подойдёт именно вам.
          </p>

          <Divider />

          {/* --- Essential --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            <span className="text-[#F5C518]">Essential</span> &mdash; база для онлайн-игры
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            PS Plus Essential &mdash; стартовый уровень. Без него сетевой мультиплеер на PS5 и PS4 закрыт. Ни Fortnite с друзьями, ни FIFA Online, ни кооп в любой игре. Это входной билет.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Помимо мультиплеера, каждый месяц Sony раздаёт три игры. Их можно забрать бесплатно и играть, пока подписка активна. Раздавали God of War, Horizon Zero Dawn, Sackboy, Death Stranding. Иногда попадаются хиты, иногда &mdash; середняки. Но за год набирается 36 игр, и среди них всегда найдётся что-то стоящее.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-8">
            <h3 className="font-rajdhani text-xl font-bold text-[#F5C518] mb-4">Что входит в Essential</h3>
            <div className="space-y-2 text-[15px]">
              {['Сетевой мультиплеер на PS5 и PS4','3 бесплатных игры каждый месяц','Эксклюзивные скидки в PS Store','Облачное хранилище сохранений','Share Play \u2014 совместная игра с друзьями','Game Help \u2014 подсказки в играх (PS5)'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#F5C518]/40 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Кому подходит: тем, кто играет в пару любимых онлайн-игр и не хочет переплачивать. Если вы покупаете игры отдельно и не нужен каталог &mdash; Essential закроет все базовые потребности.
          </p>

          <Link href="/ps-plus-essential" className="inline-flex items-center gap-2 text-[#00D4FF] text-[15px] font-semibold hover:underline mt-2">
            Подробнее о PS Plus Essential {'\u2192'}
          </Link>

          <Divider />

          {/* --- Extra --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            <span className="text-[#00D4FF]">Extra</span> &mdash; каталог из 400+ игр
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            PS Plus Extra &mdash; всё из Essential плюс огромный каталог игр. Более четырёхсот наименований для PS5 и PS4. Не демоверсии, не урезанные версии &mdash; полноценные игры, которые можно скачать и играть без ограничений.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            В каталоге пс плюс экстра собраны хиты последних лет: God of War Ragnar{'\u00F6'}k, Marvel{'\u2019'}s Spider-Man 2, Returnal, Hogwarts Legacy, Demon{'\u2019'}s Souls, Stray, Death Stranding Director{'\u2019'}s Cut. Sony добавляет новые игры каждый месяц &mdash; обычно 10{'\u2013'}15 штук.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-8">
            <h3 className="font-rajdhani text-xl font-bold text-[#00D4FF] mb-4">Что входит в Extra (поверх Essential)</h3>
            <div className="space-y-2 text-[15px]">
              {['Каталог 400+ игр для PS5 и PS4','Каталог Ubisoft+ Classics (Assassin\u2019s Creed, Far Cry, Watch Dogs)','Новые игры в каталоге каждый месяц','Скачивание на консоль (не стриминг \u2014 играете без лагов)'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#00D4FF]/40 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <Callout type="warn" label="Игры уходят из каталога">
            В отличие от ежемесячных игр Essential (забрал &mdash; твоё навсегда), игры из каталога Extra могут уйти. Sony предупреждает за две недели. Если начали проходить &mdash; не откладывайте.
          </Callout>

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Кому подходит: тем, кто любит пробовать разные игры. Если за год вы проходите 5{'\u2013'}10 игр и не хотите покупать каждую отдельно &mdash; Extra окупается за первый же месяц.
          </p>

          <Link href="/ps-plus-extra" className="inline-flex items-center gap-2 text-[#00D4FF] text-[15px] font-semibold hover:underline mt-2">
            Подробнее о PS Plus Extra {'\u2192'}
          </Link>

          <Divider />

          {/* --- Deluxe --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            <span className="text-[#B46AFF]">Deluxe</span> &mdash; классика и пробные версии
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            PS Plus Deluxe &mdash; максимальный уровень для регионов Турция, Украина и Индия. Включает всё из Extra плюс два бонуса: каталог классических игр и пробные версии новинок.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-8">
            <h3 className="font-rajdhani text-xl font-bold text-[#B46AFF] mb-4">Что входит в Deluxe (поверх Extra)</h3>
            <div className="space-y-2 text-[15px]">
              {['Каталог классики: PS1, PS2 и PSP (Tekken, Syphon Filter, Ape Escape, Worms)','Пробные версии новых игр на 2\u20135 часов до покупки','Новые классические игры каждый месяц'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#B46AFF]/40 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <Callout type="info" label="Deluxe и Premium — в чём разница">
            В США и Европе вместо Deluxe есть Premium. Отличие одно: Premium включает облачный стриминг PS3-игр. В Турции, Украине и Индии стриминг недоступен, поэтому тариф называется Deluxe и стоит дешевле. Набор классических игр и пробные версии &mdash; одинаковые.
          </Callout>

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Кому подходит: ностальгирующим по PS1/PS2 и тем, кто хочет пробовать новинки перед покупкой. Разница с Extra &mdash; 150 {'\u20BD'} в месяц. За эти деньги вы получаете доступ к нескольким десяткам классических игр и возможность протестировать новинки AAA-класса.
          </p>

          <Link href="/ps-plus-deluxe" className="inline-flex items-center gap-2 text-[#00D4FF] text-[15px] font-semibold hover:underline mt-2">
            Подробнее о PS Plus Deluxe {'\u2192'}
          </Link>

          <Divider />

          {/* --- Сравнительная таблица --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Сравнение <span className="text-[#00D4FF]">трёх уровней</span> PS Plus
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">Что входит в каждый тариф &mdash; наглядно.</p>

          {/* Таблица как карточки */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            {/* Header */}
            <div className="grid grid-cols-4 bg-white/[0.04]">
              <div className="p-4 text-[13px] text-[#6b7a8d] font-semibold border-r border-white/[0.06]">Функция</div>
              <div className="p-4 text-[13px] font-bold text-center text-[#F5C518]">Essential</div>
              <div className="p-4 text-[13px] font-bold text-center text-[#00D4FF] border-x border-white/[0.06]">Extra</div>
              <div className="p-4 text-[13px] font-bold text-center text-[#B46AFF]">Deluxe</div>
            </div>
            {/* Rows */}
            {[
              { feature: 'Онлайн-мультиплеер', e: true, x: true, d: true },
              { feature: '3 игры каждый месяц', e: true, x: true, d: true },
              { feature: 'Облачные сохранения', e: true, x: true, d: true },
              { feature: 'Скидки в PS Store', e: true, x: true, d: true },
              { feature: 'Каталог 400+ игр', e: false, x: true, d: true },
              { feature: 'Ubisoft+ Classics', e: false, x: true, d: true },
              { feature: 'Классика PS1/PS2/PSP', e: false, x: false, d: true },
              { feature: 'Пробные версии новинок', e: false, x: false, d: true },
              { feature: 'Стриминг PS3 (только Premium)', e: false, x: false, d: false },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'}`}>
                <div className="p-4 text-[13px] text-[#8896a5] border-r border-white/[0.06]">{row.feature}</div>
                <div className="p-4 text-center text-[14px]">{row.e ? <span className="text-[#5DCAA5]">{'\u2713'}</span> : <span className="text-[#444]">&mdash;</span>}</div>
                <div className="p-4 text-center text-[14px] border-x border-white/[0.06]">{row.x ? <span className="text-[#5DCAA5]">{'\u2713'}</span> : <span className="text-[#444]">&mdash;</span>}</div>
                <div className="p-4 text-center text-[14px]">{row.d ? <span className="text-[#5DCAA5]">{'\u2713'}</span> : <span className="text-[#444]">&mdash;</span>}</div>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Апгрейд/даунгрейд --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как <span className="text-[#00D4FF]">перейти</span> между уровнями
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Повысить уровень можно в любой момент. Зайдите в раздел PS Plus на консоли, выберите нужный тариф &mdash; система посчитает разницу. Вы доплатите пропорционально оставшимся дням подписки. Никаких потерь.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Понизить уровень сложнее. Автоматического даунгрейда нет. Нужно дождаться окончания текущей подписки, отключить автопродление и оформить новый уровень заново. Игры из каталога Extra при переходе на Essential станут недоступны &mdash; но вернутся, если снова подключите Extra.
          </p>

          <Callout type="info" label="Лайфхак с апгрейдом">
            Если хотите попробовать Extra, но не уверены &mdash; возьмите Essential на год и апгрейдните на Extra на месяц. Доплата будет минимальной. Если не понравится &mdash; через месяц вернётесь на Essential автоматически.
          </Callout>

          <Divider />

          {/* --- Какой тариф выбрать --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Какой <span className="text-[#00D4FF]">тариф выбрать</span>
          </h2>
          <Accent />

          <div className="space-y-4 my-8">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#F5C518] mb-2">Essential &mdash; вы играете в 1{'\u2013'}3 игры</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">У вас есть любимая FIFA, Fortnite или Call of Duty. Покупаете новые игры по одной, когда выходит что-то интересное. Каталог не нужен &mdash; Essential закроет мультиплеер и скидки.</p>
            </div>
            <div className="bg-white/[0.03] border border-[#00D4FF]/20 rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#00D4FF] mb-2">Extra &mdash; вы проходите 5{'\u2013'}10 игр в год</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Любите пробовать разное. God of War сегодня, Stray завтра, Hogwarts Legacy на выходных. Каталог Extra окупится за первые две игры, которые вы не купите отдельно.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#B46AFF] mb-2">Deluxe &mdash; вы хотите всё и сразу</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Ностальгия по PS1/PS2, интерес к пробным версиям новинок. Разница с Extra &mdash; всего 150 {'\u20BD'}/мес. Если бюджет позволяет &mdash; берите Deluxe и не думайте.</p>
            </div>
          </div>

          <Divider />

          {/* --- CTA --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Оформить <span className="text-[#00D4FF]">ПС Плюс</span> в ActivePlay
          </h2>
          <Accent />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Определились с уровнем? Оформляем любой тариф за 10 минут. Оплата в рублях через СБП или карту &laquo;Мир&raquo;. Активируем на ваш аккаунт &mdash; турецкий, украинский или индийский регион.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить подписку пс плюс эссеншиал, экстра или делюкс дёшево и быстро &mdash; к нам. ActivePlay работает с 2022 года, через нас прошли более 52 000 клиентов. Наши менеджеры знают все нюансы активации в каждом регионе.
          </p>

          {/* CTA block */}
          <div className="bg-gradient-to-br from-[#0050a0] via-[#0070D1] to-[#00D4FF] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-4 relative">Подписка PS Plus</h3>
            <p className="text-white/60 text-[15px] mb-8 relative">Активация за 10 минут. Оплата через СБП.</p>
            <div className="flex justify-center gap-6 md:gap-10 mb-8 relative flex-wrap">
              <Link href="/ps-plus-essential" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">Essential</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white group-hover:text-[#F5C518] transition-colors">от 1 250 {'\u20BD'}</div>
              </Link>
              <Link href="/ps-plus-extra" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">Extra</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white group-hover:text-[#00D4FF] transition-colors">от 1 400 {'\u20BD'}</div>
              </Link>
              <Link href="/ps-plus-deluxe" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">Deluxe</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white group-hover:text-[#B46AFF] transition-colors">от 1 550 {'\u20BD'}</div>
              </Link>
            </div>
            <a href="https://t.me/activeplay1" className="inline-block bg-white text-[#0070D1] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative">
              Написать менеджеру
            </a>
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {['PS Plus','Essential','Extra','Deluxe','Premium','отличия','сравнение','пс плюс','какой выбрать','каталог игр','подписка','PlayStation'].map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#00D4FF]/20 hover:text-[#00D4FF] transition-all cursor-default">{tag}</span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
