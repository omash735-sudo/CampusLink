// app/api/admin/clubs/registrations/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clubRegistrations, clubs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { sendClubApprovedEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, action, reviewNotes } = body;

    const [reg] = await db
      .select()
      .from(clubRegistrations)
      .where(eq(clubRegistrations.id, id));

    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (action === 'approve') {
      const slug = slugify(reg.clubName);
      const [newClub] = await db
        .insert(clubs)
        .values({
          name: reg.clubName,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          description: reg.description,
          category: reg.category || null,
          email: reg.contactEmail,
          whatsapp: reg.contactPhone || null,
          meetingInfo: reg.meetingInfo || null,
          membershipInfo: reg.membershipInfo || null,
          isActive: true,
          sortOrder: 0,
        })
        .returning();

      await db
        .update(clubRegistrations)
        .set({
          status: 'approved',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || null,
          updatedAt: new Date(),
        })
        .where(eq(clubRegistrations.id, id));

      try {
        await sendClubApprovedEmail(reg.contactEmail, reg.clubName);
      } catch (e) {
        console.error('Club approved email failed:', e);
      }

      await logAudit({
        adminId: admin.id,
        action: 'approve_club_registration',
        entity: 'club_registration',
        entityId: id,
        newValue: { clubId: newClub.id },
      });
    } else if (action === 'reject') {
      await db
        .update(clubRegistrations)
        .set({
          status: 'rejected',
          reviewedBy: admin.id,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || null,
          updatedAt: new Date(),
        })
        .where(eq(clubRegistrations.id, id));

      await logAudit({
        adminId: admin.id,
        action: 'reject_club_registration',
        entity: 'club_registration',
        entityId: id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}
