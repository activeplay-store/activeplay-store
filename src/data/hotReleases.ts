// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-08T09:00:54.779Z
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
    id: "crimson-desert",
    title: "Crimson Desert",
    slug: "crimson-desert",
    description: "Open-world RPG от Pearl Abyss. Хардкор-бой",
    releaseDate: "19 марта 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://media.rawg.io/media/games/dac/dacfcdeaef957a36416f4e6d5ec76229.jpg",
    hypeScore: 5,
    totalScore: 5.8,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 7400 },
        { name: "Deluxe", priceRUB: 8450 },
      ],
      ua: [
        { name: "Standard", priceRUB: 7400 },
        { name: "Deluxe", priceRUB: 8450 },
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
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2415/4ab56c3b6a86dca29d85b9334859f84a0516b039bad836d5.png",
    hypeScore: 2,
    totalScore: 5.1,
    editions: {
      tr: [
        { name: "Deluxe", priceRUB: 4550 },
      ],
      ua: [
        { name: "Deluxe", priceRUB: 3800 },
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
    hypeScore: 2,
    totalScore: 4.6,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4300 },
        { name: "Premium", priceRUB: 5600 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4400 },
        { name: "Premium", priceRUB: 5700 },
      ],
    },
  },
  {
    id: "darwin-s-paradox",
    title: "Darwin's Paradox!",
    slug: "darwin-s-paradox",
    description: "Платформер от ZDT Studio. Стелс-осьминог",
    releaseDate: "2 апреля 2026",
    metacritic: 0,
    genre: "Платформер",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202511/0718/8dc3bb026f8c0873ac11c58a584c3ee618dbfc9db4064514.png",
    hypeScore: 2,
    totalScore: 4.6,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 3150 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2950 },
      ],
    },
  },
];
