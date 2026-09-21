// app/admin/feedback/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { feedback, campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, and, ilike } from 'drizzle-orm';
import { FeedbackRow } from './FeedbackRow';

export const dynamic = 'force-dynamic';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
];

const CATEGORY_TABS = [
  { value: 'all', label: 'All categories' },
  { value: 'general', label: 'General' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'content', label: 'Content' },
  { value: 'other', label: 'Other' },
];

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: { status?: string; category?: string; q?: string };
}) {
  const statusFilter = searchParams.status || 'all';
  const categoryFilter = searchParams.category || 'all';
  const q = searchParams.q || '';

  const conditions: any[] = [];
  if (statusFilter !== 'all') conditions.push(eq(feedback.status, statusFilter));
  if (categoryFilter !== 'all') conditions.push(eq(feedback.category, categoryFilter));
  if (q) conditions.push(ilike(feedback.content, `%${q}%`));

  const rows = await db
    .select({
      id: feedback.id,
      content: feedback.content,
      category: feedback.category,
      status: feedback.status,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      userId: feedback.userId,
      userFullName: campuslinkUsers.fullName,
      userEmail: campuslinkUsers.email,
      userUsername: campuslinkUsers.username,
    })
    .from(feedback)
    .leftJoin(campuslinkUsers, eq(feedback.userId, campuslinkUsers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(feedback.createdAt));

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status: statusFilter, category: categoryFilter, q, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== '') p.set(k, v);
    });
    const s = p.toString();
    return `/admin/feedback${s ? `?${s}` : ''}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Feedback</h1>
          <p className="text-sm text-gray-500">
            {rows.length} submission{rows.length !== 1 ? 's' : ''}
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

      {/* Search + category filter */}
      <form className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label-text">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            className="input-field"
            placeholder="Content"
          />
        </div>
        <div>
          <label className="label-text">Category</label>
          <select name="category" defaultValue={categoryFilter} className="input-field">
            {CATEGORY_TABS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <input type="hidden" name="status" value={statusFilter} />
        <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No feedback submissions found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((row) => (
            <FeedbackRow
              key={row.id}
              feedback={{
                id: row.id,
                content: row.content,
                category: row.category,
                status: row.status,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
                userName: row.userFullName,
                userEmail: row.userEmail,
                userUsername: row.userUsername,
                isAnonymous: !row.userId,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
