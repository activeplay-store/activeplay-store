import Link from 'next/link';
import { seoSections } from '@/data/seo-content';

export default function SeoTextBlock() {
  return (
    <section className="relative z-10 pt-16 pb-16" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-10">
          Подписки PlayStation Plus и Xbox Game Pass в&nbsp;России — ActivePlay
        </h2>

        <div className="text-[15px] leading-[1.7] text-white/70">
          {seoSections.map((section, i) => (
            <div key={i}>
              <h3 className="text-[20px] font-semibold text-white font-display mt-8 mb-3" style={{ fontStyle: 'normal' }}>
                {section.title}
              </h3>
              {section.content.split('\n\n').map((paragraph, j) => (
                <p key={j} className="mb-4">{paragraph}</p>
              ))}
              {section.links && (
                <p className="mb-6">
                  Ссылки на тарифы:{' '}
                  {section.links.map((link, k) => (
                    <span key={k}>
                      <Link href={link.href} className="text-[var(--brand)] hover:underline">{link.text}</Link>
                      {k < section.links!.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
