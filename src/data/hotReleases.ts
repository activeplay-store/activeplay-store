// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-05-03T09:01:24.748Z
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
        { name: "Standard", priceRUB: 3200 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2950 },
      ],
    },
  },
  {
    id: "invincible-vs",
    title: "Invincible VS",
    slug: "invincible-vs",
    description: "2D-файтинг от Skybound. 3v3 бои Invincible",
    releaseDate: "30 апреля 2026",
    metacritic: 0,
    genre: "Файтинг",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0223/abae93143736137f8d17917de28aa0eedbf2f098ee3402e4.jpg",
    hypeScore: 4,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4700 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4350 },
      ],
    },
  },
  {
    id: "saros",
    title: "SAROS",
    slug: "saros",
    description: "Рогалик-шутер от Housemarque. Щит из пуль",
    releaseDate: "29 апреля 2026",
    metacritic: 0,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202509/2318/89c3538003fb34870e745493412408eeeed5f02b32c55d23.png",
    hypeScore: 4,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 7350 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5400 },
      ],
    },
  },
  {
    id: "sudden-strike-5",
    title: "Sudden Strike 5",
    slug: "sudden-strike-5",
    description: "Стратегия от KITE Games. Бои ВМВ, 300+ юнитов",
    releaseDate: "23 апреля 2026",
    metacritic: 77,
    genre: "Стратегия",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202507/0908/7b0b79a9f9a6be5c537543568960526e148af5c5ae1e5696.jpg",
    hypeScore: 2,
    totalScore: 5.4,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4700 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4700 },
      ],
    },
  },
];
