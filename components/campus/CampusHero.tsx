// components/campus/CampusHero.tsx
import Link from 'next/link';
import Image from 'next/image';

export function CampusHero() {
  return (
    <section className="relative bg-off-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-text mb-4">
              Discover Campus
            </h1>
            <p className="text-lg text-muted-text mb-6">
              Explore City Campus, discover important places, and find your way around with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/campus/explore"
                className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors"
              >
                Explore Campus
              </Link>
              <Link
                href="/campus/map"
                className="border-2 border-primary-green text-primary-green px-6 py-3 font-medium hover:bg-primary-green hover:text-white transition-colors"
              >
                View Campus Map
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-text">
              <span>City Centre Location</span>
              <span>Urban Campus</span>
            </div>
          </div>
          <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 border border-gray-200 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788653525/DSC_8897_asrddb.jpg"
              alt="City Campus"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
