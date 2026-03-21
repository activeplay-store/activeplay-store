export interface DiscountGame {
  id: string;
  title: string;
  edition: string;
  discount: number;
  endDate: string;
  cover: string;
  tr: { oldTRY: number; newTRY: number };
  ua: { oldUAH: number; newUAH: number };
}

// Price conversion helpers
export function toRubTR(priceTRY: number): number {
  return Math.round(priceTRY * 1.95 + 250);
}

export function toRubUA(priceUAH: number): number {
  return Math.round(priceUAH * 1.08 * 1.12);
}

export const discountGames: DiscountGame[] = [
  { id: 'baldurs-gate-3', title: "Baldur's Gate 3", edition: 'Digital Deluxe', discount: 25, endDate: '26.03', cover: '/images/covers/discounts/baldurs-gate-3.jpg', tr: { oldTRY: 2799, newTRY: 2099.25 }, ua: { oldUAH: 2599, newUAH: 1949.25 } },
  { id: 'persona-5-royal', title: 'Persona 5 Royal', edition: 'Ultimate', discount: 70, endDate: '26.03', cover: '/images/covers/discounts/persona-5-royal.jpg', tr: { oldTRY: 1699, newTRY: 509 }, ua: { oldUAH: 1849, newUAH: 555 } },
  { id: 'god-of-war-ragnarok', title: 'God of War Ragnarök', edition: 'PS5', discount: 50, endDate: '26.03', cover: '/images/covers/discounts/god-of-war-ragnarok.jpg', tr: { oldTRY: 2799, newTRY: 1399.50 }, ua: { oldUAH: 2299, newUAH: 1149.50 } },
  { id: 'resident-evil-remake-trilogy', title: 'Resident Evil Remake Trilogy', edition: 'Standard', discount: 60, endDate: '26.03', cover: '/images/covers/discounts/resident-evil-remake-trilogy.jpg', tr: { oldTRY: 3149, newTRY: 1259.60 }, ua: { oldUAH: 2399, newUAH: 959.60 } },
  { id: 'ff7-rebirth', title: 'Final Fantasy VII Rebirth', edition: 'Digital Deluxe', discount: 40, endDate: '25.03', cover: '/images/covers/discounts/ff7-rebirth.jpg', tr: { oldTRY: 3449, newTRY: 2069.40 }, ua: { oldUAH: 2199, newUAH: 1319 } },
  { id: 'death-stranding-2', title: 'Death Stranding 2', edition: 'Deluxe', discount: 25, endDate: '26.03', cover: '/images/covers/discounts/death-stranding-2.jpg', tr: { oldTRY: 3449, newTRY: 2586.75 }, ua: { oldUAH: 2199, newUAH: 1649.25 } },
  { id: 'like-a-dragon-infinite-wealth', title: 'Like a Dragon: Infinite Wealth', edition: 'Standard', discount: 70, endDate: '26.03', cover: '/images/covers/discounts/like-a-dragon.jpg', tr: { oldTRY: 2199, newTRY: 659 }, ua: { oldUAH: 2199, newUAH: 659 } },
  { id: 'tlou2-remastered', title: 'The Last of Us Part II', edition: 'Standard', discount: 25, endDate: '26.03', cover: '/images/covers/discounts/tlou2-remastered.jpg', tr: { oldTRY: 2149, newTRY: 1612 }, ua: { oldUAH: 1499, newUAH: 1124 } },
  { id: 'spider-man-2', title: "Marvel's Spider-Man 2", edition: 'Digital Deluxe', discount: 43, endDate: '26.03', cover: '/images/covers/discounts/spider-man-2.jpg', tr: { oldTRY: 2799, newTRY: 1595 }, ua: { oldUAH: 2299, newUAH: 1149.50 } },
  { id: 'sekiro', title: 'Sekiro: Shadows Die Twice', edition: 'GOTY', discount: 50, endDate: '26.03', cover: '/images/covers/discounts/sekiro.jpg', tr: { oldTRY: 469, newTRY: 234.50 }, ua: { oldUAH: 1999, newUAH: 999.50 } },
  { id: 'horizon-forbidden-west', title: 'Horizon Forbidden West', edition: 'Complete', discount: 40, endDate: '26.03', cover: '/images/covers/discounts/horizon-forbidden-west.jpg', tr: { oldTRY: 1749, newTRY: 1049 }, ua: { oldUAH: 1699, newUAH: 1121.34 } },
  { id: 'uncharted-legacy', title: 'Uncharted: Legacy of Thieves', edition: 'Standard', discount: 60, endDate: '26.03', cover: '/images/covers/discounts/uncharted-legacy.jpg', tr: { oldTRY: 2149, newTRY: 859.60 }, ua: { oldUAH: 1399, newUAH: 559.60 } },
  { id: 'gran-turismo-7', title: 'Gran Turismo 7', edition: '25th Anniversary', discount: 50, endDate: '26.03', cover: '/images/covers/discounts/gran-turismo-7.jpg', tr: { oldTRY: 4299, newTRY: 2149.50 }, ua: { oldUAH: 2899, newUAH: 1449.50 } },
  { id: 'hogwarts-legacy', title: 'Hogwarts Legacy', edition: 'PS5', discount: 85, endDate: '26.03', cover: '/images/covers/discounts/hogwarts-legacy.jpg', tr: { oldTRY: 3149, newTRY: 472.35 }, ua: { oldUAH: 2099, newUAH: 419.80 } },
  { id: 'star-wars-jedi-survivor', title: 'Star Wars Jedi: Survivor', edition: 'Standard', discount: 75, endDate: '26.03', cover: '/images/covers/discounts/star-wars-jedi-survivor.jpg', tr: { oldTRY: 3499, newTRY: 875 }, ua: { oldUAH: 2399, newUAH: 599.75 } },
  { id: 'life-is-strange-true-colors', title: 'Life Is Strange: True Colors', edition: 'Standard', discount: 70, endDate: '26.03', cover: '/images/covers/discounts/life-is-strange.jpg', tr: { oldTRY: 429, newTRY: 128.70 }, ua: { oldUAH: 2199, newUAH: 660 } },
  { id: 'ufc-5-ultimate', title: 'UFC 5', edition: 'Ultimate', discount: 85, endDate: '26.03', cover: '/images/covers/discounts/ufc-5.jpg', tr: { oldTRY: 4000, newTRY: 600 }, ua: { oldUAH: 3499, newUAH: 524.85 } },
  { id: 'ea-fc-26-ultimate', title: 'EA Sports FC 26', edition: 'Ultimate', discount: 60, endDate: '26.03', cover: '/images/covers/fc-26.png', tr: { oldTRY: 4000, newTRY: 1600 }, ua: { oldUAH: 3499, newUAH: 1399.60 } },
];
