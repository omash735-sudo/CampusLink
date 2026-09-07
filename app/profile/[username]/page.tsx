// app/profile/[username]/page.tsx
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UsersIcon, AcademicIcon, BookOpenIcon } from '@/components/icons';

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, params.username))
    .then(res => res[0]);

  if (!user) notFound();

  const mockInterests = ['Technology', 'Research', 'Entrepreneurship'];
  const mockCommunities = ['Social Work Students', 'Debate Society'];

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/connect" className="text-primary-green hover:underline text-sm">
          ← Back to Connect
        </Link>

        <div className="bg-white border border-gray-200 mt-4 overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-primary-green/10"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 -mt-12">
              <div className="h-20 w-20 rounded-full border-4 border-white bg-primary-green/10 flex items-center justify-center text-2xl font-bold text-primary-green overflow-hidden">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.fullName} width={80} height={80} className="object-cover" />
                ) : (
                  user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-muted-text">@{user.username}</p>
                <p className="text-muted-text mt-1">{user.programme || 'No programme'} • Year {user.year || '?'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-text">
                  {user.bio || 'This student hasn't added a bio yet.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {mockInterests.map((interest) => (
                    <span key={interest} className="text-xs bg-gray-100 px-3 py-1">{interest}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Communities</h3>
                <div className="flex flex-wrap gap-2">
                  {mockCommunities.map((community) => (
                    <span key={community} className="text-xs bg-primary-green/10 text-primary-green px-3 py-1">
                      {community}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Academic</h3>
                <div className="space-y-1 text-sm text-muted-text">
                  <p>Programme: {user.programme || 'Not set'}</p>
                  <p>Year: {user.year || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
              <Link 
                href="/connect" 
                className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
              >
                Connect
              </Link>
              <Link 
                href="/mentors" 
                className="border border-primary-green text-primary-green px-6 py-2 text-sm font-medium hover:bg-primary-green hover:text-white transition-colors"
              >
                Request Mentorship
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
