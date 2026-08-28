// app/api/admin/announcements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { announcementSchema } from '@/lib/validation';

export async function GET() {
  await requireAdmin();
  const all = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const body = await request.json();
  const validated = announcementSchema.parse(body);
  
  const [announcement] = await db.insert(announcements).values({
    ...validated,
    authorId: admin.id,
  }).returning();
  
  return NextResponse.json(announcement);
}
