// app/admin/mentorships/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { mentorships, mentors, campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, and, or, ilike } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { MentorshipRow } from './MentorshipRow';

export const dynamic = 'force-dynamic';

const mentorUser = alias(campuslinkUsers, 'mentor_user');
const studentUser = alias(campuslinkUsers, 'student_user');

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default async function AdminMentorshipsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const statusFilter = searchParams.status || 'all';
  const q = searchParams.q || '';

  const conditions: any[] = [];
  if (statusFilter !== 'all') conditions.push(eq(mentorships.status, statusFilter));
  if (q) {
    conditions.push(
      or(
        ilike(mentorUser.fullName, `%${q}%`),
        ilike(studentUser.fullName, `%${q}%`),
        ilike(mentorUser.username, `%${q}%`),
        ilike(studentUser.username, `%${q}%`)
      )!
    );
  }

  const rawRows = await db
    .select({
      id: mentorships.id,
      status: mentorships.status,
      startedAt: mentorships.startedAt,
      endedAt: mentorships.endedAt,
      lastInteraction: mentorships.lastInteraction,
      createdAt: mentorships.createdAt,
      mentorId: mentorships.mentorId,
      studentId: mentorships.studentId,
      mentorName: mentorUser.fullName,
      mentorUsername: mentorUser.username,
      mentorEmail: mentorUser.email,
      mentorAvatar: mentorUser.avatar,
      studentName: studentUser.fullName,
      studentUsername: studentUser.username,
      studentEmail: studentUser.email,
      studentAvatar: studentUser.avatar,
      studentProgramme: studentUser.programme,
      studentYear: studentUser.year,
    })
    .from(mentorships)
    .leftJoin(mentors, eq(mentorships.mentorId, mentors.id))
    .leftJoin(mentorUser, eq(mentors.userId, mentorUser.id))
    .leftJoin(studentUser, eq(mentorships.studentId, studentUser.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(mentorships.createdAt));

  // Coalesce nullable timestamps to strings for the client component
  const rows = rawRows.map((r) => ({
    ...r,
    startedAt: r.startedAt.toISOString(),
    endedAt: r.endedAt ? r.endedAt.toISOString() : null,
    lastInteraction: r.lastInteraction ? r.lastInteraction.toISOString() : null,
  }));

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status: statusFilter, q, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== '') p.set(k, v);
    });
    const s = p.toString();
    return `/admin/mentorships${s ? `?${s}` : ''}`;
  };

  const activeCount = rows.filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentorships</h1>
          <p className="text-sm text-gray-500">
            {rows.length} total · {activeCount} active
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={buildHref({ status: tab.value })}
            className={`px-3 py-1 text-sm ${
              statusFilter === tab.value
                ? 'bg-primary-green text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="label-text">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            className="input-field"
            placeholder="Mentor or student name/username"
          />
        </div>
        <input type="hidden" name="status" value={statusFilter} />
        <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
          Filter
        </button>
        {(q || statusFilter !== 'all') && (
          <Link
            href="/admin/mentorships"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No mentorships found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((row) => (
            <MentorshipRow key={row.id} mentorship={row} />
          ))}
        </div>
      )}
    </div>
  );
}
