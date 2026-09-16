// app/resources/policy/page.tsx
import Link from 'next/link';

export default function ResourcesPolicyPage() {
  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Academic Library Policy</h1>

        <div className="bg-white border border-gray-200 p-6 md:p-10 space-y-6 text-primary-text">
          <section>
            <h2 className="text-xl font-bold mb-2">What CampusLink can host</h2>
            <ul className="list-disc pl-5 text-muted-text space-y-1">
              <li>Original CampusLink content</li>
              <li>Materials uploaded by their creator or rights holder</li>
              <li>Public domain materials</li>
              <li>Materials with permission or under a redistribution license</li>
              <li>Publicly available educational articles, papers, and websites</li>
              <li>Educational YouTube videos embedded via the official YouTube player</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">What CampusLink does not host</h2>
            <ul className="list-disc pl-5 text-muted-text space-y-1">
              <li>Complete copyrighted books or journals without permission</li>
              <li>Institution-owned exam papers, course packs, or lecture materials uploaded without authorisation</li>
              <li>Any material CampusLink does not have the right to distribute</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Reporting</h2>
            <p className="text-muted-text">
              If you believe a resource has been uploaded without proper
              authorisation, contact us through the{' '}
              <Link href="/contact" className="text-primary-green hover:underline">
                contact page
              </Link>
              . We take such reports seriously and will remove any material
              where the right to distribute cannot be reasonably established.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Independent platform</h2>
            <p className="text-muted-text">
              CampusLink is an independent student platform. It is not operated,
              owned, endorsed, or officially affiliated with any university or
              institution. Resources shown here are curated by CampusLink and its
              contributors.
            </p>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link href="/resources" className="text-primary-green hover:underline text-sm">
            ← Back to Academic Library
          </Link>
        </div>
      </div>
    </div>
  );
}
