// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-19T09:00:45.459Z
// Горящих новинок: 4
// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом

export interface HotReleaseEdition {
  name: string;
  priceRUB: number;
}

export interface HotRelease {
  id: string;
  title: string;
  slug: string;
  description: string;
  releaseDate: string;
  metacritic: number;
  genre: string;
  platforms: string[];
  cover: string;
  hypeScore: number;
  totalScore: number;
  editions: {
    tr: HotReleaseEdition[];
    ua: HotReleaseEdition[];
  };
}

export const hotReleases: HotRelease[] = [
  {
    id: "pragmata",
    title: "PRAGMATA",
    slug: "pragmata",
    description: "Sci-fi адвенчура от Capcom. Дуэт с андроидом",
    releaseDate: "16 апреля 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202511/2605/b7ec5836e23affe26c8ad00124a1eddddab5e1bad456c03e.jpg",
    hypeScore: 6,
    totalScore: 6.2,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 6300 },
        { name: "Deluxe", priceRUB: 7250 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5000 },
        { name: "Deluxe", priceRUB: 5450 },
      ],
    },
  },
  {
    id: "the-occultist",
    title: "The Occultist",
    slug: "the-occultist",
    description: "Хоррор от Daedalic. Мистический маятник",
    releaseDate: "8 апреля 2026",
    metacritic: 66,
    genre: "Приключения",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202408/0109/1a0d7fdc724c04debb886c4421d4db4199a771f8dfe22ae1.jpg",
    hypeScore: 2,
    totalScore: 5.1,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 3650 },
      ],
      ua: [
        { name: "Standard", priceRUB: 3250 },
      ],
    },
  },
  {
    id: "starfield",
    title: "Starfield",
    slug: "starfield",
    description: "Космическая RPG от Bethesda. 1000+ планет",
    releaseDate: "7 апреля 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202603/0401/18b516e759613304c7efc7bcd3c134d6bfb5380d655df9be.jpg",
    hypeScore: 3,
    totalScore: 5,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4250 },
        { name: "Premium", priceRUB: 5550 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4400 },
        { name: "Premium", priceRUB: 5700 },
      ],
    },
  },
  {
    id: "cthulhu-the-cosmic-abyss-r-lyeh-edition",
    title: "Cthulhu: The Cosmic Abyss - R'lyeh Edition",
    slug: "cthulhu-the-cosmic-abyss-r-lyeh-edition",
    description: "Хоррор от Big Bad Wolf. Лавкрафт, Р'льех",
    releaseDate: "16 апреля 2026",
    metacritic: 78,
    genre: "Платформер",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202601/2013/e8cc34b3e9fc782c62214c44aa4ad60242defb0e24e31ce0.jpg",
    hypeScore: 1,
    totalScore: 5,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 6300 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5000 },
      ],
    },
  },
];
