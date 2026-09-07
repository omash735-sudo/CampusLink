// app/admin/resources/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    course: '',
    programme: '',
    year: '',
    fileUrl: '',
    fileName: '',
    fileType: '',
    fileSize: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year) || null,
          fileSize: parseInt(form.fileSize) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create resource');

      router.push('/admin/resources');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/resources" className="text-primary-green hover:underline text-sm">
          ← Back to Resources
        </Link>
        <h1 className="text-2xl font-bold">Add Resource</h1>
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
              placeholder="e.g. Introduction to Research Methods"
            />
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the resource..."
            />
          </div>

          <div>
            <label className="label-text">Course</label>
            <input
              type="text"
              className="input-field"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              placeholder="e.g. Research Methods"
            />
          </div>

          <div>
            <label className="label-text">Programme</label>
            <input
              type="text"
              className="input-field"
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
              placeholder="e.g. Social Work"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Year</label>
              <select
                className="input-field"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              >
                <option value="">Select year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
            <div>
              <label className="label-text">File Type</label>
              <select
                className="input-field"
                value={form.fileType}
                onChange={(e) => setForm({ ...form, fileType: e.target.value })}
              >
                <option value="">Select file type</option>
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="ppt">PPT</option>
                <option value="pptx">PPTX</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="txt">TXT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">File URL</label>
            <input
              type="url"
              className="input-field"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="https://example.com/file.pdf"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">File Name</label>
              <input
                type="text"
                className="input-field"
                value={form.fileName}
                onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="research_methods.pdf"
              />
            </div>
            <div>
              <label className="label-text">File Size (KB)</label>
              <input
                type="number"
                className="input-field"
                value={form.fileSize}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                placeholder="2450"
              />
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
              disabled={loading}
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Resource'}
            </button>
            <Link
              href="/admin/resources"
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
