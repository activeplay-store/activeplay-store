// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-05-06T09:01:18.549Z
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
    id: "invincible-vs",
    title: "Invincible VS",
    slug: "invincible-vs",
    description: "2D-файтинг от Skybound. 3v3 бои Invincible",
    releaseDate: "30 апреля 2026",
    metacritic: 0,
    genre: "Файтинг",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202512/0223/abae93143736137f8d17917de28aa0eedbf2f098ee3402e4.jpg",
    hypeScore: 5,
    totalScore: 5.8,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4700 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4400 },
      ],
    },
  },
  {
    id: "bus-bound",
    title: "Bus Bound",
    slug: "bus-bound",
    description: "",
    releaseDate: "30 апреля 2026",
    metacritic: 71,
    genre: "Экшен",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202603/2421/f16ce1ece2c04164106f28f406fa390ec64d8a5921a80c03.png",
    hypeScore: 2,
    totalScore: 5.2,
    editions: {
      tr: [
        { name: "Deluxe", priceRUB: 4000 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2950 },
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
    hypeScore: 1,
    totalScore: 5.1,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 3250 },
      ],
      ua: [
        { name: "Standard", priceRUB: 2950 },
      ],
    },
  },
];
