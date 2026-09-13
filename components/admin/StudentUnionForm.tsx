// components/admin/StudentUnionForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface StudentUnionMemberFormData {
  id?: string;
  fullName: string;
  position: string;
  description: string;
  photoUrl: string;
  email: string;
  whatsapp: string;
  academicYear: string;
  sortOrder: number;
  isActive: boolean;
}

interface Props {
  initialData?: StudentUnionMemberFormData;
  mode: 'create' | 'edit';
}

export function StudentUnionForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<StudentUnionMemberFormData>(
    initialData || {
      fullName: '',
      position: '',
      description: '',
      photoUrl: '',
      email: '',
      whatsapp: '',
      academicYear: '2026/2027',
      sortOrder: 0,
      isActive: true,
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setForm((prev) => ({ ...prev, photoUrl: data.url }));
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
      const payload = {
        fullName: form.fullName.trim(),
        position: form.position.trim(),
        description: form.description.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
        email: form.email.trim() || null,
        whatsapp: form.whatsapp.trim().replace(/[^0-9]/g, '') || null,
        academicYear: form.academicYear.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      const url =
        mode === 'create'
          ? '/api/admin/student-union'
          : `/api/admin/student-union/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/student-union');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Member Details</h2>

        <div>
          <label className="label-text">Full Name *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className="label-text">Position *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="President, Vice President, Secretary General..."
          />
        </div>

        <div>
          <label className="label-text">Short Description / Bio</label>
          <textarea
            rows={4}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="A short introduction (optional)"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Photo</h2>

        {form.photoUrl && (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.photoUrl}
              alt="Preview"
              className="h-24 w-24 object-cover border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, photoUrl: '' })}
              className="text-sm text-red-600 hover:underline"
            >
              Remove photo
            </button>
          </div>
        )}

        <div>
          <label className="label-text">
            {form.photoUrl ? 'Replace Photo' : 'Upload Photo'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="input-field"
          />
          {uploading && (
            <p className="text-xs text-muted-text mt-1">Uploading...</p>
          )}
          <p className="text-xs text-muted-text mt-1">
            Max 5MB. JPG, PNG, WebP.
          </p>
        </div>

        <div>
          <label className="label-text">Or paste an image URL</label>
          <input
            type="url"
            className="input-field"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Contact</h2>

        <div>
          <label className="label-text">Email</label>
          <input
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="president@example.com"
          />
        </div>

        <div>
          <label className="label-text">WhatsApp Number</label>
          <input
            type="tel"
            className="input-field"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="265991234567"
          />
          <p className="text-xs text-muted-text mt-1">
            International format, no + or spaces. Example: 265991234567
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Display</h2>

        <div>
          <label className="label-text">Academic Year *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            placeholder="2026/2027"
          />
        </div>

        <div>
          <label className="label-text">Display Order</label>
          <input
            type="number"
            className="input-field"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
            }
          />
          <p className="text-xs text-muted-text mt-1">
            Lower numbers appear first. President = 1, Vice President = 2, etc.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="text-sm">
            Show on the public page
          </label>
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
          {loading
            ? 'Saving...'
            : mode === 'create'
            ? 'Add Member'
            : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/student-union')}
          className="border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
