// app/api/admin/legal/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { legalDocuments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { legalDocumentSchema } from '@/lib/validation';

export const runtime = 'nodejs';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(legalDocuments);
  return NextResponse.json(rows);
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { docType, ...rest } = body;

    if (docType !== 'terms' && docType !== 'privacy') {
      return NextResponse.json({ error: 'Invalid doc type' }, { status: 400 });
    }

    const data = legalDocumentSchema.parse(rest);

    const [existing] = await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.docType, docType));

    const now = new Date();
    let saved;
    if (existing) {
      [saved] = await db
        .update(legalDocuments)
        .set({
          title: data.title,
          content: data.content,
          version: data.version,
          updatedAt: now,
        })
        .where(eq(legalDocuments.docType, docType))
        .returning();
    } else {
      [saved] = await db
        .insert(legalDocuments)
        .values({
          docType,
          title: data.title,
          content: data.content,
          version: data.version,
        })
        .returning();
    }

    return NextResponse.json({ success: true, doc: saved });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to save' },
      { status: 500 }
    );
  }
}
