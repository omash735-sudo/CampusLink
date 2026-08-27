// app/admin/announcements/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAnnouncement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/announcements');
      }
    } catch (error) {
      console.error('Failed to create:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">New Announcement</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Title</label>
              <input
                type="text"
                required
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text">Content</label>
              <textarea
                required
                rows={6}
                className="input-field"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Type</label>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="student_union">Student Union</option>
                </select>
              </div>

              <div>
                <label className="label-text">Priority</label>
                <select
                  className="input-field"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm">Publish immediately</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary px-6 py-2" disabled={loading}>
                {loading ? 'Creating...' : 'Create Announcement'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
