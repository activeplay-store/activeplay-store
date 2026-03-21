export interface PreorderEdition {
  name: string;
  priceTRY: number;
  priceRUB_TR: number;
  priceRUB_UA: number;
}

export interface Preorder {
  id: string;
  title: string;
  description: string;
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
    description: 'Sci-fi шутер от Remedy — авторы Control и Alan Wake',
    image: '/images/covers/directive-8020.jpg',
    imagePosition: 'center 30%',
    platform: 'PS5',
    releaseDate: '2026-05-15',
    editions: [
      { name: 'Standard', priceTRY: 2149, priceRUB_TR: 5840, priceRUB_UA: 4900 },
    ],
  },
  {
    id: 'pragmata',
    title: 'Pragmata',
    description: 'Sci-fi экшен от Capcom. Девочка и астронавт спасают Землю будущего',
    image: '/images/covers/pragmata.jpg',
    imagePosition: 'center top',
    platform: 'PS5',
    releaseDate: '2026-04-17',
    editions: [
      { name: 'Standard', priceTRY: 2579, priceRUB_TR: 6960, priceRUB_UA: 5800 },
      { name: 'Deluxe', priceTRY: 2999, priceRUB_TR: 8050, priceRUB_UA: 6900 },
    ],
  },
  {
    id: 'diablo-4-loh',
    title: 'Diablo IV: Lord of Hatred',
    description: 'Второе расширение Diablo IV от Blizzard. Новый класс, акт и 100+ часов контента',
    image: '/images/covers/diablo-4-loh.jpg',
    imagePosition: 'center center',
    platform: 'PS5 / PS4 / Xbox',
    releaseDate: '2026-04-28',
    editions: [
      { name: 'Standard', priceTRY: 1599, priceRUB_TR: 4410, priceRUB_UA: 3700 },
      { name: 'Deluxe', priceTRY: 2399, priceRUB_TR: 6490, priceRUB_UA: 5500 },
      { name: 'Ultimate', priceTRY: 3599, priceRUB_TR: 9610, priceRUB_UA: 8200 },
    ],
  },
  {
    id: 'saros',
    title: 'SAROS',
    description: 'Новый экшен от создателей Dead Space. Хоррор в открытом космосе',
    image: '/images/covers/saros.jpg',
    imagePosition: 'right center',
    platform: 'PS5',
    releaseDate: '2026-04-30',
    editions: [
      { name: 'Standard', priceTRY: 3449, priceRUB_TR: 9220, priceRUB_UA: 7800 },
      { name: 'Deluxe', priceTRY: 3849, priceRUB_TR: 10260, priceRUB_UA: 8700 },
    ],
  },
  {
    id: 'lego-batman',
    title: 'LEGO Batman: Legacy of the Dark Knight',
    description: 'Открытый мир Готэма от TT Games. Кооператив на двоих в стиле LEGO',
    image: '/images/covers/lego-batman.jpg',
    imagePosition: 'center center',
    platform: 'PS5 / Xbox',
    releaseDate: '2026-05-22',
    editions: [
      { name: 'Standard', priceTRY: 2999, priceRUB_TR: 8050, priceRUB_UA: 6800 },
      { name: 'Deluxe', priceTRY: 3849, priceRUB_TR: 10260, priceRUB_UA: 8700 },
    ],
  },
  {
    id: '007-first-light',
    title: '007 First Light',
    description: 'Шпионский экшен про Джеймса Бонда от IO Interactive — создатели Hitman',
    image: '/images/covers/007-first-light.jpg',
    imagePosition: '35% center',
    platform: 'PS5 / Xbox',
    releaseDate: '2026-05-26',
    editions: [
      { name: 'Standard', priceTRY: 2999, priceRUB_TR: 8050, priceRUB_UA: 6800 },
    ],
  },
];
