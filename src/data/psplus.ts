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
    description: 'Базовый уровень подписки, открывающий ключевые возможности PlayStation',
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
      title: 'Купить PS Plus Essential Турция/Украина — от 1 250 ₽/мес | ActivePlay',
      description: 'PS Plus Essential по цене турецкого региона. Онлайн-мультиплеер, ежемесячные игры, скидки PS Store. Оформление за 5 минут. Доставка на ваш аккаунт.',
      keywords: ['ps plus essential купить', 'ps plus essential турция', 'ps plus essential цена', 'playstation plus essential россия', 'купить пс плюс эссеншиал'],
    },
    showcaseGames: {
      monthlyGames: {
        month: 'Март 2026',
        availableUntil: '7 апреля 2026',
        games: [
          { title: 'Monster Hunter Rise', image: '/images/covers/monster-hunter-rise.jpg', platform: ['PS4', 'PS5'] },
          { title: 'PGA Tour 2K25', image: '/images/covers/pga-tour-2k25.jpg', platform: ['PS5'] },
          { title: 'Slime Rancher 2', image: '/images/covers/slime-rancher-2.jpg', platform: ['PS5'] },
          { title: 'The Elder Scrolls Online: Tamriel Unlimited', image: '/images/covers/elder-scrolls-online.jpg', platform: ['PS4', 'PS5'] },
        ],
      },
    },
  },
  extra: {
    id: 'extra',
    name: 'Extra',
    slug: 'ps-plus-extra',
    description: 'Онлайн мультиплеер + сотни игр для скачивания — от блокбастеров до инди',
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
      title: 'Купить PS Plus Extra Турция/Украина — от 1 400 ₽/мес | ActivePlay',
      description: 'PS Plus Extra — каталог 400+ игр по цене турецкого региона. God of War, Spider-Man, Returnal и сотни других. Оформление за 5 минут.',
      keywords: ['ps plus extra купить', 'ps plus extra турция', 'ps plus extra цена', 'ps plus extra каталог игр', 'купить пс плюс экстра'],
    },
  },
  deluxe: {
    id: 'deluxe',
    name: 'Deluxe',
    slug: 'ps-plus-deluxe',
    description: 'Максимальный план — всё из Essential и Extra + классика, пробные версии игр',
    color: '#E8E8E8',
    mainFeatures: [
      {
        icon: 'Joystick',
        title: 'Классические игры PS1/PS2/PSP',
        description: '300+ ретро-игр: Tekken, Syphon Filter, Jak and Daxter, Ratchet & Clank, Dino Crisis и другая классика PlayStation',
      },
      {
        icon: 'Play',
        title: 'Пробные версии игр',
        description: 'Попробуйте новые игры бесплатно 2–5 часов перед тем как заплатить. Прогресс сохраняется при покупке полной версии',
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
        answer: 'Extra — это каталог из 527 современных игр PS4/PS5. Deluxe добавляет к нему три вещи: классические игры PS1/PS2/PSP (468 тайтлов), пробные версии новых игр (попробовать перед покупкой) и все преимущества Essential. Итого в Deluxe доступно около 995 игр — почти вдвое больше, чем в Extra. Разница в цене — около 1 000–1 500 ₽ в год.',
      },
      {
        question: 'Что такое пробные версии игр в Deluxe?',
        answer: 'Это полноценные версии новых крупных игр с ограничением по времени — от 2 до 5 часов. Вы скачиваете игру целиком, играете, оцениваете геймплей и графику. В Essential и Extra пробные версии недоступны, это эксклюзив Deluxe.',
      },
      {
        question: 'Прогресс в пробной версии сохраняется? Может ли пробная версия исчезнуть?',
        answer: 'Да, весь прогресс и трофеи переносятся в полную версию при покупке. Набор доступных пробных версий меняется — Sony сама выбирает, какие новинки получат пробную версию. Сейчас доступно более 160 игр.',
      },
      {
        question: 'Классику PS1/PS2/PSP можно скачать или только стримить?',
        answer: 'Скачивать на консоль и играть локально — это ключевое преимущество Deluxe. Стриминг игр в Турции и Индии не работает, но он и не нужен: вся классика скачивается. Доступ к классике работает через функцию «Основная консоль» — все аккаунты на вашей PS4/PS5 получат доступ, включая российский.',
      },
      {
        question: 'Классические игры — это оригиналы или ремастеры? На чём можно играть?',
        answer: 'Это адаптированные версии для современных консолей: улучшенное сглаживание, стабильная частота кадров, поддержка трофеев PlayStation. Не полноценные ремастеры, но играть значительно комфортнее, чем на оригинальном железе. Классика работает и на PS4, и на PS5.',
      },
      {
        question: 'Есть ли в Deluxe доступ к играм PS3?',
        answer: 'Нет. Игры PS3 доступны только через облачный стриминг, который есть в Premium. Турция и Индия — регионы Deluxe, стриминга PS3 здесь нет. Для российских пользователей это не проблема: стриминг из России всё равно работает с серьёзными задержками.',
      },
      {
        question: 'В чём разница между Deluxe и Premium?',
        answer: 'Premium = Deluxe + стриминг игр PS3. Турция и Индия — регионы Deluxe, то есть без стриминга. Вся остальная библиотека — классика PS1/PS2/PSP, пробные версии, каталог Extra — полностью совпадает. Для покупки через ActivePlay это не имеет значения: вы получаете всё кроме стриминга PS3.',
      },
      {
        question: 'Как часто обновляется каталог Deluxe?',
        answer: 'Каталог современных игр (Extra-часть) обновляется ежемесячно — обычно 5–10 игр в третий вторник месяца. Классику добавляют 1–3 тайтла в месяц, в тот же день. Пробные версии появляются нерегулярно — по мере выхода новых крупных релизов.',
      },
      {
        question: 'Стоит ли доплачивать с Extra до Deluxe?',
        answer: 'Доплата — около 1 000–1 500 ₽ в год. За эти деньги вы получаете 300+ классических игр и 160+ пробных версий. Если вам интересна история PlayStation или вы хотите пробовать новинки перед покупкой — Deluxe окупается. Если играете только в современные игры — Extra достаточно.',
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
      title: 'Купить PS Plus Deluxe Турция/Украина — от 1 550 ₽/мес | ActivePlay',
      description: 'PS Plus Deluxe — максимальный план. 400+ игр, классика PS1/PS2, пробные версии. По цене турецкого региона.',
      keywords: ['ps plus deluxe купить', 'ps plus deluxe турция', 'ps plus deluxe цена', 'ps plus premium россия', 'купить пс плюс делюкс'],
    },
  },
};
