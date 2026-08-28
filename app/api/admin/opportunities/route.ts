// app/api/admin/opportunities/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { opportunities } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { opportunitySchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET() {
  await requireAdmin();
  const all = await db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const validated = opportunitySchema.parse(body);
  
  const [opportunity] = await db.insert(opportunities).values({
    title: validated.title,
    description: validated.description,
    organization: validated.organization,
    category: validated.category,
    eligibility: validated.eligibility,
    deadline: validated.deadline ? new Date(validated.deadline) : null,
    applicationUrl: validated.applicationUrl,
    contact: validated.contact,
    status: validated.isPublished ? 'published' : 'draft',
  }).returning();
  
  return NextResponse.json(opportunity);
}
