// app/mentors/become-a-mentor/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BecomeMentorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    expertise: '',
    subjects: '',
    mentorType: 'Student',
    availability: 'available',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mentors/become', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise.split(',').map((s: string) => s.trim()).filter(Boolean),
          subjects: form.subjects.split(',').map((s: string) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply');

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
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-text mb-4">
            Your mentor application has been submitted and is pending review.
            You'll receive a notification once it's approved.
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
        <Link href="/mentors" className="text-primary-green hover:underline text-sm">
          ← Back to Mentors
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-2">Become a Mentor</h1>
        <p className="text-muted-text mb-8">Share your knowledge and experience with fellow students.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">About You</label>
              <textarea
                rows={3}
                className="input-field"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell students about yourself and why you want to mentor..."
                required
              />
            </div>

            <div>
              <label className="label-text">Areas of Expertise</label>
              <input
                type="text"
                className="input-field"
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                placeholder="e.g. Academic Support, Career Guidance, Research"
                required
              />
              <p className="text-xs text-muted-text mt-1">Separate multiple areas with commas</p>
            </div>

            <div>
              <label className="label-text">Subjects You Can Help With</label>
              <input
                type="text"
                className="input-field"
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                placeholder="e.g. Research Methods, Social Work Practice, Statistics"
              />
              <p className="text-xs text-muted-text mt-1">Separate multiple subjects with commas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Mentor Type</label>
                <select
                  className="input-field"
                  value={form.mentorType}
                  onChange={(e) => setForm({ ...form, mentorType: e.target.value })}
                >
                  <option value="Student">Student Mentor</option>
                  <option value="Alumni">Alumni Mentor</option>
                  <option value="Professional">Professional Mentor</option>
                </select>
              </div>

              <div>
                <label className="label-text">Availability</label>
                <select
                  className="input-field"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited Availability</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors w-full disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
