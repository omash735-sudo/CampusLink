// components/admin/SpotlightForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface SpotlightFormData {
  id?: string;
  studentName: string;
  programme: string;
  year: number;
  bio: string;
  graphicUrl: string;
  tags: string[];
  achievement: string;
  isPublished: boolean;
  sortOrder: number;
}

interface Props {
  initialData?: SpotlightFormData;
  mode: 'create' | 'edit';
}

export function SpotlightForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState<SpotlightFormData>(
    initialData || {
      studentName: '',
      programme: '',
      year: 1,
      bio: '',
      graphicUrl: '',
      tags: [],
      achievement: '',
      isPublished: false,
      sortOrder: 0,
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const MAX_BYTES = 4 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        throw new Error(
          `Graphic is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use a graphic under 4MB.`
        );
      }

      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'spotlights');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        if (res.status === 413) {
          throw new Error('Graphic is too large. Please use a graphic under 4MB.');
        }
        throw new Error(`Upload failed (${res.status}).`);
      }

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setForm((prev) => ({ ...prev, graphicUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (form.tags.includes(t)) {
      setTagInput('');
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        studentName: form.studentName.trim(),
        programme: form.programme.trim() || null,
        year: Number(form.year) || null,
        bio: form.bio.trim(),
        graphicUrl: form.graphicUrl.trim() || null,
        tags: form.tags,
        achievement: form.achievement.trim() || null,
        isPublished: form.isPublished,
        sortOrder: Number(form.sortOrder) || 0,
      };

      const url =
        mode === 'create'
          ? '/api/admin/spotlights'
          : `/api/admin/spotlights/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/spotlights');
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
        <h2 className="text-lg font-semibold">Student Details</h2>

        <div>
          <label className="label-text">Full Name *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.studentName}
            onChange={(e) => setForm({ ...form, studentName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Programme</label>
            <input
              type="text"
              className="input-field"
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
              placeholder="e.g. BSc Agricultural Economics"
            />
          </div>
          <div>
            <label className="label-text">Year</label>
            <select
              className="input-field"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 1 })}
            >
              <option value={1}>Year 1</option>
              <option value={2}>Year 2</option>
              <option value={3}>Year 3</option>
              <option value={4}>Year 4</option>
              <option value={5}>Year 5</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-text">Bio *</label>
          <textarea
            rows={4}
            required
            maxLength={600}
            className="input-field"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Short introduction — who they are, what they do, what makes them stand out."
          />
          <p className="text-xs text-muted-text mt-1">
            {form.bio.length} / 600 characters
          </p>
        </div>

        <div>
          <label className="label-text">Achievement (optional)</label>
          <input
            type="text"
            className="input-field"
            value={form.achievement}
            onChange={(e) => setForm({ ...form, achievement: e.target.value })}
            placeholder="e.g. Winner — National Debate Championship 2026"
          />
        </div>

        <div>
          <label className="label-text">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input-field flex-1"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="e.g. Leadership, Sports, Academic Excellence"
            />
            <button
              type="button"
              onClick={addTag}
              className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-primary-green/10 text-primary-green text-xs px-3 py-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-deep-green"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Graphic</h2>
        <p className="text-xs text-muted-text">
          Upload the spotlight graphic. Recommended: portrait poster, around
          600 × 800 pixels. JPG or PNG, under 4MB.
        </p>

        {form.graphicUrl && (
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.graphicUrl}
              alt="Preview"
              className="w-40 border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, graphicUrl: '' })}
              className="text-sm text-red-600 hover:underline"
            >
              Remove graphic
            </button>
          </div>
        )}

        <div>
          <label className="label-text">
            {form.graphicUrl ? 'Replace Graphic' : 'Upload Graphic'}
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
        </div>

        <div>
          <label className="label-text">Or paste a graphic URL</label>
          <input
            type="url"
            className="input-field"
            value={form.graphicUrl}
            onChange={(e) => setForm({ ...form, graphicUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Publishing</h2>

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
            Lower numbers appear first on the public page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="isPublished" className="text-sm">
            Publish this spotlight on the public page
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
            ? 'Create Spotlight'
            : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/spotlights')}
          className="border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
