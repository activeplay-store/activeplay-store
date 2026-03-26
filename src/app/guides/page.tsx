import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GuidesContent from './GuidesContent';

export const metadata: Metadata = {
  title: 'Гайды — как купить PS Plus, Game Pass из России | ActivePlay',
  description:
    'Пошаговые инструкции: как создать аккаунт PSN Турция, купить PS Plus, оплатить Game Pass из России. Гайды с скриншотами, обновляются регулярно.',
  alternates: { canonical: 'https://activeplay.games/guides' },
  openGraph: {
    title: 'Гайды — ActivePlay',
    description: 'Пошаговые руководства по покупке подписок и игр из России.',
    url: 'https://activeplay.games/guides',
    type: 'website',
  },
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Гайды — ActivePlay',
  description: 'Пошаговые инструкции по покупке подписок PlayStation и Xbox из России.',
  url: 'https://activeplay.games/guides',
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
    { '@type': 'ListItem', position: 2, name: 'Гайды', item: 'https://activeplay.games/guides' },
  ],
};

export default function GuidesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="relative z-10">
        <GuidesContent />
      </main>
      <Footer />
    </>
  );
}
