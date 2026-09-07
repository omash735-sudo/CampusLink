// app/mentors/[username]/request/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RequestMentorshipPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    message: '',
    helpNeeded: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mentors/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorUsername: params.username,
          message: form.message,
          helpNeeded: form.helpNeeded.split(',').map((s: string) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send request');

      setSuccess(true);
      setTimeout(() => {
        router.push('/student/dashboard');
        router.refresh();
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 p-8 max-w-md text-center">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4 flex items-center justify-center text-2xl">✓</div>
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-muted-text mb-4">
            Your mentorship request has been sent. The mentor will review it and get back to you.
          </p>
          <Link href="/student/dashboard" className="text-primary-green hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href={`/mentors/${params.username}`} className="text-primary-green hover:underline text-sm">
          ← Back to Mentor Profile
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-2">Request Mentorship</h1>
        <p className="text-muted-text mb-8">Send a request to connect with this mentor.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Message</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Introduce yourself and explain why you're reaching out..."
                required
              />
            </div>

            <div>
              <label className="label-text">What do you need help with?</label>
              <input
                type="text"
                className="input-field"
                value={form.helpNeeded}
                onChange={(e) => setForm({ ...form, helpNeeded: e.target.value })}
                placeholder="e.g. Academic Guidance, Career Planning, Research Support"
              />
              <p className="text-xs text-muted-text mt-1">Separate multiple topics with commas</p>
            </div>

            {error && (
              <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
              <Link
                href={`/mentors/${params.username}`}
                className="border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
