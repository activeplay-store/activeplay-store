// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-22T03:04:29.532Z
// Предзаказов: 27
// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом

export interface PreorderEdition {
  name: string;
  clientPrice: number;
}

export interface PreorderGame {
  id: string;
  name: string;
  platforms: string[];
  coverUrl: string;
  releaseDate: string | null;
  genre: string;
  description: string;
  editions: {
    TR?: PreorderEdition[];
    UA?: PreorderEdition[];
  };
}

export const preorderData: PreorderGame[] = [
  {
    id: "tides-of-tomorrow",
    name: "Tides of Tomorrow",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202506/0502/83edea47457e08b4d5be5b6a38567d5ea8bfcb297e0ccba2.jpg",
    releaseDate: "2026-04-22",
    genre: "Приключения",
    description: "Приключение от DigixArt. Решения онлайн",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2950 },
      ],
    },
  },
  {
    id: "sudden-strike-5",
    name: "Sudden Strike 5",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0908/7b0b79a9f9a6be5c537543568960526e148af5c5ae1e5696.jpg",
    releaseDate: "2026-04-23",
    genre: "Стратегия",
    description: "Стратегия от KITE Games. Бои ВМВ, 300+ юнитов",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4700 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4000 },
      ],
    },
  },
  {
    id: "kiln",
    name: "Kiln",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/1521/6ddb729cc5b302cc14463f57497d715eef4772fae6886a4e.jpg",
    releaseDate: "2026-04-23",
    genre: "",
    description: "",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 1950 },
      ],
    },
  },
  {
    id: "kiln-fired-up-edition",
    name: "Kiln Fired Up Edition",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2600/9b613ce65ca534cfe6f1a117217d105b56ab60bd74c7322e.jpg",
    releaseDate: "2026-04-23",
    genre: "Экшен",
    description: "Ready to die? Experience the newest brutal action game from",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3050 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2850 },
      ],
    },
  },
  {
    id: "diablo-iv-lord-of-hatred",
    name: "Diablo IV: Lord of Hatred",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1201/0aa045b07431038b0f1a5dfd8d0ca532868b95a149496693.png",
    releaseDate: "2026-04-27",
    genre: "Экшен-RPG",
    description: "RPG-DLC от Blizzard. Паладин и Чернокнижник",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3750 },
        { name: "Deluxe", clientPrice: 5200 },
        { name: "Ultimate", clientPrice: 7600 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
        { name: "Deluxe", clientPrice: 6000 },
        { name: "Ultimate", clientPrice: 8550 },
      ],
    },
  },
  {
    id: "saros",
    name: "SAROS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0216/559cda0aac5db568f4d5ab40f73ad0c45416c58ee852e673.jpg",
    releaseDate: "2026-04-27",
    genre: "Экшен",
    description: "Рогалик-шутер от Housemarque. Щит из пуль",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7350 },
        { name: "Digital Deluxe", clientPrice: 8100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5350 },
      ],
    },
  },
  {
    id: "motogp26",
    name: "MotoGP 26",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/2015/f7d7f07d359ba0613bef8b43e1af74becad0e00357c1ccb3.jpg",
    releaseDate: "2026-04-28",
    genre: "Гонки",
    description: "Мотогонки от Milestone. Реальные рейтинги",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6450 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
      ],
    },
  },
  {
    id: "aphelion",
    name: "Aphelion",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2714/de6618b9259146abf211f578e1ffdb5f8caff248e3879162.jpg",
    releaseDate: "2026-04-28",
    genre: "Экшен-адвенчура",
    description: "Sci-fi адвенчура от DON'T NOD. Два астронавта",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3600 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3250 },
      ],
    },
  },
  {
    id: "magin-the-rat-project-stories",
    name: "Magin: The Rat Project Stories",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1809/ac344c7cdb7f1f6130a0048033a1686c9e671c0040f8a5c7.png",
    releaseDate: "2026-04-29",
    genre: "Карточная RPG",
    description: "Deck-builder от Daedalic. Эмоции и карты",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2250 },
      ],
    },
  },
  {
    id: "invincible-vs",
    name: "Invincible VS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0223/15539affbc76982465016d8f9800a13dcee3adff9685c037.jpg",
    releaseDate: "2026-04-30",
    genre: "Файтинг",
    description: "2D-файтинг от Skybound. 3v3 бои Invincible",
    editions: {
      TR: [
        { name: "Deluxe", clientPrice: 6450 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
      ],
    },
  },
  {
    id: "bus-bound",
    name: "Bus Bound",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/0909/efad045c4766c0944329abc8ca80a585decde5fe214f3349.png",
    releaseDate: "2026-04-30",
    genre: "Экшен",
    description: "In Bound, the player takes on the role of a dancing lady in",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3200 },
      ],
      UA: [
        { name: "Deluxe", clientPrice: 3400 },
      ],
    },
  },
  {
    id: "nitro-gen-omega",
    name: "NITRO GEN OMEGA",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/0807/507f1267c6b33c410dee46185e9ae09fd59f6dc79920a64c.png",
    releaseDate: "2026-05-11",
    genre: "Стратегия",
    description: "In this hybrid RPG/idol simulation, five idols wield Sound W",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2950 },
      ],
    },
  },
  {
    id: "directive-8020",
    name: "Directive 8020",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202408/0522/db14c69711a13cc2d73c3964201ac80587a865a816c3c5d8.png",
    releaseDate: "2026-05-12",
    genre: "Приключения",
    description: "Хоррор от Supermassive. Мимики в космосе",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4700 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4000 },
      ],
    },
  },
  {
    id: "lego-batman-legacy-of-the-dark-knight",
    name: "LEGO Batman: Legacy of the Dark Knight",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1118/3b572e6e923f360a52cfe7845d3e2adc6e6c9d5b0fdc6d6f.jpg",
    releaseDate: "2026-05-18",
    genre: "Приключения",
    description: "Адвенчура от TT Games. Открытый Готэм",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6450 },
        { name: "Deluxe", clientPrice: 8100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
      ],
    },
  },
  {
    id: "king-of-tokyo",
    name: "King of Tokyo",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0516/166e320836e1eaa2655e08f771a89010ffea1c5dfcd331ea.png",
    releaseDate: "2026-05-20",
    genre: "Экшен",
    description: "After strange disappearances hit Tokyo’s population, it’s up",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2950 },
      ],
    },
  },
  {
    id: "bubsy-4d",
    name: "Bubsy 4D",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202508/1222/2ecf79cd82dd87ef94fea0b917f0e6c1b147533a1681bc7b.jpg",
    releaseDate: "2026-05-22",
    genre: "Платформер",
    description: "Join Bubsy on an intergalactic, platforming adventure! The i",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2400 },
      ],
    },
  },
  {
    id: "007-first-light",
    name: "007 First Light",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0215/f54f11bcf773a3bcace540344dc12154973f53d3490b93fc.png",
    releaseDate: "2026-05-26",
    genre: "Экшен",
    description: "Стелс от IO Interactive. Молодой Бонд",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6450 },
      ],
    },
  },
  {
    id: "yerba-buena",
    name: "Yerba Buena",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/2713/2cb6fa09022e8d05a773b4ccbf50bb2daca1456c96d57d65.jpg",
    releaseDate: "2026-05-26",
    genre: "",
    description: "",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2800 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2650 },
      ],
    },
  },
  {
    id: "nickelodeon-extreme-tennis-next",
    name: "Nickelodeon Extreme Tennis: Next!",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/2716/38ab1556e3ead5ede982b78cd321586fa949e7c5f14589d6.jpg",
    releaseDate: "2026-05-27",
    genre: "Экшен",
    description: "Nickelodeon All-Star Brawl, is a new platform fighting game",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2950 },
      ],
    },
  },
  {
    id: "wandering-sword",
    name: "Wandering Sword",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202510/1009/103bc5118f4ca8bb6d93d83e06367628a77e94c692e039bb.png",
    releaseDate: "2026-05-27",
    genre: "Приключения",
    description: "Wuxia-RPG. 20 концовок, два режима боя",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3600 },
        { name: "Deluxe", clientPrice: 4300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3150 },
        { name: "Deluxe", clientPrice: 3700 },
      ],
    },
  },
  {
    id: "gothic-1-remake",
    name: "Gothic 1 Remake",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0714/248b43264c89e489f277a7a2030f6cfbf1a088f2852659c1.jpg",
    releaseDate: "2026-06-05",
    genre: "Экшен",
    description: "The Kingdom of Myrtana has been invaded by an implacable hor",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5550 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4500 },
      ],
    },
  },
  {
    id: "the-adventures-of-elliot-the-millennium-tales",
    name: "The Adventures of Elliot: The Millennium Tales",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/1912/b5a499582e76829925ef74ec1b9b11b7068c93267dfb429b.jpg",
    releaseDate: "2026-06-17",
    genre: "Приключения",
    description: "HD-2D RPG от Square Enix. В стиле Zelda",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6450 },
        { name: "Digital Deluxe", clientPrice: 7350 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
        { name: "Digital Deluxe", clientPrice: 5350 },
      ],
    },
  },
  {
    id: "dead-or-alive-6-last-round",
    name: "DEAD OR ALIVE 6 Last Round",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2718/15b7aec0aa3065e9590934b366888a3a9806476c0df16923.png",
    releaseDate: "2026-06-24",
    genre: "Файтинг",
    description: "3D-файтинг от Team NINJA. 29 бойцов на PS5",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3950 },
        { name: "Deluxe", clientPrice: 6450 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3800 },
        { name: "Deluxe", clientPrice: 5600 },
      ],
    },
  },
  {
    id: "echoes-of-aincrad",
    name: "Echoes of Aincrad",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1808/9d1ce6fb150d8ee13d279d08835e7c19cefc4d34ef1d6978.jpg",
    releaseDate: "2026-07-09",
    genre: "Экшен-RPG",
    description: "RPG по Sword Art Online. Замок Айнкрад",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6450 },
        { name: "Deluxe", clientPrice: 8100 },
        { name: "Ultimate", clientPrice: 9750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
        { name: "Deluxe", clientPrice: 5800 },
        { name: "Ultimate", clientPrice: 6650 },
      ],
    },
  },
  {
    id: "beast-of-reincarnation",
    name: "Beast of Reincarnation",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2622/90ec8c84dd460708d922d6693ef8c61b3b0443db0b636b23.png",
    releaseDate: "2026-08-04",
    genre: "Экшен",
    description: "Post-apocalyptic Japan lies in ruins and teeming with monstr",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5100 },
        { name: "Digital Deluxe", clientPrice: 6000 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4500 },
        { name: "Digital Deluxe", clientPrice: 5350 },
      ],
    },
  },
  {
    id: "marvel-t-kon-fighting-souls",
    name: "MARVEL Tōkon: Fighting Souls",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/0512/82ef3f898acb9608c7ca9d3ae20b012d938f444d04fd0625.jpg",
    releaseDate: "2026-08-06",
    genre: "Файтинг",
    description: "Файтинг от Arc System Works. 4v4 Marvel",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6450 },
        { name: "Digital Deluxe", clientPrice: 8500 },
        { name: "Ultimate", clientPrice: 9750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
      ],
    },
  },
  {
    id: "metal-gear-solid-master-collection-vol-2",
    name: "METAL GEAR SOLID: MASTER COLLECTION Vol.2",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2903/492bf059e5c7ed0ffacd99a444a093d2a785b0cff7fe901e.jpg",
    releaseDate: "2026-08-26",
    genre: "Экшен",
    description: "Стелс от Konami. MGS4 + Peace Walker",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4700 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4000 },
      ],
    },
  },
];
