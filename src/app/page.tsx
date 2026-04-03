import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SubscriptionSection from '@/components/SubscriptionSection';
import HowItWorks from '@/components/HowItWorks';
import ScrollReveal from '@/components/ScrollReveal';

const PreordersSection = dynamic(() => import('@/components/PreordersSection'));
const HotReleases = dynamic(() => import('@/components/HotReleases'));
const TopSellersSection = dynamic(() => import('@/components/TopSellersSection'));
const GamesSection = dynamic(() => import('@/components/GamesSection'));
const TrustBlock = dynamic(() => import('@/components/TrustBlock'));
const FAQ = dynamic(() => import('@/components/FAQ'));
const SeoTextBlock = dynamic(() => import('@/components/SeoTextBlock'));
const AntiFraudBlock = dynamic(() => import('@/components/AntiFraudBlock'));
const CTABlock = dynamic(() => import('@/components/CTABlock'));
const Footer = dynamic(() => import('@/components/Footer'));
const StickyMobileCTA = dynamic(() => import('@/components/StickyMobileCTA'));
const PromoBadge = dynamic(() => import('@/components/PromoBadge'));

function SectionDivider() {
  return <div className="section-divider" />;
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10" style={{ paddingTop: '100px' }}>
        {/* 1. Hero — transparent */}
        <Hero />

        <SectionDivider />

        {/* How it works — light blue tint */}
        <ScrollReveal>
          <div style={{ background: 'rgba(0,212,255,0.02)' }}>
            <HowItWorks />
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* 2. PlayStation Plus + Xbox + EA — transparent */}
        <ScrollReveal>
          <SubscriptionSection />
        </ScrollReveal>

        <SectionDivider />

        {/* Preorders */}
        <ScrollReveal>
          <div style={{ background: 'rgba(255,255,255,0.02)' }}>
            <PreordersSection />
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* Hot Releases */}
        <ScrollReveal>
          <HotReleases />
        </ScrollReveal>

        <SectionDivider />

        {/* Top Sellers */}
        <ScrollReveal>
          <TopSellersSection />
        </ScrollReveal>

        <SectionDivider />

        {/* Games */}
        <ScrollReveal>
          <GamesSection />
        </ScrollReveal>

        <SectionDivider />

        {/* 9. Trust — light cyan tint */}
        <ScrollReveal>
          <div style={{ background: 'rgba(0,212,255,0.02)' }}>
            <TrustBlock />
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* 10. FAQ — transparent */}
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>

        <SectionDivider />

        {/* 11. SEO text block */}
        <ScrollReveal>
          <SeoTextBlock />
        </ScrollReveal>

        <SectionDivider />

        {/* Anti-fraud block */}
        <ScrollReveal>
          <AntiFraudBlock />
        </ScrollReveal>

        <SectionDivider />

        {/* 12. CTA — radial gradient */}
        <ScrollReveal>
          <div style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.06), transparent)' }}>
            <CTABlock />
          </div>
        </ScrollReveal>
      </main>
      <Footer />
      <StickyMobileCTA />
      <PromoBadge />
    </>
  );
}
