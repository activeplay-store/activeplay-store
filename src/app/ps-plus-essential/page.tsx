import type { Metadata } from 'next';
import { psPlus } from '@/data/psplus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionPage from '@/components/subscriptions/SubscriptionPage';

const plan = psPlus.essential;

export const metadata: Metadata = {
  title: plan.seo.title,
  description: plan.seo.description,
  keywords: plan.seo.keywords.join(', '),
  openGraph: {
    title: plan.seo.title,
    description: plan.seo.description,
    url: 'https://activeplay.games/ps-plus-essential',
    type: 'website',
    siteName: 'ActivePlay',
  },
  alternates: {
    canonical: 'https://activeplay.games/ps-plus-essential',
  },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PS Plus Essential — купить по цене Турции/Украины',
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

export default function PsPlusEssentialPage() {
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
      <Header />
      <main className="relative z-10">
        <SubscriptionPage subscriptionId="essential" />
      </main>
      <Footer />
    </>
  );
}
