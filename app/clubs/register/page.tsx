// app/clubs/register/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ClubRegisterForm } from './ClubRegisterForm';

export default function ClubRegisterPage() {
  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
              alt="CampusLink"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Register Your Club
          </h1>
          <p className="text-muted-text">
            Tell us about your club and we'll review it for inclusion on
            CampusLink. We'll reach out to you by email once it's been reviewed.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-8">
          <ClubRegisterForm />
        </div>

        <div className="text-center mt-8">
          <Link href="/clubs" className="text-primary-green hover:underline text-sm">
            ← Back to Clubs
          </Link>
        </div>
      </div>
    </div>
  );
}
