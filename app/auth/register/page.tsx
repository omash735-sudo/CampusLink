// app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    programme: '',
    year: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/student/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Join CampusLink</h1>
          <p className="text-muted-text mt-2">Create your account and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="label-text">Username</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="john.doe"
            />
          </div>

          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="label-text">Programme</label>
            <select
              className="input-field"
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
              required
            >
              <option value="">Select your programme</option>
              <option value="BSc Agricultural Economics">BSc Agricultural Economics</option>
              <option value="BSc Animal Science">BSc Animal Science</option>
              <option value="BSc Food Science & Technology">BSc Food Science & Technology</option>
              <option value="BSc Social Work & Youth Development">BSc Social Work & Youth Development</option>
              <option value="BSc Environmental Science">BSc Environmental Science</option>
              <option value="BSc Engineering">BSc Engineering</option>
            </select>
          </div>

          <div>
            <label className="label-text">Year of Study</label>
            <select
              className="input-field"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
            >
              <option value="">Select your year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted-text">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-green hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
