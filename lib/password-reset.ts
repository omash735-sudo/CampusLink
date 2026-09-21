// lib/password-reset.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { passwordResetOtps, campuslinkUsers } from '@/lib/db/schema';
import { and, eq, isNull, lt, or, desc } from 'drizzle-orm';

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TOKEN_TTL_MINUTES = 15;

/**
 * Generate a 6-digit numeric OTP, uniformly distributed.
 */
export function generateOtp(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

/**
 * Generate a random opaque reset token (returned to user, hashed in DB).
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}

/**
 * Create a new OTP record for a user. Invalidates any previous
 * unconsumed OTPs for the same user.
 */
export async function createOtpRecord(userId: string, email: string) {
  // Invalidate previous unconsumed OTPs for this user
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

/**
 * Find the most recent active OTP record for an email.
 * "Active" = not consumed, not verified yet.
 */
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

/**
 * Verify an OTP. Increments attempts on failure.
 * On success, marks verifiedAt and issues a reset token.
 */
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

  // Success — issue reset token
  const resetToken = generateResetToken();
  const resetTokenHash = await hashSecret(resetToken);
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
 * Validate a reset token and return the associated user ID.
 * Does NOT consume the token — reset-password does that on success.
 */
export async function resolveResetToken(
  token: string
): Promise<
  | { ok: true; recordId: string; userId: string; email: string }
  | { ok: false }
> {
  // We can't query by token hash directly (bcrypt is non-deterministic).
  // So: find recent unexpired reset-token records, compare each.
  const candidates = await db
    .select()
    .from(passwordResetOtps)
    .where(
      and(
        isNull(passwordResetOtps.consumedAt),
        // resetTokenExpiresAt > now
        or(
          isNull(passwordResetOtps.resetTokenHash),
          // we'll filter in JS since drizzle can't compare easily here
        )!
      )
    )
    .orderBy(desc(passwordResetOtps.createdAt))
    .limit(20);

  for (const rec of candidates) {
    if (!rec.resetTokenHash || !rec.resetTokenExpiresAt) continue;
    if (rec.resetTokenExpiresAt.getTime() < Date.now()) continue;
    const matches = await verifySecret(token, rec.resetTokenHash);
    if (matches) {
      return { ok: true, recordId: rec.id, userId: rec.userId, email: rec.email };
    }
  }

  return { ok: false };
}

export async function consumeResetToken(recordId: string) {
  await db
    .update(passwordResetOtps)
    .set({ consumedAt: new Date() })
    .where(eq(passwordResetOtps.id, recordId));
}

/**
 * Optional cleanup: delete consumed/expired OTP rows older than 24 hours.
 * Call from a cron or on each new OTP creation.
 */
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
