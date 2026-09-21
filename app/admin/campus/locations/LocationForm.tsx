// app/admin/campus/locations/LocationForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'academic',
  'administration',
  'dining',
  'facility',
  'hostel',
  'library',
  'sports',
  'other',
];

export interface LocationFormData {
  id?: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  address: string;
  openingHours: string;
  contactInfo: string;
  accessibilityInfo: string;
  imageUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function LocationForm({ initial }: { initial?: LocationFormData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<LocationFormData>(
    initial || {
      name: '',
      slug: '',
      category: 'facility',
      shortDescription: '',
      description: '',
      address: '',
      openingHours: '',
      contactInfo: '',
      accessibilityInfo: '',
      imageUrl: '',
      isFeatured: false,
      isPublished: false,
      sortOrder: 0,
    }
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugTouched ? f.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit
        ? `/api/admin/campus/locations/${initial!.id}`
        : '/api/admin/campus/locations';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/campus/locations');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Identity */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Identity</h2>

        <div>
          <label className="label-text">Name *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Main Library"
          />
        </div>

        <div>
          <label className="label-text">Slug</label>
          <input
            type="text"
            className="input-field font-mono text-sm"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm({ ...form, slug: e.target.value });
            }}
            placeholder="main-library"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL will be{' '}
            <code className="bg-gray-100 px-1">
              /campus/locations/{form.slug || 'auto-generated'}
            </code>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Category *</label>
            <select
              required
              className="input-field capitalize"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
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
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Content</h2>

        <div>
          <label className="label-text">Short description</label>
          <input
            type="text"
            className="input-field"
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            placeholder="One-line summary shown on cards"
            maxLength={200}
          />
        </div>

        <div>
          <label className="label-text">Full description</label>
          <textarea
            rows={4}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Longer description shown on the location page"
          />
        </div>

        <div>
          <label className="label-text">Image URL</label>
          <input
            type="text"
            className="input-field"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
          />
          {form.imageUrl && (
            <div className="mt-3 w-full max-w-sm h-40 bg-gray-100 border border-gray-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Details (optional)</h2>

        <div>
          <label className="label-text">Address</label>
          <input
            type="text"
            className="input-field"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. Corner of Main Street"
          />
        </div>

        <div>
          <label className="label-text">Opening hours</label>
          <input
            type="text"
            className="input-field"
            value={form.openingHours}
            onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
            placeholder="e.g. Mon–Fri, 8am–5pm"
          />
        </div>

        <div>
          <label className="label-text">Contact info</label>
          <input
            type="text"
            className="input-field"
            value={form.contactInfo}
            onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
            placeholder="Phone, email, or extension"
          />
        </div>

        <div>
          <label className="label-text">Accessibility info</label>
          <input
            type="text"
            className="input-field"
            value={form.accessibilityInfo}
            onChange={(e) =>
              setForm({ ...form, accessibilityInfo: e.target.value })
            }
            placeholder="Wheelchair access, elevator, etc."
          />
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
              Show on the public Campus pages. Uncheck to keep as a draft.
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="w-4 h-4"
          />
          <div>
            <p className="text-sm font-medium">Featured</p>
            <p className="text-xs text-gray-500">
              Appears in the &quot;Featured Locations&quot; section on the main
              Campus page.
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
          disabled={saving}
          className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Location'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/campus/locations')}
          className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
