// app/profile/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { campuslinkUsers, userCommunities, groups } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { SettingsIcon } from '@/components/icons';

export default async function ProfilePage() {
  const user = await requireAuth();

  // Get user's communities
  const userCommunitiesData = await db
    .select({
      groupId: userCommunities.communityId,
      name: groups.name,
      slug: groups.slug,
    })
    .from(userCommunities)
    .leftJoin(groups, eq(userCommunities.communityId, groups.id))
    .where(eq(userCommunities.userId, user.id))
    .limit(10);

  const mockInterests = user.interests || ['Technology', 'Research', 'Social Work'];
  const communities = userCommunitiesData.map(c => c.name).filter(Boolean);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex gap-3">
            <Link 
              href="/profile/edit" 
              className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
            >
              Edit Profile
            </Link>
            <Link 
              href="/settings" 
              className="border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:border-primary-green transition-colors flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="h-32 bg-primary-green/10"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 -mt-12">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-primary-green/10 flex items-center justify-center text-3xl font-bold text-primary-green overflow-hidden">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.fullName} width={96} height={96} className="object-cover" />
                ) : (
                  user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
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
                  {user.bio || 'No bio yet. Tell other students about yourself.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {mockInterests.map((interest: string) => (
                    <span key={interest} className="text-xs bg-gray-100 px-3 py-1">{interest}</span>
                  ))}
                </div>
              </div>

              {communities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Communities</h3>
                  <div className="flex flex-wrap gap-2">
                    {communities.map((community: string) => (
                      <span key={community} className="text-xs bg-primary-green/10 text-primary-green px-3 py-1">
                        {community}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Academic</h3>
                <div className="space-y-1 text-sm text-muted-text">
                  <p>Programme: {user.programme || 'Not set'}</p>
                  <p>Year: {user.year || 'Not set'}</p>
                  <p>Campus: {user.campus || 'City Campus'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
              <Link 
                href={`/profile/${user.username}`} 
                className="border border-primary-green text-primary-green px-6 py-2 text-sm font-medium hover:bg-primary-green hover:text-white transition-colors"
              >
                View Public Profile
              </Link>
              {user.isMentor && user.mentorStatus === 'approved' && (
                <Link 
                  href="/mentor" 
                  className="border border-blue-500 text-blue-500 px-6 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Go to Mentor Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
