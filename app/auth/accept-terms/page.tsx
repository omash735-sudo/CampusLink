// app/auth/accept-terms/page.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { userNeedsToAcceptTerms } from '@/lib/legal';
import AcceptTermsForm from './AcceptTermsForm';

export const dynamic = 'force-dynamic';

export default async function AcceptTermsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const needs = await userNeedsToAcceptTerms(user);
  if (!needs) redirect('/');

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-4">
            We've Updated Our Terms
          </h1>
          <p className="text-muted-text mb-6">
            Before you continue, please review and accept our updated Terms and
            Conditions and Privacy Policy. This is required to keep using
            CampusLink.
          </p>

          <div className="border border-gray-200 p-4 mb-6 space-y-2">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-green hover:underline block text-sm"
            >
              → Read Terms and Conditions
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-green hover:underline block text-sm"
            >
              → Read Privacy Policy
            </a>
          </div>

          <AcceptTermsForm />
        </div>
      </div>
    </div>
  );
}
