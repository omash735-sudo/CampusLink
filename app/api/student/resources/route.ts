// app/api/student/resources/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';
import { resourceSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const user = await requireAuth();
  const body = await request.json();
  const validated = resourceSchema.parse(body);
  
  const [resource] = await db.insert(resources).values({
    ...validated,
    uploadedBy: user.id,
    status: 'pending',
  }).returning();
  
  return NextResponse.json(resource);
}
