// app/auth/accept-terms/AcceptTermsForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AcceptTermsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [marketingWhatsapp, setMarketingWhatsapp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      setError('You must accept the Terms and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/legal/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termsAccepted: true,
          privacyAccepted: true,
          marketingEmailConsent: marketingEmail,
          whatsappMarketingConsent: marketingWhatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record acceptance');

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-gray-200 p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="h-4 w-4 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm">
            <strong>Required:</strong> I have read and agree to the CampusLink
            Terms and Conditions and Privacy Policy.
          </span>
        </label>
      </div>

      <div className="border border-gray-200 p-4 space-y-3">
        <p className="text-xs text-muted-text font-medium uppercase tracking-wide">
          Optional
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingEmail}
            onChange={(e) => setMarketingEmail(e.target.checked)}
            className="h-4 w-4 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm">
            Send me news, updates, and announcements by email.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingWhatsapp}
            onChange={(e) => setMarketingWhatsapp(e.target.checked)}
            className="h-4 w-4 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm">
            Send me optional updates via WhatsApp.
          </span>
        </label>
      </div>

      {error && (
        <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !accepted}
        className="w-full bg-primary-green text-white font-medium py-3 hover:bg-deep-green transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'I Agree and Continue'}
      </button>
    </form>
  );
}
