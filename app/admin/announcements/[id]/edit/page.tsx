// app/admin/announcements/[id]/edit/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ANNOUNCEMENT_TYPES } from '@/lib/announcement-types';

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    isPublished: false,
    imageUrl: '',
  });

  // Local preview while a replacement poster is selected but not yet uploaded.
  const localPreviewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  // Revoke the object URL when the file changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  // What to show in the preview: local (unsaved) file, else the saved URL.
  const previewUrl = localPreviewUrl || form.imageUrl || null;

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    try {
      const res = await fetch(`/api/admin/announcements/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          title: data.title || '',
          content: data.content || '',
          type: data.type || 'general',
          priority: data.priority || 'normal',
          isPublished: data.isPublished || false,
          imageUrl: data.imageUrl || '',
        });
      }
    } catch (error) {
      console.error('Failed to load announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let imageUrl = form.imageUrl;

      // Only upload if a new file was actually selected.
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'announcements');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const res = await fetch(`/api/admin/announcements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          title: form.title,
          content: form.content,
          type: form.type,
          priority: form.priority,
          isPublished: form.isPublished,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      router.push('/admin/announcements');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/announcements" className="text-primary-green hover:underline text-sm">
          ← Back to Announcements
        </Link>
        <h1 className="text-2xl font-bold">Edit Announcement</h1>
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
            <label className="label-text">Content *</label>
            <textarea
              rows={5}
              required
              className="input-field"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <div>
            <label className="label-text">Announcement Poster</label>
            <p className="text-xs text-muted-text mb-2">
              Optional. If you upload a poster containing the announcement
              details, it will be displayed in full at the top of the post.
              Any dimensions work.
            </p>

            {previewUrl && (
              <div className="mb-3 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Announcement poster preview"
                  className="w-full max-w-md h-auto border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-sm text-red-600 hover:underline flex-shrink-0"
                >
                  Remove poster
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
            {imageFile && (
              <p className="text-sm text-muted-text mt-1">
                New file selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                {' '}— will replace the current poster on save.
              </p>
            )}
            {uploading && (
              <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Type</label>
              <select
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Priority</label>
              <select
                className="input-field"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isPublished" className="text-sm">Published</label>
          </div>

          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/announcements"
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
