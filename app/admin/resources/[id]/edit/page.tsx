// app/admin/resources/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    status: 'pending',
  });

  useEffect(() => {
    loadResource();
  }, []);

  const loadResource = async () => {
    try {
      const res = await fetch(`/api/admin/resources/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          title: data.title || '',
          description: data.description || '',
          course: data.course || '',
          programme: data.programme || '',
          year: data.year || '',
          fileUrl: data.fileUrl || '',
          fileName: data.fileName || '',
          fileType: data.fileType || '',
          fileSize: data.fileSize || '',
          status: data.status || 'pending',
        });
      }
    } catch (error) {
      console.error('Failed to load resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/resources`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          ...form,
          year: parseInt(form.year) || null,
          fileSize: parseInt(form.fileSize) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      router.push('/admin/resources');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/resources" className="text-primary-green hover:underline text-sm">
          ← Back to Resources
        </Link>
        <h1 className="text-2xl font-bold">Edit Resource</h1>
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
            <label className="label-text">Description</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label-text">Course</label>
            <input
              type="text"
              className="input-field"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
            />
          </div>

          <div>
            <label className="label-text">Programme</label>
            <input
              type="text"
              className="input-field"
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
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
            <label className="label-text">Status</label>
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
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
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
