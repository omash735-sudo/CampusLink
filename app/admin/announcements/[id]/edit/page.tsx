// app/admin/announcements/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Academic',
    priority: 'normal',
    isPublished: false,
  });

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    try {
      const res = await fetch(`/api/admin/announcements/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          title: data.title || '',
          content: data.content || '',
          category: data.category || 'Academic',
          priority: data.priority || 'normal',
          isPublished: data.isPublished || false,
        });
      }
    } catch (error) {
      console.error('Failed to load announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/announcements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      router.push('/admin/announcements');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/announcements" className="text-primary-green hover:underline text-sm">
          ← Back to Announcements
        </Link>
        <h1 className="text-2xl font-bold">Edit Announcement</h1>
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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isPublished" className="text-sm">Published</label>
          </div>

          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
