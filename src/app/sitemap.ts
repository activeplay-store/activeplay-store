import { MetadataRoute } from 'next';
import { guidesData } from '@/data/guides';
import type { NewsItem } from '@/data/news-types';
import newsJson from '@/data/news.json';

const newsData = newsJson as unknown as NewsItem[];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://activeplay.games';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/ps-plus-essential`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ps-plus-extra`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ps-plus-deluxe`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ea-play`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/xbox-game-pass-essential`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/xbox-game-pass-premium`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/xbox-game-pass-ultimate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/sale`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/igrovaya-valyuta`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  const guides: MetadataRoute.Sitemap = guidesData.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedDate || guide.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const news: MetadataRoute.Sitemap = newsData
    .filter((n) => n.category !== 'guide')
    .map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }));

  return [...staticPages, ...guides, ...news];
}
