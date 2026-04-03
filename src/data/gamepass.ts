export type GamePassTier = 'essential' | 'premium' | 'ultimate';

export interface GamePassFeature {
  icon: string;
  title: string;
  description: string;
}

export interface GamePassFaq {
  question: string;
  answer: string;
}

export interface GamePassSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface GamePassShowcaseGame {
  title: string;
  image: string;
  platform?: string[];
}

export interface GamePassPlan {
  id: GamePassTier;
  name: string;
  slug: string;
  description: string;
  color: string;
  mainFeatures: GamePassFeature[];
  alsoIncludes: string[];
  prices: {
    global: { 1: number; 3: number; 12: number };
  };
  faq: GamePassFaq[];
  seo: GamePassSeo;
  showcaseGames?: {
    hits?: GamePassShowcaseGame[];
    newReleases?: {
      month: string;
      games: GamePassShowcaseGame[];
    };
    dayOneGames?: GamePassShowcaseGame[];
  };
}

export const gamePass: Record<GamePassTier, GamePassPlan> = {
  essential: {
    id: 'essential',
    name: 'Essential',
    slug: 'game-pass-essential',
    description: 'Онлайн-мультиплеер на Xbox и ПК, каталог 50+ игр, облачный гейминг, скидки в Microsoft Store',
    color: '#107C10',
    mainFeatures: [
      {
        icon: 'Gamepad2',
        title: 'Онлайн-мультиплеер на Xbox и ПК',
        description: 'Играйте по сети в Halo, Forza, Call of Duty и сотни других игр. Без Essential мультиплеер недоступен.',
      },
      {
        icon: 'Library',
        title: 'Каталог из 50+ курируемых игр',
        description: 'Stardew Valley, Hades, Fallout 76, Cities: Skylines Remastered и другие — скачивайте и играйте без ограничений.',
      },
      {
        icon: 'Gift',
        title: 'Скидки и бонусы Microsoft Store',
        description: 'Эксклюзивные скидки Deals with Gold, бонусы в Free-to-Play играх, награды Microsoft Rewards до $25/год',
      },
    ],
    alsoIncludes: [
      'Скидки на игры в Microsoft Store',
      'Совместная игра с друзьями',
      'Microsoft Rewards (до $25/год)',
      'Бонусы в Free-to-Play играх',
    ],
    prices: {
      global: { 1: 1300, 3: 2500, 12: 6950 },
    },
    faq: [
      {
        question: 'Что такое Xbox Game Pass Essential и чем он отличается от бывшего Core?',
        answer: 'Game Pass Essential — это обновлённый тариф Xbox Game Pass, который пришёл на смену Game Pass Core в октябре 2025 года. Все функции Core сохранены: онлайн-мультиплеер, каталог из 50+ игр, скидки Deals with Gold. Добавлены: поддержка ПК (раньше Core работал только на Xbox) и базовый облачный гейминг. Цена осталась прежней — $9.99/мес.',
      },
      {
        question: 'Сколько стоит Game Pass Essential в России?',
        answer: 'В ActivePlay: 1 300₽ за 1 месяц, 2 500₽ за 3 месяца, 6 950₽ за 12 месяцев. Essential — единственный тариф Game Pass с годовой подпиской. Оплата через СБП, карту МИР или ЮMoney.',
      },
      {
        question: 'Какие игры входят в каталог Game Pass Essential?',
        answer: 'Каталог Essential включает 50+ курируемых игр: Stardew Valley, Hades, Fallout 76, Cities: Skylines Remastered, Ori and the Blind Forest и другие. Это не полный каталог Game Pass — расширенная библиотека из 200+ и 400+ игр доступна в Premium и Ultimate.',
      },
      {
        question: 'Есть ли в Essential Day One релизы?',
        answer: 'Нет. Новые игры Microsoft (Forza Horizon 6, Fable, Call of Duty) не появляются в Essential в день выхода. Для Day One нужен Ultimate или PC Game Pass. Essential предлагает курируемую библиотеку уже вышедших игр.',
      },
      {
        question: 'Работает ли Game Pass Essential на ПК?',
        answer: 'Да. С октября 2025 Essential работает и на Xbox, и на ПК. Раньше Game Pass Core был доступен только на консоли. Теперь с одной подпиской вы играете на обеих платформах.',
      },
      {
        question: 'Включён ли облачный гейминг в Essential?',
        answer: 'Да, базовый облачный стриминг включён — можно играть в игры из каталога через браузер или приложение Xbox. Для улучшенного качества до 1440p и стриминга на мобильные устройства и телевизоры нужен Ultimate.',
      },
      {
        question: 'Входит ли EA Play в Game Pass Essential?',
        answer: 'Нет. EA Play (каталог FIFA/FC, Battlefield, Mass Effect, The Sims) доступен только в Game Pass Ultimate и PC Game Pass. Essential не включает EA Play.',
      },
      {
        question: 'Можно ли купить Game Pass Essential на год?',
        answer: 'Да, Essential — единственный тариф Game Pass с официальной годовой подпиской. 12 месяцев за 6 950₽ — экономия 8 650₽ по сравнению с помесячной оплатой. Premium и Ultimate доступны только помесячно у Microsoft.',
      },
      {
        question: 'Как активировать Game Pass Essential после оплаты?',
        answer: 'После оплаты через СБП наш менеджер активирует подписку на ваш аккаунт Microsoft за 5 минут. Вам не нужен турецкий аккаунт, VPN или зарубежная карта. Связь через Telegram, VK или чат на сайте.',
      },
      {
        question: 'Нужен ли VPN для Game Pass в России?',
        answer: 'Для скачивания игр и онлайн-мультиплеера VPN не нужен — всё работает напрямую. Для облачного стриминга может потребоваться VPN на поддерживаемую страну. Если консоль медленно загружается — пропишите DNS 8.8.8.8 на роутере.',
      },
      {
        question: 'Что лучше — Game Pass Essential или PS Plus Essential?',
        answer: 'Game Pass Essential даёт каталог из 50+ игр для скачивания + облачный гейминг. PS Plus Essential даёт 3-4 бесплатные игры в месяц + онлайн-мультиплеер. Для полноценного каталога PS нужен PS Plus Extra (от 1 400₽/мес). Оба тарифа стоят одинаково ($9.99/мес). Если у вас Xbox — берите Game Pass, если PS5 — берите PS Plus.',
      },
      {
        question: 'Можно ли перейти с Essential на Ultimate?',
        answer: 'Да. При апгрейде оставшийся срок Essential конвертируется в дни Ultimate по пропорциональному курсу. Напишите менеджеру — мы рассчитаем стоимость и выполним апгрейд за 5 минут.',
      },
    ],
    seo: {
      title: 'Купить Xbox Game Pass Essential в России — от 1 300₽/мес | ActivePlay',
      description: 'Подписка Xbox Game Pass Essential для Xbox Series X|S, Xbox One и ПК. Онлайн-мультиплеер, 50+ игр, облачный гейминг. Оплата через СБП, активация за 5 минут. От 1 300₽/мес.',
      keywords: ['game pass essential купить', 'xbox game pass essential', 'game pass core купить', 'xbox live gold купить', 'game pass essential цена', 'гейм пасс эссеншиал россия'],
    },
    showcaseGames: {
      hits: [
        { title: 'Forza Horizon 5', image: '/images/covers/forza-horizon-5.jpg' },
        { title: 'Hades', image: '/images/covers/hades.jpg' },
        { title: 'Stardew Valley', image: '/images/covers/stardew-valley.jpg' },
        { title: 'Dead Cells', image: '/images/covers/dead-cells.jpg' },
        { title: 'DOOM Eternal', image: '/images/covers/doom-eternal.jpg' },
        { title: 'Grounded', image: '/images/covers/grounded.jpg' },
        { title: 'Gears 5', image: '/images/covers/gears-5.jpg' },
        { title: 'Ori and the Will of the Wisps', image: '/images/covers/ori-will-of-wisps.jpg' },
        { title: 'Tunic', image: '/images/covers/tunic.jpg' },
        { title: 'Deep Rock Galactic', image: '/images/covers/deep-rock-galactic.jpg' },
      ],
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    slug: 'game-pass-premium',
    description: 'Каталог 280 игр · Xbox-эксклюзивы через ~12 месяцев · Улучшенный облачный гейминг · Скидки до 20% в Microsoft Store',
    color: '#0078D4',
    mainFeatures: [
      {
        icon: 'Library',
        title: 'Каталог 280 игр',
        description: 'Скачивайте и играйте в Cyberpunk 2077, Kingdom Come: Deliverance II, Disco Elysium, Hogwarts Legacy, Forza Horizon 5, Starfield и сотни других хитов на Xbox и ПК',
      },
      {
        icon: 'Globe',
        title: 'Облачный гейминг (улучшенный)',
        description: 'Облачный стриминг с приоритетным доступом на Xbox, ПК, телефоне, планшете и Smart TV. Без скачивания — играйте сразу',
      },
      {
        icon: 'Gamepad2',
        title: 'Всё из Essential',
        description: 'Онлайн-мультиплеер, библиотека 50+ игр Essential, скидки в Microsoft Store, совместная игра и Microsoft Rewards (до $50/год)',
      },
    ],
    alsoIncludes: [
      'Онлайн-мультиплеер',
      'Xbox-эксклюзивы через ~12 месяцев',
      'Скидки до 20% в Microsoft Store',
      'Microsoft Rewards (до $50/год)',
      'Эксклюзивные игровые квесты',
      'Совместная игра с друзьями',
    ],
    prices: {
      global: { 1: 1700, 3: 4000, 12: 9900 },
    },
    faq: [
      {
        question: 'Что такое Game Pass Premium и чем отличается от Standard?',
        answer: 'Game Pass Premium — переименованный в октябре 2025 тариф, ранее известный как Game Pass Standard. Функционал полностью идентичен. Каталог из 280 игр для Xbox и ПК, улучшенный облачный гейминг, Xbox-эксклюзивы (с задержкой ~12 месяцев после релиза), скидки до 20% в Microsoft Store, Microsoft Rewards с 2x множителем. Цена не изменилась.',
      },
      {
        question: 'Как купить Game Pass Premium из России?',
        answer: 'Через ActivePlay: выберите срок подписки, оплатите в рублях через СБП, карту МИР или ЮMoney. Менеджер активирует подписку на ваш аккаунт Microsoft за 5 минут. VPN и зарубежная карта не нужны. Турецкий аккаунт не нужен — меньше риска блокировки со стороны Microsoft.',
      },
      {
        question: 'Сколько стоит Game Pass Premium?',
        answer: 'В ActivePlay: 1 700₽ за 1 месяц, 4 000₽ за 3 месяца, 9 900₽ за 12 месяцев. Microsoft официально продаёт Premium только помесячно ($14.99/мес). ActivePlay предлагает выгодные варианты на 3 и 12 месяцев.',
      },
      {
        question: 'Какие игры есть в каталоге Premium?',
        answer: '280 игр для Xbox и ПК, включая: Cyberpunk 2077, Kingdom Come: Deliverance II, Disco Elysium, Hogwarts Legacy, Forza Horizon 5, Starfield, Diablo IV, Like a Dragon: Infinite Wealth, Resident Evil 7, South of Midnight и другие. Каталог обновляется каждые 2 недели — новые игры добавляются, некоторые уходят.',
      },
      {
        question: 'Есть ли в Premium Day One релизы?',
        answer: 'Нет. Новые игры Microsoft НЕ появляются в Premium в день выхода. Xbox-эксклюзивы добавляются примерно через 12 месяцев после релиза. Пример: Avowed вышел в феврале 2025, в Premium добавлен в феврале 2026. Для Day One нужен Game Pass Ultimate или PC Game Pass.',
      },
      {
        question: 'Входит ли Call of Duty в Premium?',
        answer: 'Нет. Call of Duty явно исключён из Game Pass Premium — это подтверждено Microsoft (сноска на xbox.com). Ни один тайтл CoD не появится в Premium ни в день релиза, ни позже. Для Call of Duty Day One нужен Ultimate или PC Game Pass.',
      },
      {
        question: 'Как часто обновляется каталог?',
        answer: 'Каждые 2 недели Microsoft добавляет новые игры и убирает некоторые старые. В марте 2026 в Premium добавлены: Blue Prince, Disco Elysium, Like a Dragon: Infinite Wealth, Resident Evil 7, South of Midnight. Подписывайтесь на наш Telegram — публикуем обновления каталога.',
      },
      {
        question: 'Работает ли Premium на ПК?',
        answer: 'Да. Game Pass Premium работает на Xbox Series X|S, Xbox One и ПК (Windows 10/11). Играйте через приложение Xbox на ПК или через облачный стриминг в браузере. Один аккаунт — обе платформы.',
      },
      {
        question: 'Что будет с играми после окончания подписки?',
        answer: 'Доступ к каталогу Game Pass прекращается — вы не сможете запускать игры из каталога. Но все купленные со скидкой игры и сохранения остаются. При продлении подписки доступ восстанавливается моментально.',
      },
      {
        question: 'Работает ли Game Pass без VPN в России?',
        answer: 'Для скачивания игр и онлайн-мультиплеера VPN не нужен. Для облачного гейминга может потребоваться VPN на поддерживаемую страну. Если Xbox медленно загружается — пропишите DNS 8.8.8.8 или 1.1.1.1 на роутере (известная проблема с января 2026).',
      },
      {
        question: 'Можно ли перейти с Essential на Premium?',
        answer: 'Да. При апгрейде оставшийся срок Essential конвертируется в дни Premium по пропорциональному курсу. Напишите менеджеру ActivePlay — рассчитаем стоимость и выполним апгрейд за 5 минут.',
      },
      {
        question: 'Стоит ли Premium или лучше сразу Ultimate?',
        answer: 'Зависит от приоритетов. Premium (1 700₽/мес) — для тех, кто хочет большой каталог и готов ждать ~год до появления Xbox-эксклюзивов. Ultimate (2 500₽/мес) — для тех, кому важны Day One, Call of Duty, EA Play, Fortnite Crew и облачный гейминг 1440p. Разница — 800₽/мес, но Ultimate включает бонусов на ~$26/мес.',
      },
      {
        question: 'Включён ли EA Play в Premium?',
        answer: 'Нет. EA Play (каталог FIFA/FC, Battlefield, Mass Effect, Need for Speed, The Sims) доступен только в Game Pass Ultimate и PC Game Pass. В Premium EA Play не входит.',
      },
    ],
    seo: {
      title: 'Купить Xbox Game Pass Premium в России — от 1 700₽/мес | ActivePlay',
      description: 'Xbox Game Pass Premium (Гейм Пасс Премиум, бывш. Standard) — каталог 280+ игр для Xbox и ПК, Xbox-эксклюзивы, облачный гейминг. Оплата через СБП из России, активация за 5 минут.',
      keywords: ['game pass premium купить', 'xbox game pass premium', 'game pass standard купить', 'xbox game pass цена', 'game pass premium россия'],
    },
    showcaseGames: {
      hits: [
        { title: 'Cyberpunk 2077', image: '/images/covers/cyberpunk-2077.jpg' },
        { title: 'Kingdom Come: Deliverance II', image: '/images/covers/kingdom-come-2.jpg' },
        { title: 'Hogwarts Legacy', image: '/images/covers/hogwarts-legacy.jpg' },
        { title: 'Starfield', image: '/images/covers/starfield.jpg' },
        { title: 'Diablo IV', image: '/images/covers/diablo-4.jpg' },
        { title: 'Forza Horizon 5', image: '/images/covers/forza-horizon-5.jpg' },
        { title: 'Minecraft', image: '/images/covers/minecraft.jpg' },
        { title: 'GTA V', image: '/images/covers/gta-5.jpg' },
        { title: 'The Witcher 3', image: '/images/covers/witcher-3.jpg' },
        { title: 'Hollow Knight: Silksong', image: '/images/covers/hollow-knight-silksong.jpg' },
      ],
      newReleases: {
        month: 'Март 2026',
        games: [
          { title: 'Disco Elysium: The Final Cut', image: '/images/covers/disco-elysium.jpg' },
          { title: 'Like a Dragon: Infinite Wealth', image: '/images/covers/like-a-dragon.jpg' },
          { title: 'Resident Evil 7', image: '/images/covers/resident-evil-7.jpg' },
          { title: 'South of Midnight', image: '/images/covers/south-of-midnight.jpg' },
          { title: 'The Alters', image: '/images/covers/the-alters.jpg' },
          { title: 'Cyberpunk 2077', image: '/images/covers/cyberpunk-2077.jpg' },
          { title: 'Final Fantasy IV', image: '/images/covers/final-fantasy-4.jpg' },
          { title: 'Blue Prince', image: '/images/covers/blue-prince.jpg' },
        ],
      },
    },
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate',
    slug: 'game-pass-ultimate',
    description: '500+ игр с Day One релизами · EA Play + Ubisoft+ Classics + Fortnite Crew · Облачный гейминг на Xbox, ПК, телефоне и Smart TV · PC Game Pass включён',
    color: '#7B2FA0',
    mainFeatures: [
      {
        icon: 'Swords',
        title: '500+ игр Day One — в день релиза',
        description: 'Все новинки Xbox Game Studios, Bethesda и Activision Blizzard в день выхода. Call of Duty, Fable, Gears of War: E-Day, Forza Horizon 6 — без ожидания. 75+ Day One релизов в год',
      },
      {
        icon: 'Gift',
        title: 'EA Play + Ubisoft+ Classics + Fortnite Crew',
        description: 'Библиотеки EA и Ubisoft включены: FC 26, Battlefield, Need for Speed, Assassin\'s Creed, Far Cry и сотни других. Fortnite Crew: Battle Pass + 1 000 V-Bucks каждый месяц',
      },
      {
        icon: 'Cloud',
        title: 'Облачный гейминг на ТВ и телефоне',
        description: 'Играйте на смартфоне, планшете, Samsung Smart TV, Meta Quest VR или ПК — до 1440p, без скачивания. Xbox не нужен',
      },
    ],
    alsoIncludes: [
      'PC Game Pass (игры на ПК)',
      'Онлайн мультиплеер',
      'Каталог 200+ игр (Premium)',
      'Скидки до 20% в Microsoft Store',
      'Совместная игра с друзьями',
      'Облачное сохранение прогресса',
      'Эксклюзивные перки и награды',
    ],
    prices: {
      global: { 1: 2500, 3: 5100, 12: 13500 },
    },
    faq: [
      {
        question: 'Как купить Xbox Game Pass Ultimate из России в 2026 году?',
        answer: 'Напишите менеджеру ActivePlay в Telegram или VK. Выберите срок подписки (1, 3 или 12 месяцев) и оплатите в рублях через СБП или карту МИР. Менеджер активирует подписку на ваш аккаунт Microsoft за 5 минут. Без VPN, без зарубежных карт, без турецкого аккаунта — всё делаем за вас. Не нужно рисковать с покупкой через турецкий регион — Microsoft блокирует аккаунты за несоответствие страны.',
      },
      {
        question: 'Сколько стоит Xbox Game Pass Ultimate в 2026 году?',
        answer: 'В ActivePlay: 2 500₽ за 1 месяц, 5 100₽ за 3 месяца, 13 500₽ за 12 месяцев (экономия 16 500₽). Официальная цена Microsoft — $29.99/мес без возможности купить на год. ActivePlay — один из немногих способов оформить Ultimate на 12 месяцев с оплатой в рублях.',
      },
      {
        question: 'Чем Ultimate отличается от Premium?',
        answer: 'В Ultimate всё, чего нет в Premium: Day One релизы (новые игры в день выхода, включая Call of Duty), EA Play (каталог FIFA/FC, Battlefield, Mass Effect, The Sims), Ubisoft+ Classics (Assassin\'s Creed, Far Cry), Fortnite Crew (Battle Pass + 1 000 V-Bucks/мес), облачный гейминг до 1440p на Smart TV и Meta Quest VR, PC Game Pass. Суммарная стоимость бонусов — около $26/мес. Разница в цене с Premium — всего 400₽/мес.',
      },
      {
        question: 'Что значит Day One — игры действительно доступны в день релиза?',
        answer: 'Да. Все первопартийные игры Microsoft (Xbox Game Studios, Bethesda, Activision Blizzard) появляются в Ultimate в день мирового релиза. Call of Duty: Black Ops 7 был доступен в ноябре 2025 — Day One. В 2026 подтверждены: Forza Horizon 6 (май), Fable, Gears of War: E-Day, DOOM: The Dark Ages, Subnautica 2, The Outer Worlds 2. Всего 75+ Day One релизов в год.',
      },
      {
        question: 'Что такое облачный гейминг и на каких устройствах работает?',
        answer: 'Облачный гейминг позволяет играть без скачивания — игра запускается на серверах Microsoft и стримится на ваше устройство. Работает на: Xbox Series X|S, Xbox One, ПК (Windows/macOS через браузер), смартфонах (iOS/Android), планшетах, Samsung Smart TV и Meta Quest VR. Разрешение до 1440p. В России может потребоваться VPN для стриминга. Xbox для облачного гейминга не нужен — играйте с телефона или ноутбука.',
      },
      {
        question: 'EA Play входит в Ultimate — что это даёт?',
        answer: 'Полный каталог EA Play включён без доплаты. Это 60+ игр EA: EA Sports FC 26, Battlefield 2042, Star Wars Jedi: Survivor, Mass Effect Legendary Edition, Dead Space, The Sims 4, It Takes Two, Need for Speed Unbound. Плюс пробные версии новинок EA на 10 часов до официального релиза. Отдельно EA Play стоит $5.99/мес — в Ultimate он бесплатно.',
      },
      {
        question: 'PC Game Pass — могу ли я играть на ПК?',
        answer: 'Да. Ultimate включает полный PC Game Pass — 300+ игр на ПК, все Day One релизы (включая Call of Duty), EA Play, Ubisoft+ Classics. Играйте через приложение Xbox на Windows 10/11. Отдельно PC Game Pass стоит $16.49/мес — в Ultimate он включён. Если у вас нет Xbox и вы играете только на ПК — Ultimate всё равно выгоднее, чем PC Game Pass отдельно, благодаря Fortnite Crew ($11.99/мес) и облачному геймингу.',
      },
      {
        question: 'Можно ли играть на Xbox и ПК одновременно?',
        answer: 'Да, с одного аккаунта Microsoft. Играйте на Xbox и ПК — каталог общий, прогресс синхронизируется через облако. Можно начать игру на Xbox, продолжить на ПК и наоборот. Кросс-сейв работает для большинства игр в каталоге.',
      },
      {
        question: 'Стоит ли Ultimate своих денег по сравнению с Premium?',
        answer: 'Считаем: Ultimate стоит 2 500₽/мес. В него входят EA Play (~500₽/мес), Ubisoft+ Classics (~700₽/мес), Fortnite Crew (~1 000₽/мес), PC Game Pass (~1 400₽/мес), облачный гейминг 1440p и Day One релизы. Суммарная ценность бонусов — около $56/мес (4 500₽+). Платите 2 500₽, получаете на 4 500₽. Если играете хотя бы в 2-3 из этих сервисов — Ultimate окупается с первого месяца.',
      },
      {
        question: 'Можно ли апгрейдить Essential или Premium до Ultimate?',
        answer: 'Да. Оставшийся срок текущей подписки конвертируется в дни Ultimate по пропорциональному курсу. Напишите менеджеру ActivePlay — рассчитаем стоимость и выполним апгрейд за 5 минут. Можно апгрейдить в любой момент, не дожидаясь окончания текущей подписки.',
      },
      {
        question: 'Можно ли стакнуть несколько подписок Ultimate?',
        answer: 'Да. Коды Ultimate стакаются до 13 месяцев максимум. Если у вас уже активен 1 месяц Ultimate — можно добавить ещё 12 месяцев. При покупке годовой подписки в ActivePlay мы стакаем коды за вас. Это способ зафиксировать цену и не думать о продлении.',
      },
      {
        question: 'Что будет с играми, если подписка закончится?',
        answer: 'Доступ к каталогу Game Pass, EA Play и Ubisoft+ прекращается. Купленные со скидкой игры и все сохранения остаются. Fortnite Crew перестаёт обновляться, но полученные V-Bucks и скины сохраняются. При продлении подписки доступ ко всему восстанавливается моментально.',
      },
    ],
    seo: {
      title: 'Купить Xbox Game Pass Ultimate в России — от 2 500₽/мес | ActivePlay',
      description: 'Xbox Game Pass Ultimate (Гейм Пасс Ультимейт) — 500+ игр Day One, EA Play, Fortnite Crew, Ubisoft+ Classics, облачный гейминг 1440p. Оплата через СБП из России, активация за 5 минут.',
      keywords: ['game pass ultimate купить', 'xbox game pass ultimate', 'game pass ultimate цена', 'xbox game pass ultimate россия', 'купить гейм пасс ультимейт'],
    },
    showcaseGames: {
      hits: [
        { title: 'Call of Duty: Black Ops 7', image: '/images/covers/call-of-duty-black-ops-7.png' },
        { title: 'Doom: The Dark Ages', image: '/images/covers/doom-dark-ages.jpg' },
        { title: 'Clair Obscur: Expedition 33', image: '/images/covers/clair-obscur.jpg' },
        { title: 'Avowed', image: '/images/covers/avowed.jpg' },
        { title: 'Hogwarts Legacy', image: '/images/covers/hogwarts-legacy.jpg' },
        { title: 'Starfield', image: '/images/covers/starfield.jpg' },
        { title: 'Halo Infinite', image: '/images/covers/halo-infinite.jpg' },
        { title: 'Forza Horizon 5', image: '/images/covers/forza-horizon-5.jpg' },
        { title: 'Minecraft', image: '/images/covers/minecraft.jpg' },
        { title: 'Cyberpunk 2077', image: '/images/covers/cyberpunk-2077.jpg' },
      ],
      dayOneGames: [
        { title: 'EA Sports FC 26', image: '/images/covers/fc-26.png' },
        { title: 'Battlefield 2042', image: '/images/covers/battlefield-2042.jpg' },
        { title: 'Mass Effect Legendary', image: '/images/covers/mass-effect-legendary.jpg' },
        { title: 'Star Wars Jedi: Survivor', image: '/images/covers/jedi-survivor.jpg' },
        { title: 'The Sims 4', image: '/images/covers/sims-4.jpg' },
        { title: 'Dead Space', image: '/images/covers/dead-space.jpg' },
        { title: 'It Takes Two', image: '/images/covers/it-takes-two.jpg' },
      ],
    },
  },
};
