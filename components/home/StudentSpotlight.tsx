// components/home/StudentSpotlight.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { studentSpotlights } from '@/lib/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

async function getRecentSpotlights() {
  return db
    .select()
    .from(studentSpotlights)
    .where(eq(studentSpotlights.isPublished, true))
    .orderBy(asc(studentSpotlights.sortOrder), desc(studentSpotlights.publishedAt))
    .limit(3);
}

export async function StudentSpotlight() {
  const rows = await getRecentSpotlights();
  if (rows.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Student Spotlight</h2>
            <p className="text-muted-text">
              Celebrating students who stand out
            </p>
          </div>
          <Link
            href="/student-spotlight"
            className="text-primary-green hover:underline text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((s) => (
            <Link
              key={s.id}
              href="/student-spotlight"
              className="bg-off-white border border-gray-200 overflow-hidden hover:border-primary-green transition-colors flex flex-col"
            >
              {s.graphicUrl && (
                <div className="relative w-full aspect-[3/4] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.graphicUrl}
                    alt={s.studentName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold">{s.studentName}</h3>
                {(s.programme || s.year) && (
                  <p className="text-xs text-primary-green font-medium mt-1">
                    {s.programme}
                    {s.year ? ` · Year ${s.year}` : ''}
                  </p>
                )}
                {s.achievement && (
                  <p className="text-xs text-muted-text mt-2 line-clamp-2">
                    {s.achievement}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-muted-text mt-10">
          Spotlights supplied by CTC Publications Office.
        </p>
      </div>
    </section>
  );
}
