// lib/auth/index.ts

// Authentication
export { resolveAuth } from './resolve-auth';
export type { AuthUser, AuthResult } from './resolve-auth';

// Authorization
export {
  canAccess,
  explainDenial,
  isPublic,
  PUBLIC_ROUTES,
  PUBLIC_PREEMPT_ROUTES,
  AUTH_ROUTE_RULES,
  API_ROUTE_RULES,
} from './authorization';
export type { Rule } from './authorization';

// Roles
export {
  ALL_ROLES,
  LANDING_PATH,
  FALLBACK_LANDING,
  coerceRole,
  landingFor,
} from './roles';
export type { Role } from './roles';

// Guards (server component + API helpers)
export { requireUserFor, requireAuthFor, requireAnyAuth } from './guards';

// Lower-level primitives (used by resolve-auth, exposed for tests)
export { verifyToken } from './verify-token';
export type { TokenPayload } from './verify-token';
export { getCurrentUser, getUserByToken } from './get-current-user';
