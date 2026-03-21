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
  month: 'Февраль 2026',
  region: 'Европа',
  source: 'PlayStation Blog',
  games: [
    { rank: 1, title: 'Resident Evil Requiem', genre: 'Survival Horror', image: '/images/covers/resident-evil-requiem.jpg', platform: 'PS5', priceTR: 9220, priceUA: 7800 },
    { rank: 2, title: 'EA SPORTS FC 26', genre: 'Sports', image: '/images/covers/ea-fc-26.jpg', platform: 'PS5', priceTR: 7790, priceUA: 6500 },
    { rank: 3, title: 'UFC 5', genre: 'Fighting', image: '/images/covers/ufc-5.jpg', platform: 'PS5', priceTR: 7790, priceUA: 6500 },
    { rank: 4, title: 'Grand Theft Auto V', genre: 'Action / Open World', image: '/images/covers/gta-v.jpg', platform: 'PS5', priceTR: 3890, priceUA: 3200 },
    { rank: 5, title: 'Minecraft', genre: 'Sandbox / Survival', image: '/images/covers/minecraft.jpg', platform: 'PS5', priceTR: 2460, priceUA: 2100 },
    { rank: 6, title: 'It Takes Two', genre: 'Co-op Adventure', image: '/images/covers/it-takes-two.jpg', platform: 'PS5', priceTR: 4150, priceUA: 3500 },
    { rank: 7, title: 'ARC Raiders', genre: 'Sci-fi Shooter', image: '/images/covers/arc-raiders.jpg', platform: 'PS5', priceTR: 4800, priceUA: 4000 },
    { rank: 8, title: 'REANIMAL', genre: 'Horror Adventure', image: '/images/covers/reanimal.jpg', platform: 'PS5', priceTR: 4800, priceUA: 4000 },
    { rank: 9, title: 'Forza Horizon 5', genre: 'Racing / Open World', image: '/images/covers/forza-horizon-5.jpg', platform: 'PS5', priceTR: 4260, priceUA: 3600 },
    { rank: 10, title: 'Call of Duty: Black Ops 7', genre: 'FPS / Shooter', image: '/images/covers/cod-blops-7.jpg', platform: 'PS5', priceTR: 8570, priceUA: 7200 },
  ],
};
