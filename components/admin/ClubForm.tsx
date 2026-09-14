// components/admin/ClubForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface ClubFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  email: string;
  whatsapp: string;
  instagramUrl: string;
  websiteUrl: string;
  meetingInfo: string;
  membershipInfo: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

interface Props {
  initialData?: ClubFormData;
  mode: 'create' | 'edit';
}

const CATEGORIES = [
  'Academic',
  'Sports',
  'Arts & Culture',
  'Technology',
  'Entrepreneurship',
  'Community Service',
  'Religious',
  'Political',
  'Social',
  'Other',
];

export function ClubForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ClubFormData>(
    initialData || {
      name: '',
      description: '',
      category: '',
      logoUrl: '',
      email: '',
      whatsapp: '',
      instagramUrl: '',
      websiteUrl: '',
      meetingInfo: '',
      membershipInfo: '',
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
    }
  );

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'clubs');

      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Upload failed (${res.status}).`);
      }

      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setForm((prev) => ({ ...prev, logoUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url =
        mode === 'create' ? '/api/admin/clubs' : `/api/admin/clubs/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/clubs');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Club Details</h2>

        <div>
          <label className="label-text">Club Name *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="label-text">Category</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text">Description *</label>
          <textarea
            rows={5}
            required
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Logo</h2>
        {form.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.logoUrl}
            alt="Logo"
            className="h-20 w-20 object-cover border border-gray-200"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          disabled={uploading}
          className="input-field"
        />
        {uploading && <p className="text-xs text-muted-text">Uploading...</p>}
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Contact & Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="tel"
            className="input-field"
            placeholder="WhatsApp (265991234567)"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
          <input
            type="url"
            className="input-field"
            placeholder="Instagram URL"
            value={form.instagramUrl}
            onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
          />
          <input
            type="url"
            className="input-field"
            placeholder="Website URL"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          />
        </div>
        <textarea
          rows={2}
          className="input-field"
          placeholder="Meeting info"
          value={form.meetingInfo}
          onChange={(e) => setForm({ ...form, meetingInfo: e.target.value })}
        />
        <textarea
          rows={2}
          className="input-field"
          placeholder="Membership info"
          value={form.membershipInfo}
          onChange={(e) => setForm({ ...form, membershipInfo: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Display</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="text-sm">
            Show on public page
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="isFeatured" className="text-sm">
            Feature on homepage
          </label>
        </div>
        <div>
          <label className="label-text">Sort Order</label>
          <input
            type="number"
            className="input-field"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
            }
          />
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
          disabled={loading || uploading}
          className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Club' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/clubs')}
          className="border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
