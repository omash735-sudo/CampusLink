// app/admin/programmes/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProgrammePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    code: '',
    faculty: '',
    degree: '',
    duration: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/admin/programmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug,
          duration: parseInt(form.duration) || 4,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create programme');

      router.push('/admin/programmes');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/programmes" className="text-primary-green hover:underline text-sm">
          ← Back to Programmes
        </Link>
        <h1 className="text-2xl font-bold">Add Programme</h1>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Programme Name *</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Bachelor of Social Work"
            />
          </div>

          <div>
            <label className="label-text">Programme Code</label>
            <input
              type="text"
              className="input-field"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. BSW"
            />
          </div>

          <div>
            <label className="label-text">Faculty</label>
            <input
              type="text"
              className="input-field"
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              placeholder="e.g. Social Sciences"
            />
          </div>

          <div>
            <label className="label-text">Degree Type</label>
            <select
              className="input-field"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
            >
              <option value="">Select degree</option>
              <option value="Bachelor of Science">Bachelor of Science</option>
              <option value="Bachelor of Arts">Bachelor of Arts</option>
              <option value="Master of Science">Master of Science</option>
              <option value="Master of Arts">Master of Arts</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div>
            <label className="label-text">Duration (years)</label>
            <input
              type="number"
              className="input-field"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="4"
            />
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Programme description..."
            />
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
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Programme'}
            </button>
            <Link
              href="/admin/programmes"
              className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
