// components/admin/ImageUpload.tsx
'use client';

import { useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Cloudinary folder type — 'campus', 'clubs', 'events', etc. */
  uploadType?: string;
  helpText?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  uploadType = 'general',
  helpText,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', uploadType);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="label-text">{label}</label>

      <div className="flex flex-col sm:flex-row items-start gap-4 mt-1">
        {/* Preview */}
        <div className="w-28 h-28 bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center px-2">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-3 w-full">
          <div className="flex flex-wrap gap-2 items-center">
            <label
              className={`border border-gray-300 px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 inline-block ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Uploading…' : 'Choose File'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  // reset so the same file can be re-picked if removed
                  e.target.value = '';
                }}
              />
            </label>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                disabled={uploading}
                className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="h-px bg-gray-200 flex-1" />
            <span>or paste a URL</span>
            <span className="h-px bg-gray-200 flex-1" />
          </div>

          <input
            type="text"
            className="input-field"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />

          {helpText && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
