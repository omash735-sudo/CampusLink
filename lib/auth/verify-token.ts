// lib/auth/verify-token.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('[lib/auth] JWT_SECRET is not set');
}

export type TokenPayload = {
  userId: string;
  role: string;
};

/**
 * Verify a JWT issued by signToken(). Returns the payload, or null
 * if the token is missing, malformed, or expired.
 *
 * The returned `role` is a raw string (not narrowed to Role) because
 * it comes from the token and may not match a currently-valid role.
 * Callers should treat it as untrusted; authorization uses the
 * user's DB row instead.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}
