// app/admin/profile/page.tsx
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const user = await requireAdminOrPublications();
  if (!user) redirect('/auth/login');

  const fullName = (user.fullName as string) || 'Admin';
  const email = (user.email as string) || '';
  const role = (user.role as string) || 'admin';
  const username = (user.username as string) || '';
  const avatar = (user.avatar as string | null) ?? null;

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'A';

  const roleLabel = role === 'publications' ? 'Publications' : 'Administrator';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-gray-500">
          Your account information on CampusLink.
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-6 flex items-center gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={fullName}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary-green/10 flex items-center justify-center text-xl font-semibold text-primary-green">
            {initials}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold">{fullName}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <span className="inline-block mt-1 text-xs bg-primary-green/10 text-primary-green px-2 py-0.5">
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        <Row label="Full name" value={fullName} />
        <Row label="Email" value={email} />
        <Row label="Username" value={username || '—'} />
        <Row label="Role" value={roleLabel} />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
        Profile editing (name, photo, password) isn&apos;t wired up yet.
        Use <Link href="/admin/settings" className="underline">Settings</Link> or
        contact another administrator to make changes.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-primary-text font-medium">{value}</span>
    </div>
  );
}
