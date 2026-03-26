// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-26T21:40:03.855Z
// Горящих новинок: 1
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
];
