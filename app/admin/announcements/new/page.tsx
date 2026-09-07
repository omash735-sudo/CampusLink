// app/admin/announcements/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Academic',
    priority: 'normal',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create announcement');

      router.push('/admin/announcements');
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
        <Link href="/admin/announcements" className="text-primary-green hover:underline text-sm">
          ← Back to Announcements
        </Link>
        <h1 className="text-2xl font-bold">Add Announcement</h1>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Title *</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Library Extended Hours"
            />
          </div>

          <div>
            <label className="label-text">Content *</label>
            <textarea
              rows={5}
              required
              className="input-field"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Announcement content..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Academic">Academic</option>
                <option value="Student Life">Student Life</option>
                <option value="Administrative">Administrative</option>
                <option value="Events">Events</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-text">Priority</label>
              <select
                className="input-field"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
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
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
            <Link
              href="/admin/announcements"
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
