// app/admin/legal/page.tsx
import { db } from '@/lib/db';
import { legalDocuments } from '@/lib/db/schema';
import { LegalEditor } from './LegalEditor';
import { EmailUpdateButton } from './EmailUpdateButton';

export const dynamic = 'force-dynamic';

export default async function AdminLegalPage() {
  const docs = await db.select().from(legalDocuments);

  const terms = docs.find((d) => d.docType === 'terms');
  const privacy = docs.find((d) => d.docType === 'privacy');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Legal Documents</h1>
        <p className="text-sm text-gray-500">
          Edit the Terms and Conditions and Privacy Policy. Save changes as a
          new version to prompt users to re-accept.
        </p>
      </div>

      <LegalEditor
        docType="terms"
        initialTitle={terms?.title || 'Terms and Conditions'}
        initialContent={terms?.content || ''}
        initialVersion={terms?.version || 'v1.0'}
      />

      <LegalEditor
        docType="privacy"
        initialTitle={privacy?.title || 'Privacy Policy'}
        initialContent={privacy?.content || ''}
        initialVersion={privacy?.version || 'v1.0'}
      />

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-2">Notify Users</h2>
        <p className="text-sm text-gray-500 mb-4">
          When you make a material change to the Terms or Privacy Policy, send an
          email to all active users so they know to review and accept the update.
        </p>
        <EmailUpdateButton />
      </div>
    </div>
  );
}
