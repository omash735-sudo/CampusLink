// app/admin/campus/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { campusLocations, campusTimeline, campusGallery } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { MapPinIcon, CalendarIcon, BookOpenIcon } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function AdminCampusHubPage() {
  const [locationsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(campusLocations);
  const [timelineCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(campusTimeline);
  const [galleryCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(campusGallery);

  const sections = [
    {
      href: '/admin/campus/locations',
      icon: MapPinIcon,
      title: 'Locations',
      description:
        'Buildings, halls, facilities, offices and other places on campus.',
      count: locationsCount?.count ?? 0,
    },
    {
      href: '/admin/campus/timeline',
      icon: CalendarIcon,
      title: 'History Timeline',
      description:
        'Dated events that make up the story of City Campus.',
      count: timelineCount?.count ?? 0,
    },
    {
      href: '/admin/campus/gallery',
      icon: BookOpenIcon,
      title: 'Gallery',
      description:
        'Photographs of campus — used on the public gallery page and location detail pages.',
      count: galleryCount?.count ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campus</h1>
        <p className="text-sm text-gray-500">
          Manage the content behind the public Campus pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white border border-gray-200 p-6 hover:border-primary-green transition-colors group"
          >
            <div className="flex items-start gap-3">
              <s.icon className="h-6 w-6 text-primary-green flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-semibold text-lg">{s.title}</h2>
                  <span className="text-sm text-gray-400">
                    {s.count}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{s.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-semibold mb-2">Preview public pages</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/campus" className="text-primary-green hover:underline">
            /campus →
          </Link>
          <Link href="/campus/explore" className="text-primary-green hover:underline">
            /campus/explore →
          </Link>
          <Link href="/campus/gallery" className="text-primary-green hover:underline">
            /campus/gallery →
          </Link>
          <Link href="/campus/history" className="text-primary-green hover:underline">
            /campus/history →
          </Link>
          <Link href="/campus/map" className="text-primary-green hover:underline">
            /campus/map →
          </Link>
        </div>
      </div>
    </div>
  );
}
