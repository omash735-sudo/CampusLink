// lib/auth/verify-token.ts
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('[lib/auth] JWT_SECRET is not set');
}

const encodedSecret = new TextEncoder().encode(JWT_SECRET);

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
 *
 * Uses `jose` instead of `jsonwebtoken` because this is called from
 * middleware.ts, which always runs on the Edge runtime on Next 14 —
 * jsonwebtoken needs Node's crypto module, which doesn't exist there,
 * so verification was silently failing on every middleware request.
 * jose runs on Web Crypto (works in both Edge and Node) and can verify
 * the same HS256 tokens signToken() already produces.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ['HS256'],
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
