// app/admin/activity/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { auditLogs, campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, and, ilike, gte, lte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const ENTITY_TABS = [
  { value: 'all', label: 'All' },
  { value: 'resource', label: 'Resources' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'event', label: 'Events' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'mentor', label: 'Mentors' },
  { value: 'user', label: 'Users' },
];

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: { entity?: string; q?: string; from?: string; to?: string };
}) {
  const entityFilter = searchParams.entity || 'all';
  const q = searchParams.q || '';
  const from = searchParams.from || '';
  const to = searchParams.to || '';

  const conditions: any[] = [];
  if (entityFilter !== 'all') conditions.push(eq(auditLogs.entity, entityFilter));
  if (q) conditions.push(ilike(auditLogs.action, `%${q}%`));
  if (from) conditions.push(gte(auditLogs.createdAt, new Date(from)));
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    conditions.push(lte(auditLogs.createdAt, end));
  }

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      previousValue: auditLogs.previousValue,
      newValue: auditLogs.newValue,
      ipAddress: auditLogs.ipAddress,
      userAgent: auditLogs.userAgent,
      createdAt: auditLogs.createdAt,
      adminId: auditLogs.adminId,
      adminName: campuslinkUsers.fullName,
      adminEmail: campuslinkUsers.email,
      adminUsername: campuslinkUsers.username,
    })
    .from(auditLogs)
    .leftJoin(campuslinkUsers, eq(auditLogs.adminId, campuslinkUsers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(auditLogs.createdAt))
    .limit(500);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { entity: entityFilter, q, from, to, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== '') p.set(k, v);
    });
    const s = p.toString();
    return `/admin/activity${s ? `?${s}` : ''}`;
  };

  const isBypassLog = (action: string) => action.startsWith('[DEV_BYPASS]');

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-sm text-gray-500">
            {rows.length} entr{rows.length !== 1 ? 'ies' : 'y'}
            {rows.length >= 500 && ' (limited to most recent 500)'}
          </p>
        </div>
      </div>

      {/* Entity tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {ENTITY_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={buildHref({ entity: tab.value })}
            className={`px-3 py-1 text-sm ${
              entityFilter === tab.value
                ? 'bg-primary-green text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Filters */}
      <form className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label-text">Action contains</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            className="input-field"
            placeholder="create_resource, update_feedback..."
          />
        </div>
        <div>
          <label className="label-text">From</label>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">To</label>
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="input-field"
          />
        </div>
        <input type="hidden" name="entity" value={entityFilter} />
        <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
          Filter
        </button>
        {(q || from || to || entityFilter !== 'all') && (
          <Link
            href="/admin/activity"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 font-mono ${
                        isBypassLog(row.action)
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {row.action}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">
                      {row.entity}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-mono truncate">
                    {row.entityId ? `id: ${row.entityId}` : 'no entity id'}
                  </p>

                  {(row.previousValue != null || row.newValue != null) && (
                    <details className="mt-2 text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-700">
                        View changes
                      </summary>
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {row.previousValue != null && (
                          <div>
                            <p className="font-medium text-gray-600 mb-1">Before</p>
                            <pre className="bg-gray-50 p-2 overflow-auto text-[11px]">
                              {JSON.stringify(row.previousValue as any, null, 2)}
                            </pre>
                          </div>
                        )}
                        {row.newValue != null && (
                          <div>
                            <p className="font-medium text-gray-600 mb-1">After</p>
                            <pre className="bg-gray-50 p-2 overflow-auto text-[11px]">
                              {JSON.stringify(row.newValue as any, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>

                <div className="md:text-right shrink-0">
                  <p className="text-sm font-medium text-gray-800">
                    {row.adminName || row.adminUsername || row.adminEmail || (
                      <span className="italic text-gray-500">System / bypass</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(row.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
