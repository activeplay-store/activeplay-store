// ФАЙЛ: src/app/guides/kak-kupit-fc-points-iz-rossii/page.tsx
// git add . && git commit -m "content: гайд FC Points — покупка из России" && git push

import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Как купить FC Points из России — донат Ultimate Team | ActivePlay',
  description: 'Как купить ФК Поинтс (FC Points) для EA Sports FC 26 из России. Все номиналы, цены в рублях, оплата через СБП. Скидка 10% с EA Play. PS5, Xbox, ПК.',
  openGraph: {
    title: 'Как купить FC Points из России — донат EA FC 26',
    description: 'FC Points для Ultimate Team: все номиналы, цены, покупка из России через СБП. Скидка с EA Play.',
    type: 'article',
    url: 'https://activeplay.games/guides/kak-kupit-fc-points-iz-rossii',
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
function Divider() { return <><div className="h-20" /><div className="h-px bg-gradient-to-r from-transparent via-[#2ECC40]/20 to-transparent" /><div className="h-20" /></>; }
function Accent() { return <div className="w-16 h-[3px] bg-gradient-to-r from-[#2ECC40] to-[#00D4FF] rounded-full mb-6" />; }

export default function GuideFCPoints() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ═══ HERO — зелёный EA FC градиент ═══ */}
        <section className="relative overflow-hidden min-h-[480px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0a2a1a] via-50% to-[#1a5c1a]" />
          <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(46,204,64,0.15)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-40px] left-[15%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,212,255,0.08)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link><span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link><span>/</span>
              <span className="text-white/50">FC Points</span>
            </nav>
            <span className="inline-block bg-[#2ECC40] text-[#0A1628] text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">EA Sports FC</span>
            <h1 className="font-rajdhani text-[44px] md:text-[52px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              Как купить <span className="text-[#2ECC40]">FC Points</span> из России
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">Донат Ultimate Team для EA Sports FC 26. Все номиналы, цены в рублях, скидка 10% с EA Play. PS5, Xbox и ПК.</p>
            <div className="flex gap-6 mt-6 text-[13px] text-white/25"><span>6 мин чтения</span><span>FC Points, Ultimate Team, EA FC</span></div>
          </div>
        </section>

        {/* ═══ CONTENT ═══ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            FC Points (ФК Поинтс, ранее FIFA Points) &mdash; внутриигровая валюта EA Sports FC 26. За них покупают паки Ultimate Team, сезонные пропуска, кастомизацию стадиона и входы в Draft-режимы. Без FC Points собрать конкурентоспособную команду в UT намного сложнее.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Купить FC Points из России напрямую нельзя &mdash; EA заблокировала платежи с 2022 года. Но через ActivePlay пополнение занимает 5 минут: оплачиваете в рублях через СБП, мы зачисляем поинтс на ваш аккаунт.
          </p>

          {/* --- Амбассадор --- */}
          <div className="rounded-2xl overflow-hidden border border-[#00D4FF]/20 my-10">
            <div className="relative h-[320px] md:h-[400px]">
              <img src="/images/abel.webp" alt="Даниил Abel Абельдяев — 5-кратный чемпион России по EA FC" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <div className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-1">Даниил Abel Абельдяев</div>
                <div className="text-[14px] text-[#00D4FF] mb-4">5-кратный чемпион России по EA FC · Стример · Амбассадор ActivePlay</div>
                <p className="text-[17px] text-[#9aa8b8] leading-relaxed m-0 italic">
                  &laquo;Я пополняю баланс FC Points через ActivePlay и вам рекомендую &mdash; быстро, безопасно, дёшево&raquo;
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {/* --- Что такое FC Points --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Что такое <span className="text-[#2ECC40]">FC Points</span> и зачем они нужны
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            FC Points &mdash; премиальная валюта в EA Sports FC 26. Их нельзя заработать в игре &mdash; только купить за реальные деньги. Основное применение &mdash; Ultimate Team, самый популярный режим EA FC. Именно UT приносит EA миллиарды долларов ежегодно, и именно там FC Points решают.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-8">
            <h3 className="font-rajdhani text-xl font-bold text-[#2ECC40] mb-4">На что тратят FC Points</h3>
            <div className="space-y-2 text-[15px]">
              {['Паки Ultimate Team \u2014 основной способ получить топовых игроков','Premium Pass (сезонный пропуск) \u2014 награды за каждый уровень','Draft-режимы \u2014 вход стоит 300 FC Points','Кастомизация стадиона и клуба','Слоты Evolutions для прокачки игроков'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#2ECC40]/40 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* --- Номиналы --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Все <span className="text-[#2ECC40]">номиналы</span> FC Points
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            В EA Sports FC 26 доступны восемь номиналов ФК Поинтс. Чем больше пакет &mdash; тем выгоднее цена за один поинт.
          </p>

          <Link href="/igrovaya-valyuta" className="block group">
            <div className="grid grid-cols-4 gap-3 my-8">
              {['100','500','1 050','1 600','2 800','5 900','12 000','18 500'].map((n, i) => (
                <div
                  key={n}
                  className="flex flex-col items-center relative transition-transform duration-300 hover:scale-[1.03] overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #1A0D2E 0%, #0D0D1A 100%)',
                    borderRadius: '12px',
                    border: i === 6 ? '1px solid rgba(0,230,118,0.3)' : '1px solid rgba(0,230,118,0.15)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    height: '140px',
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,230,118,0.12), transparent 60%)' }} />
                  {i === 6 && (
                    <span className="absolute z-10" style={{ top: 26, right: 6, background: 'linear-gradient(135deg, #FF6B00, #FF3D00)', color: '#fff', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', padding: '1px 5px', borderRadius: 4, letterSpacing: 1, boxShadow: '0 2px 6px rgba(255,61,0,0.25)' }}>Хит</span>
                  )}
                  <div className="w-full shrink-0 flex items-center justify-center relative z-10" style={{ height: '22px', background: 'linear-gradient(90deg, #00E676, #76FF03, #00E676)', borderRadius: '12px 12px 0 0', boxShadow: '0 2px 12px rgba(0,230,118,0.3)' }}>
                    <span className="font-bold uppercase" style={{ fontSize: '8px', letterSpacing: '1px', color: '#000' }}>FC Points</span>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-1 relative z-10">
                    <img src="/images/covers/fc-points.webp" alt="FC Points" style={{ width: '40px', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,230,118,0.35))' }} />
                    <div style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,230,118,0.4), transparent)', margin: '3px auto' }} />
                    <span className="font-display" style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(180deg, #FFFFFF 0%, #90CAF9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</span>
                  </div>
                  <span className="text-white uppercase shrink-0 relative z-10" style={{ fontSize: '6px', letterSpacing: '2px', opacity: 0.5, marginBottom: '6px' }}>EA Sports FC 26</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[#2ECC40] text-[14px] font-semibold group-hover:underline">Все номиналы FC Points →</span>
            </div>
          </Link>

          <Callout type="danger" label="Несуществующие номиналы">
            Номиналы 250, 750 и 2 200 FC Points не существуют с FIFA 23. Если кто-то предлагает их купить &mdash; это мошенничество. Только 8 официальных пакетов.
          </Callout>

          <Divider />

          {/* --- Скидка EA Play --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Скидка 10% <span className="text-[#2ECC40]">с EA Play</span>
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Подписка <Link href="/ea-play" className="text-[#00D4FF] hover:underline">EA Play</Link> даёт скидку 10% на все покупки FC Points. Если регулярно донатите в Ultimate Team &mdash; EA Play окупается за первые же покупки. В ActivePlay можно выбрать FC Points &laquo;С EA Play&raquo; или &laquo;Без EA Play&raquo; &mdash; переключатель прямо на странице.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Пример: 12 000 FC Points с EA Play обходятся в 8 000 {'\u20BD'}. Это одна из лучших цен на рынке &mdash; дешевле, чем напрямую через PS Store даже в турецком регионе.
          </p>

          <Callout type="info" label="EA Play входит в Game Pass Ultimate">
            Если у вас есть <Link href="/xbox-game-pass-ultimate" className="text-[#00D4FF] hover:underline">Xbox Game Pass Ultimate</Link>, EA Play уже включён. Скидка 10% на FC Points работает автоматически.
          </Callout>

          <Divider />

          {/* --- Как купить --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как купить <span className="text-[#2ECC40]">FC Points</span> из России
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            EA заблокировала прямые покупки FC Points из России. Российские карты не принимаются ни в PS Store, ни в Microsoft Store, ни в EA App. Но через ActivePlay всё работает.
          </p>

          <div className="space-y-3 my-8">
            {[
              { t: 'Выберите номинал', d: 'Зайдите на страницу FC Points в ActivePlay. Выберите регион (Турция или Украина), номинал и наличие EA Play.' },
              { t: 'Напишите менеджеру', d: 'Нажмите \u00ABКупить\u00BB \u2014 откроется чат в Telegram. Менеджер ответит за 2\u20133 минуты.' },
              { t: 'Оплатите в рублях', d: 'Через СБП, карту или ЮMoney. Никаких зарубежных карт не нужно.' },
              { t: 'Получите FC Points', d: 'Поинтс зачисляются на ваш аккаунт за 5 минут. Сразу можно открывать паки.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#2ECC40]/15 hover:bg-[#2ECC40]/[0.01] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2ECC40] to-[#00D4FF] flex items-center justify-center font-rajdhani text-lg font-extrabold text-white flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="font-bold text-white text-[15px] mb-1">{s.t}</div>
                  <div className="text-[14px] text-[#7a8a9a] leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Платформы --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            На каких <span className="text-[#2ECC40]">платформах</span> работает
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            FC Points покупаются на конкретную платформу. Выбирайте ту, на которой играете.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-8">
            {[
              { name: 'PlayStation', sub: 'PS5 и PS4', desc: 'Через турецкий или украинский аккаунт PSN. Поинтс зачисляются через пополнение кошелька или прямую активацию.' },
              { name: 'Xbox', sub: 'Series X|S и One', desc: 'Через подарочные карты Xbox. Регион аккаунта можно менять в настройках Microsoft.' },
              { name: 'ПК', sub: 'EA App (Origin)', desc: 'Через EA App. Активация кодом или через аккаунт. Работает с любым регионом.' },
            ].map((p) => (
              <div key={p.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
                <div className="font-rajdhani text-lg font-bold text-white mb-1">{p.name}</div>
                <div className="text-[12px] text-[#5a6a7a] mb-3">{p.sub}</div>
                <p className="text-[13px] text-[#7a8a9a] leading-relaxed m-0">{p.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="info" label="Кроссплатформенность">
            FC Points привязаны к платформе. Если купили на PlayStation &mdash; потратить на Xbox не получится.
          </Callout>

          <Divider />

          {/* --- Советы --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Советы по <span className="text-[#2ECC40]">покупке FC Points</span>
          </h2>
          <Accent />

          <div className="space-y-3 mb-10">
            {[
              'Покупайте крупные номиналы \u2014 цена за один поинт ниже',
              'Используйте скидку EA Play 10% \u2014 экономия ощутимая на больших пакетах',
              'Не покупайте перед крупными промо-событиями \u2014 дождитесь выхода промо, чтобы открывать паки',
              'Следите за Lightning Rounds \u2014 специальные паки с повышенным шансом на топовых игроков',
              'Никогда не покупайте FC Points у непроверенных продавцов \u2014 EA банит аккаунты за мошеннические транзакции',
              'Номиналы 250, 750 и 2 200 Points не существуют \u2014 это мошенничество',
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 text-[15px] text-[#8896a5]">
                <div className="w-5 h-5 rounded-full bg-[#2ECC40]/15 border-[1.5px] border-[#2ECC40] flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-[#2ECC40]" /></div>
                {t}
              </div>
            ))}
          </div>

          <Divider />

          {/* --- CTA --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Купить <span className="text-[#2ECC40]">FC Points</span> в ActivePlay
          </h2>
          <Accent />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить ФК Поинтс из России дёшево и быстро &mdash; к нам. Оплата в рублях через СБП или карту &laquo;Мир&raquo;. Пополнение через турецкий или украинский аккаунт за 5 минут. С подпиской EA Play &mdash; скидка 10% на все номиналы.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить FC Points для EA FC 26, донат в Ультимейт Тим, пополнить баланс фифа поинтс &mdash; ActivePlay работает с 2022 года. Более 52 000 клиентов. Все номиналы в наличии: 100, 500, 1 050, 1 600, 2 800, 5 900, 12 000 и 18 500 FC Points. PlayStation, Xbox и ПК.
          </p>

          <div className="bg-gradient-to-br from-[#0a3a0a] via-[#1a5c1a] to-[#2ECC40] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-2 relative">FC Points для EA FC 26</h3>
            <p className="text-white/50 text-[14px] mb-6 relative">12 000 Points &mdash; от 8 000 {'\u20BD'} с EA Play</p>
            <p className="text-white/60 text-[15px] mb-8 relative">52 000+ клиентов. Все номиналы. Оплата СБП.</p>
            <Link href="/igrovaya-valyuta" className="inline-block bg-white text-[#1a5c1a] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(46,204,64,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative mr-3 mb-3">
              Выбрать номинал
            </Link>
            <a href="https://t.me/activeplay1" className="inline-block border-2 border-white/30 text-white font-bold text-base px-12 py-4 rounded-2xl hover:border-white/60 transition-all duration-200 relative mb-3">
              Написать менеджеру
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {['FC Points','фк поинтс','FIFA Points','фифа поинтс','EA FC 26','Ultimate Team','купить','из России','донат','СБП','PS5','Xbox','EA Play'].map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#2ECC40]/20 hover:text-[#2ECC40] transition-all cursor-default">{tag}</span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
