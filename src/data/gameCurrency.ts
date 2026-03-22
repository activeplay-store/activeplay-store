export interface CurrencyNominal {
  label: string;
  displayValue: string;
  priceTR: number;
  priceUA: number;
  hit?: boolean;
}

export interface CurrencyNominalEA extends CurrencyNominal {
  priceEaTR: number;
  priceEaUA: number;
}

export interface GameCurrency {
  id: string;
  title: string;
  subtitle: string;
  seoDesc: string;
  buttonText: string;
  hasRegions: boolean;
  hasEaPlay?: boolean;
}

// FC Points — НЕ ТРОГАТЬ
export const fcPointsNominals: CurrencyNominalEA[] = [
  { label: '100 Points', displayValue: '100', priceTR: 350, priceUA: 300, priceEaTR: 320, priceEaUA: 270 },
  { label: '500 Points', displayValue: '500', priceTR: 770, priceUA: 650, priceEaTR: 700, priceEaUA: 590 },
  { label: '1 050 Points', displayValue: '1 050', priceTR: 1300, priceUA: 1100, priceEaTR: 1180, priceEaUA: 1000 },
  { label: '1 600 Points', displayValue: '1 600', priceTR: 1850, priceUA: 1600, priceEaTR: 1670, priceEaUA: 1450 },
  { label: '2 800 Points', displayValue: '2 800', priceTR: 2850, priceUA: 2500, priceEaTR: 2580, priceEaUA: 2260 },
  { label: '5 900 Points', displayValue: '5 900', priceTR: 5450, priceUA: 4800, priceEaTR: 4950, priceEaUA: 4350 },
  { label: '12 000 Points', displayValue: '12 000', priceTR: 8000, priceUA: 7200, priceEaTR: 7250, priceEaUA: 6500, hit: true },
  { label: '18 500 Points', displayValue: '18 500', priceTR: 11000, priceUA: 10500, priceEaTR: 10000, priceEaUA: 9500 },
];

// V-Bucks — PS Store Turkey март 2026
export const vbucksNominals: CurrencyNominal[] = [
  { label: '800 V-Bucks', displayValue: '800', priceTR: 750, priceUA: 650 },
  { label: '2 400 V-Bucks', displayValue: '2 400', priceTR: 1500, priceUA: 1300 },
  { label: '4 500 V-Bucks', displayValue: '4 500', priceTR: 2300, priceUA: 2000 },
  { label: '12 500 V-Bucks', displayValue: '12 500', priceTR: 5200, priceUA: 4500, hit: true },
];

// Apex Coins — PS Store Turkey март 2026, скидка 10% с EA Play
export const apexNominals: CurrencyNominalEA[] = [
  { label: '2 150 Apex Coins', displayValue: '2 150', priceTR: 2000, priceUA: 1750, priceEaTR: 1800, priceEaUA: 1600 },
  { label: '4 350 Apex Coins', displayValue: '4 350', priceTR: 3800, priceUA: 3300, priceEaTR: 3450, priceEaUA: 3000 },
  { label: '11 500 Apex Coins', displayValue: '11 500', priceTR: 9000, priceUA: 7800, priceEaTR: 8100, priceEaUA: 7100, hit: true },
];

// Genesis Crystals — пополнение по UID
export const genshinNominals: CurrencyNominal[] = [
  { label: '60 кристаллов', displayValue: '60', priceTR: 400, priceUA: 350 },
  { label: '300 кристаллов', displayValue: '300', priceTR: 850, priceUA: 650 },
  { label: '980 кристаллов', displayValue: '980', priceTR: 2150, priceUA: 1500 },
  { label: '1 980 кристаллов', displayValue: '1 980', priceTR: 3950, priceUA: 2550 },
  { label: '3 280 кристаллов', displayValue: '3 280', priceTR: 6350, priceUA: 4400 },
  { label: '6 480 кристаллов', displayValue: '6 480', priceTR: 12600, priceUA: 8500, hit: true },
];

// COD Points — PS Store Turkey март 2026
export const codNominals: CurrencyNominal[] = [
  { label: '1 100 CP', displayValue: '1 100', priceTR: 1200, priceUA: 1050 },
  { label: '2 400 CP', displayValue: '2 400', priceTR: 2100, priceUA: 1850 },
  { label: '5 000 CP', displayValue: '5 000', priceTR: 4000, priceUA: 3500 },
  { label: '13 000 CP', displayValue: '13 000', priceTR: 9600, priceUA: 8400, hit: true },
];

// GTA Shark Cards — PS Store Turkey март 2026
export const gtaNominals: CurrencyNominal[] = [
  { label: 'Tiger Shark ($250K)', displayValue: 'Tiger', priceTR: 600, priceUA: 550 },
  { label: 'Bull Shark ($600K)', displayValue: 'Bull', priceTR: 950, priceUA: 800 },
  { label: 'Great White ($1.5M)', displayValue: 'Great White', priceTR: 1650, priceUA: 1400 },
  { label: 'Whale Shark ($4.25M)', displayValue: 'Whale', priceTR: 3700, priceUA: 3200, hit: true },
  { label: 'Megalodon ($10M)', displayValue: 'Megalodon', priceTR: 7000, priceUA: 6100 },
];

export const currencyFaq = [
  { q: 'Как купить игровую валюту из России?', a: 'Напишите менеджеру в Telegram, VK или через сайт. Выберите валюту (FC Points, V-Bucks, Apex Coins и др.), номинал и регион (Турция, Украина, Индия). Оплатите в рублях через СБП, карту МИР или ЮMoney. Менеджер пополнит баланс вашего аккаунта за 5–20 минут. Никаких зарубежных карт, VPN и сложных настроек — всё делаем за вас.' },
  { q: 'Можно ли зачислить валюту на российский PSN-аккаунт?', a: 'Нет. После известных событий 2022 года Sony полностью отключила все платежи для российских аккаунтов PSN. Пополнить кошелёк, купить игровую валюту или оформить подписку на российском аккаунте невозможно. Вы можете продолжать играть на российском аккаунте, но для покупок внутриигровой валюты (FC Points, V-Bucks, Apex Coins, COD Points) нужен турецкий, украинский или индийский аккаунт. Мы поможем с созданием и настройкой — напишите менеджеру.' },
  { q: 'Какую игровую валюту можно купить через ActivePlay?', a: 'FC Points (EA Sports FC 26) — PS5, PS4, Xbox, ПК. V-Bucks (Fortnite) — PS5, PS4, Xbox, ПК, Switch. Apex Coins (Apex Legends) — PS5, PS4, Xbox, ПК. Genesis Crystals (Genshin Impact) — PS5, ПК, мобильные. COD Points (Call of Duty) — PS5, PS4, Xbox. Shark Cards (GTA Online) — PS5, PS4, Xbox. Также принимаем заявки на любую другую игровую валюту — Minecoins Minecraft, гемы Brawl Stars, PUBG UC, донат Standoff 2 и другие. Напишите менеджеру.' },
  { q: 'Принимаете ли вы криптовалюту и ЮMoney для оплаты?', a: 'Да. Основной способ — СБП (быстро и без комиссии). Также принимаем карты МИР, ЮMoney (без комиссии), USDT (Tether). Для оплаты криптовалютой напишите менеджеру — он сформирует счёт. Все платежи проходят через защищённые каналы.' },
  { q: 'Не забанят ли мой аккаунт за покупку игровой валюты через ActivePlay?', a: 'Нет. Мы зачисляем валюту через официальные каналы — коды активации, подарочные карты и пополнение через легальные региональные магазины (PS Store Турция, PS Store Украина, PS Store Индия). Это не нарушает правила издателей. За 4 года работы и 52 000+ клиентов ни одного случая бана.' },
  { q: 'Что такое откат валюты и как ActivePlay от этого защищает?', a: 'Откат — это когда валюта списывается с аккаунта через несколько дней после покупки. Происходит, если продавец оплатил краденой картой — банк делает чарджбек, издатель забирает валюту и может забанить аккаунт. У ActivePlay это невозможно. У нас собственные счета в иностранных банках, мы не используем подставных лиц и чужие карты. Все оплаты проходят через наши легальные счета — откат полностью исключён.' },
  { q: 'Как отличить надёжный сервис от мошенников при покупке доната?', a: 'Надёжный сервис — это ActivePlay, проверенный годами работы с 2022 года, 52 000+ реальных клиентов, все способы оплаты легальные — СБП, карта МИР, ЮMoney. Реальные отзывы в Telegram-канале, сотрудничество с крупнейшими блогерами и киберспортсменами, поддержка 24/7. За остальных мы отвечать не можем — будьте осторожны с сервисами без сайта, без отзывов и с ценами в 3–4 раза ниже рынка.' },
  { q: 'Можно ли вернуть деньги, если передумал или возникла проблема?', a: 'До зачисления валюты — полный возврат без вопросов. После зачисления — цифровая валюта возврату не подлежит (политика всех издателей — EA, Epic, Sony). Если ошибка на стороне ActivePlay (зачислили не тот номинал, не на тот аккаунт) — полный возврат или повторное зачисление за наш счёт.' },
  { q: 'Нужно ли передавать пароль от аккаунта для зачисления валюты?', a: 'Зависит от платформы и игры. На PlayStation в большинстве случаев требуется логин и пароль — покупка происходит через баланс аккаунта. Альтернатива — пополнение через PSN-карту, тогда пароль не нужен. На Xbox — зачисляем через код активации, без передачи логина и пароля. Genshin Impact — пополняем по UID (9 цифр из профиля), пароль не нужен. Мы гарантируем безопасность ваших данных.' },
  { q: 'Сколько времени занимает зачисление валюты после оплаты?', a: 'Коды активации (V-Bucks, PSN-карты, Xbox-карты) — моментально после оплаты, вы получаете код и активируете сами. Пополнение по UID (Genshin Impact) — 5–15 минут. Зачисление через менеджера (FC Points, Apex Coins, COD Points) — до 10 минут, при высокой загрузке — до 20 минут в рабочее время (10:00–23:30 МСК).' },
  { q: 'Что делать, если валюта не поступила на аккаунт после оплаты?', a: 'За всю практику ActivePlay не было ни одного случая, чтобы валюта не зачислилась. Иногда клиенты путают свои аккаунты на PlayStation — валюта зачисляется на один аккаунт, а проверяют баланс на другом. Если вы не видите валюту — перезайдите в игру и проверьте, на каком аккаунте вы авторизованы. Если всё равно не нашли — напишите менеджеру с номером заказа, разберёмся за 5 минут.' },
  { q: 'Сохранится ли валюта, если я играю на нескольких платформах — PS5, Xbox, ПК?', a: 'Зависит от игры. V-Bucks (Fortnite) — общий баланс между платформами, но купленные через PS Store или Xbox Store привязаны к платформе покупки. FC Points — привязаны к платформе, не переносятся. Genshin Impact кристаллы — привязаны к платформе покупки. Apex Coins — привязаны к платформе. Перед покупкой уточните у менеджера, на какой платформе играете — подберём правильный вариант.' },
  { q: 'Как работает пополнение Genshin Impact по UID — без доступа к аккаунту?', a: 'Откройте Genshin Impact, в правом нижнем углу экрана — ваш UID (9 цифр). Сообщите его менеджеру вместе с названием сервера (Europe, America, Asia). Мы пополним кристаллы напрямую через официальный сайт HoYoverse. Пароль не нужен, доступ к аккаунту не требуется. Зачисление — 5–15 минут. Важно: проверьте UID дважды — ошибка в одной цифре отправит кристаллы другому игроку.' },
  { q: 'Можно ли купить Благословение полой луны и боевой пропуск Genshin Impact?', a: 'Да. Мы зачисляем нужное количество Genesis Crystals на ваш аккаунт по UID, а вы покупаете Благословение полой луны (Welkin Moon) или боевой пропуск (Gnostic Hymn) в самой игре. Также можем оформить напрямую — уточните у менеджера.' },
  { q: 'Можно ли купить V-Bucks без создания турецкого аккаунта?', a: 'Да. V-Bucks можно зачислить через украинский или индийский аккаунт — пополнение через логин и пароль, это наиболее безопасный и проверенный способ.' },
  { q: 'Почему цены на игровую валюту через ActivePlay ниже, чем в официальном магазине?', a: 'Региональное ценообразование. Sony, EA, Epic Games устанавливают разные цены для разных стран — в Турции и Индии цены в 2–3 раза ниже, чем в Европе или США. Мы покупаем валюту через эти регионы по официальным ценам и перепродаём с минимальной наценкой. Это легальная разница в ценообразовании между странами, а не серый рынок.' },
  { q: 'Чем подарочная карта PSN отличается от прямой покупки валюты — что выгоднее?', a: 'Прямая покупка валюты зачастую выгоднее. Вы платите за конкретный номинал FC Points, V-Bucks или Apex Coins — без остатка на балансе. Карта PSN — это универсальный баланс, который можно потратить на что угодно: игры, валюту, DLC, подписки. Разные цели — разные инструменты. Если вам нужна только валюта — покупайте напрямую. Если планируете разные покупки в PS Store — берите карту.' },
];
