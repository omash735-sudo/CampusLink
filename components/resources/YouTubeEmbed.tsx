// components/resources/YouTubeEmbed.tsx
'use client';

import { useState } from 'react';

interface Props {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: Props) {
  const [blocked, setBlocked] = useState(false);

  if (blocked) {
    return (
      <div className="border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-muted-text mb-3">
          This video cannot be embedded directly. You can still watch it on YouTube.
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
        >
          Watch on YouTube
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onError={() => setBlocked(true)}
      />
    </div>
  );
}
