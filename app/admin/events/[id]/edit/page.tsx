// app/admin/events/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    organizer: '',
    category: '',
    maxAttendees: '',
    status: 'draft',
  });

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const res = await fetch(`/api/admin/events/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          title: data.title || '',
          description: data.description || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          location: data.location || '',
          organizer: data.organizer || '',
          category: data.category || '',
          maxAttendees: data.maxAttendees || '',
          status: data.status || 'draft',
        });
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/events`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          ...form,
          maxAttendees: parseInt(form.maxAttendees) || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      router.push('/admin/events');
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
        <Link href="/admin/events" className="text-primary-green hover:underline text-sm">
          ← Back to Events
        </Link>
        <h1 className="text-2xl font-bold">Edit Event</h1>
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
            <label className="label-text">Description</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Date *</label>
              <input
                type="date"
                required
                className="input-field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Start Time *</label>
              <input
                type="time"
                required
                className="input-field"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">End Time</label>
              <input
                type="time"
                className="input-field"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Max Attendees</label>
              <input
                type="number"
                className="input-field"
                value={form.maxAttendees}
                onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label-text">Location *</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Organizer</label>
              <input
                type="text"
                className="input-field"
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="Orientation">Orientation</option>
                <option value="Academic">Academic</option>
                <option value="Career">Career</option>
                <option value="Social">Social</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">Status</label>
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
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
              href="/admin/events"
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
