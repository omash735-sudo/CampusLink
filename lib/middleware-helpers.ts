// lib/middleware-helpers.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function checkSuperAccessToken(token: string | undefined): boolean {
  if (!token) return false;
  if (process.env.SUPER_ACCESS_ENABLED !== 'true') return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { type?: string };
    return decoded?.type === 'super_access';
  } catch {
    return false;
  }
}
