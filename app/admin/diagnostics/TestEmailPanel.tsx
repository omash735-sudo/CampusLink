// app/admin/diagnostics/TestEmailPanel.tsx
'use client';

import { useState } from 'react';

export function TestEmailPanel({ defaultTo = '' }: { defaultTo?: string }) {
  const [to, setTo] = useState(defaultTo);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<
    | { kind: 'ok'; message: string; elapsed: number }
    | { kind: 'err'; message: string; hint?: string }
    | null
  >(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({
          kind: 'err',
          message: data.error || 'Failed',
          hint: data.hint,
        });
      } else {
        setResult({
          kind: 'ok',
          message: `Delivered. Message ID: ${data.messageId}`,
          elapsed: data.elapsedMs,
        });
      }
    } catch (err: any) {
      setResult({ kind: 'err', message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        This sends a real email through your configured SMTP provider. Use it
        to confirm delivery before relying on password resets in production.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          className="input-field flex-1"
          placeholder="recipient@example.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={sending || !to.trim()}
          className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Send test email'}
        </button>
      </div>

      {result && (
        <div
          className={`p-3 text-sm border ${
            result.kind === 'ok'
              ? 'border-green-300 bg-green-50 text-green-800'
              : 'border-red-300 bg-red-50 text-red-700'
          }`}
        >
          <p>{result.message}</p>
          {result.kind === 'ok' && (
            <p className="text-xs mt-1 opacity-75">
              Took {result.elapsed}ms
            </p>
          )}
          {result.kind === 'err' && result.hint && (
            <p className="text-xs mt-2 opacity-90">{result.hint}</p>
          )}
        </div>
      )}
    </div>
  );
}
