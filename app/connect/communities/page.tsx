// app/connect/communities/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { groups } from '@/lib/db/schema';
import { and, eq, desc, or } from 'drizzle-orm';
import { resolveAuth } from '@/lib/auth/resolve-auth';
import { CommunityCard } from '@/components/communities/CommunityCard';

export const dynamic = 'force-dynamic';

export default async function CommunitiesPage() {
  const auth = await resolveAuth();
  if (!auth.authenticated) {
    redirect('/auth/login?next=/connect/communities');
  }

  const approved = await db
    .select()
    .from(groups)
    .where(and(eq(groups.status, 'approved'), eq(groups.isActive, true)))
    .orderBy(desc(groups.memberCount), desc(groups.createdAt));

  const mine = await db
    .select()
    .from(groups)
    .where(eq(groups.submittedBy, auth.user.id))
    .orderBy(desc(groups.createdAt));

  const pending = mine.filter((g) => g.status === 'pending');
  const rejected = mine.filter((g) => g.status === 'rejected');

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Communities</h1>
            <p className="text-muted-text mt-2">
              Join WhatsApp groups from across City Campus — or start your own.
            </p>
          </div>
          <Link
            href="/connect/communities/new"
            className="bg-primary-green text-white px-5 py-2.5 text-sm font-medium hover:bg-deep-green transition-colors whitespace-nowrap"
          >
            + Create Your Own Group
          </Link>
        </div>

        {/* Approved communities */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            Approved Communities
            <span className="ml-2 text-sm font-normal text-muted-text">
              ({approved.length})
            </span>
          </h2>

          {approved.length === 0 ? (
            <div className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-muted-text">
                No communities are live yet. Be the first — start one above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approved.map((g) => (
                <CommunityCard key={g.id} community={g} />
              ))}
            </div>
          )}
        </section>

        {/* Your submissions */}
        {(pending.length > 0 || rejected.length > 0) && (
          <section>
            <h2 className="text-xl font-bold mb-4">Your Submissions</h2>

            {pending.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-text mb-2">
                  Pending review ({pending.length})
                </h3>
                <div className="space-y-2">
                  {pending.map((g) => (
                    <div
                      key={g.id}
                      className="bg-white border border-yellow-300 p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{g.name}</p>
                        <p className="text-xs text-muted-text">
                          Submitted {g.submittedAt ? new Date(g.submittedAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1">
                        Pending review
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rejected.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-text mb-2">
                  Not approved ({rejected.length})
                </h3>
                <div className="space-y-2">
                  {rejected.map((g) => (
                    <div
                      key={g.id}
                      className="bg-white border border-gray-200 p-4"
                    >
                      <p className="font-medium">{g.name}</p>
                      {g.reviewNotes && (
                        <p className="text-xs text-muted-text mt-1">
                          Reason: {g.reviewNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
