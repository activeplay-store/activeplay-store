import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Купить EA Play подписку в России — цены от 900₽ | ActivePlay',
  description: 'Купить подписку EA Play и EA Play Pro в России. Каталог 64 игры EA: Battlefield, Star Wars, FC, Dead Space, Need for Speed. Оплата через СБП. Активация за 5 минут. Цены от 900 ₽.',
  keywords: 'EA Play купить, еа плей, EA Play подписка, EA Play Pro, EA Play Россия, EA Play PS5, EA Play цена, EA Play список игр, EA Play Steam, купить EA Play из России',
  alternates: {
    canonical: 'https://activeplay.games/ea-play',
  },
  openGraph: {
    title: 'Купить EA Play подписку — PS5, Xbox, ПК | ActivePlay',
    description: 'EA Play подписка по лучшей цене. 64 игры EA, ранний доступ, скидка 10%. Оплата через СБП. Мгновенная активация.',
    url: 'https://activeplay.games/ea-play',
    siteName: 'ActivePlay',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/images/platforms/ea-play-sm.webp', width: 1200, height: 630, alt: 'EA Play — купить подписку в России' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купить EA Play подписку — PS5, Xbox, ПК | ActivePlay',
    description: 'EA Play подписка по лучшей цене. 64 игры EA, ранний доступ, скидка 10%.',
    images: ['/images/platforms/ea-play-sm.webp'],
  },
};

export default function EAPlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
