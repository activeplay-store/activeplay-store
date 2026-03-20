export interface TopSellerGame {
  rank: number;
  title: string;
  image: string;
  platform: string;
  priceRUB: number;
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
    { rank: 1, title: 'Resident Evil Requiem', image: '/images/covers/resident-evil-requiem.jpg', platform: 'PS5', priceRUB: 9220 },
    { rank: 2, title: 'EA SPORTS FC 26', image: '/images/covers/ea-fc-26.jpg', platform: 'PS5', priceRUB: 7790 },
    { rank: 3, title: 'UFC 5', image: '/images/covers/ufc-5.jpg', platform: 'PS5', priceRUB: 7790 },
    { rank: 4, title: 'Grand Theft Auto V', image: '/images/covers/gta-v.jpg', platform: 'PS5', priceRUB: 3890 },
    { rank: 5, title: 'Minecraft', image: '/images/covers/minecraft.jpg', platform: 'PS5', priceRUB: 2460 },
    { rank: 6, title: 'It Takes Two', image: '/images/covers/it-takes-two.jpg', platform: 'PS5', priceRUB: 4150 },
    { rank: 7, title: 'ARC Raiders', image: '/images/covers/arc-raiders.jpg', platform: 'PS5', priceRUB: 4800 },
    { rank: 8, title: 'REANIMAL', image: '/images/covers/reanimal.jpg', platform: 'PS5', priceRUB: 4800 },
    { rank: 9, title: 'Forza Horizon 5', image: '/images/covers/forza-horizon-5.jpg', platform: 'PS5', priceRUB: 4260 },
    { rank: 10, title: 'Call of Duty: Black Ops 7', image: '/images/covers/cod-blops-7.jpg', platform: 'PS5', priceRUB: 8570 },
  ],
};
