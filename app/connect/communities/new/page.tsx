// app/connect/communities/new/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { resolveAuth } from '@/lib/auth/resolve-auth';
import { CommunitySubmitForm } from '@/components/communities/CommunitySubmitForm';

export const dynamic = 'force-dynamic';

export default async function NewCommunityPage() {
  const auth = await resolveAuth();
  if (!auth.authenticated) {
    redirect('/auth/login?next=/connect/communities/new');
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/connect/communities"
          className="text-primary-green hover:underline text-sm"
        >
          ← Back to Communities
        </Link>

        <div className="bg-white border border-gray-200 p-6 md:p-8 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold">Start a Community</h1>
          <p className="text-muted-text mt-2 mb-6">
            CampusLink Communities are WhatsApp groups managed by students.
            Create the WhatsApp group first, then submit its invite link
            below. An admin will review your submission before it goes live.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 mb-6">
            <p className="font-semibold mb-2">How it works</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a WhatsApp group for your community</li>
              <li>Collect the phone numbers of interested students</li>
              <li>Add them to your WhatsApp group</li>
              <li>Copy the WhatsApp group invite link</li>
              <li>Paste it below and submit for review</li>
            </ol>
          </div>

          <CommunitySubmitForm />
        </div>
      </div>
    </div>
  );
}
