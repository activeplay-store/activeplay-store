export interface Game {
  id: string;
  title: string;
  cover: string;
  platforms: ('PS' | 'Xbox')[];
  discount: number;
  oldPrice: number;
  newPrice: number;
}

export const discountedGames: Game[] = [
  {
    id: 'astro-bot',
    title: 'Astro Bot',
    cover: '/images/covers/astro-bot.png',
    platforms: ['PS'],
    discount: 30,
    oldPrice: 4990,
    newPrice: 3490,
  },
  {
    id: 'silent-hill-2',
    title: 'Silent Hill 2',
    cover: '/images/covers/silent-hill-2.png',
    platforms: ['PS'],
    discount: 40,
    oldPrice: 4490,
    newPrice: 2690,
  },
  {
    id: 'death-stranding-2',
    title: 'Death Stranding 2',
    cover: '/images/covers/death-stranding-2.png',
    platforms: ['PS'],
    discount: 20,
    oldPrice: 5490,
    newPrice: 4390,
  },
  {
    id: 'fc-26',
    title: 'FC 26',
    cover: '/images/covers/fc-26.png',
    platforms: ['PS', 'Xbox'],
    discount: 20,
    oldPrice: 4990,
    newPrice: 3990,
  },
  {
    id: 'resident-evil-requiem',
    title: 'Resident Evil: Requiem',
    cover: '/images/covers/Resident-Evil-Requiem.jpg',
    platforms: ['PS', 'Xbox'],
    discount: 30,
    oldPrice: 4990,
    newPrice: 3490,
  },
  {
    id: 'cod-bo7',
    title: 'Call of Duty: Black Ops 7',
    cover: '/images/covers/call-of-duty-black-ops-7.png',
    platforms: ['PS', 'Xbox'],
    discount: 25,
    oldPrice: 5990,
    newPrice: 4490,
  },
];
