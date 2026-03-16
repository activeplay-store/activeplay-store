export interface Preorder {
  id: string;
  title: string;
  cover: string;
  platforms: string[];
  releaseDate: string;
  price: number;
  description: string;
}

export const preorders: Preorder[] = [
  {
    id: 'gta-6',
    title: 'GTA 6',
    cover: '/images/covers/gta-6.png',
    platforms: ['PS5', 'Xbox'],
    releaseDate: '26.09.2025',
    price: 7990,
    description: 'Самая ожидаемая игра десятилетия — Vice City ждёт',
  },
  {
    id: 'ghost-of-yotei',
    title: 'Ghost of Yōtei',
    cover: '/images/covers/ghost-of-yotei.png',
    platforms: ['PS5'],
    releaseDate: 'Q4 2025',
    price: 5490,
    description: 'Новая глава саги о призраках — Хоккайдо, 1603 год',
  },
  {
    id: 'borderlands-4',
    title: 'Borderlands 4',
    cover: '/images/covers/borderlands-4.png',
    platforms: ['PS5', 'Xbox', 'PC'],
    releaseDate: '2025',
    price: 4990,
    description: 'Безумный лутер-шутер возвращается с новой планетой',
  },
  {
    id: 'mafia-old-country',
    title: 'Mafia: The Old Country',
    cover: '/images/covers/mafia-the-old-country.png',
    platforms: ['PS5', 'Xbox', 'PC'],
    releaseDate: '2025',
    price: 4990,
    description: 'Начало истории мафии — Сицилия, 1900-е годы',
  },
];
