// app/auth/reset-password/page.tsx
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');

      router.push('/auth/login?reset=success');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold mb-4">Missing reset token</h1>
          <p className="text-muted-text mb-6">
            Please start the password reset process again.
          </p>
          <Link href="/auth/forgot-password" className="text-primary-green hover:underline font-medium">
            Start over
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-muted-text mt-2">
            Choose a strong password you haven&apos;t used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
            <p className="text-xs text-muted-text mt-1">
              Must contain an uppercase letter, a lowercase letter, and a number.
            </p>
          </div>

          <div>
            <label className="label-text">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-text">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show password
          </label>

          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-primary-green text-white w-full py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
