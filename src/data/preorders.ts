// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-26T17:55:20.119Z
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
  editions: {
    TR?: PreorderEdition[];
    UA?: PreorderEdition[];
  };
}

export const preorderData: PreorderGame[] = [
  {
    id: "mega-man-star-force-legacy-collection-ps4-ps5",
    name: "Mega Man Star Force Legacy Collection",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202510/2104/27af46b79a25c509364fbbdf12a9cba453e6dadd4ea4988b.png",
    releaseDate: "2015-08-24",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4550 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4300 },
      ],
    },
  },
  {
    id: "the-occultist",
    name: "The Occultist",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2415/4ab56c3b6a86dca29d85b9334859f84a0516b039bad836d5.png",
    releaseDate: "2015-09-29",
    editions: {
      TR: [
        { name: "Deluxe", clientPrice: 4550 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3300 },
      ],
    },
  },
  {
    id: "magin-the-rat-project-stories",
    name: "Magin: The Rat Project Stories",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1809/ac344c7cdb7f1f6130a0048033a1686c9e671c0040f8a5c7.png",
    releaseDate: "2016-04-11",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2750 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2500 },
      ],
    },
  },
  {
    id: "magin-the-rat-project-stories-essence-edition",
    name: "Magin: The Rat Project Stories Essence Edition",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1810/516a4c9f55826f986befa072858d1314ea05806d26708e40.png",
    releaseDate: "2016-04-11",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3700 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3400 },
      ],
    },
  },
  {
    id: "tides-of-tomorrow",
    name: "Tides of Tomorrow",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202506/0502/83edea47457e08b4d5be5b6a38567d5ea8bfcb297e0ccba2.jpg",
    releaseDate: "2017-02-27",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3700 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3300 },
      ],
    },
  },
  {
    id: "sudden-strike-5",
    name: "Sudden Strike 5",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/0911/5889aa7d51188a5c22841f0cecb7a8232442335979f417a7.jpg",
    releaseDate: "2017-08-10",
    editions: {
      TR: [
        { name: "Deluxe", clientPrice: 6400 },
      ],
      UA: [
        { name: "Deluxe", clientPrice: 5100 },
      ],
    },
  },
  {
    id: "motogp26",
    name: "MotoGP 26",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/2015/f7d7f07d359ba0613bef8b43e1af74becad0e00357c1ccb3.jpg",
    releaseDate: "2018-06-07",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5600 },
      ],
    },
  },
  {
    id: "darwin-s-paradox",
    name: "Darwin's Paradox!",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/0718/8dc3bb026f8c0873ac11c58a584c3ee618dbfc9db4064514.png",
    releaseDate: "2018-07-27",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3000 },
      ],
    },
  },
  {
    id: "cthulhu-the-cosmic-abyss-r-lyeh-edition",
    name: "Cthulhu: The Cosmic Abyss - R'lyeh Edition",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2013/e8cc34b3e9fc782c62214c44aa4ad60242defb0e24e31ce0.jpg",
    releaseDate: "2020-07-13",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5100 },
      ],
    },
  },
  {
    id: "cthulhu-the-cosmic-abyss",
    name: "Cthulhu: The Cosmic Abyss",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202503/0315/efbadeb619a95800bf218aad72b12e3460894763243ee3ba.jpg",
    releaseDate: "2020-07-13",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4500 },
      ],
    },
  },
  {
    id: "wandering-sword",
    name: "Wandering Sword",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202510/1009/103bc5118f4ca8bb6d93d83e06367628a77e94c692e039bb.png",
    releaseDate: "2020-10-27",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4100 },
        { name: "Deluxe", clientPrice: 4950 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3550 },
        { name: "Deluxe", clientPrice: 4200 },
      ],
    },
  },
  {
    id: "jay-and-silent-bob-chronic-blunt-punch",
    name: "Jay and Silent Bob: Chronic Blunt Punch",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2417/cbb7c65a786cca846fe8be3bf5bf609457a36b8a5469f087.jpg",
    releaseDate: "2021-08-15",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2750 },
      ],
    },
  },
  {
    id: "echoes-of-aincrad",
    name: "Echoes of Aincrad",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1907/db819d43d83148bec96dbaebc3daed099761432296eff166.jpg",
    releaseDate: "2021-09-28",
    editions: {
      TR: [
        { name: "Ultimate", clientPrice: 11250 },
        { name: "Standard", clientPrice: 7400 },
        { name: "Deluxe", clientPrice: 9350 },
      ],
      UA: [
        { name: "Ultimate", clientPrice: 7500 },
        { name: "Standard", clientPrice: 5600 },
        { name: "Deluxe", clientPrice: 6550 },
      ],
    },
  },
  {
    id: "metal-gear-solid-master-collection-vol-2",
    name: "METAL GEAR SOLID: MASTER COLLECTION Vol.2",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2903/492bf059e5c7ed0ffacd99a444a093d2a785b0cff7fe901e.jpg",
    releaseDate: "2023-10-23",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4500 },
      ],
    },
  },
  {
    id: "diablo-iv-lord-of-hatred",
    name: "Diablo IV: Lord of Hatred",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1201/0aa045b07431038b0f1a5dfd8d0ca532868b95a149496693.png",
    releaseDate: "2024-10-07",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4300 },
        { name: "Ultimate", clientPrice: 8750 },
        { name: "Deluxe", clientPrice: 6000 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
        { name: "Ultimate", clientPrice: 9650 },
        { name: "Deluxe", clientPrice: 6800 },
      ],
    },
  },
  {
    id: "diablo-iv-age-of-hatred-collection",
    name: "Diablo IV: Age of Hatred Collection",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1222/84024460e7ec9f95d0c02b6ace0dd7477a01a212413c26ac.png",
    releaseDate: "2024-10-07",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6950 },
        { name: "Standard", clientPrice: 4650 },
      ],
    },
  },
  {
    id: "pragmata",
    name: "PRAGMATA",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/2605/b7ec5836e23affe26c8ad00124a1eddddab5e1bad456c03e.jpg",
    releaseDate: "2026-04-17",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6400 },
        { name: "Deluxe", clientPrice: 7400 },
      ],
      UA: [
        { name: "Deluxe", clientPrice: 5600 },
        { name: "Standard", clientPrice: 5100 },
      ],
    },
  },
  {
    id: "saros",
    name: "SAROS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202509/2318/89c3538003fb34870e745493412408eeeed5f02b32c55d23.png",
    releaseDate: "2026-04-30",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 8450 },
        { name: "Digital Deluxe", clientPrice: 9350 },
      ],
      UA: [
        { name: "Standard", clientPrice: 6050 },
      ],
    },
  },
  {
    id: "invincible-vs",
    name: "Invincible VS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0223/abae93143736137f8d17917de28aa0eedbf2f098ee3402e4.jpg",
    releaseDate: "2026-04-30",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4900 },
      ],
    },
  },
  {
    id: "directive-8020",
    name: "Directive 8020",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202408/0522/db14c69711a13cc2d73c3964201ac80587a865a816c3c5d8.png",
    releaseDate: "2026-05-12",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4500 },
      ],
    },
  },
  {
    id: "lego-batman-legacy-of-the-dark-knight",
    name: "LEGO Batman: Legacy of the Dark Knight",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1118/3b572e6e923f360a52cfe7845d3e2adc6e6c9d5b0fdc6d6f.jpg",
    releaseDate: "2026-05-22",
    editions: {
      TR: [
        { name: "Deluxe", clientPrice: 9350 },
        { name: "Standard", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5600 },
      ],
    },
  },
  {
    id: "007-first-light",
    name: "007 First Light",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0215/f54f11bcf773a3bcace540344dc12154973f53d3490b93fc.png",
    releaseDate: "2026-05-27",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7400 },
      ],
    },
  },
  {
    id: "the-adventures-of-elliot-the-millennium-tales",
    name: "The Adventures of Elliot: The Millennium Tales",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/1912/b5a499582e76829925ef74ec1b9b11b7068c93267dfb429b.jpg",
    releaseDate: "2026-06-18",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7400 },
        { name: "Digital Deluxe", clientPrice: 8450 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5600 },
        { name: "Digital Deluxe", clientPrice: 6050 },
      ],
    },
  },
  {
    id: "dead-or-alive-6-last-round",
    name: "DEAD OR ALIVE 6 Last Round",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2718/15b7aec0aa3065e9590934b366888a3a9806476c0df16923.png",
    releaseDate: "2026-06-24",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4550 },
        { name: "Standard", clientPrice: 6250 },
        { name: "Deluxe", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4300 },
        { name: "Standard", clientPrice: 5600 },
        { name: "Deluxe", clientPrice: 6300 },
      ],
    },
  },
  {
    id: "marvel-t-kon-fighting-souls",
    name: "MARVEL Tōkon: Fighting Souls",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/0512/82ef3f898acb9608c7ca9d3ae20b012d938f444d04fd0625.jpg",
    releaseDate: "2026-08-06",
    editions: {
      TR: [
        { name: "Ultimate", clientPrice: 11250 },
        { name: "Digital Deluxe", clientPrice: 9800 },
        { name: "Standard", clientPrice: 7400 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5600 },
      ],
    },
  },
  {
    id: "aphelion",
    name: "Aphelion",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2714/de6618b9259146abf211f578e1ffdb5f8caff248e3879162.jpg",
    releaseDate: null,
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3650 },
      ],
    },
  },
  {
    id: "starfield",
    name: "Starfield",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/0401/18b516e759613304c7efc7bcd3c134d6bfb5380d655df9be.jpg",
    releaseDate: null,
    editions: {
      TR: [
        { name: "Premium", clientPrice: 5700 },
        { name: "Standard", clientPrice: 4350 },
      ],
      UA: [
        { name: "Premium", clientPrice: 5850 },
        { name: "Standard", clientPrice: 4500 },
      ],
    },
  },
];
