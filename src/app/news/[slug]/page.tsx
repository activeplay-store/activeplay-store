import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NEWS_CATEGORIES, type NewsItem } from '@/data/news-types';
import newsJson from '@/data/news.json';
import { dealsData } from '@/data/deals';

const newsData = newsJson as unknown as NewsItem[];
import { notFound } from 'next/navigation';
import NewsArticleContent from './NewsArticleContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsData
    .filter((n) => n.category !== 'guide')
    .map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = newsData.find((n) => n.slug === slug);
  if (!article) return {};
  const desc = article.metaDescription || article.excerpt || article.content.substring(0, 160);
  return {
    title: `${article.title} | ActivePlay`,
    description: desc,
    alternates: { canonical: `https://activeplay.games/news/${slug}` },
    openGraph: {
      title: article.title,
      description: desc,
      url: `https://activeplay.games/news/${slug}`,
      siteName: 'ActivePlay',
      locale: 'ru_RU',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['ActivePlay'],
      images: [{
        url: article.coverUrl,
        width: 1200,
        height: 630,
        alt: article.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: desc,
      images: [article.coverUrl],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = newsData.find((n) => n.slug === slug);
  if (!article || article.category === 'guide') return notFound();

  const cat = NEWS_CATEGORIES[article.category] || NEWS_CATEGORIES.news;

  // Related articles (same category or shared tags)
  const related = newsData
    .filter((n) => n.id !== article.id && n.category !== 'guide')
    .filter((n) => n.category === article.category || (article.tags && n.tags?.some((t) => article.tags!.includes(t))))
    .slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.coverUrl,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: article.author || 'ActivePlay', url: 'https://activeplay.games' },
    publisher: {
      '@type': 'Organization',
      name: 'ActivePlay',
      logo: { '@type': 'ImageObject', url: 'https://activeplay.games/images/logo/ActivePlay.png' },
    },
    description: article.metaDescription || article.content.substring(0, 160),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://activeplay.games' },
      { '@type': 'ListItem', position: 2, name: 'Новости', item: 'https://activeplay.games/news' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://activeplay.games/news/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="relative z-10">
        <article className="pt-32 pb-20 px-4">
          <div className="max-w-[720px] mx-auto">
            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 font-mono mb-6">
              <a href="/" className="hover:text-[#00D4FF] transition-colors">ActivePlay</a>
              <span className="mx-2">/</span>
              <a href="/news" className="hover:text-[#00D4FF] transition-colors">Новости</a>
              <span className="mx-2">/</span>
              <span className="text-gray-400 line-clamp-1">{article.title}</span>
            </div>

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
            <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl sm:text-3xl text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-500 mb-6">
              <span>{new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {article.author && <><span>·</span><span>{article.author}</span></>}
            </div>

            {/* Cover or YouTube */}
            <NewsArticleContent article={article} />

            {/* Article body — plain text split into paragraphs */}
            {article.content && (
              <div className="prose-custom font-[family-name:var(--font-body)] text-base text-gray-300 leading-[1.7] mt-8">
                {article.content.split('\n\n').filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph.replace(/\n/g, ' ')}</p>
                ))}
              </div>
            )}

            {/* Product CTA blocks */}
            {article.cta && (
              <div className="bg-[#0d1f3c] border border-cyan-500/30 rounded-xl p-6 mt-8">
                <h3 className="text-white text-lg font-bold">{article.cta.title}</h3>
                {article.cta.description && <p className="text-gray-400 text-sm mt-1">{article.cta.description}</p>}
                <div className="flex items-center gap-3 mt-3">
                  {article.cta.price && <span className="text-cyan-400 text-2xl font-bold">{typeof article.cta.price === 'number' ? `${article.cta.price.toLocaleString('ru-RU')} ₽` : article.cta.price}</span>}
                  {article.cta.oldPrice && <span className="text-gray-500 line-through text-lg">{typeof article.cta.oldPrice === 'number' ? `${article.cta.oldPrice.toLocaleString('ru-RU')} ₽` : article.cta.oldPrice}</span>}
                  {article.cta.discount && article.cta.discount > 0 && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-bold">-{article.cta.discount}%</span>}
                </div>
                <a href={article.cta.url} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg px-6 py-3 mt-4 transition-colors">
                  {article.cta.buttonText || `${article.cta.title} →`}
                </a>
              </div>
            )}

            {article.cta2 && (
              <div className="bg-[#1a1a2e] border border-orange-500/30 rounded-xl p-6 mt-4">
                <h3 className="text-white text-lg font-bold">{article.cta2.title}</h3>
                {article.cta2.description && <p className="text-gray-400 text-sm mt-1">{article.cta2.description}</p>}
                <a href={article.cta2.url} className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-lg px-6 py-3 mt-4 transition-colors">
                  {article.cta2.buttonText || `${article.cta2.title} →`}
                </a>
              </div>
            )}

            {/* Dynamic CTA based on article platform */}
                        {(() => {
                          const ctaConfigs: Record<string, { title: string; description: string; buttonText: string; link: string; gradient: string }> = {
                            gamepass: {
                              title: 'Xbox Game Pass',
                              description: 'Сотни игр по подписке. Новинки с первого дня.',
                              buttonText: 'Оформить Game Pass →',
                              link: '/subscriptions',
                              gradient: 'from-[#107C10] to-[#1DB954]',
                            },
                            psplus: {
                              title: 'PS Plus от 1 250 ₽/мес',
                              description: 'Essential, Extra, Deluxe — оформляем из России за 10 минут.',
                              buttonText: 'Оформить PS Plus →',
                              link: '/subscriptions',
                              gradient: 'from-[#0070D1] to-[#00D4FF]',
                            },
                            deals: {
                              title: 'Скидки PS Store',
                              description: 'Весенняя распродажа — скидки до 92%',
                              buttonText: 'Смотреть скидки →',
                              link: '/sale',
                              gradient: 'from-[#0070D1] to-[#00D4FF]',
                            },
                            general: {
                              title: 'Подписки от 1 250 ₽/мес',
                              description: 'PS Plus, Xbox Game Pass, EA Play — оформляем из России.',
                              buttonText: 'Выбрать подписку →',
                              link: '/subscriptions',
                              gradient: 'from-[#6366F1] to-[#8B5CF6]',
                            },
                          };
                          const ctaType = article.ctaType || 'deals';
                          const config = ctaConfigs[ctaType] || ctaConfigs.general;
                          return (
                            <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-6 mt-8`}>
                              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white mb-2">{config.title}</h3>
                              <p className="text-white/70 text-sm mb-4">{config.description}</p>
                              <a href={config.link} className="inline-block bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
                                {config.buttonText}
                              </a>
                            </div>
                          );
                        })()}
            
                        
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
                {article.tags.map((tag) => {
                  const tagLinks: Record<string, string> = {
                    'PS Plus': '/ps-plus-essential',
                    'PS Plus Essential': '/ps-plus-essential',
                    'PS Plus Extra': '/ps-plus-extra',
                    'PS Plus Deluxe': '/ps-plus-deluxe',
                    'Xbox Game Pass': '/xbox-game-pass-ultimate',
                    'EA Play': '/ea-play',
                    'PS Store': '/sale',
                  };
                  const href = tagLinks[tag] || `/news?tag=${encodeURIComponent(tag)}`;
                  return (
                    <a key={tag} href={href} className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-colors">
                      {tag}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Telegram CTA */}
            <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center">
              <p className="text-gray-300 text-sm mb-3">Обсудите эту новость в нашем Telegram-канале</p>
              <a
                href="https://t.me/PS_PLUS_RUS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-telegram text-white font-semibold text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Обсудить в Telegram
              </a>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-white mb-6">
                  Читайте <span className="text-[#00D4FF]">также</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((item) => {
                    const itemCat = NEWS_CATEGORIES[item.category] || NEWS_CATEGORIES.news;
                    return (
                      <a
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group block rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#00D4FF]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] hover:-translate-y-0.5"
                      >
                        <div className="aspect-video overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        </div>
                        <div className="p-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-1.5" style={{ backgroundColor: `${itemCat.color}15`, color: itemCat.color }}>
                            {itemCat.label}
                          </span>
                          <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-[#00D4FF] transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
