// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-01T01:16:56.944Z
// Предзаказов: 24
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
    id: "darwin-s-paradox",
    name: "Darwin's Paradox!",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/0718/8dc3bb026f8c0873ac11c58a584c3ee618dbfc9db4064514.png",
    releaseDate: "2026-04-02",
    genre: "Казуальная",
    description: "Платформер от ZDT Studio. Стелс-осьминог",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2900 },
      ],
    },
  },
  {
    id: "starfield",
    name: "Starfield",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/0401/18b516e759613304c7efc7bcd3c134d6bfb5380d655df9be.jpg",
    releaseDate: "2026-04-07",
    genre: "Экшен-RPG",
    description: "Космическая RPG от Bethesda. 1000+ планет",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4200 },
        { name: "Premium", clientPrice: 5500 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
        { name: "Premium", clientPrice: 5650 },
      ],
    },
  },
  {
    id: "the-occultist",
    name: "The Occultist",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202408/0109/1a0d7fdc724c04debb886c4421d4db4199a771f8dfe22ae1.jpg",
    releaseDate: "2026-04-08",
    genre: "Приключения",
    description: "Хоррор от Daedalic. Мистический маятник",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3600 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3200 },
      ],
    },
  },
  {
    id: "pragmata",
    name: "PRAGMATA",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/2605/b7ec5836e23affe26c8ad00124a1eddddab5e1bad456c03e.jpg",
    releaseDate: "2026-04-16",
    genre: "Экшен",
    description: "Sci-fi адвенчура от Capcom. Дуэт с андроидом",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6200 },
        { name: "Deluxe", clientPrice: 7150 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4950 },
        { name: "Deluxe", clientPrice: 5400 },
      ],
    },
  },
  {
    id: "cthulhu-the-cosmic-abyss",
    name: "Cthulhu: The Cosmic Abyss",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202503/0315/efbadeb619a95800bf218aad72b12e3460894763243ee3ba.jpg",
    releaseDate: "2026-04-16",
    genre: "Хоррор",
    description: "Хоррор от Big Bad Wolf. Лавкрафт, Р'льех",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5250 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
      ],
    },
  },
  {
    id: "jay-and-silent-bob-chronic-blunt-punch",
    name: "Jay and Silent Bob: Chronic Blunt Punch",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2417/cbb7c65a786cca846fe8be3bf5bf609457a36b8a5469f087.jpg",
    releaseDate: "2026-04-20",
    genre: "Аркада",
    description: "Beat 'em up от Interabang. Кооп-аркада",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2650 },
      ],
    },
  },
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
        { name: "Standard", clientPrice: 3600 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3200 },
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
        { name: "Standard", clientPrice: 5250 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
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
        { name: "Standard", clientPrice: 4150 },
        { name: "Deluxe", clientPrice: 5800 },
        { name: "Ultimate", clientPrice: 8500 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4750 },
        { name: "Deluxe", clientPrice: 6550 },
        { name: "Ultimate", clientPrice: 9350 },
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
        { name: "Standard", clientPrice: 7150 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5400 },
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
        { name: "Standard", clientPrice: 4000 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3550 },
      ],
    },
  },
  {
    id: "saros",
    name: "SAROS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202509/2318/89c3538003fb34870e745493412408eeeed5f02b32c55d23.png",
    releaseDate: "2026-04-29",
    genre: "Экшен",
    description: "Рогалик-шутер от Housemarque. Щит из пуль",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 8150 },
        { name: "Digital Deluxe", clientPrice: 9050 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5850 },
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
        { name: "Standard", clientPrice: 2650 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2450 },
      ],
    },
  },
  {
    id: "invincible-vs",
    name: "Invincible VS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0223/abae93143736137f8d17917de28aa0eedbf2f098ee3402e4.jpg",
    releaseDate: "2026-04-30",
    genre: "Файтинг",
    description: "2D-файтинг от Skybound. 3v3 бои Invincible",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5250 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4750 },
      ],
    },
  },
  {
    id: "bus-bound",
    name: "Bus Bound",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/1113/0466c34c4f4ceeeb44c46ba875dcc58753f1a5ae30d7257c.png",
    releaseDate: "2026-04-30",
    genre: "Экшен",
    description: "In Bound, the player takes on the role of a dancing lady in",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3600 },
      ],
      UA: [
        { name: "Deluxe", clientPrice: 3700 },
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
        { name: "Standard", clientPrice: 5250 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
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
        { name: "Standard", clientPrice: 7150 },
        { name: "Deluxe", clientPrice: 9050 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5400 },
      ],
    },
  },
  {
    id: "007-first-light",
    name: "007 First Light",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0215/f54f11bcf773a3bcace540344dc12154973f53d3490b93fc.png",
    releaseDate: "2026-05-25",
    genre: "Экшен",
    description: "Стелс от IO Interactive. Молодой Бонд",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7150 },
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
        { name: "Standard", clientPrice: 4000 },
        { name: "Deluxe", clientPrice: 4800 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3400 },
        { name: "Deluxe", clientPrice: 4050 },
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
        { name: "Standard", clientPrice: 7150 },
        { name: "Digital Deluxe", clientPrice: 8150 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5400 },
        { name: "Digital Deluxe", clientPrice: 5850 },
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
        { name: "Standard", clientPrice: 4450 },
        { name: "Deluxe", clientPrice: 7150 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4150 },
        { name: "Deluxe", clientPrice: 6100 },
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
        { name: "Standard", clientPrice: 7150 },
        { name: "Deluxe", clientPrice: 9050 },
        { name: "Ultimate", clientPrice: 10900 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5400 },
        { name: "Deluxe", clientPrice: 6350 },
        { name: "Ultimate", clientPrice: 7250 },
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
        { name: "Standard", clientPrice: 7150 },
        { name: "Digital Deluxe", clientPrice: 9450 },
        { name: "Ultimate", clientPrice: 10900 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5400 },
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
        { name: "Standard", clientPrice: 5250 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4350 },
      ],
    },
  },
];
