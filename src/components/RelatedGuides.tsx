import Link from 'next/link';

const ALL_GUIDES = [
  { slug: 'kak-kupit-ps-plus-iz-rossii', title: 'Как купить PS Plus из России', category: 'PlayStation' },
  { slug: 'ps-plus-essential-extra-deluxe-otlichiya', title: 'PS Plus Essential, Extra и Deluxe — отличия', category: 'PlayStation' },
  { slug: 'xbox-game-pass-kak-kupit-iz-rossii', title: 'Xbox Game Pass — тарифы и покупка', category: 'Xbox' },
  { slug: 'kak-kupit-fc-points-iz-rossii', title: 'Как купить FC Points из России', category: 'EA FC' },
  { slug: 'ea-play-podpiska-kak-kupit', title: 'EA Play — подписка Electronic Arts', category: 'EA' },
];

export default function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const related = ALL_GUIDES.filter(g => g.slug !== currentSlug).slice(0, 3);
  return (
    <div className="my-12">
      <h3 className="font-rajdhani text-xl font-bold text-white mb-6">Похожие гайды</h3>
      <div className="space-y-3">
        {related.map(g => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="block bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-[#00D4FF]/20 transition-colors">
            <span className="text-[12px] text-[#00D4FF]">{g.category}</span>
            <div className="text-[15px] text-white font-semibold mt-1">{g.title}</div>
          </Link>
        ))}
      </div>
      <Link href="/guides" className="inline-block text-[#00D4FF] text-[14px] font-semibold mt-4 hover:underline">Все гайды ActivePlay →</Link>
    </div>
  );
}
