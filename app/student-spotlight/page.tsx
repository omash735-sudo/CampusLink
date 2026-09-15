// app/student-spotlight/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { studentSpotlights } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function StudentSpotlightPage() {
  const rows = await db
    .select()
    .from(studentSpotlights)
    .where(eq(studentSpotlights.isPublished, true))
    .orderBy(asc(studentSpotlights.sortOrder));

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
              alt="CampusLink"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Student Spotlight
          </h1>
          <p className="text-muted-text italic font-serif leading-relaxed">
            Celebrating students who are making a difference — academically,
            socially, and in their communities. Each spotlight is a story worth
            sharing.
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mx-auto">
            <p className="text-muted-text">
              No spotlights have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((s) => (
                <SpotlightCard key={s.id} spotlight={s} />
              ))}
            </div>

            <p className="text-center text-xs text-muted-text mt-12">
              Spotlights supplied by CTC Publications Office.
            </p>
          </>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="text-primary-green hover:underline text-sm">
            ← Back to CampusLink
          </Link>
        </div>
      </div>
    </div>
  );
}

function SpotlightCard({
  spotlight,
}: {
  spotlight: {
    id: string;
    studentName: string;
    programme: string | null;
    year: number | null;
    bio: string;
    graphicUrl: string | null;
    tags: string[] | null;
    achievement: string | null;
  };
}) {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden flex flex-col">
      {spotlight.graphicUrl && (
        <div className="relative w-full aspect-[3/4] bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={spotlight.graphicUrl}
            alt={spotlight.studentName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold">{spotlight.studentName}</h3>
        {(spotlight.programme || spotlight.year) && (
          <p className="text-sm text-primary-green font-medium mt-1">
            {spotlight.programme}
            {spotlight.year ? ` · Year ${spotlight.year}` : ''}
          </p>
        )}

        {spotlight.achievement && (
          <p className="text-sm font-medium text-primary-text mt-3 border-l-2 border-primary-green pl-3">
            {spotlight.achievement}
          </p>
        )}

        <p className="text-sm text-muted-text mt-3 leading-relaxed">
          {spotlight.bio}
        </p>

        {spotlight.tags && spotlight.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {spotlight.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary-green/10 text-primary-green px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
