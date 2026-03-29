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
        { name: "Standard", priceRUB: 6550 },
        { name: "Deluxe", priceRUB: 7400 },
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
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202512/1205/e0364b3089bbbad7e0a04f87cab6c273172515a134efdf88.png",
    hypeScore: 4,
    totalScore: 5.8,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 8300 },
      ],
      ua: [
        { name: "Standard", priceRUB: 7400 },
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
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202512/2621/48bbb6fcf773ee326ebf5cbceb47bd8dd26e2f27cd270736.jpg",
    hypeScore: 4,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4050 },
        { name: "Deluxe", priceRUB: 5550 },
      ],
      ua: [
        { name: "Standard", priceRUB: 3700 },
        { name: "Deluxe", priceRUB: 4900 },
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
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202510/1005/a09a71be0ef59273817c8f816a71cbdd1a417e169ec87719.png",
    hypeScore: 3,
    totalScore: 5,
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
