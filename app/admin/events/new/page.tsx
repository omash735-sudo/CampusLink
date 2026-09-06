// app/admin/events/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    category: 'social',
    organizer: '',
    status: 'published',
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

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'event');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.url;
        }
      }

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          location: form.location,
          startDate: form.startDate,
          endDate: form.endDate,
          category: form.category,
          organizer: form.organizer,
          image: imageUrl,
          status: form.status,
        }),
      });

      if (res.ok) {
        router.push('/admin/events');
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
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Description</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter event description"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Enter event location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">End Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="social">Social</option>
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="workshop">Workshop</option>
                  <option value="orientation">Orientation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Organizer</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  value={form.organizer}
                  onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                  placeholder="Event organizer"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Event Image</label>
              <div className="mt-1 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-primary-green transition-colors p-4 text-center flex-1"
                >
                  <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500">Click to upload image</span>
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

              {imagePreview && (
                <div className="mt-3 border border-gray-200 p-2">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="max-h-48 object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="border-2 border-primary-green text-primary-green px-6 py-2 font-medium hover:bg-primary-green hover:text-white transition-colors"
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
