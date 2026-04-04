import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsContent from './NewsContent';

export const metadata: Metadata = {
  title: 'Игровые новости — PS5, Xbox, PC | ActivePlay',
  description:
    'Свежие новости мира PlayStation, Xbox и PC. Обзоры, гайды, интервью, видео и подкасты. Обновляется ежедневно.',
  alternates: { canonical: 'https://activeplay.games/news' },
  openGraph: {
    title: 'Игровые новости — ActivePlay',
    description: 'Свежие новости мира PlayStation, Xbox и PC.',
    url: 'https://activeplay.games/news',
    siteName: 'ActivePlay',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Игровые новости — ActivePlay' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Игровые новости — ActivePlay',
    description: 'Свежие новости мира PlayStation, Xbox и PC.',
    images: ['/images/og-image.png'],
  },
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Игровые новости — ActivePlay',
  description: 'Свежие новости мира PlayStation, Xbox и PC. Обзоры, гайды, интервью, видео и подкасты.',
  url: 'https://activeplay.games/news',
  publisher: {
    '@type': 'Organization',
    name: 'ActivePlay',
    url: 'https://activeplay.games',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games' },
    { '@type': 'ListItem', position: 2, name: 'Новости', item: 'https://activeplay.games/news' },
  ],
};

export default function NewsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="relative z-10">
        <NewsContent />
      </main>
      <Footer />
    </>
  );
}
