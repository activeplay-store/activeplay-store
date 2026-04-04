// ФАЙЛ: src/app/guides/ea-play-podpiska-kak-kupit/page.tsx
// git add . && git commit -m "content: гайд EA Play — подписка и покупка из России" && git push

import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EA Play — что входит в подписку и как купить из России | ActivePlay',
  description: 'Что входит в подписку EA Play (ЕА Плей): каталог 64 игр, скидка 10% на FC Points и Apex Coins, ранний доступ к новинкам. Как купить из России, цены от 900₽.',
  openGraph: {
    title: 'EA Play — подписка Electronic Arts: каталог, скидки, покупка',
    description: 'Полный гайд по EA Play: 64 игры, скидка 10%, ранний доступ. Покупка из России через СБП.',
    type: 'article',
    url: 'https://activeplay.games/guides/ea-play-podpiska-kak-kupit',
    siteName: 'ActivePlay',
  },
};

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
function Divider() { return <><div className="h-20" /><div className="h-px bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent" /><div className="h-20" /></>; }
function Accent() { return <div className="w-16 h-[3px] bg-gradient-to-r from-[#FF6B00] to-[#00D4FF] rounded-full mb-6" />; }

export default function GuideEAPlay() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ═══ HERO — оранжевый EA-градиент ═══ */}
        <section className="relative overflow-hidden min-h-[480px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1a1a0a] via-50% to-[#8B4000]" />
          <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,107,0,0.15)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-40px] left-[15%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,212,255,0.08)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link><span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link><span>/</span>
              <span className="text-white/50">EA Play</span>
            </nav>
            <span className="inline-block bg-[#FF6B00] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">Electronic Arts</span>
            <h1 className="font-rajdhani text-[44px] md:text-[52px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              <span className="text-[#FF6B00]">EA Play</span> в 2026 &mdash; все игры, цены и как купить подписку из России
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">64 игры, скидка 10% на FC Points и Apex Coins, ранний доступ к новинкам EA. Как купить ЕА Плей из России.</p>
            <div className="flex gap-6 mt-6 text-[13px] text-white/25"><span>6 мин чтения</span><span>EA Play, подписка, Electronic Arts</span></div>
          </div>
        </section>

        {/* ═══ CONTENT ═══ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            EA Play (ЕА Плей) &mdash; подписка от Electronic Arts. За фиксированную плату вы получаете каталог из 64 игр на PlayStation, Xbox и ПК, скидку 10% на все покупки EA и ранний доступ к новинкам. Battlefield, Need for Speed, Dead Space, Mass Effect, Star Wars, The Sims &mdash; всё в одной подписке.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Для тех, кто играет в EA FC 26 и покупает FC Points, EA Play &mdash; must-have: скидка 10% на каждый пакет поинтов окупает подписку за первую же покупку.
          </p>

          <Divider />

          {/* --- Что входит --- */}
          <Link href="/ea-play" className="block hover:opacity-80 transition-opacity">
            <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
              Что входит в <span className="text-[#FF6B00]">EA Play</span>
            </h2>
          </Link>
          <Accent />

          <div className="space-y-4 my-8">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
              <h3 className="font-rajdhani text-xl font-bold text-[#FF6B00] mb-3">64 игры без ограничений</h3>
              <p className="text-[15px] text-[#9aa8b8] leading-relaxed m-0 mb-4">
                Полный доступ к каталогу EA на вашей платформе. Скачивайте и играйте без лимитов по времени. Каталог на PlayStation &mdash; ровно 64 игры. На ПК через EA App библиотека шире.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[13px] text-[#7a8a9a]">
                {['Dead Space (2023)','Dragon Age: The Veilguard','It Takes Two','Battlefield 2042','Star Wars Jedi: Fallen Order','Titanfall 2','Need for Speed: Heat','Mass Effect Legendary','The Sims 4','A Way Out','NHL 25','EA FC 25'].map((g) => (
                  <div key={g} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]/40 flex-shrink-0" />{g}</div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
              <h3 className="font-rajdhani text-xl font-bold text-[#FF6B00] mb-3">Скидка 10% на всё от EA</h3>
              <p className="text-[15px] text-[#9aa8b8] leading-relaxed m-0">
                Работает на игры, DLC, сезонные пропуски и внутриигровую валюту. <Link href="/igrovaya-valyuta" className="text-[#00D4FF] hover:underline">FC Points</Link>, Apex Coins, боевые пропуски &mdash; всё на 10% дешевле. Для тех, кто регулярно покупает ФК Поинтс, EA Play окупается моментально.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
              <h3 className="font-rajdhani text-xl font-bold text-[#FF6B00] mb-3">Ранний доступ к новинкам</h3>
              <p className="text-[15px] text-[#9aa8b8] leading-relaxed m-0">
                Играйте в новые игры EA до 10 часов до мирового релиза. Весь прогресс сохраняется при покупке полной версии. Пик &mdash; сентябрь (EA Sports FC) и ноябрь (Battlefield).
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
              <h3 className="font-rajdhani text-xl font-bold text-[#FF6B00] mb-3">Ежемесячные награды</h3>
              <p className="text-[15px] text-[#9aa8b8] leading-relaxed m-0">
                Эксклюзивный контент для EA FC 26 (паки, игроки, кастомизация), Apex Legends (скины), Battlefield (косметика) и NHL. Награды обновляются каждый месяц.
              </p>
            </div>
          </div>

          <Divider />

          {/* --- EA Play vs EA Play Pro --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            EA Play и <span className="text-[#FF6B00]">EA Play Pro</span> &mdash; в чём разница
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            EA Play Pro &mdash; расширенная подписка только для ПК (EA App). Каталог вырастает до 144 игр, новинки доступны в полном объёме с первого дня (не 10 часов, а без ограничений), включая Ultimate-издания. Стоит дороже, но для хардкорных игроков на ПК &mdash; имеет смысл.
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/[0.06] my-8">
            <div className="grid grid-cols-3 bg-white/[0.04]">
              <div className="p-4 text-[12px] text-[#6b7a8d] font-semibold border-r border-white/[0.06]">Функция</div>
              <div className="p-4 text-[12px] font-bold text-center text-[#FF6B00]">EA Play</div>
              <div className="p-4 text-[12px] font-bold text-center text-[#FFD700]">EA Play Pro</div>
            </div>
            {[
              { f: 'Платформы', a: 'PS, Xbox, ПК', b: 'Только ПК' },
              { f: 'Каталог игр', a: '64 игры (PS)', b: '144 игры' },
              { f: 'Новинки EA', a: '10 часов раннего доступа', b: 'Полный доступ с Day One' },
              { f: 'Издания новинок', a: 'Стандартные', b: 'Ultimate-издания' },
              { f: 'Скидка 10%', a: '\u2713', b: '\u2713' },
              { f: 'Ежемесячные награды', a: '\u2713', b: '\u2713 (расширенные)' },
              { f: 'Цена в ActivePlay', a: 'от 900 \u20BD/мес', b: 'Уточняйте' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'}`}>
                <div className="p-3 text-[12px] text-[#8896a5] border-r border-white/[0.06]">{row.f}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8]">{row.a}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8]">{row.b}</div>
              </div>
            ))}
          </div>

          <Callout type="info" label="EA Play входит в Game Pass Ultimate">
            Если у вас <Link href="/xbox-game-pass-ultimate" className="text-[#00D4FF] hover:underline">Xbox Game Pass Ultimate</Link>, EA Play уже включён. Отдельно покупать не нужно. Скидка 10% на FC Points и другие покупки работает автоматически.
          </Callout>

          <Divider />

          {/* --- На каких платформах --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            На каких <span className="text-[#FF6B00]">платформах</span> работает EA Play
          </h2>
          <Accent />

          <div className="grid md:grid-cols-3 gap-4 my-8">
            {[
              { name: 'PlayStation', sub: 'PS5 и PS4', desc: 'Каталог 64 игры. Активация через турецкий или украинский аккаунт PSN. Скидка 10% работает в PS Store.' },
              { name: 'Xbox', sub: 'Series X|S и One', desc: 'Каталог игр EA. Входит в Game Pass Ultimate. Если есть Ultimate \u2014 отдельно покупать не нужно.' },
              { name: 'ПК', sub: 'EA App (Origin)', desc: 'Расширенный каталог. Доступна версия Pro с полным доступом к новинкам. Работает через Steam или EA App.' },
            ].map((p) => (
              <div key={p.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
                <div className="font-rajdhani text-lg font-bold text-white mb-1">{p.name}</div>
                <div className="text-[12px] text-[#5a6a7a] mb-3">{p.sub}</div>
                <p className="text-[13px] text-[#7a8a9a] leading-relaxed m-0">{p.desc}</p>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Как купить --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как купить <span className="text-[#FF6B00]">EA Play</span> из России
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Купить подписку ЕА Плей из России напрямую нельзя &mdash; Electronic Arts заблокировала платежи с российских карт. Но через ActivePlay оформление занимает 5 минут.
          </p>

          <div className="space-y-3 my-8">
            {[
              { t: 'Выберите срок подписки', d: 'На странице EA Play в ActivePlay выберите 1 месяц или 12 месяцев. Годовая подписка \u2014 выгоднее в 2.5 раза.' },
              { t: 'Напишите менеджеру', d: 'Нажмите \u00ABОформить\u00BB \u2014 откроется чат. Менеджер ответит за 2\u20133 минуты.' },
              { t: 'Оплатите в рублях', d: 'Через СБП, карту или ЮMoney. Без зарубежных карт.' },
              { t: 'Подписка активна', d: 'EA Play активируется на ваш аккаунт PSN, Xbox или EA. Каталог и скидки доступны сразу.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#FF6B00]/15 hover:bg-[#FF6B00]/[0.01] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FFD700] flex items-center justify-center font-rajdhani text-lg font-extrabold text-white flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="font-bold text-white text-[15px] mb-1">{s.t}</div>
                  <div className="text-[14px] text-[#7a8a9a] leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Кому подходит --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Кому <span className="text-[#FF6B00]">подходит</span> EA Play
          </h2>
          <Accent />

          <div className="space-y-4 my-8">
            <div className="bg-white/[0.03] border border-[#FF6B00]/20 rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-[#FF6B00] mb-2">Игрокам в EA FC 26 и Ultimate Team</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">Скидка 10% на FC Points. Если покупаете поинтс хотя бы раз в месяц &mdash; EA Play окупается мгновенно. Плюс ежемесячные награды для UT.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-white mb-2">Фанатам Battlefield, Need for Speed, Mass Effect</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">64 игры EA в каталоге. Dead Space, Dragon Age, Star Wars Jedi, Titanfall 2 &mdash; всё включено. Одна подписка вместо десятка покупок.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-rajdhani text-lg font-bold text-white mb-2">Тем, кто хочет попробовать новинки EA</h3>
              <p className="text-[14px] text-[#7a8a9a] leading-relaxed m-0">10 часов раннего доступа. Играйте в новую часть FC, Battlefield или NFS до мирового релиза. Если игра понравилась &mdash; купите со скидкой 10%.</p>
            </div>
          </div>

          <Callout type="warn" label="Когда EA Play не нужен">
            Если у вас Xbox Game Pass Ultimate &mdash; EA Play уже включён. Отдельно покупать &mdash; двойная оплата. Проверьте свою подписку перед покупкой.
          </Callout>

          <Divider />

          {/* --- CTA --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Оформить <span className="text-[#FF6B00]">EA Play</span> в ActivePlay
          </h2>
          <Accent />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить подписку ЕА Плей из России &mdash; к нам. Оплата в рублях через СБП. Активация на ваш аккаунт PlayStation, Xbox или ПК за 5 минут. ActivePlay работает с 2022 года, более 52 000 клиентов.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            EA Play открывает каталог из 64 игр Electronic Arts, скидку 10% на все покупки (включая FC Points и Apex Coins) и ранний доступ к новинкам. Годовая подписка &mdash; самый выгодный вариант.
          </p>

          <div className="bg-gradient-to-br from-[#4a2800] via-[#8B4000] to-[#FF6B00] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-2 relative">Подписка EA Play</h3>
            <p className="text-white/50 text-[14px] mb-6 relative">64 игры {'\u00B7'} Скидка 10% {'\u00B7'} Ранний доступ</p>
            <div className="flex justify-center gap-10 mb-8 relative flex-wrap">
              <Link href="/ea-play" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">1 месяц</div>
                <div className="text-[28px] font-extrabold text-white group-hover:text-[#FF6B00] transition-colors">от 900 {'\u20BD'}</div>
              </Link>
              <Link href="/ea-play" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">12 месяцев</div>
                <div className="text-[28px] font-extrabold text-white group-hover:text-[#FF6B00] transition-colors">4 500 {'\u20BD'}</div>
              </Link>
            </div>
            <p className="text-white/60 text-[15px] mb-8 relative">52 000+ клиентов. Активация за 5 минут. Оплата СБП.</p>
            <Link href="/ea-play" className="inline-block bg-white text-[#8B4000] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative">
              Оформить EA Play
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {['EA Play','еа плей','подписка','Electronic Arts','каталог игр','скидка 10%','FC Points','Battlefield','Dead Space','из России','купить','СБП','EA Play Pro','PS5','Xbox','ПК'].map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#FF6B00]/20 hover:text-[#FF6B00] transition-all cursor-default">{tag}</span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}