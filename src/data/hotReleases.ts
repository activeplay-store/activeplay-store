// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-21T14:55:58.500Z
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
        { name: "Standard", priceRUB: 6750 },
        { name: "Deluxe", priceRUB: 7750 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5350 },
        { name: "Deluxe", priceRUB: 5800 },
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
        { name: "Standard", priceRUB: 6750 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5350 },
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
    hypeScore: 1,
    totalScore: 4.7,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 3900 },
      ],
      ua: [
        { name: "Standard", priceRUB: 3450 },
      ],
    },
  },
  {
    id: "jay-and-silent-bob-chronic-blunt-punch",
    title: "Jay and Silent Bob: Chronic Blunt Punch",
    slug: "jay-and-silent-bob-chronic-blunt-punch",
    description: "Beat 'em up от Interabang. Кооп-аркада",
    releaseDate: "20 апреля 2026",
    metacritic: 0,
    genre: "Аркада",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2417/cbb7c65a786cca846fe8be3bf5bf609457a36b8a5469f087.jpg",
    hypeScore: 1,
    totalScore: 4.2,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 2850 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2850 },
      ],
    },
  },
];
