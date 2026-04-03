import type { Metadata } from 'next';
import { Rajdhani, Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

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
  metadataBase: new URL('https://activeplay.games'),
  title: 'Купить PS Plus и Game Pass в России — ActivePlay | Подписки, карты PSN, игры PS5',
  description:
    'Купить PS Plus Essential, Extra, Deluxe, Xbox Game Pass Ultimate и EA Play из России. Карты пополнения PSN Турция. Оплата в рублях через СБП, активация за 5 минут. 52 000+ клиентов с 2022 года.',
  keywords:
    'купить PS Plus Россия, PlayStation Plus подписка, Xbox Game Pass купить, PS Plus Essential цена, PS Plus Extra цена, Game Pass Ultimate Россия, подписка PlayStation дешево',
  alternates: {
    canonical: 'https://activeplay.games',
  },
  openGraph: {
    title: 'ActivePlay — PS Plus и Xbox Game Pass для России',
    description: 'Подписки PlayStation и Xbox по лучшим ценам. Активация за 5 минут.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ActivePlay',
    url: 'https://activeplay.games',
    images: [
      {
        url: '/images/logo/ActivePlay.png',
        width: 1200,
        height: 630,
        alt: 'ActivePlay — игровой магазин подписок',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ActivePlay — PS Plus и Xbox Game Pass для России',
    description: 'Подписки PlayStation и Xbox по лучшим ценам. Активация за 5 минут.',
    images: ['/images/logo/ActivePlay.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const storeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'ActivePlay',
  description: 'Подписки PlayStation Plus и Xbox Game Pass для России',
  url: 'https://activeplay.games',
  foundingDate: '2022',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '312',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'PS Plus Essential 12 мес (Турция)',
      price: '5800',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'PS Plus Extra 12 мес (Турция)',
      price: '9500',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Xbox Game Pass Ultimate 12 мес',
      price: '7690',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
  ],
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ActivePlay',
  url: 'https://activeplay.games',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ActivePlay',
  url: 'https://activeplay.games',
  logo: 'https://activeplay.games/images/logo/AP_WHITE.png',
  description: 'Игровой магазин подписок и цифровых товаров. PS Plus, Xbox Game Pass, EA Play, FC Points, подарочные карты PSN.',
  foundingDate: '2022',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Russian',
    url: 'https://t.me/activeplay1',
  },
  sameAs: [
    'https://t.me/PS_PLUS_RUS',
    'https://vk.com/activeplay',
    'https://youtube.com/@activeplay2023',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '500',
    reviewCount: '500',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Rtp' },
      datePublished: '2025-08',
      reviewBody: 'Взял предзаказ на FC 26 и подписку Plus, все максимально быстро, ответили сразу, за 15 минут все было сделано.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Vitaly M.' },
      datePublished: '2023-08',
      reviewBody: 'Оформил предзаказ на игру и скажу, что все очень четко, быстро и без разводилова. Реально все сделали минут за 5-7.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Кирилл Х.' },
      datePublished: '2022-12',
      reviewBody: 'Парни просто красавцы! Все быстро, четко и профессионально. Спасибо вам!',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://chat.activeplay.games" />
        <link rel="preconnect" href="https://image.api.playstation.com" />
        <link rel="dns-prefetch" href="https://image.api.playstation.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
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
        <ChatWidget />
      </body>
    </html>
  );
}
