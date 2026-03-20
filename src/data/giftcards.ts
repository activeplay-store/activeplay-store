export type CardRegion = 'turkey' | 'india';

export interface GiftCard {
  nominal: string;
  price: number;
}

export const giftcards: Record<CardRegion, GiftCard[]> = {
  turkey: [
    { nominal: '250 TL', price: 900 },
    { nominal: '500 TL', price: 1600 },
    { nominal: '750 TL', price: 2250 },
    { nominal: '1000 TL', price: 2900 },
    { nominal: '1500 TL', price: 4200 },
    { nominal: '2000 TL', price: 5400 },
    { nominal: '2500 TL', price: 6500 },
    { nominal: '3000 TL', price: 7800 },
    { nominal: '4000 TL', price: 10400 },
    { nominal: '5000 TL', price: 13000 },
  ],
  india: [
    { nominal: '₹1000', price: 1500 },
    { nominal: '₹2000', price: 3000 },
    { nominal: '₹3000', price: 4500 },
    { nominal: '₹4000', price: 5500 },
    { nominal: '₹5000', price: 7000 },
  ],
};
