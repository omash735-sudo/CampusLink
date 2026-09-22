// lib/password-reset.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { passwordResetOtps } from '@/lib/db/schema';
import { and, eq, isNull, lt, or, desc } from 'drizzle-orm';

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TOKEN_TTL_MINUTES = 15;

export function generateOtp(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}

/** SHA-256 hash for the reset token — deterministic so we can query by it. */
function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createOtpRecord(userId: string, email: string) {
  await db
    .update(passwordResetOtps)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(passwordResetOtps.userId, userId),
        isNull(passwordResetOtps.consumedAt)
      )
    );

  const otp = generateOtp();
  const otpHash = await hashSecret(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  const [row] = await db
    .insert(passwordResetOtps)
    .values({
      userId,
      email,
      otpHash,
      expiresAt,
      maxAttempts: OTP_MAX_ATTEMPTS,
    })
    .returning();

  return { record: row, otp };
}

export async function findActiveOtp(email: string) {
  const [row] = await db
    .select()
    .from(passwordResetOtps)
    .where(
      and(
        eq(passwordResetOtps.email, email),
        isNull(passwordResetOtps.consumedAt),
        isNull(passwordResetOtps.verifiedAt)
      )
    )
    .orderBy(desc(passwordResetOtps.createdAt))
    .limit(1);
  return row ?? null;
}

export async function verifyOtpAndIssueResetToken(
  email: string,
  otp: string
): Promise<
  | { ok: true; resetToken: string }
  | { ok: false; reason: 'not_found' | 'expired' | 'too_many_attempts' | 'invalid' }
> {
  const record = await findActiveOtp(email);
  if (!record) return { ok: false, reason: 'not_found' };

  if (record.expiresAt.getTime() < Date.now()) {
    await db
      .update(passwordResetOtps)
      .set({ consumedAt: new Date() })
      .where(eq(passwordResetOtps.id, record.id));
    return { ok: false, reason: 'expired' };
  }

  if (record.attempts >= record.maxAttempts) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  const matches = await verifySecret(otp, record.otpHash);
  if (!matches) {
    await db
      .update(passwordResetOtps)
      .set({ attempts: record.attempts + 1 })
      .where(eq(passwordResetOtps.id, record.id));
    return { ok: false, reason: 'invalid' };
  }

  const resetToken = generateResetToken();
  const resetTokenHash = hashResetToken(resetToken);
  const resetTokenExpiresAt = new Date(
    Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000
  );

  await db
    .update(passwordResetOtps)
    .set({
      verifiedAt: new Date(),
      resetTokenHash,
      resetTokenExpiresAt,
    })
    .where(eq(passwordResetOtps.id, record.id));

  return { ok: true, resetToken };
}

/**
 * Look up the reset token row directly by its deterministic SHA-256 hash.
 * O(1) query — no scanning, no limit, no race.
 */
export async function resolveResetToken(
  token: string
): Promise<
  | { ok: true; recordId: string; userId: string; email: string }
  | { ok: false }
> {
  const tokenHash = hashResetToken(token);

  const [record] = await db
    .select()
    .from(passwordResetOtps)
    .where(
      and(
        eq(passwordResetOtps.resetTokenHash, tokenHash),
        isNull(passwordResetOtps.consumedAt)
      )
    )
    .limit(1);

  if (!record) return { ok: false };
  if (!record.resetTokenExpiresAt) return { ok: false };
  if (record.resetTokenExpiresAt.getTime() < Date.now()) return { ok: false };

  return {
    ok: true,
    recordId: record.id,
    userId: record.userId,
    email: record.email,
  };
}

export async function consumeResetToken(recordId: string) {
  await db
    .update(passwordResetOtps)
    .set({ consumedAt: new Date() })
    .where(eq(passwordResetOtps.id, recordId));
}

export async function cleanupExpiredOtps() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await db
    .delete(passwordResetOtps)
    .where(
      or(
        lt(passwordResetOtps.expiresAt, cutoff),
        lt(passwordResetOtps.createdAt, cutoff)
      )!
    );
}
