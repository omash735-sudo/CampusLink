// app/auth/register-success/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg border border-gray-200 bg-white p-8 text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
            alt="CampusLink"
            width={48}
            height={48}
            className="h-12 w-12"
            priority
          />
        </div>

        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary-green/10 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-primary-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3">Welcome to CampusLink</h1>

        <p className="text-muted-text mb-4">
          Your account has been created successfully. You can sign in right
          away and start connecting with the CampusLink community.
        </p>

        <p className="text-sm text-muted-text mb-8">
          A confirmation email has been sent to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/login"
            className="bg-primary-green text-white font-medium px-6 py-3 hover:bg-deep-green transition-colors inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 font-medium px-6 py-3 hover:border-primary-green hover:text-primary-green transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
