// Автоматически сгенерировано AI-агентом ActivePlay
// Обновлено: 2026-05-07T01:00:05.089Z
// Игр со скидкой: 6 (TR), 6 (UA)
// НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ — файл перезаписывается агентом

export interface DealGame {
  id: string;
  name: string;
  platforms: ('PS5' | 'PS4')[];
  coverUrl: string;
  releaseDate: string;
  metacritic?: number;
  prices: {
    TR?: {
      basePriceTRY: number;
      salePriceTRY: number;
      psPlusPriceTRY?: number;
      clientBasePrice: number;
      clientSalePrice: number;
      clientPsPlusPrice?: number;
    };
    UA?: {
      basePriceUAH: number;
      salePriceUAH: number;
      psPlusPriceUAH?: number;
      clientBasePrice: number;
      clientSalePrice: number;
      clientPsPlusPrice?: number;
    };
  };
  discountPct: number;
  saleEndDate?: string;
  hasPsPlusPrice?: boolean;
}

export const saleMeta = {
  saleName: "Майская распродажа PS Store 2026",
  saleNameEn: "May Sale",
  maxDiscount: 10,
  endDate: "2026-06-19T15:00:00.000Z",
  gamesCount: { TR: 6, UA: 6 },
  updatedAt: "2026-05-07T01:00:05.089Z",
  totalGames: 7,
};

export const dealsData: DealGame[] = [
  {
    id: "toxic-tide-pack-battlefield-6-and-redsec",
    name: "Toxic Tide Pack - Battlefield 6 and REDSEC",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202602/1021/548d149b2d4ab334c769cf730156caba266ea5ecee213955.png",
    releaseDate: "2025-10-10",
    prices: {
      TR: { basePriceTRY: 720, salePriceTRY: 648, clientBasePrice: 2100, clientSalePrice: 1900 },
    },
    discountPct: 10,
  },
  {
    id: "ufc-5",
    name: "UFC 5",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202501/0815/2de522e47a785ff33787d7ccea62b5221a14d2a6251c72a6.png",
    releaseDate: "2023-10-27",
    prices: {
      TR: { basePriceTRY: 4000, salePriceTRY: 3600, clientBasePrice: 8400, clientSalePrice: 7650 },
      UA: { basePriceUAH: 3499, salePriceUAH: 3149, clientBasePrice: 8050, clientSalePrice: 7400 },
    },
    discountPct: 10,
  },
  {
    id: "need-for-speed-ultimate-bundle",
    name: "Need for Speed Ultimate Bundle",
    platforms: ["PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/img/rnd/202011/0204/o8uqorBt6kI8vwatK0p7NU5X.png",
    releaseDate: "2015-11-03",
    metacritic: 66,
    prices: {
      TR: { basePriceTRY: 4749, salePriceTRY: 4274, clientBasePrice: 9850, clientSalePrice: 8950 },
      UA: { basePriceUAH: 2699, salePriceUAH: 2429, clientBasePrice: 6500, clientSalePrice: 5900 },
    },
    discountPct: 10,
  },
  {
    id: "dirt-rally-2-0",
    name: "DiRT Rally 2.0",
    platforms: ["PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/img/rnd/202010/1520/oboqMPZEHLgMbR7bazjrfoqX.png",
    releaseDate: "2019-02-26",
    metacritic: 83,
    prices: {
      UA: { basePriceUAH: 1499, salePriceUAH: 1349, clientBasePrice: 4050, clientSalePrice: 3750 },
    },
    discountPct: 10,
  },
  {
    id: "dirt-rally-2-0-year-one-pass",
    name: "DiRT Rally 2.0 - Year One Pass",
    platforms: ["PS4"],
    coverUrl: "https://image.api.playstation.com/vulcan/img/cfn/11307zc6XkUt4ttzgYk6Im9GvSZ2tlA7dY7JOt8kXs8Zuh-0ptBlM4EFw7-l-287XBUTFfO7SwmiSr-SKO-OARiwmM0J48A9.png",
    releaseDate: "2019-02-26",
    metacritic: 83,
    prices: {
      TR: { basePriceTRY: 699, salePriceTRY: 629, clientBasePrice: 2050, clientSalePrice: 1850 },
      UA: { basePriceUAH: 649, salePriceUAH: 584, clientBasePrice: 2250, clientSalePrice: 2100 },
    },
    discountPct: 10,
  },
  {
    id: "need-for-speed-rivals-complete-edition",
    name: "Need for Speed Rivals: Complete Edition",
    platforms: ["PS4"],
    coverUrl: "https://image.api.playstation.com/cdn/EP0006/CUSA00168_00/KZnZ2EidOuCPVhQlO17U1noSkMhlNVIr.png",
    releaseDate: "2014-10-21",
    prices: {
      TR: { basePriceTRY: 1949, salePriceTRY: 1754, clientBasePrice: 4300, clientSalePrice: 4000 },
      UA: { basePriceUAH: 749, salePriceUAH: 674, clientBasePrice: 2500, clientSalePrice: 2300 },
    },
    discountPct: 10,
  },
  {
    id: "ufc-6",
    name: "UFC 6",
    platforms: ["PS5"],
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202604/2217/062d04994b5e270962724a172a640b122b0d4049c8471d05.png",
    releaseDate: "2020-08-14",
    metacritic: 80,
    prices: {
      TR: { basePriceTRY: 5499, salePriceTRY: 4949, clientBasePrice: 11350, clientSalePrice: 10200 },
      UA: { basePriceUAH: 3999, salePriceUAH: 3599, clientBasePrice: 9000, clientSalePrice: 8250 },
    },
    discountPct: 10,
    saleEndDate: "2026-06-19T15:00:00.000Z",
  },
];
