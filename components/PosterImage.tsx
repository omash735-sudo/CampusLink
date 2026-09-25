// components/PosterImage.tsx
import Image from 'next/image';

type PosterImageProps = {
  src: string | null | undefined;
  alt: string;
  /**
   * "card"  → for listing cards (grid cells). Fills the card width.
   * "hero"  → for detail/featured views. Capped max width, centered.
   */
  variant?: 'card' | 'hero';
  /**
   * Hint to the browser about the rendered width at common breakpoints.
   * Keeps Cloudinary from serving a 4000px poster into a 380px card.
   */
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function PosterImage({
  src,
  alt,
  variant = 'card',
  sizes,
  className = '',
  priority = false,
}: PosterImageProps) {
  if (!src) return null;

  // Fallback sizes if the caller doesn't provide a hint.
  // card  → full column width on mobile, ~1/3 on desktop grid
  // hero  → almost full container on mobile, capped around 900px on desktop
  const resolvedSizes =
    sizes ??
    (variant === 'hero'
      ? '(max-width: 768px) 100vw, 900px'
      : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');

  const wrapperClass =
    variant === 'hero'
      ? `w-full max-w-3xl mx-auto ${className}`
      : `w-full ${className}`;

  return (
    <div className={wrapperClass}>
      {/*
        width={0} height={0} + w-full h-auto is the canonical Next.js pattern
        for "render at container width, keep the image's own aspect ratio."

        - No object-cover   → nothing is cropped
        - No fixed aspect-* → the poster is as tall as it needs to be
        - sizes             → Cloudinary gets asked for the right resolution
        - unoptimized=false → still optimized through next/image
      */}
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes={resolvedSizes}
        className="w-full h-auto block"
        priority={priority}
      />
    </div>
  );
}
