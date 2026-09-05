// app/admin/announcements/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAnnouncement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    isPublished: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'announcement');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.url;
        }
      }

      // Create announcement with image
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          imageUrl,
        }),
      });

      if (res.ok) {
        router.push('/admin/announcements');
      } else {
        const error = await res.json();
        console.error('Failed to create:', error);
      }
    } catch (error) {
      console.error('Failed to create:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">New Announcement</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Title</label>
              <input
                type="text"
                required
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="label-text">Content</label>
              <textarea
                required
                rows={6}
                className="input-field"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Enter announcement content..."
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="label-text">Poster / Image</label>
              <div className="mt-1 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-primary-green transition-colors p-4 rounded text-center flex-1"
                >
                  <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500">Click to upload poster</span>
                  <span className="text-xs text-gray-400 block">PNG, JPG, WebP up to 5MB</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imageFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 border border-gray-200 p-2">
                  <img
                    src={imagePreview}
                    alt="Announcement poster preview"
                    className="max-h-48 object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Type</label>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="student_union">Student Union</option>
                </select>
              </div>

              <div>
                <label className="label-text">Priority</label>
                <select
                  className="input-field"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm">Publish immediately</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary px-6 py-2" disabled={loading}>
                {loading ? 'Creating...' : 'Create Announcement'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
