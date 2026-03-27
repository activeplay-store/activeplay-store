// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-03-27T00:12:03.324Z
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
  month: "Февраль 2026",
  region: "Европа",
  source: "PlayStation Blog",
  games: [
    { rank: 1, title: "Resident Evil Requiem", genre: "Survival Horror", image: "/images/covers/Resident-Evil-Requiem.jpg", platform: "PS5", priceTR: 2300, priceUA: 2300 },
    { rank: 2, title: "EA SPORTS FC 26", genre: "Спорт", image: "https://image.api.playstation.com/vulcan/ap/rnd/202507/1617/f0fe830f8f01600d13cce060680e0287374c58613a63c716.png", platform: "PS5", priceTR: 2750, priceUA: 2750 },
    { rank: 3, title: "UFC 5", genre: "Файтинг", image: "https://image.api.playstation.com/vulcan/ap/rnd/202309/0421/0b3fe53ab2d54998602b41682ef1bd83e63e82d3f9ab8fff.png", platform: "PS5", priceTR: 1600, priceUA: 1650 },
    { rank: 4, title: "Grand Theft Auto V", genre: "Экшен / Open World", image: "https://image.api.playstation.com/vulcan/ap/rnd/202202/2816/YHqWG89UegirLGRyNIn8tmnv.jpg", platform: "PS5", priceTR: 1750, priceUA: 2450 },
    { rank: 5, title: "Minecraft", genre: "Песочница", image: "/images/covers/minecraft.jpg", platform: "PS5", priceTR: 2460, priceUA: 2100 },
    { rank: 6, title: "It Takes Two", genre: "Кооп-адвенчура", image: "https://image.api.playstation.com/vulcan/ap/rnd/202012/0815/IjqyQi0J2PL7GdEo3K8jKWMh.png", platform: "PS5", priceTR: 1250, priceUA: 1400 },
    { rank: 7, title: "ARC Raiders", genre: "Шутер / Кооп", image: "https://image.api.playstation.com/vulcan/ap/rnd/202504/1515/99f254edff001a6a52d1d9f09af28959abfbaf1fe1a034b4.jpg", platform: "PS5", priceTR: 3900, priceUA: 3650 },
    { rank: 8, title: "REANIMAL", genre: "Хоррор-адвенчура", image: "/images/covers/reanimal.jpg", platform: "PS5", priceTR: 4800, priceUA: 4000 },
    { rank: 9, title: "Forza Horizon 5", genre: "Гонки / Open World", image: "https://image.api.playstation.com/vulcan/ap/rnd/202502/1221/1cdbb2177cc3c6302027f05796073b27ca7f7ccf091c3127.png", platform: "PS5", priceTR: 4200, priceUA: 3850 },
    { rank: 10, title: "Call of Duty: Black Ops 7", genre: "Шутер / FPS", image: "https://image.api.playstation.com/vulcan/ap/rnd/202508/2119/b22bad2858eeaac332a5889000900fc1e090b81cb0a40a1f.png", platform: "PS5", priceTR: 8850, priceUA: 8850 },
  ],
};
