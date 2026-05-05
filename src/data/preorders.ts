// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-05-05T00:04:10.214Z
// Предзаказов: 25
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
    id: "nitro-gen-omega",
    name: "NITRO GEN OMEGA",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/0807/507f1267c6b33c410dee46185e9ae09fd59f6dc79920a64c.png",
    releaseDate: "2026-05-11",
    genre: "Стратегия",
    description: "In this hybrid RPG/idol simulation, five idols wield Sound W",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3250 },
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
        { name: "Standard", clientPrice: 4750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4050 },
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
        { name: "Standard", clientPrice: 6500 },
        { name: "Deluxe", clientPrice: 8200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5000 },
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
        { name: "Standard", clientPrice: 3250 },
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
        { name: "Standard", clientPrice: 6500 },
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
        { name: "Standard", clientPrice: 2700 },
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
        { name: "Standard", clientPrice: 3250 },
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
        { name: "Deluxe", clientPrice: 4350 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3150 },
        { name: "Deluxe", clientPrice: 3750 },
      ],
    },
  },
  {
    id: "necrophosis-full-consciousness",
    name: "Necrophosis: Full Consciousness",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2214/3d3c6d0311a5817e560593a0d7b13735346c7835fe24e4b1.jpg",
    releaseDate: "2026-05-28",
    genre: "Приключения",
    description: "Our indecisive protagonist, Vincent, has been with his long-",
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
    id: "gothic-1-remake",
    name: "Gothic 1 Remake",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0714/248b43264c89e489f277a7a2030f6cfbf1a088f2852659c1.jpg",
    releaseDate: "2026-06-05",
    genre: "Экшен",
    description: "The Kingdom of Myrtana has been invaded by an implacable hor",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5650 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4600 },
      ],
    },
  },
  {
    id: "monopoly-star-wars-heroes-vs-villains",
    name: "Monopoly: Star Wars Heroes vs. Villains",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/0912/e2118793c28673394ef7134551f954d10f6c8b2940bf7279.jpg",
    releaseDate: "2026-06-10",
    genre: "Экшен",
    description: "Master the art of starfighter combat in the authentic piloti",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2850 },
      ],
    },
  },
  {
    id: "ufc-6",
    name: "UFC 6",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/2217/062d04994b5e270962724a172a640b122b0d4049c8471d05.png",
    releaseDate: "2026-06-12",
    genre: "Спорт",
    description: "In EA SPORTS UFC 4 the fighter you become is shaped by your",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 8450 },
        { name: "Ultimate", clientPrice: 11400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 6300 },
        { name: "Ultimate", clientPrice: 9000 },
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
        { name: "Standard", clientPrice: 6500 },
        { name: "Digital Deluxe", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5000 },
        { name: "Digital Deluxe", clientPrice: 5400 },
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
        { name: "Standard", clientPrice: 4000 },
        { name: "Deluxe", clientPrice: 6500 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3850 },
        { name: "Deluxe", clientPrice: 5650 },
      ],
    },
  },
  {
    id: "assassin-s-creed-black-flag-resynced",
    name: "Assassin's Creed Black Flag Resynced",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/1215/866aea007130d2610c97731cd33f6c725181924cbc8154dd.jpg",
    releaseDate: "2026-07-08",
    genre: "Приключения",
    description: "The iconic solo pirate adventure returns. Sail the Caribbean",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4650 },
        { name: "Deluxe", clientPrice: 5400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4600 },
        { name: "Deluxe", clientPrice: 5200 },
      ],
    },
  },
  {
    id: "echoes-of-aincrad",
    name: "Echoes of Aincrad",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1907/db819d43d83148bec96dbaebc3daed099761432296eff166.jpg",
    releaseDate: "2026-07-09",
    genre: "Экшен-RPG",
    description: "RPG по Sword Art Online. Замок Айнкрад",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6500 },
        { name: "Deluxe", clientPrice: 8200 },
        { name: "Ultimate", clientPrice: 9900 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5000 },
        { name: "Deluxe", clientPrice: 5850 },
        { name: "Ultimate", clientPrice: 6700 },
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
        { name: "Standard", clientPrice: 5150 },
        { name: "Digital Deluxe", clientPrice: 6100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4600 },
        { name: "Digital Deluxe", clientPrice: 5400 },
      ],
    },
  },
  {
    id: "marvel-t-kon-fighting-souls",
    name: "MARVEL Tōkon: Fighting Souls",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/0512/7ba3a1fac3bdcf6df6ffd10662d2a7833abe9743529782fb.jpg",
    releaseDate: "2026-08-06",
    genre: "Файтинг",
    description: "Файтинг от Arc System Works. 4v4 Marvel",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6500 },
        { name: "Digital Deluxe", clientPrice: 8550 },
        { name: "Ultimate", clientPrice: 9900 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5000 },
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
        { name: "Standard", clientPrice: 4750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4050 },
      ],
    },
  },
  {
    id: "brigandine-abyss",
    name: "Brigandine Abyss",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/0500/fec32977d055a076022ac101496d414d5157e4bce5690753.jpg",
    releaseDate: "2026-08-26",
    genre: "Платформер",
    description: "Neon Abyss is a frantic roguelike action platformer features",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4050 },
      ],
    },
  },
  {
    id: "the-blood-of-dawnwalker",
    name: "The Blood of Dawnwalker",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/3009/0de89908bb791e48c078a1de80a959855f494a842353004d.jpg",
    releaseDate: "2026-09-02",
    genre: "Экшен",
    description: "From Rebel Wolves, comes the first chapter of a brand new ro",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6500 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5000 },
      ],
    },
  },
  {
    id: "the-blood-of-dawnwalker-eclipse-edition",
    name: "The Blood of Dawnwalker - Eclipse Edition",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/0906/ca19474111582ae9a946cbe61d970b854dd87426213cfb22.jpg",
    releaseDate: "2026-09-02",
    genre: "Экшен",
    description: "From Rebel Wolves, comes the first chapter of a brand new ro",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5400 },
      ],
    },
  },
  {
    id: "star-wars-galactic-racer",
    name: "STAR WARS: Galactic Racer",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/2012/20bdb4865991fe33b571f41d38def2fbf6cd2a146c80c826.png",
    releaseDate: "2026-10-06",
    genre: "Гонки",
    description: "It has been eight years since the first spectacular Podracin",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5650 },
        { name: "Deluxe", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4600 },
      ],
    },
  },
  {
    id: "crymelight",
    name: "CRYMELIGHT",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/0205/baf360b1f72f1d88b1da64a7f89b20efacfb8be7806f243a.png",
    releaseDate: "2026-11-04",
    genre: "",
    description: "",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2400 },
        { name: "Deluxe", clientPrice: 4000 },
      ],
    },
  },
];
