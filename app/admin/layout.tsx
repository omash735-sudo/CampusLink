// app/admin/layout.tsx
import { getCurrentUser } from '@/lib/auth';
import { AdminLayoutShell } from './AdminLayoutShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const role = user?.role || 'student';

  return <AdminLayoutShell role={role}>{children}</AdminLayoutShell>;
}
