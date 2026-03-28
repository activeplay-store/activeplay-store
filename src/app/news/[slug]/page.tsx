import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { newsData, NEWS_CATEGORIES } from '@/data/news';
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
  return {
    title: article.metaTitle || `${article.title} | ActivePlay`,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverUrl],
      type: 'article',
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = newsData.find((n) => n.slug === slug);
  if (!article || article.category === 'guide') return notFound();

  const cat = NEWS_CATEGORIES[article.category];

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
    datePublished: article.date,
    author: { '@type': 'Organization', name: article.author || 'ActivePlay' },
    publisher: {
      '@type': 'Organization',
      name: 'ActivePlay',
      url: 'https://activeplay.games',
      logo: { '@type': 'ImageObject', url: 'https://activeplay.games/images/logo/AP_WHITE.png' },
    },
    description: article.excerpt,
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
              <span>{new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {article.author && <><span>·</span><span>{article.author}</span></>}
            </div>

            {/* Cover or YouTube */}
            <NewsArticleContent article={article} />

            {/* Article body */}
            {article.content && (
              <div
                className="prose-custom font-[family-name:var(--font-body)] text-base text-gray-300 leading-[1.7] mt-8 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_strong]:text-white [&_a]:text-[#00D4FF] [&_a]:underline [&_a:hover]:text-white"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

            {/* Product CTA */}
            {article.tags?.some((t) => t.toLowerCase().includes('ps plus')) && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20">
                <p className="text-lg font-semibold text-white mb-2">Оформить PS Plus Essential</p>
                <p className="text-sm text-gray-400 mb-4">Активация на турецком аккаунте за 5 минут. От 1 250 ₽/мес.</p>
                <a href="/ps-plus-essential" className="inline-block px-6 py-3 bg-[#00D4FF] text-black font-semibold rounded-lg hover:bg-[#00B8D9] transition">
                  Купить PS Plus Essential →
                </a>
              </div>
            )}
            {article.tags?.some((t) => t.toLowerCase().includes('game pass')) && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#107C10]/10 to-transparent border border-[#107C10]/20">
                <p className="text-lg font-semibold text-white mb-2">Оформить Xbox Game Pass</p>
                <p className="text-sm text-gray-400 mb-4">Подписка на сотни игр. Активация за 5 минут.</p>
                <a href="/xbox-game-pass-ultimate" className="inline-block px-6 py-3 bg-[#107C10] text-white font-semibold rounded-lg hover:bg-[#0e6b0e] transition">
                  Купить Game Pass →
                </a>
              </div>
            )}
            {article.tags?.some((t) => t.toLowerCase().includes('скидки') || t.toLowerCase().includes('распродажа')) && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#EF4444]/10 to-transparent border border-[#EF4444]/20">
                <p className="text-lg font-semibold text-white mb-2">Скидки PS Store</p>
                <p className="text-sm text-gray-400 mb-4">Весенняя распродажа — скидки до 92%</p>
                <a href="/sale" className="inline-block px-6 py-3 bg-[#EF4444] text-white font-semibold rounded-lg hover:bg-[#DC2626] transition">
                  Смотреть скидки →
                </a>
              </div>
            )}

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
                    const itemCat = NEWS_CATEGORIES[item.category];
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
