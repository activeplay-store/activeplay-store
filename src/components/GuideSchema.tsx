export default function GuideSchema({ title, slug, date }: { title: string; slug: string; date: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": { "@type": "Organization", "name": "ActivePlay", "url": "https://activeplay.games" },
    "publisher": { "@type": "Organization", "name": "ActivePlay", "url": "https://activeplay.games" },
    "datePublished": date,
    "dateModified": date,
    "mainEntityOfPage": `https://activeplay.games/guides/${slug}`
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
