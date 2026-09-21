// app/api/feedback/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedback } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { feedbackSubmitSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = feedbackSubmitSchema.parse(body);

    // Optional: attach user if logged in, otherwise anonymous
    const user = await getCurrentUser().catch(() => null);

    const [row] = await db
      .insert(feedback)
      .values({
        userId: user?.id ?? null,
        content: data.content,
        category: data.category,
        status: 'new',
      })
      .returning();

    return NextResponse.json({ success: true, id: row.id });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('[feedback] submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
