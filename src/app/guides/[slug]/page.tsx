import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { guidesData, GUIDE_CATEGORIES } from '@/data/guides';
import { notFound } from 'next/navigation';
import GuideArticleContent from './GuideArticleContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guidesData.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guidesData.find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle || `${guide.title} | ActivePlay`,
    description: guide.metaDescription || guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      images: [guide.coverUrl],
      type: 'article',
    },
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const guide = guidesData.find((g) => g.slug === slug);
  if (!guide) return notFound();

  const cat = GUIDE_CATEGORIES[guide.category];

  // Related guides (same category, exclude self)
  const related = guidesData
    .filter((g) => g.id !== guide.id && g.category === guide.category)
    .slice(0, 3);

  // If not enough from same category, add from other categories
  const allRelated = related.length < 2
    ? [...related, ...guidesData.filter((g) => g.id !== guide.id && g.category !== guide.category).slice(0, 3 - related.length)]
    : related;

  const schemas = [];

  // Article schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    image: guide.coverUrl,
    datePublished: guide.date,
    dateModified: guide.updatedDate || guide.date,
    author: { '@type': 'Organization', name: guide.author },
    publisher: {
      '@type': 'Organization',
      name: 'ActivePlay',
      url: 'https://activeplay.games',
      logo: { '@type': 'ImageObject', url: 'https://activeplay.games/images/logo/ActivePlay.png' },
    },
    description: guide.excerpt,
  });

  // HowTo schema
  if (guide.schemaHowTo) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: guide.title,
      description: guide.excerpt,
      image: guide.coverUrl,
      step: guide.sections.map((s) => ({
        '@type': 'HowToStep',
        name: s.title,
        text: stripHtml(s.content),
        ...(s.imageUrl ? { image: s.imageUrl } : {}),
      })),
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games' },
      { '@type': 'ListItem', position: 2, name: 'Гайды', item: 'https://activeplay.games/guides' },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `https://activeplay.games/guides?category=${guide.category}` },
      { '@type': 'ListItem', position: 4, name: guide.title, item: `https://activeplay.games/guides/${guide.slug}` },
    ],
  };

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="relative z-10">
        <article className="pt-32 pb-20 px-4">
          <div className="max-w-[720px] mx-auto">
            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 font-mono mb-6">
              <a href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</a>
              <span className="mx-2">/</span>
              <a href="/guides" className="hover:text-[#00D4FF] transition-colors">Гайды</a>
              <span className="mx-2">/</span>
              <span style={{ color: cat.color }}>{cat.label}</span>
              <span className="mx-2">/</span>
              <span className="text-gray-400 line-clamp-1">{guide.title}</span>
            </div>

            {/* Header */}
            <div>
              {/* Category badge */}
              <span
                className="inline-block px-3 py-1 rounded text-xs font-semibold mb-4"
                style={{
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                  border: `1px solid ${cat.color}30`,
                }}
              >
                {cat.icon} {cat.label}
              </span>

              {/* Title */}
              <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl sm:text-[32px] text-white mb-4 leading-tight">
                {guide.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
                <span>📅 {new Date(guide.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>·</span>
                <span>⏱ {guide.readTime}</span>
                <span>·</span>
                <span>✍️ {guide.author}</span>
              </div>

              {/* Updated badge */}
              {guide.updatedDate && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 mb-6">
                  🔄 Обновлено: {new Date(guide.updatedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Cover */}
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.coverUrl}
                alt={guide.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Two-column layout */}
            <GuideArticleContent guide={guide} relatedGuides={allRelated} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
