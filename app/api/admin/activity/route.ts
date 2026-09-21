// app/api/admin/activity/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auditLogs, campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, and, ilike, gte, lte } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const entityFilter = searchParams.get('entity') || 'all';
  const q = searchParams.get('q') || '';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const conditions: any[] = [];
  if (entityFilter !== 'all') conditions.push(eq(auditLogs.entity, entityFilter));
  if (q) conditions.push(ilike(auditLogs.action, `%${q}%`));
  if (from) conditions.push(gte(auditLogs.createdAt, new Date(from)));
  if (to) {
    // inclusive end-of-day
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    conditions.push(lte(auditLogs.createdAt, end));
  }

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      previousValue: auditLogs.previousValue,
      newValue: auditLogs.newValue,
      ipAddress: auditLogs.ipAddress,
      userAgent: auditLogs.userAgent,
      createdAt: auditLogs.createdAt,
      adminId: auditLogs.adminId,
      adminName: campuslinkUsers.fullName,
      adminEmail: campuslinkUsers.email,
      adminUsername: campuslinkUsers.username,
    })
    .from(auditLogs)
    .leftJoin(campuslinkUsers, eq(auditLogs.adminId, campuslinkUsers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(auditLogs.createdAt))
    .limit(500);

  return NextResponse.json(rows);
}
