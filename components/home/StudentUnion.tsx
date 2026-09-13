// components/home/StudentUnion.tsx
import { db } from '@/lib/db';
import { studentUnionMembers } from '@/lib/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

async function getUnionMembers() {
  const latest = await db
    .select({ academicYear: studentUnionMembers.academicYear })
    .from(studentUnionMembers)
    .where(eq(studentUnionMembers.isActive, true))
    .orderBy(desc(studentUnionMembers.academicYear))
    .limit(1);

  if (latest.length === 0) return { year: null, members: [] };

  const year = latest[0].academicYear;

  const members = await db
    .select()
    .from(studentUnionMembers)
    .where(eq(studentUnionMembers.isActive, true))
    .orderBy(asc(studentUnionMembers.sortOrder));

  return {
    year,
    members: members.filter((m) => m.academicYear === year),
  };
}

export async function StudentUnion() {
  const { year, members } = await getUnionMembers();

  if (members.length === 0) return null;

  return (
    <section className="py-16 bg-off-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Know Your Student Union</h2>
          {year && (
            <p className="text-muted-text">
              The {year} Student Union leadership
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <UnionCard key={member.id} member={member} />
          ))}
        </div>

        <p className="text-center text-xs text-muted-text mt-10">
          Photo &amp; details supplied by CTC Publications Office.
        </p>
      </div>
    </section>
  );
}

function UnionCard({
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
    <div className="bg-white border border-gray-200 p-6 flex flex-col">
      <div className="flex justify-center mb-4">
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={member.fullName}
            className="h-28 w-28 rounded-full object-cover border-2 border-primary-green/20"
          />
        ) : (
          <div className="h-28 w-28 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-bold text-primary-green">
            {initials}
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-center">{member.fullName}</h3>
      <p className="text-sm text-primary-green font-medium text-center mb-3">
        {member.position}
      </p>

      {member.description && (
        <p className="text-sm text-muted-text text-center mb-4 line-clamp-4">
          {member.description}
        </p>
      )}

      <div className="flex gap-2 mt-auto pt-4">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary-green text-white text-sm font-medium py-2 text-center hover:bg-deep-green transition-colors"
          >
            WhatsApp
          </a>
        )}
        {emailHref && (
          <a
            href={emailHref}
            className="flex-1 border border-primary-green text-primary-green text-sm font-medium py-2 text-center hover:bg-primary-green/5 transition-colors"
          >
            Email
          </a>
        )}
      </div>
    </div>
  );
}
