// app/apply/publications/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import { ApplyForm } from './ApplyForm';

export const dynamic = 'force-dynamic';

export default async function ApplyPublicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login?next=/apply/publications');
  }

  if (user.role === 'publications' || user.role === 'admin') {
    return (
      <div className="min-h-screen bg-off-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold mb-3">You're already in</h1>
            <p className="text-muted-text mb-6">
              {user.role === 'admin'
                ? 'You are an administrator. You already have full access.'
                : 'You are a Publications Officer. You already have access to the publications dashboard.'}
            </p>
            <Link
              href="/admin"
              className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.publicationsStatus === 'pending') {
    return (
      <div className="min-h-screen bg-off-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold mb-3">Application Under Review</h1>
            <p className="text-muted-text">
              Your application to join the Publications Office has been
              received and is currently under review. We'll notify you by email
              once a decision has been made.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnzur.png"
              alt="CampusLink"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Join the Publications Office
          </h1>
          <p className="text-muted-text mt-3 max-w-lg mx-auto">
            Publications Officers help run announcements, student news, events,
            and the Student Union section on CampusLink. If you'd like to help
            publish and manage content, apply below.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-8">
          {user.publicationsStatus === 'rejected' && (
            <div className="border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-800 mb-6">
              Your previous application was not approved. You may apply again.
            </div>
          )}
          <ApplyForm
            initialMotivation={user.publicationsMotivation || ''}
            initialExperience={''}
          />
        </div>
      </div>
    </div>
  );
}
