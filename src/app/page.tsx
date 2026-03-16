import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import SubscriptionSection from '@/components/SubscriptionSection';
import HowItWorks from '@/components/HowItWorks';
import GamesSection from '@/components/GamesSection';
import PreordersSection from '@/components/PreordersSection';
import TrustBlock from '@/components/TrustBlock';
import NewsPlaceholder from '@/components/NewsPlaceholder';
import CTABlock from '@/components/CTABlock';
import Footer from '@/components/Footer';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <Hero />
        <PromoBanner />
        <SubscriptionSection />
        <HowItWorks />
        <GamesSection />
        <PreordersSection />
        <TrustBlock />
        <NewsPlaceholder />
        <CTABlock />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
