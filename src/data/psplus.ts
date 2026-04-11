export type PsPlusTier = 'essential' | 'extra' | 'deluxe';

export interface PsPlusFeature {
  icon: string;
  title: string;
  description: string;
}

export interface PsPlusFaq {
  question: string;
  answer: string;
}

export interface PsPlusSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface ShowcaseGame {
  title: string;
  image: string;
  platform?: string[];
}

export interface PsPlusPlan {
  id: PsPlusTier;
  name: string;
  slug: string;
  description: string;
  color: string;
  mainFeatures: PsPlusFeature[];
  alsoIncludes: string[];
  prices: {
    turkey: { 1: number; 3: number; 12: number };
    ukraine: { 12: number };
  };
  faq: PsPlusFaq[];
  seo: PsPlusSeo;
  showcaseGames?: {
    hits?: ShowcaseGame[];
    newReleases?: {
      month: string;
      games: ShowcaseGame[];
    };
    monthlyGames?: {
      month: string;
      availableUntil: string;
      games: ShowcaseGame[];
    };
    classicsHits?: { title: string; image: string; platform: string }[];
    trialHits?: { title: string; image: string; hours: number }[];
  };
}

export const psPlus: Record<PsPlusTier, PsPlusPlan> = {
  essential: {
    id: 'essential',
    name: 'Essential',
    slug: 'ps-plus-essential',
    description: 'Онлайн-мультиплеер, 3 бесплатные игры каждый месяц, облачное хранилище для PS5 и PS4',
    color: '#C6A220',
    mainFeatures: [
      {
        icon: 'Gamepad2',
        title: 'Онлайн мультиплеер',
        description: 'Играйте по сети в FC 26, Call of Duty, GTA Online и сотни других игр с друзьями и игроками со всего мира',
      },
      {
        icon: 'Gift',
        title: '3 игры каждый месяц',
        description: 'Получайте 3 новые игры ежемесячно бесплатно, пока активна подписка. Игры остаются в вашей библиотеке',
      },
      {
        icon: 'Cloud',
        title: 'Облачное хранилище 100 ГБ',
        description: 'Сохраняйте прогресс в облаке и продолжайте игру на любой консоли PS4/PS5',
      },
    ],
    alsoIncludes: [
      'Share Play (совместная игра)',
      'PS Plus Collection (PS5)',
      'Эксклюзивный игровой контент',
    ],
    prices: {
      turkey: { 1: 1250, 3: 2150, 12: 5800 },
      ukraine: { 12: 5000 },
    },
    faq: [
      {
        question: 'Как купить PS Plus Essential из России в 2026 году?',
        answer: 'Напишите менеджеру ActivePlay в Telegram или VK. Выберите регион (Турция или Украина), срок подписки (1, 3 или 12 месяцев) и оплатите в рублях через СБП или карту МИР. Менеджер активирует подписку на ваш PSN-аккаунт за 5 минут. Без VPN, без зарубежных карт — всё делаем за вас.',
      },
      {
        question: 'Можно ли активировать PS Plus Essential на российский аккаунт PSN?',
        answer: 'Нет. Sony отключила все платежи для российских аккаунтов с 2022 года. Для активации PS Plus Essential нужен турецкий или украинский аккаунт PSN. ActivePlay создаёт аккаунт нужного региона бесплатно при покупке подписки от 1 000₽, или за 500₽ отдельно.',
      },
      {
        question: 'Сколько стоит PS Plus Essential в 2026 году?',
        answer: 'Турция: 1 месяц — 1 250₽, 3 месяца — 2 150₽, 12 месяцев — 5 800₽. Украина: 12 месяцев — 5 000₽. Цены пересчитываются по курсу ЦБ и могут незначительно меняться. Годовая подписка — максимальная экономия.',
      },
      {
        question: 'Какие игры дают каждый месяц и как их забрать?',
        answer: 'Каждый первый вторник месяца Sony добавляет 2-3 новые игры. Заходите в PS Store → раздел PS Plus → «Игры месяца» → добавляете в библиотеку. Забрать нужно до конца месяца — потом они уходят. Игры остаются у вас, пока активна подписка.',
      },
      {
        question: 'Нужна ли Essential для Fortnite, Warzone, Apex Legends?',
        answer: 'Нет. Все Free-to-Play игры — Fortnite, Call of Duty Warzone, Apex Legends, PUBG, Genshin Impact — работают онлайн без подписки. Essential нужна для мультиплеера в платных играх: FC 26, GTA Online, Call of Duty (основная часть), Battlefield и т.д.',
      },
      {
        question: 'Что будет с играми и мультиплеером, если подписка закончится?',
        answer: 'Мультиплеер отключается сразу — вы не сможете играть по сети (кроме Free-to-Play). Игры, полученные по подписке, пропадают из библиотеки. Но при продлении — всё возвращается, прогресс сохраняется. Купленные за деньги игры остаются навсегда, подписка на них не влияет.',
      },
      {
        question: 'Можно ли играть на PS4 и PS5 одновременно?',
        answer: 'Да, с нюансом. Активируете турецкий аккаунт как «Основной» на одной консоли — там все аккаунты получают мультиплеер. На второй консоли заходите в свой аккаунт напрямую. Итого — две консоли одновременно с одной подпиской.',
      },
      {
        question: 'Можно ли поделиться подпиской с другом или семьёй?',
        answer: 'Да. Если ваш аккаунт с подпиской стоит как «Основная консоль» на PS5 друга или ребёнка — они получают мультиплеер и доступ к вашим играм. Детские аккаунты на семейной консоли тоже пользуются подпиской (с учётом родительского контроля).',
      },
      {
        question: 'Что такое облачные сохранения и зачем они?',
        answer: '100 ГБ в облаке Sony для ваших сохранений. Прогресс синхронизируется автоматически. Если сломается консоль, купите новую PS5 или играете у друга — весь прогресс на месте. Без подписки облачные сохранения недоступны.',
      },
      {
        question: 'Можно ли стакнуть несколько подписок подряд?',
        answer: 'Да. Покупаете вторую подписку — срок плюсуется к текущей. Например, осталось 3 месяца, купили 12 — получили 15 месяцев. Максимальный стак — 36 месяцев вперёд.',
      },
      {
        question: 'Можно ли играть без интернета?',
        answer: 'Да, если турецкий аккаунт активирован как «Основная консоль». Тогда все скачанные игры запускаются офлайн. Если консоль не основная — нужен интернет для проверки подписки.',
      },
      {
        question: 'Что такое Share Play?',
        answer: 'Функция, которая позволяет «передать» экран или управление другу через интернет на 60 минут. Полезно, когда хотите поиграть вместе в игру, у которой нет кооператива, или у друга нет этой игры. Работает через Party Chat на PS4/PS5.',
      },
    ],
    seo: {
      title: 'Купить PS Plus Essential в России — цены от 1 250₽ | ActivePlay',
      description: 'Подписка PS Plus Essential для PS5 и PS4. Онлайн-мультиплеер, 3 бесплатные игры каждый месяц, облачное хранилище. Турция и Украина. Оплата через СБП, активация за 5 минут. От 1 250₽/мес.',
      keywords: ['ps plus essential купить', 'ps plus essential турция', 'ps plus essential цена', 'playstation plus essential россия', 'купить пс плюс эссеншиал'],
    },
    showcaseGames: {
      monthlyGames: {
        month: 'Апрель 2026',
        availableUntil: '5 мая 2026',
        games: [
          { title: 'Lords of the Fallen', image: '/images/covers/lords-of-the-fallen.jpg', platform: ['PS5'] },
          { title: 'Tomb Raider I-III Remastered', image: '/images/covers/tomb-raider-i-iii-remastered.jpg', platform: ['PS4', 'PS5'] },
          { title: 'Sword Art Online: Fractured Daydream', image: '/images/covers/sword-art-online-fractured-daydream.jpg', platform: ['PS5'] },
        ],
      },
    },
  },
  extra: {
    id: 'extra',
    name: 'Extra',
    slug: 'ps-plus-extra',
    description: 'Каталог игр PS5 и PS4: God of War, Spider-Man, Returnal, Hogwarts Legacy + Ubisoft+ Classics',
    color: '#1E1E1E',
    mainFeatures: [
      {
        icon: 'Library',
        title: 'Каталог 400+ игр',
        description: 'Скачивайте и играйте в God of War, Spider-Man, Returnal, Ghost of Tsushima, Hogwarts Legacy и сотни других хитов',
      },
      {
        icon: 'Swords',
        title: 'Ubisoft+ Classics',
        description: 'Assassin\'s Creed, Far Cry, Watch Dogs и другие легендарные серии Ubisoft в подарок к подписке',
      },
      {
        icon: 'Gamepad2',
        title: 'Всё из Essential',
        description: 'Онлайн мультиплеер, 3 игры каждый месяц, облачное хранилище 100 ГБ и все остальные преимущества базового плана',
      },
    ],
    alsoIncludes: [
      'Онлайн мультиплеер',
      '3 игры каждый месяц',
      'Share Play (совместная игра)',
      'Облачное хранилище (100 ГБ)',
      'Эксклюзивный игровой контент',
      'PS Plus Collection (PS5)',
    ],
    prices: {
      turkey: { 1: 1400, 3: 3250, 12: 9500 },
      ukraine: { 12: 7000 },
    },
    faq: [
      {
        question: 'Как купить PS Plus Extra из России в 2026 году?',
        answer: 'Напишите менеджеру ActivePlay в Telegram или VK. Выберите регион (Турция или Украина), срок подписки (1, 3 или 12 месяцев) и оплатите в рублях через СБП или карту МИР. Менеджер активирует подписку на ваш PSN-аккаунт за 5 минут. Без VPN, без зарубежных карт.',
      },
      {
        question: 'Можно ли активировать PS Plus Extra на российский аккаунт PSN?',
        answer: 'Нет. Sony отключила все платежи для российских аккаунтов с 2022 года. Для PS Plus Extra нужен турецкий или украинский аккаунт PSN. ActivePlay создаёт аккаунт нужного региона бесплатно при покупке подписки от 1 000₽, или за 500₽ отдельно.',
      },
      {
        question: 'Сколько стоит PS Plus Extra в 2026 году?',
        answer: 'Турция: 1 месяц — 1 400₽, 3 месяца — 3 250₽, 12 месяцев — 9 500₽. Украина: 12 месяцев — 7 000₽. Цены пересчитываются по курсу ЦБ. Годовая подписка — максимальная экономия.',
      },
      {
        question: 'Чем Extra принципиально отличается от Essential?',
        answer: 'Essential — это мультиплеер и 3 игры в месяц. Extra добавляет постоянный каталог из 400+ игр, которые можно скачивать и играть без отдельной покупки. God of War Ragnarök, Spider-Man 2, Returnal, Ghost of Tsushima — всё это доступно по подписке. Также в Extra входит коллекция Ubisoft+ Classics: Assassin\'s Creed, Far Cry, Watch Dogs и другие серии Ubisoft.',
      },
      {
        question: 'Как часто обновляется каталог и бывают ли новинки в день релиза?',
        answer: 'Каталог обновляется раз в месяц, обычно в третий вторник. Sony анонсирует список за неделю. Новинки в день релиза не попадают — Sony выдерживает окно продаж. Эксклюзивы PlayStation появляются в каталоге через 6–12 месяцев после выхода. Некоторые игры со временем уходят из каталога — об этом предупреждают заранее.',
      },
      {
        question: 'Что происходит с прогрессом, если игра ушла из каталога?',
        answer: 'Прогресс и сохранения остаются на консоли и в облаке. Если игра вернётся в каталог или вы купите её отдельно — продолжите с того же места.',
      },
      {
        question: 'Сколько игр одновременно можно скачать из каталога?',
        answer: 'Ограничений по количеству нет — скачивайте сколько хотите, пока хватает места на диске.',
      },
      {
        question: 'Подписка закончилась — что будет с играми из каталога?',
        answer: 'Запуск скачанных игр будет заблокирован. Файлы останутся на диске, но играть не получится. При возобновлении подписки доступ восстанавливается мгновенно, весь прогресс на месте.',
      },
      {
        question: 'Одинаков ли каталог Extra в Турции и других регионах?',
        answer: 'В целом — да, основной каталог совпадает. Но возможны небольшие отличия из-за лицензионных ограничений: например, отдельные японские тайтлы могут быть только в азиатском регионе. На популярные ААА-игры это обычно не влияет.',
      },
      {
        question: 'Стоит ли Extra своих денег по сравнению с Essential?',
        answer: 'Если вы играете хотя бы в 2–3 игры из каталога в год — Extra окупается. Одна игра уровня God of War или Spider-Man стоит 3 500–5 000 ₽ при покупке отдельно. В каталоге есть как нативные PS5-игры (Demon\'s Souls, Returnal, Ratchet & Clank: Rift Apart), так и PS4-хиты.',
      },
      {
        question: 'Можно ли апгрейдить Essential до Extra?',
        answer: 'Да, в любой момент. Оставшееся время Essential пересчитывается, вы доплачиваете разницу. Наш менеджер рассчитает точную сумму и выполнит активацию за 5 минут.',
      },
      {
        question: 'Есть ли в Extra пробные версии новых игр?',
        answer: 'Нет. Пробные версии (Game Trials) — функция тарифа Deluxe. В Deluxe можно попробовать новые игры бесплатно 2–5 часов перед покупкой, прогресс сохраняется.',
      },
    ],
    showcaseGames: {
      hits: [
        { title: 'God of War Ragnarök', image: '/images/covers/god-of-war-ragnarok.jpg' },
        { title: "Marvel's Spider-Man 2", image: '/images/covers/spider-man-2.jpg' },
        { title: "Ghost of Tsushima Director's Cut", image: '/images/covers/ghost-of-tsushima.jpg' },
        { title: 'The Last of Us Part I', image: '/images/covers/the-last-of-us-part-1.jpg' },
        { title: 'Horizon Forbidden West', image: '/images/covers/horizon-forbidden-west.jpg' },
        { title: 'Hogwarts Legacy', image: '/images/covers/hogwarts-legacy.jpg' },
        { title: 'Silent Hill 2', image: '/images/covers/silent-hill-2.jpg' },
        { title: 'Cyberpunk 2077', image: '/images/covers/cyberpunk-2077.jpg' },
        { title: 'Mortal Kombat 1', image: '/images/covers/mortal-kombat-1.jpg' },
        { title: 'Returnal', image: '/images/covers/returnal.jpg' },
      ],
      newReleases: {
        month: 'Март 2026',
        games: [
          { title: 'Warhammer 40,000: Space Marine 2', image: '/images/covers/space-marine-2.jpg' },
          { title: 'Persona 5 Royal', image: '/images/covers/persona-5-royal.jpg' },
          { title: 'Blasphemous II', image: '/images/covers/blasphemous-2.jpg' },
          { title: 'Astroneer', image: '/images/covers/astroneer.jpg' },
          { title: 'Neva', image: '/images/covers/neva.jpg' },
          { title: 'Monster Hunter Stories', image: '/images/covers/monster-hunter-stories.jpg' },
          { title: 'Monster Hunter Stories 2: Wings of Ruin', image: '/images/covers/monster-hunter-stories-2.jpg' },
          { title: 'Test Drive Unlimited: Solar Crown', image: '/images/covers/test-drive-solar-crown.jpg' },
          { title: 'The Lord of the Rings: Return to Moria', image: '/images/covers/lotr-return-to-moria.jpg' },
          { title: 'Echoes of the End: Enhanced Edition', image: '/images/covers/echoes-of-the-end.jpg' },
          { title: 'Madden NFL 26', image: '/images/covers/madden-nfl-26.jpg' },
          { title: 'Metal Eden', image: '/images/covers/metal-eden.jpg' },
          { title: 'Season: A Letter to the Future', image: '/images/covers/season.jpg' },
          { title: 'Venba', image: '/images/covers/venba.jpg' },
          { title: 'Rugby 25', image: '/images/covers/rugby-25.jpg' },
        ],
      },
    },
    seo: {
      title: 'Купить PS Plus Extra в России — каталог 523 игры от 1 400₽ | ActivePlay',
      description: 'Подписка PS Plus Extra для PS5 и PS4. Каталог 527 игр: God of War, Spider-Man, Hogwarts Legacy + Ubisoft Classics. Турция и Украина. Оплата через СБП. От 1 400₽/мес.',
      keywords: ['ps plus extra купить', 'ps plus extra турция', 'ps plus extra цена', 'ps plus extra каталог игр', 'купить пс плюс экстра'],
    },
  },
  deluxe: {
    id: 'deluxe',
    name: 'Deluxe',
    slug: 'ps-plus-deluxe',
    description: 'Максимальный план — всё из Essential и Extra + 468 классических игр и 164 пробные версии. Турция и Украина. Оплата через СБП',
    color: '#E8E8E8',
    mainFeatures: [
      {
        icon: 'Joystick',
        title: 'Классические игры PS1/PS2/PSP',
        description: '468 классических игр: Tekken, Syphon Filter, Jak and Daxter, Ratchet & Clank, Dino Crisis и другая классика PlayStation',
      },
      {
        icon: 'Play',
        title: 'Пробные версии игр',
        description: '164 пробные версии: попробуйте AAA-игры бесплатно от 30 минут до 10 часов. Прогресс и трофеи сохраняются при покупке полной версии',
      },
      {
        icon: 'Library',
        title: 'Всё из Extra',
        description: 'Каталог 400+ современных игр для скачивания, Ubisoft+ Classics, онлайн-мультиплеер, 3 игры каждый месяц и все преимущества Essential',
      },
    ],
    alsoIncludes: [
      'Каталог 400+ игр (Extra)',
      'Ubisoft+ Classics',
      'Онлайн мультиплеер',
      '3 игры каждый месяц',
      'Облачное хранилище (100 ГБ)',
      'Share Play (совместная игра)',
      'Эксклюзивный игровой контент',
    ],
    prices: {
      turkey: { 1: 1550, 3: 3750, 12: 10750 },
      ukraine: { 12: 8000 },
    },
    faq: [
      {
        question: 'Чем Deluxe отличается от Extra?',
        answer: 'PS Plus Deluxe включает всё из Extra — каталог 523 современных игр PS4/PS5, Ubisoft+ Classics, онлайн-мультиплеер и ежемесячные игры. Дополнительно Deluxe открывает доступ к каталогу из 468 классических игр PS1, PS2, PSP и PS3, а также к 164 пробным версиям (Game Trials) новых AAA-игр продолжительностью от 30 минут до 10 часов. Разница в цене с Extra — всего 150₽/мес на турецком аккаунте.',
      },
      {
        question: 'Что такое пробные версии игр в Deluxe?',
        answer: 'Game Trials — эксклюзивная функция PS Plus Deluxe и Premium. Позволяет бесплатно попробовать новые AAA-игры перед покупкой. Длительность — от 30 минут до 10 часов в зависимости от игры. Доступно 164 пробные версии, включая God of War Ragnarök, Hogwarts Legacy, Cyberpunk 2077, Baldur\'s Gate 3 и Like a Dragon: Infinite Wealth. Если решите купить игру — весь прогресс и трофеи сохранятся.',
      },
      {
        question: 'Прогресс в пробной версии сохраняется? Может ли пробная версия исчезнуть?',
        answer: 'Да, прогресс полностью сохраняется. Если вы решите купить полную версию игры, вы продолжите с того же места. Трофеи тоже остаются. Пробные версии могут быть удалены из каталога — Sony периодически ротирует список. Но если вы уже начали играть в trial, он останется доступен до истечения вашего времени.',
      },
      {
        question: 'Классику PS1/PS2/PSP можно скачать или только стримить?',
        answer: 'Классические игры PS1, PS2 и PSP скачиваются на PS4 и PS5 — стриминг для них не нужен. Играете офлайн, без задержек. А вот игры PS3 доступны только через облачный стриминг, который не работает в Турции, Украине и Индии. Поэтому PS3-классика на турецком и украинском аккаунте недоступна.',
      },
      {
        question: 'Классические игры — это оригиналы или ремастеры? На чём можно играть?',
        answer: 'Это оригинальные версии игр, запущенные через эмуляцию на PS4 и PS5. Не ремастеры и не ремейки. Многие получили улучшения: повышенное разрешение, поддержку трофеев, функцию быстрого сохранения (save states) и перемотку. Играть можно на PS4 и PS5 — классика скачивается на консоль.',
      },
      {
        question: 'Есть ли в Deluxe доступ к играм PS3?',
        answer: 'Формально каталог PS3 входит в Deluxe, но есть нюанс: PS3-игры доступны только через облачный стриминг. В регионах Турция, Украина и Индия стриминг не работает — поэтому на практике PS3-классика на вашем аккаунте будет недоступна. Доступны только PS1, PS2 и PSP (скачиваемые). Полноценный доступ к PS3 есть только в PS Plus Premium (Европа, США, Япония).',
      },
      {
        question: 'В чём разница между Deluxe и Premium?',
        answer: 'Deluxe — это версия Premium для регионов без облачного стриминга (Турция, Украина, Индия). Контент почти идентичен: те же классические игры PS1/PS2/PSP, те же Game Trials. Два отличия: в Deluxe нет стриминга PS3-игр и нет возможности играть через облако на ПК, смартфоне или телевизоре. Зато Deluxe стоит дешевле Premium. Для 99% игроков, которые играют на консоли — разницы нет.',
      },
      {
        question: 'Как часто обновляется каталог Deluxe?',
        answer: 'Классические игры добавляются нерегулярно — примерно 2–5 новых тайтлов в месяц. Например, в марте 2026 была добавлена Tekken: Dark Resurrection (PSP). Game Trials обновляются чаще — новые пробные версии могут появляться еженедельно. Каталог Extra (523 игры), который тоже входит в Deluxe, обновляется в третий вторник каждого месяца.',
      },
      {
        question: 'Стоит ли доплачивать с Extra до Deluxe?',
        answer: 'Если вам интересны классические игры PlayStation (Jak and Daxter, Syphon Filter, Tekken, Dino Crisis) или вы хотите тестировать новые AAA-релизы до покупки — однозначно да. Разница в цене всего 150₽/мес на турецком аккаунте. Одна «неудачная» покупка игры за 4 000–5 000₽, которую можно было бы проверить через Game Trial, окупает годовую разницу между Extra и Deluxe.',
      },
      {
        question: 'Сколько стоит PS Plus Deluxe и какой вариант выгоднее?',
        answer: 'Цены на турецком аккаунте: 1 550₽ за 1 месяц, 3 750₽ за 3 месяца, 10 750₽ за 12 месяцев. На украинском аккаунте доступна только годовая подписка за 8 000₽ — это самый выгодный вариант, экономия 2 750₽ по сравнению с годовой турецкой подпиской. Если планируете пользоваться год и дольше — берите Украину на 12 месяцев.',
      },
      {
        question: 'Можно ли повысить подписку с Essential или Extra до Deluxe?',
        answer: 'Да, апгрейд возможен в любой момент. Вы оплачиваете разницу в стоимости пропорционально оставшемуся сроку текущей подписки. Напишите нашему менеджеру — мы рассчитаем точную стоимость и выполним апгрейд за 5 минут.',
      },
      {
        question: 'Как купить PS Plus Deluxe из России в 2026 году?',
        answer: 'Через ActivePlay: выберите срок и регион, оплатите в рублях через СБП, карту МИР или ЮMoney. Мы активируем подписку на ваш PSN-аккаунт турецкого или украинского региона за 5 минут. VPN не нужен. Зарубежная карта не нужна. Если у вас ещё нет аккаунта нужного региона — поможем создать.',
      },
    ],
    showcaseGames: {
      classicsHits: [
        { title: 'Tekken 2', image: '/images/covers/tekken-2.jpg', platform: 'PS1' },
        { title: 'Syphon Filter', image: '/images/covers/syphon-filter.jpg', platform: 'PS1' },
        { title: 'Jak and Daxter', image: '/images/covers/jak-and-daxter.jpg', platform: 'PS2' },
        { title: 'Ratchet & Clank', image: '/images/covers/ratchet-clank-classic.jpg', platform: 'PS2' },
        { title: 'Dino Crisis', image: '/images/covers/dino-crisis.jpg', platform: 'PS1' },
        { title: 'Ridge Racer', image: '/images/covers/ridge-racer.jpg', platform: 'PS1' },
        { title: 'Ape Escape', image: '/images/covers/ape-escape.jpg', platform: 'PS1' },
        { title: 'Wild Arms', image: '/images/covers/wild-arms.jpg', platform: 'PS1' },
        { title: 'MediEvil', image: '/images/covers/medievil.jpg', platform: 'PS1' },
        { title: 'Twisted Metal', image: '/images/covers/twisted-metal.jpg', platform: 'PS1' },
        { title: 'Dark Cloud', image: '/images/covers/dark-cloud.jpg', platform: 'PS2' },
        { title: 'Dark Chronicle', image: '/images/covers/dark-chronicle.jpg', platform: 'PS2' },
        { title: 'ICO', image: '/images/covers/ico.jpg', platform: 'PS2' },
        { title: 'The Legend of Dragoon', image: '/images/covers/legend-of-dragoon.jpg', platform: 'PS1' },
        { title: 'Tomba!', image: '/images/covers/tomba.jpg', platform: 'PS1' },
      ],
      trialHits: [
        { title: 'Cyberpunk 2077', image: '/images/covers/cyberpunk-2077.jpg', hours: 5 },
        { title: 'Hogwarts Legacy', image: '/images/covers/hogwarts-legacy.jpg', hours: 5 },
        { title: 'God of War Ragnarök', image: '/images/covers/god-of-war-ragnarok.jpg', hours: 5 },
        { title: 'Dying Light 2 Stay Human', image: '/images/covers/dying-light-2.jpg', hours: 5 },
        { title: 'Gotham Knights', image: '/images/covers/gotham-knights.jpg', hours: 5 },
        { title: 'Sifu', image: '/images/covers/sifu.jpg', hours: 2 },
        { title: 'Atomic Heart', image: '/images/covers/atomic-heart.jpg', hours: 5 },
        { title: 'A Plague Tale: Requiem', image: '/images/covers/plague-tale-requiem.jpg', hours: 5 },
        { title: 'Rollerdrome', image: '/images/covers/rollerdrome.jpg', hours: 2 },
        { title: "Marvel's Midnight Suns", image: '/images/covers/midnight-suns.jpg', hours: 5 },
      ],
    },
    seo: {
      title: 'Купить PS Plus Deluxe в России — цены от 1 550₽ | ActivePlay',
      description: 'Подписка PS Plus Deluxe (Делюкс) — 468 классических игр PS1, PS2, PSP, PS3 и 164 пробные версии AAA-хитов. Турция от 1 550₽/мес, Украина 8 000₽/год. Оплата СБП. Активация за 5 минут.',
      keywords: ['ps plus deluxe купить', 'ps plus deluxe турция', 'ps plus deluxe цена', 'ps plus premium россия', 'купить пс плюс делюкс'],
    },
  },
};
