// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-27T09:00:55.393Z
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
        { name: "Standard", priceRUB: 5650 },
        { name: "Deluxe", priceRUB: 6500 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4600 },
        { name: "Deluxe", priceRUB: 5000 },
      ],
    },
  },
  {
    id: "tides-of-tomorrow",
    title: "Tides of Tomorrow",
    slug: "tides-of-tomorrow",
    description: "Приключение от DigixArt. Решения онлайн",
    releaseDate: "22 апреля 2026",
    metacritic: 81,
    genre: "Инди",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202506/0502/83edea47457e08b4d5be5b6a38567d5ea8bfcb297e0ccba2.jpg",
    hypeScore: 2,
    totalScore: 5.5,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 3250 },
      ],
      ua: [
        { name: "Standard", priceRUB: 3000 },
      ],
    },
  },
  {
    id: "saros",
    title: "SAROS",
    slug: "saros",
    description: "Рогалик-шутер от Housemarque. Щит из пуль",
    releaseDate: "27 апреля 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0216/559cda0aac5db568f4d5ab40f73ad0c45416c58ee852e673.jpg",
    hypeScore: 4,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 7400 },
        { name: "Digital Deluxe", priceRUB: 8200 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5450 },
      ],
    },
  },
  {
    id: "kiln-fired-up-edition",
    title: "Kiln Fired Up Edition",
    slug: "kiln-fired-up-edition",
    description: "",
    releaseDate: "23 апреля 2026",
    metacritic: 84,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2600/9b613ce65ca534cfe6f1a117217d105b56ab60bd74c7322e.jpg",
    hypeScore: 1,
    totalScore: 5.2,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 3050 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2850 },
      ],
    },
  },
];
