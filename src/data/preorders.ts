export interface PreorderEdition {
  name: string;
  priceTRY: number;
  priceRUB_TR: number;
}

export interface Preorder {
  id: string;
  title: string;
  image: string;
  imagePosition?: string;
  platform: string;
  releaseDate: string;
  editions: PreorderEdition[];
}

export const preorders: Preorder[] = [
  {
    id: 'directive-8020',
    title: 'Directive 8020',
    image: '/images/covers/directive-8020.jpg',
    imagePosition: 'center 30%',
    platform: 'PS5',
    releaseDate: '2026-05-15',
    editions: [
      { name: 'Standard', priceTRY: 2149, priceRUB_TR: 5840 },
    ],
  },
  {
    id: 'pragmata',
    title: 'Pragmata',
    image: '/images/covers/pragmata.jpg',
    imagePosition: 'center top',
    platform: 'PS5',
    releaseDate: '2026-04-17',
    editions: [
      { name: 'Standard', priceTRY: 2579, priceRUB_TR: 6960 },
      { name: 'Deluxe', priceTRY: 2999, priceRUB_TR: 8050 },
    ],
  },
  {
    id: 'diablo-4-loh',
    title: 'Diablo IV: Lord of Hatred',
    image: '/images/covers/diablo-4-loh.jpg',
    imagePosition: 'center center',
    platform: 'PS5 / PS4 / Xbox',
    releaseDate: '2026-04-28',
    editions: [
      { name: 'Standard', priceTRY: 1599, priceRUB_TR: 4410 },
      { name: 'Deluxe', priceTRY: 2399, priceRUB_TR: 6490 },
      { name: 'Ultimate', priceTRY: 3599, priceRUB_TR: 9610 },
    ],
  },
  {
    id: 'saros',
    title: 'SAROS',
    image: '/images/covers/saros.jpg',
    imagePosition: 'right center',
    platform: 'PS5',
    releaseDate: '2026-04-30',
    editions: [
      { name: 'Standard', priceTRY: 3449, priceRUB_TR: 9220 },
      { name: 'Deluxe', priceTRY: 3849, priceRUB_TR: 10260 },
    ],
  },
  {
    id: 'lego-batman',
    title: 'LEGO Batman: Legacy of the Dark Knight',
    image: '/images/covers/lego-batman.jpg',
    imagePosition: 'center center',
    platform: 'PS5 / Xbox',
    releaseDate: '2026-05-22',
    editions: [
      { name: 'Standard', priceTRY: 2999, priceRUB_TR: 8050 },
      { name: 'Deluxe', priceTRY: 3849, priceRUB_TR: 10260 },
    ],
  },
  {
    id: '007-first-light',
    title: '007 First Light',
    image: '/images/covers/007-first-light.jpg',
    imagePosition: '35% center',
    platform: 'PS5 / Xbox',
    releaseDate: '2026-05-26',
    editions: [
      { name: 'Standard', priceTRY: 2999, priceRUB_TR: 8050 },
    ],
  },
];
