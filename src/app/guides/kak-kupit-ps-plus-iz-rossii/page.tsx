import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Как купить PS Plus из России — пошаговая инструкция | ActivePlay',
  description: 'Как купить и активировать подписку ПС Плюс из России через турецкий или украинский аккаунт. Оплата через СБП, карту Мир. Пошаговая инструкция.',
  openGraph: {
    title: 'Как купить PS Plus из России — пошаговая инструкция',
    description: 'Полный гайд по покупке PlayStation Plus из России. Выбор региона, создание аккаунта, активация подписки.',
    type: 'article',
    url: 'https://activeplay.games/guides/kak-kupit-ps-plus-iz-rossii',
    siteName: 'ActivePlay',
  },
};

/* --- SVG флаги --- */
function FlagTR({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#E30A17"/>
      <circle cx="21" cy="24" r="8" fill="white"/>
      <circle cx="23.5" cy="24" r="6.5" fill="#E30A17"/>
      <polygon points="28,24 30.5,21.5 29,24.5 32,23 29.5,25 32,27 29,26 30.5,28.5 28,26 29.5,29 27.5,26.5 27.5,29.5 27,26.5 25,29 26.5,26 24,27.5 26.5,25.5 24,24 26.5,24" fill="white" transform="translate(1,0) scale(0.8)" style={{transformOrigin:'28px 24px'}}/>
    </svg>
  );
}
function FlagUA({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#005BBB"/>
      <rect y="24" width="48" height="24" rx="0" fill="#FFD500"/>
      <rect x="0" y="36" width="48" height="12" rx="12" ry="12" fill="#FFD500"/>
    </svg>
  );
}
function FlagIN({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="white"/>
      <rect width="48" height="16" rx="12" ry="12" fill="#FF9933"/>
      <rect y="32" width="48" height="16" rx="12" ry="12" fill="#138808"/>
      <circle cx="24" cy="24" r="5" fill="none" stroke="#000088" strokeWidth="1"/>
      <circle cx="24" cy="24" r="1" fill="#000088"/>
    </svg>
  );
}

/* --- helpers --- */
function Callout({ type, label, children }: { type: 'warn' | 'info' | 'danger'; label: string; children: React.ReactNode }) {
  const s = {
    warn:   { wrap: 'bg-[#EF9F27]/[0.06] border-[#EF9F27]/20 border-l-[#EF9F27]', lbl: 'text-[#EF9F27]', txt: 'text-[#d4a44a]', ico: '\u26A0\uFE0F' },
    info:   { wrap: 'bg-[#00D4FF]/[0.05] border-[#00D4FF]/15 border-l-[#00D4FF]',  lbl: 'text-[#00D4FF]', txt: 'text-[#6eaad4]', ico: '\u2139\uFE0F' },
    danger: { wrap: 'bg-[#E24B4A]/[0.06] border-[#E24B4A]/15 border-l-[#E24B4A]',  lbl: 'text-[#E24B4A]', txt: 'text-[#d47a7a]', ico: '\u26D4' },
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

/* --- page --- */
export default function GuidePSPlus() {
  return (
    <>
      <Header />
      <article className="min-h-screen bg-[#0A1628]">

        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden min-h-[480px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#081e3a] via-50% to-[#0070D1]" />
          <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,212,255,0.18)_0%,transparent_60%)] animate-pulse" />
          <div className="absolute bottom-[-50px] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,112,209,0.12)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16 pt-32">
            <nav className="flex items-center gap-2 text-[13px] text-white/30 mb-6">
              <Link href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</Link><span>/</span>
              <Link href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</Link><span>/</span>
              <span className="text-white/50">PS Plus</span>
            </nav>
            <span className="inline-block bg-[#0070D1] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-5">PlayStation</span>
            <h1 className="font-rajdhani text-[48px] md:text-[56px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              Как купить <span className="text-[#00D4FF]">PS Plus</span> из&nbsp;России
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">Полный гайд по покупке и активации подписки PlayStation&nbsp;Plus. Выбор региона, создание аккаунта, оплата через&nbsp;СБП.</p>
            <div className="flex gap-6 mt-6 text-[13px] text-white/25"><span>7 мин чтения</span><span>PS Plus, подписка, СБП</span></div>
          </div>
        </section>

        {/* ═══ CONTENT ═══ */}
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-20">

          {/* --- Вступление --- */}
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            PS Store в России заморожен с марта 2022 года. Sony ушла, ликвидировала юрлицо, убрала страну из списка. Ни Visa, ни Mastercard, ни &laquo;Мир&raquo; &mdash; ничего не работает.
          </p>
          <p className="text-[19px] text-[#9aa8b8] leading-relaxed">
            Подписка ПС Плюс по-прежнему доступна. Нужен аккаунт в другом регионе и специалисты, которые возьмут на себя активацию. Карта пополнения кошелька сама по себе ничего не решает &mdash; об этом ниже.
          </p>

          <Callout type="warn" label="Главное заблуждение">
            Пополнил кошелёк &mdash; подписка твоя? Нет. Sony проверяет IP-адрес. Из России активировать PS Plus нельзя, даже если деньги на балансе. На этом спотыкаются тысячи людей.
          </Callout>

          <Divider />

          {/* --- Регионы (без цен, без выделения, с SVG-флагами) --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Какой регион <span className="text-[#00D4FF]">выбрать</span>
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">PlayStation &mdash; мультирегиональная система. На одной консоли могут быть аккаунты из любых стран мира.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Турция */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5">
              <div className="mb-5"><FlagTR /></div>
              <div className="font-rajdhani text-[22px] font-extrabold text-white mb-4">Турция</div>
              <div className="space-y-2 text-[13px] leading-relaxed">
                <div className="text-[#5DCAA5]">{'\u2713'} Одни из самых низких цен в мире</div>
                <div className="text-[#5DCAA5]">{'\u2713'} Широкое распространение среди российских пользователей</div>
                <div className="text-[#E07070]">{'\u2717'} Нужен VPN для регистрации и турецкий IP для активации подписки</div>
              </div>
            </div>

            {/* Украина — без выделения, как все */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5">
              <div className="mb-5"><FlagUA /></div>
              <div className="font-rajdhani text-[22px] font-extrabold text-white mb-4">Украина</div>
              <div className="space-y-2 text-[13px] leading-relaxed">
                <div className="text-[#5DCAA5]">{'\u2713'} Самый дешёвый регион</div>
                <div className="text-[#5DCAA5]">{'\u2713'} Русский язык в меню и озвучка во многих играх</div>
                <div className="text-[#5DCAA5]">{'\u2713'} Цены не поднимались с момента запуска</div>
                <div className="text-[#E07070]">{'\u2717'} Сложная активация: нужен украинский IP, физическое нахождение или SIM-карта оператора</div>
              </div>
            </div>

            {/* Индия */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5">
              <div className="mb-5"><FlagIN /></div>
              <div className="font-rajdhani text-[22px] font-extrabold text-white mb-4">Индия</div>
              <div className="space-y-2 text-[13px] leading-relaxed">
                <div className="text-[#5DCAA5]">{'\u2713'} Регистрация без VPN</div>
                <div className="text-[#E07070]">{'\u2717'} Только английский язык в играх и в меню</div>
                <div className="text-[#E07070]">{'\u2717'} Частые перебои с картами пополнения</div>
                <div className="text-[#E07070]">{'\u2717'} Невозможно работать с индийскими банками напрямую</div>
                <div className="text-[#E07070]">{'\u2717'} Цены на игры не всегда ниже, чем в других регионах</div>
              </div>
            </div>
          </div>

          <Divider />

          {/* --- Почему нельзя самому --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Почему нельзя <span className="text-[#00D4FF]">активировать самому</span>
          </h2>
          <Accent />

          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Главный подводный камень. Человек покупает карту пополнения, закидывает деньги на кошелёк, заходит в PS Plus, нажимает &laquo;Купить&raquo; &mdash; и получает ошибку.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Sony проверяет IP-адрес при оформлении подписки. Не совпадает с регионом аккаунта &mdash; подписка не пройдёт. Деньги останутся на кошельке, но толку от них нет.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-10">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <FlagTR size={32} />
                <span className="font-rajdhani text-lg font-bold text-white">Турция</span>
              </div>
              <p className="text-[14px] text-[#6b7a8d] leading-relaxed m-0">Нужен турецкий IP на консоли. Без него подписка не оформляется. Игры покупаются нормально &mdash; ограничение только на PS Plus.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <FlagUA size={32} />
                <span className="font-rajdhani text-lg font-bold text-white">Украина</span>
              </div>
              <p className="text-[14px] text-[#6b7a8d] leading-relaxed m-0">Та же история. Нужен украинский VPN или SIM-карта оператора. Без украинского интернета активация не проходит.</p>
            </div>
          </div>

          <Callout type="info" label="Решение">
            Обратитесь к специалистам с инфраструктурой нужного региона. В ActivePlay мы активируем подписки каждый день и знаем все ограничения.
          </Callout>

          <Divider />

          {/* --- Создание аккаунта --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как создать <span className="text-[#00D4FF]">аккаунт PSN</span>
          </h2>
          <p className="text-[#6b7a8d] text-base mt-3 mb-10">Новый email на Gmail, 5 минут и чистый браузер. Всё.</p>

          <div className="space-y-3">
            {[
              { t: 'Режим инкогнито', d: 'Откройте браузер. Для турецкого аккаунта включите VPN с турецким сервером. Для индийского VPN не нужен.' },
              { t: 'Регистрация на PSN', d: 'store.playstation.com \u2192 \u00ABСоздать аккаунт\u00BB. Выберите регион: Turkey, India или Ukraine. Регион фиксируется навсегда.' },
              { t: 'Адрес в стране', d: 'Любой отель с Google Maps. Турция: Istanbul, Kadik\u00F6y, 34710. Индия: Mumbai, Maharashtra, 400001.' },
              { t: 'Почта и пароль', d: 'Gmail, Outlook или любой другой зарубежный почтовый сервис. Sony блокирует российские почтовые адреса \u2014 mail.ru, yandex.ru и другие .ru-домены не подходят.' },
              { t: 'Двухфакторная аутентификация', d: 'Настройки \u2192 Безопасность \u2192 2FA. Включите и сохраните резервные коды.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#00D4FF]/15 hover:bg-[#00D4FF]/[0.01] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0070D1] to-[#00D4FF] flex items-center justify-center font-rajdhani text-lg font-extrabold text-white flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="font-bold text-white text-[15px] mb-1">{s.t}</div>
                  <div className="text-[14px] text-[#7a8a9a] leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Привязка --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Привязка аккаунта <span className="text-[#00D4FF]">к PS5</span>
          </h2>
          <Accent />
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Созданный аккаунт привяжите к консоли. На PS5: Настройки {'\u2192'} Пользователи {'\u2192'} Добавить пользователя. Войдите с новыми данными.
          </p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">
            Затем: Настройки {'\u2192'} Пользователи {'\u2192'} Другое {'\u2192'} Совместное использование консоли {'\u2192'} Включить. После этого все аккаунты на консоли получат доступ к играм PS Plus. Играйте со своего основного аккаунта &mdash; трофеи и сохранения работают.
          </p>
          <Callout type="info" label="Мультирегиональность">
            На одной консоли свободно уживаются аккаунты из разных стран. Это штатная функция PlayStation, не лазейка и не нарушение правил.
          </Callout>

          <Divider />

          {/* --- Продление --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как продлить <span className="text-[#00D4FF]">подписку PS Plus</span>
          </h2>
          <Accent />
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">Продление ПС Плюс работает по тем же правилам. Подписка продлевается с даты окончания текущей. Купили год, пока два месяца остаётся &mdash; год добавится сверху.</p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">Автопродление лучше отключить сразу. Оно требует карты региона, а её у вас нет. Без карты подписка просто закончится. Продлевайте заранее.</p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">Те же ограничения по IP. Из России самостоятельно не продлить. Напишите в ActivePlay &mdash; продлим за 10 минут.</p>

          <Divider />

          {/* --- Оплата --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Оплата через <span className="text-[#00D4FF]">СБП и карту &laquo;Мир&raquo;</span>
          </h2>
          <Accent />
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">Напрямую с PlayStation Store ни СБП, ни &laquo;Мир&raquo; не работают. Sony не поддерживает российскую платёжную инфраструктуру.</p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">Зато оба способа работают для оплаты подписок через российских продавцов. В ActivePlay вы платите в рублях через СБП &mdash; быстро, без комиссии, из любого банка. Вся работа с регионами, IP и активацией &mdash; на нашей стороне.</p>

          <Divider />

          {/* --- Баны --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Баны аккаунтов &mdash; <span className="text-[#00D4FF]">мифы и реальность</span>
          </h2>
          <Accent />
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">PlayStation &mdash; мультирегиональная платформа. Аккаунты из Бельгии, Аргентины и Турции на одной консоли &mdash; норма. Сам по себе иностранный регион не нарушает правил.</p>
          <p className="text-[17px] text-[#9aa8b8] leading-relaxed">Волна банов в мае 2025 затронула аккаунты перекупщиков. Сотни аккаунтов с одного IP, одна карта на всех, продажа пачками. Sony засекла паттерн. Самостоятельно созданные аккаунты с нормальной историей &mdash; работают.</p>

          <Callout type="danger" label="Никогда не делайте чарджбэк">
            Возврат платежа через банк = моментальный перманентный бан аккаунта и консоли. Проблема с покупкой? Пишите в поддержку PlayStation, не в банк.
          </Callout>

          <h3 className="font-rajdhani text-2xl font-bold text-[#00D4FF] mt-10 mb-5">Как защитить аккаунт</h3>
          <div className="space-y-3 mb-10">
            {['Создавайте аккаунт сами \u2014 не покупайте готовые у перекупщиков','Используйте Gmail, Outlook или любой зарубежный почтовый сервис','Включите двухфакторную аутентификацию','Не используйте VPN при обычной игре','Подождите 5\u20137 дней после регистрации перед первой покупкой','Периодически играйте на иностранном аккаунте \u2014 зарабатывайте трофеи'].map((t) => (
              <div key={t} className="flex items-start gap-3 text-[15px] text-[#8896a5]">
                <div className="w-5 h-5 rounded-full bg-[#5DCAA5]/15 border-[1.5px] border-[#5DCAA5] flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-[#5DCAA5]" /></div>
                {t}
              </div>
            ))}
          </div>

          <Divider />

          {/* --- Ошибки --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Частые <span className="text-[#00D4FF]">ошибки</span> и решения
          </h2>
          <Accent />
          <div className="h-4" />
          <div className="space-y-3">
            {[
              { c: 'E-8210604A', d: '\u00ABПроизошла ошибка\u00BB при оплате картой', f: 'Используйте PSN-карты пополнения вместо прямой оплаты' },
              { c: 'E-82000134', d: 'Код не подходит \u2014 регион карты \u2260 регион аккаунта', f: 'Проверьте валюту: TRY для Турции, INR для Индии, UAH для Украины' },
              { c: 'E-82000138', d: 'Кошелёк не пополняется', f: 'Лимит: максимум 5 000 TRY. Перезагрузите консоль' },
              { c: 'WS-116367-4', d: 'Аккаунт полностью заблокирован', f: 'Причины: чарджбэк, купленный аккаунт. Пишите в поддержку региона' },
            ].map((e) => (
              <div key={e.c} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-[#E24B4A]/20 transition-colors">
                <div className="font-mono text-[15px] font-bold text-[#E24B4A]">{e.c}</div>
                <div className="text-[14px] text-[#6b7a8d] mt-1">{e.d}</div>
                <div className="text-[14px] text-[#5DCAA5] mt-2">{'\u2192'} {e.f}</div>
              </div>
            ))}
          </div>

          <Divider />

          {/* --- ФИНАЛ: CTA + цены --- */}
          <h2 className="font-rajdhani text-[38px] font-extrabold text-white leading-tight tracking-tight">
            Как купить (продлить) <span className="text-[#00D4FF]">ПС Плюс</span> в ActivePlay
          </h2>
          <Accent />

          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Купить ПС Плюс дёшево и без головной боли &mdash; к нам. ActivePlay работает с 2022 года, через нас прошли более 52 000 клиентов.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Чтобы активировать ПС Плюс, не нужно разбираться с VPN и региональными блокировками. Наши менеджеры четыре года подряд работают с десятками тысяч клиентов. Знают каждый регион &mdash; Турцию, Украину, Индию.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            У нас три уровня подписки: <Link href="/ps-plus-essential" className="text-[#00D4FF] hover:underline">PS Plus Essential</Link> &mdash; сетевой мультиплеер и 3 игры каждый месяц. <Link href="/ps-plus-extra" className="text-[#00D4FF] hover:underline">PS Plus Extra</Link> &mdash; каталог из 400+ игр, включая God of War, Spider-Man и Hogwarts Legacy. <Link href="/ps-plus-deluxe" className="text-[#00D4FF] hover:underline">PS Plus Deluxe</Link> &mdash; всё из Extra плюс классика PS1/PS2/PSP и пробные версии новинок.
          </p>
          <p className="text-[18px] text-[#9aa8b8] leading-relaxed">
            Оформить или продлить подписку Плейстейшен Плюс Эссеншиал, Экстра или Делюкс &mdash; десять минут. Платите через СБП или карту &laquo;Мир&raquo;. Никаких рисков.
          </p>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0050a0] via-[#0070D1] to-[#00D4FF] rounded-3xl p-12 md:p-14 text-center mt-12 mb-16 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_60%)]" />
            <h3 className="font-rajdhani text-[28px] md:text-[32px] font-extrabold text-white mb-4 relative">Подписка PS Plus</h3>
            <p className="text-white/60 text-[15px] mb-8 relative">52 000+ клиентов с 2022 года. Активация за 10 минут. Гарантия.</p>
            <div className="flex justify-center gap-6 md:gap-10 mb-8 relative flex-wrap">
              <Link href="/ps-plus-essential" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">Essential</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white group-hover:text-[#00D4FF] transition-colors">от 1 250 {'\u20BD'}</div>
              </Link>
              <Link href="/ps-plus-extra" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">Extra</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white group-hover:text-[#00D4FF] transition-colors">от 1 400 {'\u20BD'}</div>
              </Link>
              <Link href="/ps-plus-deluxe" className="text-center group">
                <div className="text-[12px] text-white/45 mb-1">Deluxe</div>
                <div className="text-[24px] md:text-[28px] font-extrabold text-white group-hover:text-[#00D4FF] transition-colors">от 1 550 {'\u20BD'}</div>
              </Link>
            </div>
            <a href="https://t.me/activeplay1" className="inline-block bg-white text-[#0070D1] font-bold text-base px-12 py-4 rounded-2xl hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)] hover:-translate-y-0.5 transition-all duration-200 relative">
              Написать менеджеру
            </a>
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/[0.05]">
            {['PS Plus','PlayStation','подписка','Турция','Украина','из России','СБП','пс плюс','купить','активировать'].map((tag) => (
              <span key={tag} className="text-[12px] text-[#4a5a6a] bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full hover:border-[#00D4FF]/20 hover:text-[#00D4FF] transition-all cursor-default">{tag}</span>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
