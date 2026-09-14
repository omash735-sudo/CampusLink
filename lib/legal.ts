// lib/legal.ts
import { db } from './db';
import { legalDocuments } from './db/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_TERMS_VERSION = 'v1.0';
const DEFAULT_PRIVACY_VERSION = 'v1.0';

export async function getCurrentLegal(docType: 'terms' | 'privacy') {
  const [doc] = await db
    .select()
    .from(legalDocuments)
    .where(eq(legalDocuments.docType, docType));
  return doc || null;
}

export async function getCurrentVersions() {
  const terms = await getCurrentLegal('terms');
  const privacy = await getCurrentLegal('privacy');
  return {
    termsVersion: terms?.version || DEFAULT_TERMS_VERSION,
    privacyVersion: privacy?.version || DEFAULT_PRIVACY_VERSION,
  };
}

export async function userNeedsToAcceptTerms(user: {
  termsVersion: string | null;
  privacyVersion: string | null;
}): Promise<boolean> {
  const current = await getCurrentVersions();
  if (!user.termsVersion || user.termsVersion !== current.termsVersion) {
    return true;
  }
  if (!user.privacyVersion || user.privacyVersion !== current.privacyVersion) {
    return true;
  }
  return false;
}
