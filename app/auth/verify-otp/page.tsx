// app/auth/verify-otp/page.tsx
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyOtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialEmail = params.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      router.push(`/auth/reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    setError('');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } catch {
      setError('Could not resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
              alt="CampusLink"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Enter your code</h1>
          <p className="text-muted-text mt-2">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="label-text">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              className="input-field text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
            />
          </div>

          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {resent && (
            <div className="border border-green-300 bg-green-50 p-3 text-sm text-green-800">
              New code sent.
            </div>
          )}

          <button
            type="submit"
            className="bg-primary-green text-white w-full py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-primary-green hover:underline font-medium disabled:opacity-50"
            >
              {resending ? 'Resending…' : 'Resend code'}
            </button>
            <Link href="/auth/forgot-password" className="text-muted-text hover:underline">
              Change email
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
