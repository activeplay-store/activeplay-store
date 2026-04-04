import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GTA 6 — дата выхода, цена, предзаказ и как купить из России | ActivePlay',
  description: 'Всё о GTA 6: дата выхода 19 ноября 2026, цена, предзаказ, платформы PS5 и Xbox, выход на ПК, карта Вайс-Сити, сюжет. Как купить ГТА 6 из России через турецкий аккаунт.',
  keywords: 'gta 6, гта 6, gta 6 дата выхода, когда выйдет гта 6, gta 6 цена, gta 6 предзаказ, купить gta 6, gta 6 ps5, gta 6 на пк, gta 6 системные требования, gta 6 карта, gta 6 трейлер',
  openGraph: {
    title: 'GTA 6 — дата выхода, цена, предзаказ и как купить из России',
    description: 'Полный гайд по GTA 6: релиз 19 ноября 2026, цены по регионам, предзаказ, покупка из России.',
    type: 'article',
    url: 'https://activeplay.games/guides/gta-6-data-vyhoda-cena-kak-kupit',
    siteName: 'ActivePlay',
    publishedTime: '2026-04-04',
  },
  alternates: { canonical: 'https://activeplay.games/guides/gta-6-data-vyhoda-cena-kak-kupit' },
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
function Divider() { return <><div className="h-20" /><div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" /><div className="h-20" /></>; }
function Accent() { return <div className="w-16 h-[3px] bg-gradient-to-r from-[#FFD700] to-[#FF6B00] rounded-full mb-6" />; }

export default function GuideGTA6() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden min-h-[520px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1a1a0a] via-40% to-[#4a3000]" />
          <div className="absolute top-[-80px] right-[-80px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,215,0,0.12)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-50px] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,107,0,0.08)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link><span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link><span>/</span>
              <span className="text-white/50">GTA 6</span>
            </nav>
            <span className="inline-block bg-[#FFD700] text-[#0A1628] text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">Rockstar Games</span>
            <h1 className="font-rajdhani text-[42px] md:text-[50px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              <span className="text-[#FFD700]">GTA 6</span> &mdash; дата выхода, цена, предзаказ и как купить из России
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">Всё о Grand Theft Auto VI: релиз 19 ноября 2026, Вайс-Сити, Люсия и Джейсон, цены по регионам и пошаговая покупка из России.</p>
            <div className="flex gap-6 mt-6 text-[13px] text-white/25"><span>12 мин чтения</span><span>Обновлено: апрель 2026</span></div>
          </div>
        </section>

        {/* ═══ CONTENT ═══ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          {/* Краткая таблица-саммари */}
          <div className="bg-white/[0.03] border border-[#FFD700]/20 rounded-2xl p-7 mb-12">
            <h3 className="font-rajdhani text-xl font-bold text-[#FFD700] mb-4">GTA 6 &mdash; ключевые факты</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
              {[
                ['Дата выхода', '19 ноября 2026'],
                ['Платформы', 'PS5, Xbox Series X|S'],
                ['ПК-версия', 'Конец 2027 \u2013 начало 2028 (не анонсирована)'],
                ['Предзаказ', 'Не открыт (ожидается лето 2026)'],
                ['Цена (прогноз)', '$70\u201380 (от ~6 750 \u20BD через турецкий аккаунт)'],
                ['Разработчик', 'Rockstar Games'],
                ['Сеттинг', 'Вайс-Сити, штат Леонида (Флорида)'],
                ['Герои', 'Люсия и Джейсон'],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <div className="text-[#6b7a8d]">{k}</div>
                  <div className="text-white font-medium">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Вступление */}
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            GTA 6 &mdash; самая ожидаемая игра десятилетия. Grand Theft Auto V продалась тиражом свыше 210 миллионов копий и генерировала доход 13 лет подряд. Шестая часть обещает переосмыслить формулу: два протагониста, современный Вайс-Сити, живая Флорида с аллигаторами и инфлюэнсерами.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Для российских игроков есть нюанс. PS Store и Xbox Store в России заморожены. Купить ГТА 6 напрямую нельзя. Но через иностранный аккаунт и подарочные карты &mdash; можно, причём дешевле, чем в Европе. Как именно &mdash; разбираем в этом гайде.
          </p>

          <Divider />

          {/* ═══ 1. ДАТА ВЫХОДА ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Дата выхода <span className="text-[#FFD700]">GTA 6</span> &mdash; когда релиз
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Когда выйдет ГТА 6? Официальная дата релиза &mdash; <strong className="text-white">19 ноября 2026 года</strong>. Это четверг, как и большинство крупных релизов Rockstar.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Игра переносилась дважды. Первый трейлер в декабре 2023 года обещал осень 2025. В мае 2025 вместе со вторым трейлером дату сдвинули на 26 мая 2026. В ноябре 2025 &mdash; ещё один перенос, на 19 ноября 2026. Больше переносов не ожидается: CEO Take-Two Штраусс Зельник подтвердил дату на февральском звонке с инвесторами и назвал запуск &laquo;groundbreaking&raquo;.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Вышла ли GTA 6? Нет, на апрель 2026 года игра находится на финальном этапе разработки. Rockstar активно нанимает QA-тестеров, что подтверждает близость к золоту.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-8">
            <h3 className="font-rajdhani text-lg font-bold text-[#FFD700] mb-3">Хронология переносов</h3>
            <div className="space-y-2 text-[14px]">
              {[
                ['Декабрь 2023', 'Трейлер 1 \u2014 анонс на осень 2025'],
                ['Май 2025', 'Трейлер 2 \u2014 перенос на 26 мая 2026'],
                ['Ноябрь 2025', 'Перенос на 19 ноября 2026'],
                ['Февраль 2026', 'Take-Two подтверждает дату'],
                ['Апрель 2026', 'Без изменений. Финальный этап'],
              ].map(([date, event]) => (
                <div key={date} className="flex gap-4">
                  <div className="text-[#FFD700] font-semibold w-32 flex-shrink-0">{date}</div>
                  <div className="text-[#8896a5]">{event}</div>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* ═══ 2. ПЛАТФОРМЫ + ПК ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            GTA 6 на ПК &mdash; <span className="text-[#FFD700]">дата выхода и системные требования</span>
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            При запуске GTA 6 выйдет только на <strong className="text-white">PS5</strong> и <strong className="text-white">Xbox Series X|S</strong>. PS4 и Xbox One не поддерживаются &mdash; игра создаётся исключительно для нового поколения консолей.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            GTA 6 на ПК &mdash; самый частый вопрос. Rockstar <strong className="text-white">не анонсировала ПК-версию</strong>. Это стандартная стратегия студии: GTA V вышла на ПК через 18 месяцев после консолей, Red Dead Redemption 2 &mdash; через 13 месяцев. Исходя из этого паттерна, выход ГТА 6 на ПК ожидается в <strong className="text-white">конце 2027 &mdash; начале 2028 года</strong>.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Дата выхода GTA 6 на ПК не объявлена, и платформа дистрибуции (Steam, Epic Games Store, Rockstar Launcher) пока неизвестна. Если хотите играть в день релиза &mdash; нужна PS5 или Xbox Series.
          </p>

          <h3 className="font-rajdhani text-2xl font-bold text-[#FFD700] mt-10 mb-5">Системные требования GTA 6 на ПК (прогноз)</h3>
          <p className="text-[15px] text-[#6b7a8d] mb-6">Официальных требований нет. Прогноз на основе RAGE Engine и Red Dead Redemption 2.</p>

          <div className="overflow-hidden rounded-2xl border border-white/[0.06] my-8">
            <div className="grid grid-cols-4 bg-white/[0.04]">
              <div className="p-3 text-[12px] text-[#6b7a8d] font-semibold border-r border-white/[0.06]">Компонент</div>
              <div className="p-3 text-[12px] font-bold text-center text-[#E07070]">Мин. (1080p/30fps)</div>
              <div className="p-3 text-[12px] font-bold text-center text-[#FFD700] border-x border-white/[0.06]">Рек. (1440p/60fps)</div>
              <div className="p-3 text-[12px] font-bold text-center text-[#5DCAA5]">Ultra (4K/60fps)</div>
            </div>
            {[
              { c: 'Процессор', a: 'i5-6600K / Ryzen 5 3600', b: 'i7-10700 / Ryzen 7 7800X3D', d: 'i9-13900K / Ryzen 9 7950X' },
              { c: 'Видеокарта', a: 'GTX 1660 / RX 6600 XT', b: 'RTX 3060\u20133070 / RX 6700 XT', d: 'RTX 4080 / RX 7900 XTX' },
              { c: 'Оперативная', a: '16 ГБ', b: '16\u201332 ГБ', d: '32 ГБ' },
              { c: 'Диск', a: 'SSD 150 ГБ', b: 'NVMe SSD', d: 'NVMe SSD' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'}`}>
                <div className="p-3 text-[12px] text-[#8896a5] border-r border-white/[0.06]">{row.c}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8]">{row.a}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8] border-x border-white/[0.06]">{row.b}</div>
                <div className="p-3 text-center text-[12px] text-[#9aa8b8]">{row.d}</div>
              </div>
            ))}
          </div>

          <Callout type="info" label="SSD обязателен">
            GTA 6 использует потоковую загрузку мира без экранов загрузки. HDD не справится. Даже на минимальных настройках понадобится SSD &mdash; это требование нового поколения.
          </Callout>

          <Divider />

          {/* ═══ 3. СЮЖЕТ ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Сюжет <span className="text-[#FFD700]">GTA 6</span> &mdash; Люсия, Джейсон и современный Вайс-Сити
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Впервые в истории серии Grand Theft Auto &mdash; два играбельных протагониста с переключением в реальном времени, как в GTA V.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            <strong className="text-white">Люсия Каминос</strong> &mdash; первая женщина-главный герой в истории GTA. Латиноамериканка, недавно вышла из тюрьмы Леонида. <strong className="text-white">Джейсон Дюваль</strong> &mdash; вырос среди мошенников, отслужил в армии, связался с наркокурьерами во Флорида-Кис. Rockstar описывает их как &laquo;преступный дуэт&raquo; в духе Бонни и Клайда.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Действие разворачивается в современном <strong className="text-white">Вайс-Сити</strong> &mdash; вымышленном аналоге Майами &mdash; в штате <strong className="text-white">Леонида</strong> (аналог Флориды). Временной период &mdash; наши дни: сатира на 2020-е с соцсетями, инфлюэнсерами и культурой &laquo;Florida Man&raquo;. Официальное описание с PS Store: &laquo;Когда простое дело идёт наперекосяк, они оказываются в самой тёмной стороне самого солнечного места в Америке&raquo;.
          </p>

          <Divider />

          {/* ═══ 4. КАРТА ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Карта <span className="text-[#FFD700]">GTA 6</span> &mdash; Вайс-Сити и штат Леонида
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Карта ГТА 6 &mdash; шесть регионов штата Леонида. По оценкам фанатов, площадь составляет порядка 125 км{'\u00B2'} &mdash; это в 2{'\u2013'}2,5 раза больше карты GTA V. Проезд от края до края на автомобиле занимает около 6 минут.
          </p>

          <div className="space-y-3 my-8">
            {[
              { name: 'Vice City', real: 'Майами', desc: 'Неоновый горизонт, ар-деко, Оушен-Бич, Маленькая Куба' },
              { name: 'Leonida Keys', real: 'Флорида-Кис', desc: 'Тропические острова, бары, опасные воды' },
              { name: 'Grassrivers', real: 'Эверглейдс', desc: 'Болота, аллигаторы, мангровые заросли' },
              { name: 'Port Gellhorn', real: 'Побережье залива', desc: 'Разрушенный курортный город' },
              { name: 'Ambrosia', real: 'Центральная Флорида', desc: 'Сахарные заводы, байкерские банды, озеро' },
              { name: 'Mount Kalaga', real: 'Северная Флорида', desc: 'Леса, каньоны, охота, бездорожье' },
            ].map((r) => (
              <div key={r.name} className="flex gap-5 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                <div className="w-32 flex-shrink-0">
                  <div className="font-rajdhani text-[15px] font-bold text-[#FFD700]">{r.name}</div>
                  <div className="text-[11px] text-[#5a6a7a]">{r.real}</div>
                </div>
                <div className="text-[14px] text-[#7a8a9a]">{r.desc}</div>
              </div>
            ))}
          </div>

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            В трейлере 2 на номерных знаках замечен штат <strong className="text-white">Gloriana</strong> (аналог Джорджии). Возможно, карту расширят через DLC. Rockstar также подтвердила 700+ доступных интерьеров &mdash; беспрецедентная детализация для открытого мира.
          </p>

          <Divider />

          {/* ═══ 5. ТРЕЙЛЕРЫ ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Трейлеры и геймплей <span className="text-[#FFD700]">GTA 6</span>
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            На апрель 2026 года вышло два официальных трейлера ГТА 6. Первый (декабрь 2023) набрал 251 млн+ просмотров и представил Люсию и Вайс-Сити. Второй (май 2025) набрал 70 млн+ просмотров за 20 часов и показал Джейсона и динамику отношений между героями.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Третий трейлер GTA 6 ожидается в <strong className="text-white">мае 2026 года</strong> &mdash; Take-Two подтвердила &laquo;летний маркетинг&raquo;. Ожидается, что вместе с трейлером 3 откроются предзаказы.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 my-8">
            <h3 className="font-rajdhani text-lg font-bold text-[#FFD700] mb-3">Известные механики (трейлеры + утечки)</h3>
            <div className="space-y-2 text-[15px]">
              {['Два протагониста с переключением в реальном времени','Ограниченная система оружия \u2014 тяжёлое хранится в багажнике','700+ интерьеров \u2014 можно заходить в здания','ViceTube \u2014 пародия на TikTok внутри игры','Продвинутый ИИ NPC \u2014 реалистичные реакции и поведение','Без экранов загрузки \u2014 бесшовный открытый мир'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#9aa8b8]">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]/40 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* ═══ 6. GTA ONLINE 2 ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            GTA 6 Online &mdash; <span className="text-[#FFD700]">что известно о мультиплеере</span>
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Rockstar не раскрывала деталей мультиплеера. Но на странице PS Store указано &laquo;Online Interactions Not Rated by the ESRB&raquo; &mdash; онлайн-компонент точно существует.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            В 2023 году Rockstar купила Cfx.re &mdash; создателей FiveM и RedM (моды для RP-серверов GTA V). Это сильный сигнал о продвинутом мультиплеере с поддержкой пользовательских серверов. По неподтверждённым данным: 64-игроковые лобби (цель &mdash; 96), возможная отдельная продажа GTA Online от сюжетного режима, бесшовный мультиплеер.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Микротранзакции (Shark Cards или аналог) почти наверняка вернутся &mdash; GTA Online генерирует миллиарды долларов ежегодно. Подписка GTA+ тоже, вероятно, перейдёт в шестую часть.
          </p>

          <Divider />

          {/* ═══ 7. ЦЕНА ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Сколько стоит <span className="text-[#FFD700]">GTA 6</span> &mdash; цена и издания
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Официальная цена ГТА 6 не объявлена. Но CEO Take-Two Штраусс Зельник обмолвился в интервью: &laquo;Трудно представить, что мы вставим рекламу в игру, за которую человек заплатил 70 или 80 баксов&raquo;. Это самый сильный ценовой сигнал на сегодня.
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/[0.06] my-8">
            <div className="grid grid-cols-3 bg-white/[0.04]">
              <div className="p-4 text-[12px] text-[#6b7a8d] font-semibold border-r border-white/[0.06]">Регион / Метод</div>
              <div className="p-4 text-[12px] font-bold text-center text-[#FFD700]">Standard (прогноз)</div>
              <div className="p-4 text-[12px] font-bold text-center text-[#FF6B00]">Deluxe (прогноз)</div>
            </div>
            {[
              { r: 'США', a: '$69,99\u2013$79,99', b: '$89,99\u2013$99,99' },
              { r: 'Европа', a: '\u20AC79,99', b: '\u20AC99,99\u2013\u20AC109,99' },
              { r: 'Турция (PS Store)', a: '~\u20BA2 500\u20133 000', b: '~\u20BA3 500\u20134 000' },
              { r: '\u0420\u043E\u0441\u0441\u0438\u044F (тур. аккаунт)', a: '~6 750\u20138 100 \u20BD', b: '~9 500\u201310 800 \u20BD' },
              { r: '\u0420\u043E\u0441\u0441\u0438\u044F (физ. диск)', a: '7 000\u201310 000 \u20BD', b: '\u2014' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'}`}>
                <div className="p-3 text-[13px] text-[#8896a5] border-r border-white/[0.06]">{row.r}</div>
                <div className="p-3 text-center text-[13px] text-[#9aa8b8]">{row.a}</div>
                <div className="p-3 text-center text-[13px] text-[#9aa8b8]">{row.b}</div>
              </div>
            ))}
          </div>

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Сколько будет стоить GTA 6 для россиян? Самый дешёвый вариант &mdash; цифровая покупка через <strong className="text-white">турецкий аккаунт PS Store</strong>. При ожидаемой цене ~{'\u20BA'}2 500 и текущем курсе это порядка 6 750{'\u2013'}8 100 {'\u20BD'}.
          </p>

          <Callout type="info" label="Издания пока не объявлены">
            Rockstar не анонсировала издания. Два обнаруженных ID в базе PS Store указывают минимум на Standard и Deluxe. Точный состав изданий станет известен при открытии предзаказов. Мы обновим гайд.
          </Callout>

          <Divider />

          {/* ═══ 8. ПРЕДЗАКАЗ ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Предзаказ <span className="text-[#FFD700]">GTA 6</span> &mdash; когда и как оформить
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Предзаказ ГТА 6 пока <strong className="text-white">не открыт</strong>. На PS Store существует страница, где можно добавить игру в список желаний. Кнопки &laquo;Купить&raquo; нет, цена не указана.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Когда откроется предзаказ? Ожидаемый срок &mdash; <strong className="text-white">июль{'\u2013'}сентябрь 2026</strong>, одновременно с трейлером 3 и стартом маркетинговой кампании. В марте 2026 в базе PS Store обнаружены новые идентификаторы &mdash; типичный шаг перед открытием предзаказов.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Российские ритейлеры физических дисков (IgroRay, GameBuy, Gameconsol) уже принимают предзаказы по 7 000{'\u2013'}10 000 {'\u20BD'}. Цифровой предзаказ через иностранный аккаунт станет доступен после открытия в PS Store.
          </p>

          <Callout type="warn" label="{`Не покупайте «предзаказы» у перекупщиков`}">
            Пока Rockstar не открыла предзаказы, никто не может продать вам цифровую копию GTA 6. Если кто-то предлагает &laquo;ключ GTA 6&raquo; прямо сейчас &mdash; это мошенничество.
          </Callout>

          <Divider />

          {/* ═══ 9. КАК КУПИТЬ ИЗ РОССИИ ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как купить <span className="text-[#FFD700]">GTA 6</span> из России &mdash; полный гайд
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            PS Store и Xbox Store в России заморожены с 2022 года. Российские карты не принимаются. Но купить ГТА 6 из России можно &mdash; через иностранный аккаунт и подарочные карты. Вот рабочие методы.
          </p>

          <h3 className="font-rajdhani text-2xl font-bold text-[#FFD700] mt-10 mb-5">Метод 1: Цифровая покупка через турецкий аккаунт PSN</h3>
          <p className="text-[15px] text-[#9aa8b8] leading-relaxed">
            Самый дешёвый способ. Турция &mdash; один из самых дешёвых регионов PS Store. Нужен турецкий аккаунт PSN и подарочные карты PSN в турецких лирах. Подробная инструкция по созданию аккаунта &mdash; в нашем <Link href="/guides/kak-kupit-ps-plus-iz-rossii" className="text-[#00D4FF] hover:underline">гайде по PS Plus</Link>.
          </p>

          <div className="space-y-3 my-6">
            {[
              { t: 'Создайте турецкий аккаунт PSN', d: 'Или используйте существующий. Регион \u2014 Turkey.' },
              { t: 'Купите подарочные карты PSN (Турция)', d: 'В ActivePlay \u2014 оплата в рублях через СБП. Номинал зависит от цены игры.' },
              { t: 'Пополните кошелёк PS Store', d: 'Введите код карты в PS Store через турецкий аккаунт.' },
              { t: 'Оформите предзаказ или купите игру', d: 'Когда предзаказ откроется \u2014 нажмите \u00ABКупить\u00BB. Нужен турецкий IP для оплаты.' },
              { t: 'Играйте на основном аккаунте', d: 'Включите \u00ABСовместное использование консоли\u00BB \u2014 игра доступна всем аккаунтам на PS5.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center font-rajdhani text-sm font-extrabold text-white flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="font-bold text-white text-[14px] mb-1">{s.t}</div>
                  <div className="text-[13px] text-[#7a8a9a]">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-rajdhani text-2xl font-bold text-[#FFD700] mt-10 mb-5">Метод 2: Физический диск</h3>
          <p className="text-[15px] text-[#9aa8b8] leading-relaxed">
            Российские ритейлеры продают диски GTA 6 для PS5 и Xbox. Цены &mdash; 7 000{'\u2013'}10 000 {'\u20BD'}. Плюс: не нужен иностранный аккаунт. Минус: дороже цифры через Турцию, нужно ждать доставку.
          </p>

          <h3 className="font-rajdhani text-2xl font-bold text-[#FFD700] mt-10 mb-5">Метод 3: Покупка через ActivePlay</h3>
          <p className="text-[15px] text-[#9aa8b8] leading-relaxed">
            Не хотите разбираться с аккаунтами, VPN и картами пополнения? Напишите менеджеру в ActivePlay &mdash; мы оформим покупку или предзаказ GTA 6 на ваш аккаунт. Оплата в рублях через СБП. Активация за 10 минут. Как только предзаказ откроется &mdash; мы одни из первых начнём продавать.
          </p>

          <Divider />

          {/* ═══ 10. CTA ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Купить <span className="text-[#FFD700]">GTA 6</span> через ActivePlay
          </h2>
          <Accent />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            ActivePlay &mdash; магазин игровых подписок и цифровых товаров для России. Работаем с 2022 года, более 52 000 клиентов. Когда предзаказ GTA 6 откроется &mdash; мы начнём продавать одними из первых.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Уже сейчас у нас можно купить подарочные карты PSN (Турция, Украина, Индия) для пополнения кошелька PS Store, подписки <Link href="/ps-plus-essential" className="text-[#00D4FF] hover:underline">PS Plus</Link> и <Link href="/xbox-game-pass-ultimate" className="text-[#00D4FF] hover:underline">Xbox Game Pass</Link> для онлайн-мультиплеера в GTA Online.
          </p>

          <div className="bg-gradient-to-br from-[#3a2800] via-[#6a4a00] to-[#FFD700] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-4 relative">GTA 6 &mdash; будь первым</h3>
            <p className="text-white/60 text-[15px] mb-4 relative">Предзаказ ещё не открыт. Подготовьтесь заранее.</p>
            <p className="text-white/50 text-[14px] mb-8 relative">Подарочные карты PSN для покупки GTA 6 через турецкий аккаунт уже в продаже.</p>
            <a href="https://t.me/activeplay1" className="inline-block bg-white text-[#6a4a00] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative">
              Написать менеджеру
            </a>
          </div>

          <Divider />

          {/* ═══ FAQ ═══ */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Частые <span className="text-[#FFD700]">вопросы</span> о GTA 6
          </h2>
          <Accent />

          <div className="space-y-3 my-8">
            {[
              { q: 'Когда выйдет GTA 6?', a: '19 ноября 2026 года на PS5 и Xbox Series X|S.' },
              { q: 'Выйдет ли GTA 6 на ПК?', a: 'ПК-версия не анонсирована. По паттерну Rockstar \u2014 конец 2027 или начало 2028.' },
              { q: 'Сколько стоит GTA 6?', a: 'Цена не объявлена. Прогноз: $70\u201380. Через турецкий аккаунт \u2014 от ~6 750 \u20BD.' },
              { q: 'Можно ли купить GTA 6 в России?', a: 'Напрямую \u2014 нет. Через иностранный аккаунт PSN и подарочные карты \u2014 да. Через ActivePlay \u2014 с оплатой в рублях.' },
              { q: 'Когда откроется предзаказ GTA 6?', a: 'Ожидается лето 2026, одновременно с трейлером 3.' },
              { q: 'Будет ли GTA Online 2?', a: 'Онлайн-компонент подтверждён на PS Store. Детали пока неизвестны.' },
              { q: 'Выйдет ли GTA 6 на PS4?', a: 'Нет. Только PS5 и Xbox Series X|S. PS4 и Xbox One не поддерживаются.' },
              { q: 'Какие системные требования GTA 6 на ПК?', a: 'Официальных нет. Прогноз: минимум GTX 1660, 16 \u0413\u0411 RAM, SSD обязателен.' },
              { q: 'Будет ли русская озвучка в GTA 6?', a: 'Не подтверждена. Rockstar обычно делает субтитры на русском, озвучка \u2014 английская.' },
              { q: 'Нужен ли PS Plus для GTA 6 Online?', a: 'Для мультиплеера на PlayStation \u2014 скорее всего да. Подписку PS Plus можно купить в ActivePlay.' },
            ].map((faq) => (
              <details key={faq.q} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden group">
                <summary className="p-6 cursor-pointer text-white font-semibold text-[16px] flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  {faq.q}
                  <span className="text-[#FFD700] text-xl ml-4 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-[15px] text-[#8896a5] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {['GTA 6','гта 6','дата выхода','когда выйдет','цена','предзаказ','купить','из России','PS5','Xbox','ПК','системные требования','карта','Вайс-Сити','Леонида','Люсия','Джейсон','трейлер','GTA Online','Rockstar Games'].map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#FFD700]/20 hover:text-[#FFD700] transition-all cursor-default">{tag}</span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
