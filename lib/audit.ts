// lib/audit.ts
import { db } from './db';
import { auditLogs } from './db/schema';

interface AuditParams {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logAudit(params: AuditParams) {
  try {
    await db.insert(auditLogs).values({
      adminId: params.adminId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId || null,
      previousValue: params.previousValue || null,
      newValue: params.newValue || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    });
  } catch (err) {
    console.error('[audit] failed to record:', err);
  }
}
