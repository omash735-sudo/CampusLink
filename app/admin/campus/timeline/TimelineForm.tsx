// app/admin/campus/timeline/TimelineForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';

export interface TimelineFormData {
  id?: string;
  year: number;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  isPublished: boolean;
  sortOrder: number;
}

export function TimelineForm({ initial }: { initial?: TimelineFormData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<TimelineFormData>(
    initial || {
      year: new Date().getFullYear(),
      title: '',
      description: '',
      imageUrl: '',
      source: '',
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

    try {
      const url = isEdit
        ? `/api/admin/campus/timeline/${initial!.id}`
        : '/api/admin/campus/timeline';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/campus/timeline');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Core */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Entry</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-text">Year *</label>
            <input
              type="number"
              required
              min={1800}
              max={2200}
              className="input-field"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: parseInt(e.target.value) || 0 })
              }
              placeholder="1995"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-text">Title *</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Founding of City Campus"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea
            rows={4}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What happened and why it mattered..."
          />
        </div>

        <div>
          <label className="label-text">Source</label>
          <input
            type="text"
            className="input-field"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="e.g. University Archives"
          />
        </div>
      </div>

      {/* Image */}
      <div className="bg-white border border-gray-200 p-6">
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          label="Historical image"
          uploadType="campus"
          helpText="Optional. JPG, PNG, or WebP, max 5MB."
        />
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
              Show on the public Campus History page.
            </p>
          </div>
        </label>

        <div>
          <label className="label-text">Sort order</label>
          <input
            type="number"
            className="input-field max-w-xs"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first. Timeline also sorts by year desc.
          </p>
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
          disabled={saving}
          className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Entry'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/campus/timeline')}
          className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
