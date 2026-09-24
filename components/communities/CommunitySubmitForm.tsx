// components/communities/CommunitySubmitForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CommunitySubmitForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    whatsappLink: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/communities/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="border border-green-300 bg-green-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Submission received
        </h2>
        <p className="text-sm text-green-800 mb-4">
          Your community is now pending review. You'll receive an email once
          an administrator has reviewed it.
        </p>
        <button
          onClick={() => router.push('/connect/communities')}
          className="text-primary-green hover:underline text-sm font-medium"
        >
          Back to Communities →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-text">Community name *</label>
        <input
          type="text"
          required
          maxLength={120}
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. BSc Agriculture Year 2"
        />
      </div>

      <div>
        <label className="label-text">Description *</label>
        <textarea
          rows={4}
          required
          minLength={10}
          maxLength={1000}
          className="input-field"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What is this community for? Who should join?"
        />
      </div>

      <div>
        <label className="label-text">Category</label>
        <input
          type="text"
          maxLength={60}
          className="input-field"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="e.g. Academic, Sports, Faith, Social"
        />
      </div>

      <div>
        <label className="label-text">WhatsApp invite link *</label>
        <input
          type="url"
          required
          className="input-field"
          value={form.whatsappLink}
          onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
          placeholder="https://chat.whatsapp.com/..."
        />
        <p className="text-xs text-muted-text mt-1">
          Must be a WhatsApp group invite link. Admins will review before it
          goes live.
        </p>
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
          {saving ? 'Submitting…' : 'Submit for review'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/connect/communities')}
          className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
