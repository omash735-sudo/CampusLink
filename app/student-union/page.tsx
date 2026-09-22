// app/student-union/page.tsx
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { studentUnionMembers } from '@/lib/db/schema';
import { eq, asc, desc, and } from 'drizzle-orm';

const getMembers = unstable_cache(
  async () => {
    const [latest] = await db
      .select({ academicYear: studentUnionMembers.academicYear })
      .from(studentUnionMembers)
      .where(eq(studentUnionMembers.isActive, true))
      .orderBy(desc(studentUnionMembers.academicYear))
      .limit(1);

    if (!latest) return { year: null, members: [] as typeof studentUnionMembers.$inferSelect[] };

    const members = await db
      .select()
      .from(studentUnionMembers)
      .where(
        and(
          eq(studentUnionMembers.isActive, true),
          eq(studentUnionMembers.academicYear, latest.academicYear)
        )
      )
      .orderBy(asc(studentUnionMembers.sortOrder));

    return { year: latest.academicYear, members };
  },
  ['student-union-members'],
  {
    revalidate: 86400, // 24 hours
    tags: ['student-union'],
  }
);

export default async function StudentUnionPage() {
  const { year, members } = await getMembers();

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Student Union
          </h1>
          {year && (
            <p className="text-muted-text mb-6">The {year} leadership</p>
          )}
          <p className="text-muted-text italic font-serif leading-relaxed">
            The Student Union represents the student body and works to make
            campus life better for everyone. Here are the current members of
            the {year || 'current'} leadership. Reach out to any of them
            directly via WhatsApp or email.
          </p>
        </div>

        {members.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mx-auto">
            <p className="text-muted-text">
              No Student Union members are listed yet. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            <p className="text-center text-xs text-muted-text mt-12">
              Photo &amp; details supplied by CTC Publications Office.
            </p>
          </>
        )}

        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-primary-green hover:underline text-sm"
          >
            ← Back to CampusLink
          </Link>
        </div>
      </div>
    </div>
  );
}

function MemberCard({
  member,
}: {
  member: {
    id: string;
    fullName: string;
    position: string;
    description: string | null;
    photoUrl: string | null;
    email: string | null;
    whatsapp: string | null;
  };
}) {
  const initials = member.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const whatsappHref = member.whatsapp
    ? `https://wa.me/${member.whatsapp}?text=${encodeURIComponent(
        `Hello ${member.fullName}, I'm reaching out through CampusLink.`
      )}`
    : null;

  const emailHref = member.email
    ? `mailto:${member.email}?subject=${encodeURIComponent(
        'Enquiry via CampusLink'
      )}`
    : null;

  return (
    <div className="bg-white border border-gray-200 p-4 flex flex-col">
      <div className="flex justify-center mb-3">
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={member.fullName}
            className="h-20 w-20 rounded-full object-cover border-2 border-primary-green/20"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-primary-green/10 flex items-center justify-center text-lg font-bold text-primary-green">
            {initials}
          </div>
        )}
      </div>

      <h3 className="text-sm font-bold text-center leading-tight">
        {member.fullName}
      </h3>
      <p className="text-xs text-primary-green font-medium text-center mt-1 mb-2">
        {member.position}
      </p>

      {member.description && (
        <p className="text-xs text-muted-text text-center mb-3 line-clamp-3">
          {member.description}
        </p>
      )}

      <div className="flex flex-col gap-1 mt-auto pt-2">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-green text-white text-xs font-medium py-1.5 text-center hover:bg-deep-green transition-colors"
          >
            WhatsApp
          </a>
        )}
        {emailHref && (
          <a
            href={emailHref}
            className="border border-primary-green text-primary-green text-xs font-medium py-1.5 text-center hover:bg-primary-green/5 transition-colors"
          >
            Email
          </a>
        )}
      </div>
    </div>
  );
}
