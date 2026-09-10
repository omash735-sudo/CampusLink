// app/admin/setup/SetupForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
    confirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          fullName: form.fullName,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Setup failed');

      router.push('/auth/login?setup=success');
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
          Full Name
        </label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 text-primary-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-primary-text block mb-1">
          Username
        </label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 text-primary-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-primary-text block mb-1">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 text-primary-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-primary-text block mb-1">
          Password
        </label>
        <input
          type="password"
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 text-primary-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <p className="text-xs text-muted-text mt-1">
          At least 10 characters, with uppercase, lowercase and a number.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-primary-text block mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 text-primary-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
        {loading ? 'Creating admin...' : 'Create Admin Account'}
      </button>
    </form>
  );
}
