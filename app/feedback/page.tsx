// app/feedback/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { value: 'general', label: 'General feedback' },
  { value: 'bug', label: 'Report a bug' },
  { value: 'feature', label: 'Suggest a feature' },
  { value: 'content', label: 'Content issue' },
  { value: 'other', label: 'Other' },
];

export default function FeedbackPage() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
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
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">
            Share Feedback
          </h1>
          <p className="text-muted-text mt-2">
            Help us improve CampusLink. Tell us what&apos;s working, what isn&apos;t,
            or what you&apos;d like to see next.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-green-300 p-8 text-center">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Thank you!
            </h2>
            <p className="text-muted-text mb-6">
              Your feedback has been received. We review every submission.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary-green hover:underline text-sm font-medium"
              >
                Send more feedback
              </button>
              <Link
                href="/"
                className="text-muted-text hover:underline text-sm"
              >
                Back to home
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 p-6 space-y-4"
          >
            <div>
              <label className="label-text">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">Your feedback</label>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                className="input-field"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us what's on your mind…"
              />
              <p className="text-xs text-muted-text mt-1">
                {content.length}/2000
              </p>
            </div>

            {error && (
              <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || content.length < 10}
              className="bg-primary-green text-white w-full py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Submit feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
