// components/about/AboutHero.tsx
import Link from 'next/link';
import Image from 'next/image';

export function AboutHero() {
  return (
    <section className="py-16 md:py-24 bg-off-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-text mb-4">
              Built for Campus Life.
            </h1>
            <p className="text-lg text-muted-text mb-6">
              A student-focused digital platform designed to make university life easier to navigate, 
              easier to connect with, and easier to discover.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/register"
                className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors"
              >
                Join CampusLink
              </Link>
              <Link
                href="/campus"
                className="border-2 border-primary-green text-primary-green px-6 py-3 font-medium hover:bg-primary-green hover:text-white transition-colors"
              >
                Explore Campus
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 border border-gray-200 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1789247541/757b291e2b61b6990b11d22ad3158183_sycrsw.jpg"
              alt="Campus Community"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
