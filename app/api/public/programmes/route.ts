// app/api/public/programmes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programmes } from '@/lib/db/schema';

export async function GET() {
  const all = await db.select().from(programmes);
  return NextResponse.json(all);
}
