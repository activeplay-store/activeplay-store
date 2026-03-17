import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SubscriptionSection from '@/components/SubscriptionSection';
import HowItWorks from '@/components/HowItWorks';
import GamesSection from '@/components/GamesSection';
import PreordersSection from '@/components/PreordersSection';
import TrustBlock from '@/components/TrustBlock';
import FAQ from '@/components/FAQ';
import SeoTextBlock from '@/components/SeoTextBlock';
import CTABlock from '@/components/CTABlock';
import Footer from '@/components/Footer';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import PromoBadge from '@/components/PromoBadge';
import ScrollReveal from '@/components/ScrollReveal';

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

        {/* 2. PlayStation Plus + Xbox + EA — transparent */}
        <ScrollReveal>
          <SubscriptionSection />
        </ScrollReveal>

        <SectionDivider />

        {/* 6. How it works — light blue tint */}
        <ScrollReveal>
          <div style={{ background: 'rgba(0,212,255,0.02)' }}>
            <HowItWorks />
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* 7. Games — transparent */}
        <ScrollReveal>
          <GamesSection />
        </ScrollReveal>

        <SectionDivider />

        {/* 8. Preorders — slightly lighter */}
        <ScrollReveal>
          <div style={{ background: 'rgba(255,255,255,0.02)' }}>
            <PreordersSection />
          </div>
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
