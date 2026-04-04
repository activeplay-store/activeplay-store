// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-04-04T01:17:11.663Z
// Топ-продаж: 10 игр
// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом

export interface TopSellerGame {
  rank: number;
  title: string;
  genre: string;
  image: string;
  platform: string;
  priceTR: number;
  priceUA: number;
}

export interface TopSellers {
  month: string;
  region: string;
  source: string;
  games: TopSellerGame[];
}

export const topSellers: TopSellers = {
  month: "Март 2026",
  region: "Европа",
  source: "PlayStation Blog",
  games: [
    { rank: 1, title: "document.documentElement.classList.remove(\"no-js\");", genre: "Приключения", image: "/images/covers/document-documentelement-classlist-remove-no-js.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 2, title: "PS5", genre: "Экшен", image: "/images/covers/ps5.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 3, title: "PS VR2", genre: "Гонки", image: "/images/covers/ps-vr2.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 4, title: "PS4", genre: "Экшен", image: "/images/covers/ps4.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 5, title: "PS Store", genre: "Гонки", image: "/images/covers/ps-store.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 6, title: "PS Plus", genre: "Экшен", image: "/images/covers/ps-plus.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 7, title: "French", genre: "Экшен", image: "/images/covers/french.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 8, title: "German", genre: "Шутер", image: "/images/covers/german.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 9, title: "Italian", genre: "Экшен", image: "/images/covers/italian.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
    { rank: 10, title: "Japanese", genre: "Экшен", image: "/images/covers/japanese.jpg", platform: "PS5", priceTR: 0, priceUA: 0 },
  ],
};
