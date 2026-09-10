// app/super-access/SuperAccessForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAccessForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/super-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid super access password');

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-primary-text block mb-1">
          Super Access Password
        </label>
        <input
          type="password"
          required
          autoFocus
          className="w-full border border-gray-300 bg-white px-4 py-3 text-primary-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-green text-white font-medium hover:bg-deep-green transition-colors px-6 py-3 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Activate Super Access'}
      </button>

      <p className="text-xs text-muted-text text-center">
        Session expires after 1 hour. You must be logged in as an admin.
      </p>
    </form>
  );
}
