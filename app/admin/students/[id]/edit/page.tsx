// app/admin/students/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    programme: '',
    year: '',
    bio: '',
    role: 'student',
    isActive: true,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          fullName: data.fullName || '',
          username: data.username || '',
          email: data.email || '',
          programme: data.programme || '',
          year: data.year || '',
          bio: data.bio || '',
          role: data.role || 'student',
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, ...form, year: parseInt(form.year) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      router.push(`/admin/students/${params.id}`);
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
        <Link href={`/admin/students/${params.id}`} className="text-primary-green hover:underline text-sm">
          ← Back to Student
        </Link>
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
            />
          </div>

          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="label-text">Programme</label>
            <input
              type="text"
              className="input-field"
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
            />
          </div>

          <div>
            <label className="label-text">Year</label>
            <select
              className="input-field"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          <div>
            <label className="label-text">Bio</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="label-text">Role</label>
            <select
              className="input-field"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm">Active</label>
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
              href={`/admin/students/${params.id}`}
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
