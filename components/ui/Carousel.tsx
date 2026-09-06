// components/ui/Carousel.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  images,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1 || isPaused) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNext, images.length, isPaused]);

  if (images.length === 0) return null;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-64 w-full flex-shrink-0 md:h-96"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-12">
                <p className="text-center text-sm font-medium text-white drop-shadow-lg md:text-base">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 md:left-4 md:p-3"
            aria-label="Previous slide"
          >
            <svg 
              className="h-5 w-5 md:h-6 md:w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 md:right-4 md:p-3"
            aria-label="Next slide"
          >
            <svg 
              className="h-5 w-5 md:h-6 md:w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 transition-all md:h-2.5 ${
                index === currentIndex
                  ? 'w-8 bg-primary-green md:w-10'
                  : 'w-2 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute right-4 top-4 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
