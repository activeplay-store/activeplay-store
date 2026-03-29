// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-29T09:01:15.044Z
// Горящих новинок: 2
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
        { name: "Standard", priceRUB: 7150 },
        { name: "Deluxe", priceRUB: 8150 },
      ],
      ua: [
        { name: "Standard", priceRUB: 7150 },
        { name: "Deluxe", priceRUB: 8150 },
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
    hypeScore: 4,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 1550 },
      ],
      ua: [
        { name: "Standard", priceRUB: 1550 },
      ],
    },
  },
];
