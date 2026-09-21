// app/admin/students/RecoveryModal.tsx
'use client';

import { useState } from 'react';

interface RecoveryModalProps {
  userId: string;
  userEmail: string;
  userName: string;
  onClose: () => void;
}

type Action = 'resend-otp' | 'restart-verification' | 'send-reset-instructions';

export function RecoveryModal({
  userId,
  userEmail,
  userName,
  onClose,
}: RecoveryModalProps) {
  const [loading, setLoading] = useState<Action | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const run = async (action: Action, label: string) => {
    setLoading(action);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage({ kind: 'ok', text: `${label} succeeded.` });
    } catch (err: any) {
      setMessage({ kind: 'err', text: err.message || 'Failed' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold">Account Recovery</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Recovery actions for <strong>{userName}</strong> ({userEmail}).
            Passwords are never visible to administrators — these actions only
            help the user complete the standard recovery flow.
          </p>

          <div className="space-y-2">
            <ActionButton
              label="Resend OTP"
              description="Generates a new 6-digit code and emails it to the user."
              onClick={() => run('resend-otp', 'Resend OTP')}
              loading={loading === 'resend-otp'}
            />
            <ActionButton
              label="Restart verification"
              description="Clears any active OTP so the user can start over cleanly."
              onClick={() => run('restart-verification', 'Restart verification')}
              loading={loading === 'restart-verification'}
            />
            <ActionButton
              label="Send reset instructions"
              description="Emails the user a link to the standard password reset flow."
              onClick={() => run('send-reset-instructions', 'Send reset instructions')}
              loading={loading === 'send-reset-instructions'}
            />
          </div>

          {message && (
            <div
              className={`p-3 text-sm border ${
                message.kind === 'ok'
                  ? 'border-green-300 bg-green-50 text-green-800'
                  : 'border-red-300 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  description,
  onClick,
  loading,
}: {
  label: string;
  description: string;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full text-left border border-gray-200 p-3 hover:border-primary-green transition-colors disabled:opacity-50"
    >
      <p className="font-medium text-sm">{loading ? `${label}…` : label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </button>
  );
}
