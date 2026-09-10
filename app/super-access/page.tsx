// app/super-access/page.tsx
import { isSuperAccessEnabled, hasSuperAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SuperAccessForm from './SuperAccessForm';

export const dynamic = 'force-dynamic';

export default function SuperAccessPage() {
  if (!isSuperAccessEnabled()) {
    // Route effectively doesn't exist when disabled
    redirect('/');
  }

  if (hasSuperAccess()) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Super Access</h1>
          <p className="text-muted-text mt-2 text-sm">
            Temporary owner access for testing and debugging. You must already
            be signed in as an admin.
          </p>
        </div>
        <SuperAccessForm />
      </div>
    </div>
  );
}
