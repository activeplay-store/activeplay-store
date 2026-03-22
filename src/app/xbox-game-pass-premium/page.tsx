import type { Metadata } from 'next';
import { gamePass } from '@/data/gamepass';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GamePassSubscriptionPage from '@/components/subscriptions/GamePassSubscriptionPage';

const plan = gamePass.premium;

export const metadata: Metadata = {
  title: plan.seo.title,
  description: plan.seo.description,
  keywords: plan.seo.keywords.join(', '),
  openGraph: {
    title: plan.seo.title,
    description: plan.seo.description,
    url: 'https://activeplay.games/xbox-game-pass-premium',
    type: 'website',
    siteName: 'ActivePlay',
  },
  alternates: { canonical: 'https://activeplay.games/xbox-game-pass-premium' },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Xbox Game Pass Premium — купить в России',
  brand: { '@type': 'Brand', name: 'Xbox' },
  offers: { '@type': 'AggregateOffer', lowPrice: plan.prices.global[1], highPrice: plan.prices.global[12], priceCurrency: 'RUB', availability: 'https://schema.org/InStock', offerCount: 3 },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: plan.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games/' },
    { '@type': 'ListItem', position: 2, name: 'Game Pass Premium', item: 'https://activeplay.games/xbox-game-pass-premium' },
  ],
};

export default function GamePassPremiumPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="relative z-10">
        <GamePassSubscriptionPage subscriptionId="premium" />
      </main>
      <Footer />
    </>
  );
}
