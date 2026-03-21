'use client';

import { useState } from 'react';
import { homepageFAQ } from '@/data/faq';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group transition-colors duration-200 hover:bg-[rgba(0,212,255,0.03)] rounded-lg"
        style={{ padding: '20px 0', minHeight: '44px' }}
      >
        <span className="text-[15px] font-semibold text-white group-hover:text-[var(--brand)] transition-colors">
          {question}
        </span>
        <span
          className="shrink-0 flex items-center justify-center text-sm font-bold transition-all duration-300"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.3)',
            color: 'var(--brand)',
            fontSize: '24px',
            lineHeight: 1,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '500px' : '0',
          opacity: open ? 1 : 0,
        }}
      >
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed pb-5">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative z-10 pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold gradient-text text-center mb-12">
          Частые вопросы
        </h2>

        <div className="card-base p-6 sm:p-8">
          {homepageFAQ.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>

        {/* FAQ Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: homepageFAQ.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.shortAnswer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
