// app/admin/diagnostics/page.tsx
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { db } from '@/lib/db';
import { auditLogs, campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { TestEmailPanel } from './TestEmailPanel';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ---------- helpers ----------

function walkFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else files.push(full);
  }
  return files;
}

function readOrEmpty(path: string): string {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

// ---------- env checks ----------

type EnvCheck = {
  key: string;
  category: string;
  required: boolean;
  note?: string;
};

const ENV_CHECKS: EnvCheck[] = [
  { key: 'JWT_SECRET', category: 'Auth', required: true },
  { key: 'DEV_BYPASS', category: 'Dev', required: false, note: 'Set to "true" to bypass admin auth' },
  { key: 'SUPER_ACCESS_ENABLED', category: 'Dev', required: false },
  { key: 'SUPER_ACCESS_PASSWORD', category: 'Dev', required: false },
  { key: 'CLOUDINARY_CLOUD_NAME', category: 'Media', required: true },
  { key: 'CLOUDINARY_API_KEY', category: 'Media', required: true },
  { key: 'CLOUDINARY_API_SECRET', category: 'Media', required: true },
  { key: 'SMTP_HOST', category: 'Email', required: true },
  { key: 'SMTP_PORT', category: 'Email', required: true },
  { key: 'SMTP_USER', category: 'Email', required: true },
  { key: 'SMTP_PASS', category: 'Email', required: true },
  { key: 'SMTP_FROM', category: 'Email', required: true },
  { key: 'NEXT_PUBLIC_APP_URL', category: 'App', required: true },
];

// ---------- page ----------

export default async function DiagnosticsPage() {
  const user = await requireAdminOnly();
  if (!user) {
    return (
      <div className="p-8 text-sm text-red-700">
        Unauthorized. Sign in as admin or set DEV_BYPASS=true.
      </div>
    );
  }

  const cwd = process.cwd();

  // ---- 1. Env vars ----
  const envStatus = ENV_CHECKS.map((c) => ({
    ...c,
    set: !!process.env[c.key],
  }));
  const missingRequired = envStatus.filter((c) => c.required && !c.set);

  // ---- 2. Auth layer audit ----
  const adminApiDir = join(cwd, 'app/api/admin');
  const adminApiFiles = walkFiles(adminApiDir).filter((f) => f.endsWith('route.ts'));

  const authIssues = adminApiFiles
    .map((file) => {
      const src = readOrEmpty(file);
      const usesOldAuth = src.includes("from '@/lib/auth'");
      const usesNewAuth = src.includes("from '@/lib/dev-auth'");
      const hasLogAudit = src.includes('logAudit(');
      const isMutation = /export async function (POST|PUT|PATCH|DELETE)/.test(src);
      return {
        rel: relative(cwd, file),
        usesOldAuth,
        usesNewAuth,
        hasLogAudit,
        isMutation,
      };
    })
    .filter((f) => f.usesOldAuth || (f.isMutation && !f.hasLogAudit));

  const oldAuthFiles = authIssues.filter((f) => f.usesOldAuth);
  const unloggedMutationFiles = authIssues.filter(
    (f) => !f.usesOldAuth && f.isMutation && !f.hasLogAudit
  );

  // ---- 3. Admin pages inventory ----
  const adminPagesDir = join(cwd, 'app/admin');
  const adminPageFiles = walkFiles(adminPagesDir).filter((f) => f.endsWith('page.tsx'));
  const adminPageRoutes = adminPageFiles
    .map((f) => {
      const rel = relative(adminPagesDir, f);
      const route = '/admin/' + rel.replace(/\/page\.tsx$/, '').replace(/^page\.tsx$/, '');
      return route === '/admin/' ? '/admin' : route;
    })
    .sort();

  // ---- 4. Route coverage heuristic ----
  // For each admin page, guess the API folder it uses. Not perfect, but informative.
  const missingApis = adminPageRoutes
    .map((r) => {
      const segs = r.split('/').filter(Boolean).slice(1); // drop 'admin'
      if (segs.length === 0) return null;
      const candidate = join(adminApiDir, ...segs);
      const [idSeg] = segs.slice(-1);
      // If last segment is a dynamic [id] or slug, check parent
      const parent = idSeg.startsWith('[')
        ? join(adminApiDir, ...segs.slice(0, -1))
        : candidate;
      const exists = existsSync(join(parent, 'route.ts'));
      return exists ? null : r;
    })
    .filter((x): x is string => !!x);

  // ---- 5. Recent activity ----
  const recentAudit = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entity: auditLogs.entity,
      createdAt: auditLogs.createdAt,
      adminName: campuslinkUsers.fullName,
    })
    .from(auditLogs)
    .leftJoin(campuslinkUsers, eq(auditLogs.adminId, campuslinkUsers.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(5);

  // ---- 6. Counts ----
  const [auditCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs);

  // ---- 7. Dev bypass ----
  const bypassOn = process.env.DEV_BYPASS === 'true';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Diagnostics</h1>
        <p className="text-sm text-gray-500">
          Health check for auth wiring, environment, and route coverage.
        </p>
      </div>

      {/* DEV_BYPASS banner */}
      {bypassOn && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 p-4 text-sm">
          <p className="font-semibold">DEV_BYPASS is enabled</p>
          <p className="mt-1">
            Admin authorization is currently bypassed. Turn off by setting
            <code className="bg-yellow-200 px-1 mx-1">DEV_BYPASS=false</code>
            in your env and restarting.
          </p>
        </div>
      )}

      {/* Env vars */}
      <Section
        title="Environment Variables"
        summary={
          missingRequired.length === 0
            ? 'All required vars are set.'
            : `${missingRequired.length} required var${
                missingRequired.length === 1 ? '' : 's'
              } missing.`
        }
        tone={missingRequired.length === 0 ? 'ok' : 'warn'}
      >
        <div className="divide-y divide-gray-100">
          {envStatus.map((c) => (
            <div
              key={c.key}
              className="flex items-center justify-between gap-4 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono">{c.key}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {c.category}
                  {c.required && ' · required'}
                </span>
                {c.note && (
                  <p className="text-xs text-gray-500 mt-0.5">{c.note}</p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 flex-shrink-0 ${
                  c.set
                    ? 'bg-green-100 text-green-700'
                    : c.required
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.set ? 'set' : 'missing'}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Auth migration */}
      <Section
        title="Auth Layer"
        summary={
          oldAuthFiles.length === 0
            ? 'All admin API routes use @/lib/dev-auth.'
            : `${oldAuthFiles.length} route${
                oldAuthFiles.length === 1 ? '' : 's'
              } still import from @/lib/auth.`
        }
        tone={oldAuthFiles.length === 0 ? 'ok' : 'warn'}
      >
        {oldAuthFiles.length === 0 ? (
          <p className="text-sm text-green-700">
            Nothing to migrate. DEV_BYPASS now works across the entire admin API.
          </p>
        ) : (
          <ul className="space-y-1 text-sm">
            {oldAuthFiles.map((f) => (
              <li key={f.rel} className="font-mono text-xs">
                {f.rel}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Audit logging coverage */}
      <Section
        title="Audit Logging Coverage"
        summary={
          unloggedMutationFiles.length === 0
            ? 'All mutation routes call logAudit().'
            : `${unloggedMutationFiles.length} mutation route${
                unloggedMutationFiles.length === 1 ? '' : 's'
              } don't call logAudit().`
        }
        tone={unloggedMutationFiles.length === 0 ? 'ok' : 'info'}
      >
        {unloggedMutationFiles.length === 0 ? (
          <p className="text-sm text-green-700">
            Every POST/PUT/PATCH/DELETE admin route logs to the audit trail.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">
              These mutation routes don&apos;t write audit entries — actions
              won&apos;t appear on the Activity page:
            </p>
            <ul className="space-y-1 text-sm">
              {unloggedMutationFiles.map((f) => (
                <li key={f.rel} className="font-mono text-xs">
                  {f.rel}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {/* Route coverage */}
      <Section
        title="Admin Page → API Coverage"
        summary={
          missingApis.length === 0
            ? 'Every admin page has a matching API folder.'
            : `${missingApis.length} page${
                missingApis.length === 1 ? '' : 's'
              } without an obvious API folder.`
        }
        tone={missingApis.length === 0 ? 'ok' : 'info'}
      >
        {missingApis.length === 0 ? (
          <p className="text-sm text-green-700">
            All admin pages appear to have a backing API folder.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">
              These pages don&apos;t have a matching{' '}
              <code className="bg-gray-100 px-1">app/api/admin/…/route.ts</code>
              . Might be intentional (server-only pages), might be a gap:
            </p>
            <ul className="space-y-1 text-sm">
              {missingApis.map((p) => (
                <li key={p} className="font-mono text-xs">
                  {p}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {/* Admin page inventory */}
      <Section
        title="Admin Pages"
        summary={`${adminPageRoutes.length} page${
          adminPageRoutes.length === 1 ? '' : 's'
        } found`}
        tone="info"
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {adminPageRoutes.map((r) => (
            <li key={r} className="font-mono text-xs">
              {r}
            </li>
          ))}
        </ul>
      </Section>

      {/* Test email */}
      <Section
        title="Email / SMTP"
        summary="Send a test email to confirm delivery."
        tone="info"
      >
        <TestEmailPanel defaultTo={user.email || ''} />
      </Section>

      {/* Recent activity */}
      <Section
        title="Recent Audit Activity"
        summary={`${auditCount?.count ?? 0} total entries`}
        tone="info"
      >
        {recentAudit.length === 0 ? (
          <p className="text-sm text-gray-500">No audit entries yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {recentAudit.map((a) => (
              <li key={a.id} className="flex justify-between gap-4 py-1">
                <span className="font-mono text-xs truncate">{a.action}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {a.adminName || 'system'} ·{' '}
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  summary,
  tone,
  children,
}: {
  title: string;
  summary?: string;
  tone: 'ok' | 'warn' | 'info';
  children: React.ReactNode;
}) {
  const border =
    tone === 'ok'
      ? 'border-green-200'
      : tone === 'warn'
      ? 'border-yellow-300'
      : 'border-gray-200';

  return (
    <div className={`bg-white border ${border} p-5`}>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="font-semibold">{title}</h2>
        {summary && (
          <span
            className={`text-xs ${
              tone === 'ok'
                ? 'text-green-700'
                : tone === 'warn'
                ? 'text-yellow-800'
                : 'text-gray-500'
            }`}
          >
            {summary}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
