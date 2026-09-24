// app/api/communities/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups, campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resolveAuth } from '@/lib/auth/resolve-auth';
import { notifyCommunitySubmitted } from '@/lib/services/notification.service';
import { sendCommunitySubmissionReceivedEmail } from '@/lib/services/email.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(1000),
  category: z.string().max(60).optional().nullable(),
  whatsappLink: z
    .string()
    .url('Enter a valid WhatsApp invite link')
    .refine((v) => v.includes('chat.whatsapp.com') || v.includes('wa.me'), {
      message: 'Link must be a WhatsApp group invite link',
    }),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: Request) {
  const auth = await resolveAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    let slug = slugify(data.name);
    const [conflict] = await db
      .select({ id: groups.id })
      .from(groups)
      .where(eq(groups.slug, slug))
      .limit(1);
    if (conflict) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const [row] = await db
      .insert(groups)
      .values({
        name: data.name.trim(),
        slug,
        description: data.description.trim(),
        category: data.category || null,
        whatsappLink: data.whatsappLink,
        type: 'open',
        status: 'pending',
        submittedBy: auth.user.id,
        submittedAt: new Date(),
        isActive: true,
        memberCount: 0,
      })
      .returning();

    // Notify admins
    try {
      const admins = await db
        .select()
        .from(campuslinkUsers)
        .where(eq(campuslinkUsers.role, 'admin'));
      for (const admin of admins) {
        await notifyCommunitySubmitted(
          admin.id,
          auth.user.id,
          auth.user.fullName,
          row.name
        );
      }
    } catch (e) {
      console.error('[community-submit] admin notification failed:', e);
    }

    // Confirm to submitter
    try {
      await sendCommunitySubmissionReceivedEmail(
        auth.user.email,
        auth.user.fullName,
        row.name
      );
    } catch (e) {
      console.error('[community-submit] confirmation email failed:', e);
    }

    return NextResponse.json({ success: true, group: row });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('[community-submit] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit' },
      { status: 500 }
    );
  }
}
