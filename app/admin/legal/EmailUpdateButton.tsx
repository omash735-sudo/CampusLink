// app/admin/legal/EmailUpdateButton.tsx
'use client';

import { useState } from 'react';

export function EmailUpdateButton() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleClick = async () => {
    if (
      !confirm(
        'This will send an email to ALL active users about the Terms update. Continue?'
      )
    ) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/legal/email-update', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setResult(
        `Sent ${data.sent} of ${data.total} (${data.failed} failed).`
      );
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={sending}
        className="bg-yellow-600 text-white px-4 py-2 font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send Terms Update Email to All Users'}
      </button>
      {result && <p className="text-sm mt-3 text-gray-700">{result}</p>}
    </div>
  );
}
