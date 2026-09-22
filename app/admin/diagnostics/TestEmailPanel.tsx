// app/admin/diagnostics/TestEmailPanel.tsx
'use client';

import { useState } from 'react';

type Result =
  | {
      kind: 'ok';
      message: string;
      details: Record<string, any>;
      warning?: string;
    }
  | {
      kind: 'err';
      message: string;
      code?: string;
      response?: string;
      hint?: string;
    }
  | null;

export function TestEmailPanel({ defaultTo = '' }: { defaultTo?: string }) {
  const [to, setTo] = useState(defaultTo);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result>(null);

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

      if (!res.ok || !data.success) {
        setResult({
          kind: 'err',
          message: data.error || 'Failed',
          code: data.code,
          response: data.response,
          hint: data.hint,
        });
      } else {
        setResult({
          kind: 'ok',
          message: `Server accepted the message.`,
          details: {
            to: data.to,
            from: data.from,
            messageId: data.messageId,
            response: data.response,
            accepted: data.accepted,
            rejected: data.rejected,
            elapsedMs: data.elapsedMs,
          },
          warning: data.warning,
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
          className={`p-3 text-sm border space-y-2 ${
            result.kind === 'ok'
              ? 'border-green-300 bg-green-50 text-green-800'
              : 'border-red-300 bg-red-50 text-red-700'
          }`}
        >
          <p className="font-medium">{result.message}</p>

          {result.kind === 'err' && result.code && (
            <p className="text-xs">Code: {result.code}</p>
          )}
          {result.kind === 'err' && result.response && (
            <p className="text-xs break-words">
              Server: {result.response}
            </p>
          )}
          {result.kind === 'err' && result.hint && (
            <p className="text-xs opacity-90">{result.hint}</p>
          )}

          {result.kind === 'ok' && result.warning && (
            <p className="text-xs bg-yellow-100 border border-yellow-300 text-yellow-900 p-2">
              {result.warning}
            </p>
          )}

          {result.kind === 'ok' && (
            <details>
              <summary className="cursor-pointer text-xs opacity-80">
                Server response details
              </summary>
              <pre className="mt-1 text-[11px] bg-white/60 p-2 overflow-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 space-y-1">
        <p className="font-medium">If it says &quot;accepted&quot; but nothing arrives:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Check spam, promotions, and updates tabs — not just inbox.</li>
          <li>
            Confirm <code className="bg-gray-100 px-1">SMTP_FROM</code> matches{' '}
            <code className="bg-gray-100 px-1">SMTP_USER</code> in the details above.
          </li>
          <li>Send to a different provider (Outlook, iCloud) to rule out Gmail-to-Gmail filtering.</li>
          <li>Google sometimes throttles or silently drops first-time senders from a fresh Gmail SMTP connection.</li>
        </ul>
      </div>
    </div>
  );
}
