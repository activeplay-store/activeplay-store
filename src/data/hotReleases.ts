// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-04T09:01:03.599Z
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
    hypeScore: 4,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 7300 },
        { name: "Deluxe", priceRUB: 8350 },
      ],
      ua: [
        { name: "Standard", priceRUB: 7300 },
        { name: "Deluxe", priceRUB: 8350 },
      ],
    },
  },
  {
    id: "marathon",
    title: "Marathon",
    slug: "marathon",
    description: "Extraction-шутер от Bungie. PvPvE-лутер",
    releaseDate: "5 марта 2026",
    metacritic: 0,
    genre: "Шутер",
    platforms: ["PS5"],
    cover: "https://media.rawg.io/media/games/cab/cabc7cd14f1d9829c37d3bd2bec16c4a.jpg",
    hypeScore: 3,
    totalScore: 5,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 1600 },
      ],
      ua: [
        { name: "Standard", priceRUB: 1600 },
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
    genre: "Казуальная",
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
  {
    id: "monster-hunter-stories-3-twisted-reflection",
    title: "Monster Hunter Stories 3: Twisted Reflection",
    slug: "monster-hunter-stories-3-twisted-reflection",
    description: "",
    releaseDate: "13 марта 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://media.rawg.io/media/screenshots/c84/c842dbb0dcd7e2689ca2f587ef28f99f.jpg",
    hypeScore: 2,
    totalScore: 4.6,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 5550 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4900 },
      ],
    },
  },
];
