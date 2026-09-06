// app/mentors/become/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

export default function BecomeMentorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    expertise: '',
    subjects: '',
    introduction: '',
    experience: '',
    mentorType: 'Student',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/mentors/become', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
          subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push('/mentors');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to apply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Become a Mentor</h1>
        <p className="text-muted-text mb-8">
          Share your experience and help other students succeed.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Mentor Type</label>
              <select
                className="input-field"
                value={form.mentorType}
                onChange={(e) => setForm({ ...form, mentorType: e.target.value })}
                required
              >
                <option value="Student">Student Mentor</option>
                <option value="Alumni">Alumni Mentor</option>
                <option value="Professional">Professional Mentor</option>
              </select>
            </div>

            <div>
              <label className="label-text">Areas of Expertise</label>
              <input
                type="text"
                className="input-field"
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                placeholder="e.g. Career Development, Entrepreneurship, Academic Support"
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
                placeholder="e.g. Agricultural Economics, Research Methods, CV Writing"
              />
              <p className="text-xs text-muted-text mt-1">Separate multiple subjects with commas</p>
            </div>

            <div>
              <label className="label-text">Introduction</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.introduction}
                onChange={(e) => setForm({ ...form, introduction: e.target.value })}
                placeholder="Tell students about yourself and why you want to mentor..."
                required
              />
            </div>

            <div>
              <label className="label-text">Experience</label>
              <textarea
                rows={3}
                className="input-field"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                placeholder="Share your relevant experience..."
              />
            </div>

            <button
              type="submit"
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Apply to Become a Mentor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
