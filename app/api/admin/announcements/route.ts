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
    title: validated.title,
    content: validated.content,
    type: validated.type,
    priority: validated.priority,
    isPublished: validated.isPublished,
    authorId: admin.id,
    expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
    publishedAt: validated.isPublished ? new Date() : null,
  }).returning();
  
  return NextResponse.json(announcement);
}
