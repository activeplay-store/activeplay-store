import type { Metadata } from 'next';
import { psPlus } from '@/data/psplus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionPage from '@/components/subscriptions/SubscriptionPage';

const plan = psPlus.deluxe;

export const metadata: Metadata = {
  title: plan.seo.title,
  description: plan.seo.description,
  keywords: plan.seo.keywords.join(', '),
  openGraph: {
    title: plan.seo.title,
    description: plan.seo.description,
    url: 'https://activeplay.games/ps-plus-deluxe',
    type: 'website',
    siteName: 'ActivePlay',
  },
  alternates: {
    canonical: 'https://activeplay.games/ps-plus-deluxe',
  },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PS Plus Deluxe — купить по цене Турции/Украины',
  brand: { '@type': 'Brand', name: 'PlayStation' },
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: plan.prices.turkey[1],
    highPrice: plan.prices.turkey[12],
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
    offerCount: 3,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: plan.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function PsPlusDeluxePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games/' }, { '@type': 'ListItem', position: 2, name: 'PS Plus Deluxe', item: 'https://activeplay.games/ps-plus-deluxe' }] }) }}
      />
      <Header />
      <main className="relative z-10">
        <SubscriptionPage subscriptionId="deluxe" />
      </main>
      <Footer />
    </>
  );
}
