// components/campus/LocationGrid.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Location {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
}

export function LocationGrid({ locations }: { locations: Location[] }) {
  if (locations.length === 0) {
    return (
      <div className="border border-gray-200 bg-white p-8 text-center">
        <p className="text-muted-text">No locations found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  return (
    <Link
      href={`/campus/locations/${location.slug}`}
      className="border border-gray-200 bg-white hover:border-primary-green transition-colors overflow-hidden group"
    >
      <div className="relative h-48 bg-gray-200">
        {location.imageUrl ? (
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-text">
            No image
          </div>
        )}
        <span className="absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 capitalize">
          {location.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-primary-text">{location.name}</h3>
        {location.shortDescription && (
          <p className="text-sm text-muted-text mt-1 line-clamp-2">{location.shortDescription}</p>
        )}
        <span className="text-xs text-primary-green font-medium mt-2 inline-block">
          View location →
        </span>
      </div>
    </Link>
  );
}
