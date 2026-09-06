// app/resources/upload/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

export default function UploadResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Lecture Notes',
    course: '',
    programmeId: '',
    year: '',
    semester: '',
    academicYear: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'resource');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let fileUrl = '';
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        fileUrl = data.url;
      }

      // Create resource
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          year: parseInt(form.year),
        }),
      });

      if (res.ok) {
        router.push('/resources');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Upload Resource</h1>
        <p className="text-muted-text mb-8">
          Share academic resources with the CampusLink community.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Resource Title *</label>
              <input
                type="text"
                required
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Introduction to Agricultural Economics"
              />
            </div>

            <div>
              <label className="label-text">Description</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the resource..."
              />
            </div>

            <div>
              <label className="label-text">Resource Type *</label>
              <select
                required
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Past Paper">Past Paper</option>
                <option value="Study Guide">Study Guide</option>
                <option value="Handout">Handout</option>
                <option value="Course Outline">Course Outline</option>
                <option value="Research">Research</option>
                <option value="Assignment">Assignment</option>
                <option value="Textbook">Textbook</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label-text">Course</label>
              <input
                type="text"
                className="input-field"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                placeholder="e.g. Introduction to Agricultural Economics"
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
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Semester</label>
                <select
                  className="input-field"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                >
                  <option value="">Select semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label-text">Academic Year</label>
              <input
                type="text"
                className="input-field"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                placeholder="e.g. 2024/2025"
              />
            </div>

            <div>
              <label className="label-text">File *</label>
              <input
                type="file"
                required
                className="input-field"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              />
              <p className="text-xs text-muted-text mt-1">
                Supported: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT (max 20MB)
              </p>
              {file && (
                <p className="text-sm text-muted-text mt-1">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors w-full"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
