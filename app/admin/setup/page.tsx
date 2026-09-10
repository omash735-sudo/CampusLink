// app/admin/setup/page.tsx
import { adminExists } from '@/lib/auth';
import { notFound } from 'next/navigation';
import SetupForm from './SetupForm';

export const dynamic = 'force-dynamic';

export default async function AdminSetupPage() {
  // If an admin already exists, this route is dead.
  const exists = await adminExists();
  if (exists) notFound();

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">First-Time Admin Setup</h1>
          <p className="text-muted-text mt-2 text-sm">
            Create the administrator account for this platform. This page will
            disable itself after you submit.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
