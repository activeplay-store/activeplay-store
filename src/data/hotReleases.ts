// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-26T21:00:17.804Z
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
    id: "mega-man-star-force-legacy-collection",
    title: "Mega Man Star Force Legacy Collection",
    slug: "mega-man-star-force-legacy-collection",
    description: "",
    releaseDate: "26 марта 2026",
    metacritic: 85,
    genre: "Arcade",
    platforms: ["PS5","PS4"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202510/2104/27af46b79a25c509364fbbdf12a9cba453e6dadd4ea4988b.png",
    hypeScore: 1,
    totalScore: 5.2,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 4500 },
      ],
      ua: [
        { name: "Standard", priceRUB: 4200 },
      ],
    },
  },
  {
    id: "nioh-3",
    title: "Nioh 3",
    slug: "nioh-3",
    description: "",
    releaseDate: "6 февраля 2026",
    metacritic: 0,
    genre: "Action",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202509/0401/835b207c01d1b02c29229e73fba0da13b914148c8b8bd4ed.png",
    hypeScore: 2,
    totalScore: 4.6,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 8450 },
        { name: "Digital Deluxe", priceRUB: 12150 },
      ],
      ua: [
        { name: "Standard", priceRUB: 6050 },
        { name: "Digital Deluxe", priceRUB: 7950 },
      ],
    },
  },
  {
    id: "code-vein-ii",
    title: "CODE VEIN II",
    slug: "code-vein-ii",
    description: "",
    releaseDate: "30 января 2026",
    metacritic: 0,
    genre: "Action",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202508/2218/6e65eb4269ce9cf10aa643c08437863f7f38bc2619b3fec0.jpg",
    hypeScore: 1,
    totalScore: 4.2,
    editions: {
      tr: [
        { name: "Standard", priceRUB: 7400 },
        { name: "Deluxe", priceRUB: 9350 },
        { name: "Ultimate", priceRUB: 10350 },
      ],
      ua: [
        { name: "Standard", priceRUB: 5600 },
        { name: "Deluxe", priceRUB: 6550 },
        { name: "Ultimate", priceRUB: 7000 },
      ],
    },
  },
  {
    id: "styx-blades-of-greed-quartz-edition",
    title: "Styx: Blades of Greed - Quartz Edition",
    slug: "styx-blades-of-greed-quartz-edition",
    description: "",
    releaseDate: "19 февраля 2026",
    metacritic: 0,
    genre: "Adventure",
    platforms: ["PS5"],
    cover: "https://image.api.playstation.com/vulcan/ap/rnd/202509/0808/ed252cada24d0c52d87c1f41f75b7b02fdde36460254387e.jpg",
    hypeScore: 1,
    totalScore: 4.2,
    editions: {
      tr: [
      ],
      ua: [
        { name: "Standard", priceRUB: 5100 },
      ],
    },
  },
];
