// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-26T22:19:55.697Z
// Предзаказов: 23
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
    genre: "Casual",
    description: "Play as Black Paradox, a bounty hunter, able to travel in ti",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3150 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2950 },
      ],
    },
  },
  {
    id: "starfield",
    name: "Starfield",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/0401/18b516e759613304c7efc7bcd3c134d6bfb5380d655df9be.jpg",
    releaseDate: "2026-04-07",
    genre: "",
    description: "",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4250 },
        { name: "Premium", clientPrice: 5600 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4450 },
        { name: "Premium", clientPrice: 5750 },
      ],
    },
  },
  {
    id: "the-occultist",
    name: "The Occultist",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2415/4ab56c3b6a86dca29d85b9334859f84a0516b039bad836d5.png",
    releaseDate: "2026-04-08",
    genre: "Adventure",
    description: "Just Updated The Survival Mode update adds an all new gamepl",
    editions: {
      TR: [
        { name: "Deluxe", clientPrice: 4500 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3250 },
      ],
    },
  },
  {
    id: "pragmata",
    name: "PRAGMATA",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/2605/b7ec5836e23affe26c8ad00124a1eddddab5e1bad456c03e.jpg",
    releaseDate: "2026-04-16",
    genre: "Action",
    description: "Capcom’s newest IP—PRAGMATA. An all-new Science Fiction acti",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6300 },
        { name: "Deluxe", clientPrice: 7300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5050 },
        { name: "Deluxe", clientPrice: 5500 },
      ],
    },
  },
  {
    id: "cthulhu-the-cosmic-abyss-r-lyeh-edition",
    name: "Cthulhu: The Cosmic Abyss - R'lyeh Edition",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2013/e8cc34b3e9fc782c62214c44aa4ad60242defb0e24e31ce0.jpg",
    releaseDate: "2026-04-16",
    genre: "Platformer",
    description: "Neon Abyss is a frantic roguelike action platformer features",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 6300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5050 },
      ],
    },
  },
  {
    id: "jay-and-silent-bob-chronic-blunt-punch",
    name: "Jay and Silent Bob: Chronic Blunt Punch",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2417/cbb7c65a786cca846fe8be3bf5bf609457a36b8a5469f087.jpg",
    releaseDate: "2026-04-20",
    genre: "Arcade",
    description: "Jay and Silent Bob: Chronic Blunt Punch is a colorful side-s",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2700 },
      ],
    },
  },
  {
    id: "sudden-strike-5",
    name: "Sudden Strike 5",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/0911/5889aa7d51188a5c22841f0cecb7a8232442335979f417a7.jpg",
    releaseDate: "2026-04-20",
    genre: "Strategy",
    description: "Sudden Strike 4 sends you off on three extensive campaigns s",
    editions: {
      TR: [
        { name: "Deluxe", clientPrice: 6300 },
      ],
      UA: [
        { name: "Deluxe", clientPrice: 5050 },
      ],
    },
  },
  {
    id: "tides-of-tomorrow",
    name: "Tides of Tomorrow",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202506/0502/83edea47457e08b4d5be5b6a38567d5ea8bfcb297e0ccba2.jpg",
    releaseDate: "2026-04-22",
    genre: "Indie",
    description: "Torment: Tides of Numenera is a role-playing game developed",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 3650 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3250 },
      ],
    },
  },
  {
    id: "diablo-iv-lord-of-hatred",
    name: "Diablo IV: Lord of Hatred",
    platforms: ["PS5","PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1201/0aa045b07431038b0f1a5dfd8d0ca532868b95a149496693.png",
    releaseDate: "2026-04-27",
    genre: "Action",
    description: "",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4250 },
        { name: "Deluxe", clientPrice: 5900 },
        { name: "Ultimate", clientPrice: 8650 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4850 },
        { name: "Deluxe", clientPrice: 6700 },
        { name: "Ultimate", clientPrice: 9500 },
      ],
    },
  },
  {
    id: "motogp26",
    name: "MotoGP 26",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/2015/f7d7f07d359ba0613bef8b43e1af74becad0e00357c1ccb3.jpg",
    releaseDate: "2026-04-28",
    genre: "Racing",
    description: "Become the star of the 2018 MotoGP™ season! Pursue your care",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5500 },
      ],
    },
  },
  {
    id: "aphelion",
    name: "Aphelion",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2714/de6618b9259146abf211f578e1ffdb5f8caff248e3879162.jpg",
    releaseDate: "2026-04-28",
    genre: "",
    description: "",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4050 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3600 },
      ],
    },
  },
  {
    id: "saros",
    name: "SAROS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202509/2318/89c3538003fb34870e745493412408eeeed5f02b32c55d23.png",
    releaseDate: "2026-04-29",
    genre: "Action",
    description: "SAROS is an action game with the haunting story of a lost of",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 8300 },
        { name: "Digital Deluxe", clientPrice: 9200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5950 },
      ],
    },
  },
  {
    id: "magin-the-rat-project-stories",
    name: "Magin: The Rat Project Stories",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1809/ac344c7cdb7f1f6130a0048033a1686c9e671c0040f8a5c7.png",
    releaseDate: "2026-04-29",
    genre: "Platformer",
    description: "Stories: The Path of Destinies is an action RPG developed by",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 2700 },
      ],
      UA: [
        { name: "Standard", clientPrice: 2500 },
      ],
    },
  },
  {
    id: "invincible-vs",
    name: "Invincible VS",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0223/abae93143736137f8d17917de28aa0eedbf2f098ee3402e4.jpg",
    releaseDate: "2026-04-30",
    genre: "Fighting",
    description: "Invincible VS is an upcoming fighting video game developed b",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4850 },
      ],
    },
  },
  {
    id: "directive-8020",
    name: "Directive 8020",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202408/0522/db14c69711a13cc2d73c3964201ac80587a865a816c3c5d8.png",
    releaseDate: "2026-05-12",
    genre: "Adventure",
    description: "Earth is dying and humanity is running out of time. 12 light",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4450 },
      ],
    },
  },
  {
    id: "lego-batman-legacy-of-the-dark-knight",
    name: "LEGO Batman: Legacy of the Dark Knight",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202511/1118/3b572e6e923f360a52cfe7845d3e2adc6e6c9d5b0fdc6d6f.jpg",
    releaseDate: "2026-05-18",
    genre: "Adventure",
    description: "Lego Batman: Legacy of the Dark Knight is an upcoming Lego-t",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7300 },
        { name: "Deluxe", clientPrice: 9200 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5500 },
      ],
    },
  },
  {
    id: "007-first-light",
    name: "007 First Light",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0215/f54f11bcf773a3bcace540344dc12154973f53d3490b93fc.png",
    releaseDate: "2026-05-25",
    genre: "Action",
    description: "007 First Light is a brand new James Bond video game develop",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7300 },
      ],
    },
  },
  {
    id: "wandering-sword",
    name: "Wandering Sword",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202510/1009/103bc5118f4ca8bb6d93d83e06367628a77e94c692e039bb.png",
    releaseDate: "2026-05-27",
    genre: "Adventure",
    description: "Journey through a fantastical reimagining of ancient China i",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4050 },
        { name: "Deluxe", clientPrice: 4850 },
      ],
      UA: [
        { name: "Standard", clientPrice: 3500 },
        { name: "Deluxe", clientPrice: 4100 },
      ],
    },
  },
  {
    id: "the-adventures-of-elliot-the-millennium-tales",
    name: "The Adventures of Elliot: The Millennium Tales",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/1912/b5a499582e76829925ef74ec1b9b11b7068c93267dfb429b.jpg",
    releaseDate: "2026-06-17",
    genre: "Adventure",
    description: "Les Aventures d'Elliot : Les Contes du Millénaire vous plong",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7300 },
        { name: "Digital Deluxe", clientPrice: 8300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5500 },
        { name: "Digital Deluxe", clientPrice: 5950 },
      ],
    },
  },
  {
    id: "dead-or-alive-6-last-round",
    name: "DEAD OR ALIVE 6 Last Round",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2718/15b7aec0aa3065e9590934b366888a3a9806476c0df16923.png",
    releaseDate: "2026-06-24",
    genre: "Arcade",
    description: "The final word in fighting entertainment - DEAD OR ALIVE 5 L",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 4500 },
        { name: "Deluxe", clientPrice: 7300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4200 },
        { name: "Deluxe", clientPrice: 6200 },
      ],
    },
  },
  {
    id: "echoes-of-aincrad",
    name: "Echoes of Aincrad",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1907/db819d43d83148bec96dbaebc3daed099761432296eff166.jpg",
    releaseDate: "2026-07-09",
    genre: "Adventure",
    description: "A strange satellite photo that can’t be explained. A new mus",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7300 },
        { name: "Deluxe", clientPrice: 9200 },
        { name: "Ultimate", clientPrice: 11100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5500 },
        { name: "Deluxe", clientPrice: 6450 },
        { name: "Ultimate", clientPrice: 7400 },
      ],
    },
  },
  {
    id: "marvel-t-kon-fighting-souls",
    name: "MARVEL Tōkon: Fighting Souls",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/0512/82ef3f898acb9608c7ca9d3ae20b012d938f444d04fd0625.jpg",
    releaseDate: "2026-08-06",
    genre: "Fighting",
    description: "Marvel Tōkon: Fighting Souls is an upcoming fighting game de",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 7300 },
        { name: "Digital Deluxe", clientPrice: 9600 },
        { name: "Ultimate", clientPrice: 11100 },
      ],
      UA: [
        { name: "Standard", clientPrice: 5500 },
      ],
    },
  },
  {
    id: "metal-gear-solid-master-collection-vol-2",
    name: "METAL GEAR SOLID: MASTER COLLECTION Vol.2",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2903/492bf059e5c7ed0ffacd99a444a093d2a785b0cff7fe901e.jpg",
    releaseDate: "2026-08-26",
    genre: "Action",
    description: "The origin of stealth action returns. METAL GEAR SOLID: MAST",
    editions: {
      TR: [
        { name: "Standard", clientPrice: 5300 },
      ],
      UA: [
        { name: "Standard", clientPrice: 4450 },
      ],
    },
  },
];
