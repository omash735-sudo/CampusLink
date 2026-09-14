// app/terms/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { getCurrentLegal } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const doc = await getCurrentLegal('terms');

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
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
          <h1 className="text-3xl md:text-4xl font-bold">
            {doc?.title || 'Terms and Conditions'}
          </h1>
          {doc?.version && (
            <p className="text-sm text-muted-text mt-2">
              Version {doc.version}
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-10">
          {doc?.content ? (
            <div className="prose prose-sm md:prose-base max-w-none text-primary-text">
              <ReactMarkdown>{doc.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-text italic text-center py-12">
              Terms and Conditions are not yet available. Please check back soon.
            </p>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-primary-green hover:underline text-sm">
            ← Back to CampusLink
          </Link>
        </div>
      </div>
    </div>
  );
}
