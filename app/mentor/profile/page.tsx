// app/mentor/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MentorProfile {
  introduction: string;
  expertise: string[];
  subjects: string[];
  mentorType: string;
  availability: string;
  experience: string;
}

export default function MentorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [form, setForm] = useState<MentorProfile>({
    introduction: '',
    expertise: [],
    subjects: [],
    mentorType: 'Student',
    availability: 'available',
    experience: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/mentors/profile');
      if (res.ok) {
        const data = await res.json();
        setForm({
          introduction: data.introduction || '',
          expertise: data.expertise || [],
          subjects: data.subjects || [],
          mentorType: data.mentorType || 'Student',
          availability: data.availability || 'available',
          experience: data.experience || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (field: 'expertise' | 'subjects', value: string) => {
    const t = value.trim();
    if (!t || form[field].includes(t)) return;
    setForm({ ...form, [field]: [...form[field], t] });
    if (field === 'expertise') setExpertiseInput('');
    else setSubjectInput('');
  };

  const removeTag = (field: 'expertise' | 'subjects', value: string) => {
    setForm({ ...form, [field]: form[field].filter((t) => t !== value) });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/mentors/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess('Profile updated successfully.');
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
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/mentor" className="text-primary-green hover:underline text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">Mentor Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="border border-green-400 bg-green-50 p-3 text-sm text-green-700 mb-4">
            {success}
          </div>
        )}

        <div className="bg-white border border-gray-200 p-6 space-y-6">
          <div>
            <label className="label-text">Introduction</label>
            <textarea
              rows={4}
              className="input-field"
              value={form.introduction}
              onChange={(e) => setForm({ ...form, introduction: e.target.value })}
              placeholder="Tell students about yourself..."
            />
          </div>

          <div>
            <label className="label-text">Areas of Expertise</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.expertise.map((item) => (
                <span key={item} className="bg-gray-100 px-3 py-1 text-sm flex items-center gap-2">
                  {item}
                  <button onClick={() => removeTag('expertise', item)} className="text-muted-text hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add expertise..."
                className="input-field flex-1"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('expertise', expertiseInput);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addTag('expertise', expertiseInput)}
                className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="label-text">Subjects / Courses</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.subjects.map((item) => (
                <span key={item} className="bg-primary-green/10 text-primary-green px-3 py-1 text-sm flex items-center gap-2">
                  {item}
                  <button onClick={() => removeTag('subjects', item)} className="text-primary-green hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add subject..."
                className="input-field flex-1"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('subjects', subjectInput);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addTag('subjects', subjectInput)}
                className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="label-text">Experience</label>
            <textarea
              rows={3}
              className="input-field"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="Share your relevant experience..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Mentor Type</label>
              <select
                className="input-field"
                value={form.mentorType}
                onChange={(e) => setForm({ ...form, mentorType: e.target.value })}
              >
                <option value="Student">Student Mentor</option>
                <option value="Alumni">Alumni Mentor</option>
                <option value="Professional">Professional Mentor</option>
                <option value="Staff">Staff Mentor</option>
              </select>
            </div>
            <div>
              <label className="label-text">Availability</label>
              <select
                className="input-field"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="limited">Limited Availability</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
