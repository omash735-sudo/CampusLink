// app/admin/campus/gallery/GalleryForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';

const CATEGORIES = [
  'buildings',
  'campus-life',
  'events',
  'nature',
  'sports',
  'students',
  'other',
];

export interface GalleryFormData {
  id?: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  locationId: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface LocationOption {
  id: string;
  name: string;
}

export function GalleryForm({
  initial,
  locations,
}: {
  initial?: GalleryFormData;
  locations: LocationOption[];
}) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<GalleryFormData>(
    initial || {
      title: '',
      imageUrl: '',
      category: '',
      description: '',
      locationId: '',
      isPublished: false,
      sortOrder: 0,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!form.imageUrl) {
      setError('Please upload or paste an image URL.');
      setSaving(false);
      return;
    }

    try {
      const url = isEdit
        ? `/api/admin/campus/gallery/${initial!.id}`
        : '/api/admin/campus/gallery';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          locationId: form.locationId || null,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/campus/gallery');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image — the most important thing */}
      <div className="bg-white border border-gray-200 p-6">
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          label="Image *"
          uploadType="campus"
          helpText="JPG, PNG, or WebP. Max 5MB."
        />
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Details</h2>

        <div>
          <label className="label-text">Title</label>
          <input
            type="text"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Optional caption"
            maxLength={150}
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
              <option value="">None</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Sort order</label>
            <input
              type="number"
              className="input-field"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea
            rows={2}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional. Shown on hover or in some views."
          />
        </div>

        <div>
          <label className="label-text">Associated location</label>
          <select
            className="input-field"
            value={form.locationId}
            onChange={(e) => setForm({ ...form, locationId: e.target.value })}
          >
            <option value="">None (standalone)</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            If set, this image also appears in the Gallery section of that
            location&apos;s public page.
          </p>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white border border-gray-200 p-6 space-y-3">
        <h2 className="font-semibold">Visibility</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="w-4 h-4"
          />
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-xs text-gray-500">
              Show on the public Campus Gallery page.
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || !form.imageUrl}
          className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Image'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/campus/gallery')}
          className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
