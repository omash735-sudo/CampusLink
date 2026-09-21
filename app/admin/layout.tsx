// app/admin/layout.tsx
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { redirect } from 'next/navigation';
import { AdminLayoutShell } from './AdminLayoutShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminOrPublications();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <AdminLayoutShell
      role={user.role}
      fullName={(user.fullName as string) || 'Admin'}
      email={(user.email as string) || ''}
      avatar={(user.avatar as string | null) ?? null}
    >
      {children}
    </AdminLayoutShell>
  );
}
