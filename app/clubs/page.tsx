// app/clubs/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function ClubsPage() {
  const rows = await db
    .select()
    .from(clubs)
    .where(eq(clubs.isActive, true))
    .orderBy(asc(clubs.sortOrder), asc(clubs.name));

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
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
            Interested in Joining Campus Clubs?
          </h1>
          <p className="text-muted-text mb-6">
            Browse student clubs and organisations on campus. Find a community
            that matches your interests, or start one of your own.
          </p>
          <Link
            href="/clubs/register"
            className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors inline-block"
          >
            Register Your Club
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mx-auto">
            <p className="text-muted-text mb-4">
              No clubs have been published yet. Be the first to register yours.
            </p>
            <Link
              href="/clubs/register"
              className="text-primary-green hover:underline"
            >
              Register Your Club →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
            <p className="text-center text-xs text-muted-text mt-12">
              Clubs listed on CampusLink are student-run. Inclusion does not
              imply official institutional recognition.
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

function ClubCard({
  club,
}: {
  club: {
    id: string;
    name: string;
    description: string;
    category: string | null;
    logoUrl: string | null;
    email: string | null;
    whatsapp: string | null;
    instagramUrl: string | null;
    websiteUrl: string | null;
  };
}) {
  const whatsappHref = club.whatsapp
    ? `https://wa.me/${club.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hi, I'm interested in joining ${club.name}.`
      )}`
    : null;

  return (
    <div className="bg-white border border-gray-200 p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        {club.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.logoUrl}
            alt={club.name}
            className="h-14 w-14 object-cover border border-gray-200"
          />
        ) : (
          <div className="h-14 w-14 bg-primary-green/10 flex items-center justify-center text-primary-green font-bold">
            {club.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-bold truncate">{club.name}</h3>
          {club.category && (
            <p className="text-xs text-primary-green">{club.category}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-text line-clamp-4 mb-4 flex-1">
        {club.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
        {club.email && (
          <a
            href={`mailto:${club.email}?subject=Interest in ${club.name}`}
            className="text-xs border border-primary-green text-primary-green px-3 py-1.5 hover:bg-primary-green/5"
          >
            Email
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-primary-green text-white px-3 py-1.5 hover:bg-deep-green"
          >
            WhatsApp
          </a>
        )}
        {club.instagramUrl && (
          <a
            href={club.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
          >
            Instagram
          </a>
        )}
        {club.websiteUrl && (
          <a
            href={club.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}
