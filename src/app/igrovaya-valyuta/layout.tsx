import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Купить игровую валюту в России — FC Points, V-Bucks, Apex Coins | ActivePlay',
  description: 'FC Points, V-Bucks, Apex Coins, COD Points, Genshin — купить игровую валюту в России. Оплата через СБП, карту МИР. Пополнение за 5 минут. Все платформы: PS5, Xbox, PC.',
  keywords: 'FC Points купить, V-Bucks купить, Apex Coins, Genesis Crystals, COD Points, Shark Cards, игровая валюта Россия, купить ФК Поинтс, В-Баксы купить',
  alternates: { canonical: 'https://activeplay.games/igrovaya-valyuta' },
  openGraph: {
    title: 'Купить игровую валюту в России — FC Points, V-Bucks, Apex Coins | ActivePlay',
    description: 'FC Points, V-Bucks, Apex Coins, COD Points, Genshin — купить игровую валюту в России. Оплата через СБП, карту МИР. Пополнение за 5 минут.',
    url: 'https://activeplay.games/igrovaya-valyuta',
    siteName: 'ActivePlay',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Игровая валюта — купить в России' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купить игровую валюту в России — FC Points, V-Bucks, Apex Coins | ActivePlay',
    description: 'FC Points, V-Bucks, Apex Coins, COD Points — купить в России. Оплата через СБП.',
    images: ['/images/og-image.png'],
  },
};

export default function CurrencyLayout({ children }: { children: React.ReactNode }) {
  return <><Header />{children}<Footer /></>;
}
