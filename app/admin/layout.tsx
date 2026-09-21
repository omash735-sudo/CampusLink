// app/admin/layout.tsx
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { AdminLayoutShell } from './AdminLayoutShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminOrPublications();

  // requireAdminOrPublications returns null if not authorized and bypass is off.
  // In that case, fall through with role='student' and let the shell's own
  // redirect handle it — OR redirect here. Either works.
  const role = user?.role || 'student';

  return <AdminLayoutShell role={role}>{children}</AdminLayoutShell>;
}
