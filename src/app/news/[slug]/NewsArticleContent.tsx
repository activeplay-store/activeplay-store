'use client';

import { useState } from 'react';
import type { NewsItem } from '@/data/news';

interface Props {
  article: NewsItem;
}

export default function NewsArticleContent({ article }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  // YouTube embed
  if (article.youtubeUrl && (article.category === 'video' || article.category === 'podcast')) {
    const videoId = extractYouTubeId(article.youtubeUrl);

    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        {!showVideo ? (
          <button onClick={() => setShowVideo(true)} className="relative w-full h-full group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : article.coverUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg">
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {article.duration && (
              <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono backdrop-blur-sm">
                {article.duration}
              </span>
            )}
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title={article.title}
          />
        )}
      </div>
    );
  }

  // Regular cover image
  if (!article.coverUrl) return null;

  return (
    <div className="aspect-video rounded-xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={article.coverUrl}
        alt={article.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/);
  return match ? match[1] : null;
}
