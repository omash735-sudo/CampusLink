// components/admin/ResourceForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Psychology',
  'Social Work',
  'Youth Development',
  'Sociology',
  'Research',
  'Academic Writing',
  'Study Skills',
  'General',
];

const RIGHTS_TYPES = [
  { value: 'campuslink_original', label: 'CampusLink Original' },
  { value: 'own_material', label: 'My Own Material' },
  { value: 'public_domain', label: 'Public Domain' },
  { value: 'licensed_redistribution', label: 'Licensed for Redistribution' },
  { value: 'permission_obtained', label: 'Permission Obtained' },
  { value: 'other', label: 'Other' },
];

export interface ResourceFormData {
  id?: string;
  resourceKind: 'document' | 'video' | 'article' | 'publication';
  title: string;
  description: string;
  category: string;
  subject: string;
  programmeId: string;
  year: number;
  author: string;
  source: string;
  publicationDate: string;
  coverImageUrl: string;
  body: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  showEmbeddedPlayer: boolean;
  showYoutubeButton: boolean;
  downloadable: boolean;
  previewable: boolean;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  rightsType: string;
  rightsConfirmed: boolean;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface Props {
  initialData?: Partial<ResourceFormData>;
  mode: 'create' | 'edit';
}

export function ResourceForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [agreeRights, setAgreeRights] = useState(initialData?.rightsConfirmed ?? false);

  const [form, setForm] = useState<ResourceFormData>({
    resourceKind: (initialData?.resourceKind as any) || 'document',
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    subject: initialData?.subject || '',
    programmeId: initialData?.programmeId || '',
    year: initialData?.year || 0,
    author: initialData?.author || '',
    source: initialData?.source || '',
    publicationDate: initialData?.publicationDate || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    body: initialData?.body || '',
    youtubeUrl: initialData?.youtubeUrl || '',
    youtubeVideoId: initialData?.youtubeVideoId || '',
    showEmbeddedPlayer: initialData?.showEmbeddedPlayer ?? true,
    showYoutubeButton: initialData?.showYoutubeButton ?? true,
    downloadable: initialData?.downloadable ?? true,
    previewable: initialData?.previewable ?? true,
    featured: initialData?.featured ?? false,
    status: (initialData?.status as any) || 'draft',
    rightsType: initialData?.rightsType || '',
    rightsConfirmed: initialData?.rightsConfirmed ?? false,
    fileUrl: initialData?.fileUrl || '',
    fileName: initialData?.fileName || '',
    fileType: initialData?.fileType || '',
    fileSize: initialData?.fileSize || 0,
  });

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'resources');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Upload failed (${res.status})`);
      }
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setForm((p) => ({
        ...p,
        fileUrl: data.url,
        fileName: data.filename || file.name,
        fileType: file.type,
        fileSize: file.size,
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'resource-covers');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setForm((p) => ({ ...p, coverImageUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveStatus?: 'draft' | 'published') => {
    e.preventDefault();
    setError('');

    if (form.resourceKind === 'document' && !form.fileUrl) {
      setError('Please upload a file');
      return;
    }
    if (form.resourceKind === 'video' && !form.youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }
    if (
      (form.resourceKind === 'article' || form.resourceKind === 'publication') &&
      form.body.trim().length < 50
    ) {
      setError('Body must be at least 50 characters');
      return;
    }
    if (form.resourceKind === 'document' && !agreeRights) {
      setError('You must confirm you have the right to distribute this material');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        resourceKind: form.resourceKind,
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category || null,
        subject: form.subject.trim() || null,
        programmeId: form.programmeId || null,
        year: form.year || null,
        author: form.author.trim() || null,
        source: form.source.trim() || null,
        publicationDate: form.publicationDate || null,
        coverImageUrl: form.coverImageUrl || null,
        featured: form.featured,
        status: saveStatus || form.status,
      };

      if (form.resourceKind === 'document') {
        Object.assign(payload, {
          fileUrl: form.fileUrl,
          fileName: form.fileName,
          fileType: form.fileType,
          fileSize: form.fileSize,
          downloadable: form.downloadable,
          previewable: form.previewable,
          rightsType: form.rightsType,
          rightsConfirmed: agreeRights,
        });
      } else if (form.resourceKind === 'video') {
        Object.assign(payload, {
          youtubeUrl: form.youtubeUrl,
          showEmbeddedPlayer: form.showEmbeddedPlayer,
          showYoutubeButton: form.showYoutubeButton,
        });
      } else {
        payload.body = form.body;
      }

      const url =
        mode === 'create'
          ? '/api/admin/resources'
          : `/api/admin/resources/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/resources');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Resource Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['document', 'video', 'article', 'publication'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setForm({ ...form, resourceKind: kind })}
              disabled={mode === 'edit'}
              className={`px-4 py-3 text-sm border transition-colors ${
                form.resourceKind === kind
                  ? 'bg-primary-green text-white border-primary-green'
                  : 'border-gray-200 hover:border-primary-green'
              } ${mode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {kind === 'document' && '📄 Document'}
              {kind === 'video' && '▶️ Video'}
              {kind === 'article' && '📝 Article'}
              {kind === 'publication' && '📰 Publication'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Details</h2>

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
          <label className="label-text">
            {form.resourceKind === 'video' ? 'About this video' : 'Description'}
          </label>
          <textarea
            rows={4}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {(form.resourceKind === 'article' || form.resourceKind === 'publication') && (
          <div>
            <label className="label-text">Body * (markdown supported)</label>
            <textarea
              rows={16}
              className="input-field font-mono text-xs"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="# Heading&#10;&#10;Your content here..."
            />
            <p className="text-xs text-muted-text mt-1">
              {form.body.length} characters
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Category</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Subject</label>
            <input
              type="text"
              className="input-field"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Research Methods"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Author / Creator</label>
            <input
              type="text"
              className="input-field"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">Source</label>
            <input
              type="text"
              className="input-field"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder={form.resourceKind === 'video' ? 'e.g. YouTube' : 'e.g. Academic publication'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-text">Programme</label>
            <input
              type="text"
              className="input-field"
              value={form.programmeId}
              onChange={(e) => setForm({ ...form, programmeId: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="label-text">Year</label>
            <select
              className="input-field"
              value={form.year || ''}
              onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })}
            >
              <option value="">—</option>
              {[1,2,3,4,5].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Publication Date</label>
            <input
              type="date"
              className="input-field"
              value={form.publicationDate}
              onChange={(e) => setForm({ ...form, publicationDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label-text">Cover Image (optional)</label>
          {form.coverImageUrl && (
            <div className="mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.coverImageUrl} alt="Cover" className="h-32 border border-gray-200" />
              <button
                type="button"
                onClick={() => setForm({ ...form, coverImageUrl: '' })}
                className="text-xs text-red-600 mt-1"
              >
                Remove
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            disabled={uploading}
            className="input-field"
          />
        </div>
      </div>

      {form.resourceKind === 'document' && (
        <>
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold">File Upload</h2>
            <p className="text-xs text-muted-text">
              Accepted: PDF, PPTX, DOCX. Max 20MB.
            </p>

            {form.fileUrl && (
              <div className="border border-gray-200 p-3 text-sm">
                <p className="font-medium">{form.fileName}</p>
                <p className="text-xs text-muted-text">
                  {form.fileType} · {(form.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>
            )}

            <input
              type="file"
              accept=".pdf,.pptx,.docx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleDocUpload}
              disabled={uploading}
              className="input-field"
            />
            {uploading && <p className="text-xs text-muted-text">Uploading...</p>}

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.downloadable}
                  onChange={(e) => setForm({ ...form, downloadable: e.target.checked })}
                />
                Downloadable
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.previewable}
                  onChange={(e) => setForm({ ...form, previewable: e.target.checked })}
                />
                Show preview where supported
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Content Rights</h2>
            <div>
              <label className="label-text">Rights Type *</label>
              <select
                className="input-field"
                value={form.rightsType}
                onChange={(e) => setForm({ ...form, rightsType: e.target.value })}
              >
                <option value="">Select rights type</option>
                {RIGHTS_TYPES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={agreeRights}
                onChange={(e) => setAgreeRights(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-sm">
                I confirm that I have the right or appropriate permission to
                upload and distribute this material through CampusLink.
              </span>
            </label>
          </div>
        </>
      )}

      {form.resourceKind === 'video' && (
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">YouTube Video</h2>
          <div>
            <label className="label-text">YouTube URL *</label>
            <input
              type="url"
              className="input-field"
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.showEmbeddedPlayer}
                onChange={(e) => setForm({ ...form, showEmbeddedPlayer: e.target.checked })}
              />
              Show embedded player
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.showYoutubeButton}
                onChange={(e) => setForm({ ...form, showYoutubeButton: e.target.checked })}
              />
              Show &quot;Watch on YouTube&quot; button
            </label>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Publishing</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm">
            Feature this resource (appears at the top of the library)
          </label>
        </div>
        <div>
          <label className="label-text">Status</label>
          <select
            className="input-field"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={(e) => handleSubmit(e as any, 'draft')}
          disabled={loading || uploading}
          className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e as any, 'published')}
          disabled={loading || uploading}
          className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Publish'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/resources')}
          className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
