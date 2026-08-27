// app/admin/page.tsx
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, announcements, events, resources, posts, opportunities } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

export default async function AdminDashboard() {
  await requireAdmin();

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [announcementCount] = await db.select({ count: sql<number>`count(*)` }).from(announcements);
  const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(events);
  const [resourceCount] = await db.select({ count: sql<number>`count(*)` }).from(resources);
  const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [opportunityCount] = await db.select({ count: sql<number>`count(*)` }).from(opportunities);

  const recentUsers = await db.select().from(users).orderBy(users.createdAt, 'desc').limit(5);
  const recentAnnouncements = await db.select().from(announcements).orderBy(announcements.createdAt, 'desc').limit(5);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Users" value={userCount.count} href="/admin/users" />
          <StatCard title="Announcements" value={announcementCount.count} href="/admin/announcements" />
          <StatCard title="Events" value={eventCount.count} href="/admin/events" />
          <StatCard title="Resources" value={resourceCount.count} href="/admin/resources" />
          <StatCard title="Posts" value={postCount.count} href="/admin/posts" />
          <StatCard title="Opportunities" value={opportunityCount.count} href="/admin/opportunities" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span>{user.fullName}</span>
                  <span className="text-sm text-muted-text">{user.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
            <div className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-b border-gray-100 pb-2">
                  <div className="font-medium">{announcement.title}</div>
                  <div className="text-sm text-muted-text">{new Date(announcement.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors">
      <div className="text-2xl font-bold text-primary-green">{value}</div>
      <div className="text-sm text-muted-text">{title}</div>
    </Link>
  );
}
