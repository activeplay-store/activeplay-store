export type CardRegion = 'turkey' | 'india' | 'ukraine';

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
    { nominal: '500 INR', price: 550 },
    { nominal: '1000 INR', price: 1050 },
    { nominal: '2000 INR', price: 2050 },
    { nominal: '3000 INR', price: 3050 },
    { nominal: '5000 INR', price: 5050 },
  ],
  ukraine: [
    { nominal: '500 UAH', price: 1100 },
    { nominal: '1000 UAH', price: 2100 },
    { nominal: '1500 UAH', price: 3100 },
    { nominal: '2000 UAH', price: 4100 },
  ],
};
