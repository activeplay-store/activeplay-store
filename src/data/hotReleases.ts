// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-26T23:29:57.935Z
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
    hypeScore: 7,
    totalScore: 6.6,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 7300 },
        { name: "Deluxe", priceRUB: 8300 },
      ],
      ua: [
        { name: "Standard", priceRUB: 7300 },
        { name: "Deluxe", priceRUB: 8300 },
      ],
    },
  },
  {
    id: "resident-evil-9-requiem",
    title: "Resident Evil 9: Requiem",
    slug: "resident-evil-9-requiem",
    description: "Survival horror от Capcom. Два героя, MC 88",
    releaseDate: "27 февраля 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://media.rawg.io/media/games/ed6/ed613937e113a4d43fa0db771e527a2f.jpg",
    hypeScore: 4,
    totalScore: 5.8,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 2300 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2300 },
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
        { name: "Standard", priceRUB: 1600 },
      ],
      ua: [
        { name: "Standard", priceRUB: 1600 },
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
    hypeScore: 3,
    totalScore: 5,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4500 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4500 },
      ],
    },
  },
];
