// app/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    bio: '',
    programme: '',
    year: '',
    interests: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setForm({
          fullName: data.user.fullName || '',
          username: data.user.username || '',
          bio: data.user.bio || '',
          programme: data.user.programme || '',
          year: data.user.year || '',
          interests: data.user.interests?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year) || null,
          interests: form.interests.split(',').map((s: string) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="bg-white border border-gray-200 p-6 mt-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="text-primary-green hover:underline text-sm">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
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
              <label className="label-text">Bio</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell other students about yourself..."
              />
            </div>

            <div>
              <label className="label-text">Programme</label>
              <input
                type="text"
                className="input-field"
                value={form.programme}
                onChange={(e) => setForm({ ...form, programme: e.target.value })}
                placeholder="e.g. Social Work & Youth Development"
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
              <label className="label-text">Interests</label>
              <input
                type="text"
                className="input-field"
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="e.g. Technology, Research, Sports"
              />
              <p className="text-xs text-muted-text mt-1">Separate multiple interests with commas</p>
            </div>

            {error && (
              <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-green-400 bg-green-50 p-3 text-sm text-green-700">
                Profile updated successfully! Redirecting...
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
                href="/profile"
                className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
