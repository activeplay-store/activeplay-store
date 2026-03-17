import type { Metadata } from 'next';
import { Rajdhani, Inter } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  style: ['normal'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ActivePlay — купить PS Plus и Xbox Game Pass в России | От 690 ₽/мес',
  description:
    'Подписки PlayStation Plus и Xbox Game Pass для России по лучшим ценам. Активация за 5 минут, без VPN. Оплата по СБП. Работаем с 2020 года. PS Plus Essential, Extra, Deluxe — от 690 ₽/мес.',
  keywords:
    'купить PS Plus Россия, PlayStation Plus подписка, Xbox Game Pass купить, PS Plus Essential цена, PS Plus Extra цена, Game Pass Ultimate Россия, подписка PlayStation дешево',
  openGraph: {
    title: 'ActivePlay — PS Plus и Xbox Game Pass для России',
    description: 'Подписки PlayStation и Xbox по лучшим ценам. Активация за 5 минут.',
    type: 'website',
    locale: 'ru_RU',
  },
};

const storeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'ActivePlay',
  description: 'Подписки PlayStation Plus и Xbox Game Pass для России',
  url: 'https://activeplay-store.ru',
  foundingDate: '2020',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '312',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'PS Plus Essential 1 мес (Турция)',
      price: '890',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'PS Plus Extra 1 мес (Турция)',
      price: '1490',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Xbox Game Pass Ultimate 1 мес',
      price: '1590',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Это легально? Аккаунт не заблокируют?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, полностью легально. Мы используем официальные подписки из турецкого и украинского PlayStation Store.',
      },
    },
    {
      '@type': 'Question',
      name: 'Нужен ли VPN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Нет. После активации подписка работает без VPN.',
      },
    },
    {
      '@type': 'Question',
      name: 'Как происходит оплата?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Переводом по СБП или картой Сбер, Тинькофф, Альфа.',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* TODO: Яндекс.Метрика — вставить счётчик */}
        {/* TODO: VK Pixel — вставить код */}
        {/* TODO: цели на клик "Оформить за 5 мин", "Предзаказать", выбор мессенджера */}
      </head>
      <body className={`${rajdhani.variable} ${inter.variable} antialiased`}>
        {/* Atmosphere blobs */}
        <div className="atmosphere-wrapper" aria-hidden="true">
          <div className="atmosphere-blob atmosphere-blob--blue" />
          <div className="atmosphere-blob atmosphere-blob--cyan" />
          <div className="atmosphere-blob atmosphere-blob--purple" />
        </div>
        {children}
      </body>
    </html>
  );
}
