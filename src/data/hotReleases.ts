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
  editions: {
    tr: HotReleaseEdition[];
    ua: HotReleaseEdition[];
  };
}

export const hotReleases: HotRelease[] = [
  {
    id: 'resident-evil-requiem',
    title: 'Resident Evil Requiem',
    slug: 'resident-evil-requiem',
    description: 'Survival horror от Capcom. Два героя',
    releaseDate: '27 февраля 2026',
    metacritic: 88,
    genre: 'Survival Horror',
    platforms: ['PS5', 'Xbox', 'PC'],
    cover: '/images/covers/resident-evil-requiem.jpg',
    editions: {
      tr: [
        { name: 'Standard', priceRUB: 5490 },
        { name: 'Deluxe', priceRUB: 6490 },
      ],
      ua: [
        { name: 'Standard', priceRUB: 4990 },
        { name: 'Deluxe', priceRUB: 5490 },
      ],
    },
  },
  {
    id: 'crimson-desert',
    title: 'Crimson Desert',
    slug: 'crimson-desert',
    description: 'Open-world RPG от создателей Black Desert',
    releaseDate: '19 марта 2026',
    metacritic: 78,
    genre: 'Action RPG',
    platforms: ['PS5', 'Xbox', 'PC'],
    cover: '/images/covers/crimson-desert.jpg',
    editions: {
      tr: [
        { name: 'Standard', priceRUB: 4990 },
        { name: 'Deluxe', priceRUB: 6490 },
      ],
      ua: [
        { name: 'Standard', priceRUB: 4490 },
        { name: 'Deluxe', priceRUB: 5990 },
      ],
    },
  },
  {
    id: 'nioh-3',
    title: 'Nioh 3',
    slug: 'nioh-3',
    description: 'Souls-like от Team Ninja. Открытый мир, кооп',
    releaseDate: '6 февраля 2026',
    metacritic: 86,
    genre: 'Action Soulslike',
    platforms: ['PS5', 'PC'],
    cover: '/images/covers/nioh-3.jpg',
    editions: {
      tr: [
        { name: 'Standard', priceRUB: 5490 },
        { name: 'Digital Deluxe', priceRUB: 8190 },
      ],
      ua: [
        { name: 'Standard', priceRUB: 4990 },
        { name: 'Digital Deluxe', priceRUB: 7490 },
      ],
    },
  },
  {
    id: 'monster-hunter-stories-3',
    title: 'Monster Hunter Stories 3',
    slug: 'monster-hunter-stories-3',
    description: 'JRPG от Capcom. 120+ монстров',
    releaseDate: '13 марта 2026',
    metacritic: 86,
    genre: 'RPG',
    platforms: ['PS5', 'Xbox', 'Switch', 'PC'],
    cover: '/images/covers/monster-hunter-stories-3.jpg',
    editions: {
      tr: [
        { name: 'Standard', priceRUB: 4990 },
        { name: 'Deluxe', priceRUB: 6490 },
      ],
      ua: [
        { name: 'Standard', priceRUB: 4490 },
        { name: 'Deluxe', priceRUB: 5990 },
      ],
    },
  },
];
