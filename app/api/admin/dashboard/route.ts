// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, programmes, resources, posts, events, opportunities, announcements } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';
import { sql, desc } from 'drizzle-orm';

export async function GET() {
  await requireAdmin();
  
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [totalProgrammes] = await db.select({ count: sql<number>`count(*)` }).from(programmes);
  const [totalResources] = await db.select({ count: sql<number>`count(*)` }).from(resources);
  const [totalPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [totalEvents] = await db.select({ count: sql<number>`count(*)` }).from(events);
  const [totalOpportunities] = await db.select({ count: sql<number>`count(*)` }).from(opportunities);
  const [totalAnnouncements] = await db.select({ count: sql<number>`count(*)` }).from(announcements);
  
  const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);
  const recentPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(5);
  
  return NextResponse.json({
    stats: {
      users: totalUsers.count,
      programmes: totalProgrammes.count,
      resources: totalResources.count,
      posts: totalPosts.count,
      events: totalEvents.count,
      opportunities: totalOpportunities.count,
      announcements: totalAnnouncements.count,
    },
    recent: {
      users: recentUsers,
      posts: recentPosts,
    }
  });
}
