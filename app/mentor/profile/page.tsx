// app/mentor/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ContactMethod = 'whatsapp' | 'campuslink' | 'both';

interface MentorProfile {
  introduction: string;
  expertise: string[];
  subjects: string[];
  mentorType: string;
  availability: string;
  experience: string;
  preferredContactMethod: ContactMethod;
  contactWhatsapp: string;
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
    preferredContactMethod: 'whatsapp',
    contactWhatsapp: '',
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
          preferredContactMethod:
            (data.preferredContactMethod as ContactMethod) || 'whatsapp',
          contactWhatsapp: data.contactWhatsapp || '',
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

  const needsWhatsapp =
    form.preferredContactMethod === 'whatsapp' ||
    form.preferredContactMethod === 'both';

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Fire both endpoints in parallel. If either fails, we report the error.
      const [profileRes, contactRes] = await Promise.all([
        fetch('/api/mentors/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            introduction: form.introduction,
            expertise: form.expertise,
            subjects: form.subjects,
            mentorType: form.mentorType,
            availability: form.availability,
            experience: form.experience,
          }),
        }),
        fetch('/api/mentor/contact-preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preferredContactMethod: form.preferredContactMethod,
            contactWhatsapp: needsWhatsapp ? form.contactWhatsapp : '',
          }),
        }),
      ]);

      const profileData = await profileRes.json();
      const contactData = await contactRes.json();

      if (!profileRes.ok) {
        throw new Error(profileData.error || 'Failed to save profile');
      }
      if (!contactRes.ok) {
        throw new Error(contactData.error || 'Failed to save contact preferences');
      }

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
            <Link
              href="/mentor"
              className="text-primary-green hover:underline text-sm"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">Mentor Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || (needsWhatsapp && !form.contactWhatsapp.trim())}
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

        {/* Profile content */}
        <div className="bg-white border border-gray-200 p-6 space-y-6 mb-6">
          <div>
            <label className="label-text">Introduction</label>
            <textarea
              rows={4}
              className="input-field"
              value={form.introduction}
              onChange={(e) =>
                setForm({ ...form, introduction: e.target.value })
              }
              placeholder="Tell students about yourself..."
            />
          </div>

          <div>
            <label className="label-text">Areas of Expertise</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.expertise.map((item) => (
                <span
                  key={item}
                  className="bg-gray-100 px-3 py-1 text-sm flex items-center gap-2"
                >
                  {item}
                  <button
                    onClick={() => removeTag('expertise', item)}
                    className="text-muted-text hover:text-red-500"
                  >
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
                <span
                  key={item}
                  className="bg-primary-green/10 text-primary-green px-3 py-1 text-sm flex items-center gap-2"
                >
                  {item}
                  <button
                    onClick={() => removeTag('subjects', item)}
                    className="text-primary-green hover:text-red-500"
                  >
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
                onChange={(e) =>
                  setForm({ ...form, mentorType: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, availability: e.target.value })
                }
              >
                <option value="available">Available</option>
                <option value="limited">Limited Availability</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact preferences */}
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold">Contact Preferences</h2>
            <p className="text-sm text-muted-text mt-1">
              Choose how your mentees should reach you. This appears on your
              active mentorships so students know the right channel.
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="sr-only">Preferred contact method</legend>

            <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4 hover:border-primary-green transition-colors">
              <input
                type="radio"
                name="method"
                value="whatsapp"
                checked={form.preferredContactMethod === 'whatsapp'}
                onChange={() =>
                  setForm({ ...form, preferredContactMethod: 'whatsapp' })
                }
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">WhatsApp</p>
                <p className="text-xs text-muted-text mt-0.5">
                  Mentees reach you through WhatsApp. Your number is only
                  shared with students you are actively mentoring.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4 hover:border-primary-green transition-colors">
              <input
                type="radio"
                name="method"
                value="campuslink"
                checked={form.preferredContactMethod === 'campuslink'}
                onChange={() =>
                  setForm({ ...form, preferredContactMethod: 'campuslink' })
                }
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">
                  CampusLink Messages{' '}
                  <span className="text-xs font-normal text-orange-600">
                    (coming soon)
                  </span>
                </p>
                <p className="text-xs text-muted-text mt-0.5">
                  Messaging inside CampusLink. This feature is not yet live — if
                  you pick this option, mentees won&apos;t be able to reach you
                  until it launches.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4 hover:border-primary-green transition-colors">
              <input
                type="radio"
                name="method"
                value="both"
                checked={form.preferredContactMethod === 'both'}
                onChange={() =>
                  setForm({ ...form, preferredContactMethod: 'both' })
                }
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">
                  Both{' '}
                  <span className="text-xs font-normal text-orange-600">
                    (CampusLink Messages coming soon)
                  </span>
                </p>
                <p className="text-xs text-muted-text mt-0.5">
                  Students can reach you on either channel. Until CampusLink
                  Messages launches, WhatsApp will be the only working option.
                </p>
              </div>
            </label>
          </fieldset>

          {needsWhatsapp && (
            <div>
              <label className="label-text">WhatsApp Number</label>
              <input
                type="tel"
                className="input-field"
                value={form.contactWhatsapp}
                onChange={(e) =>
                  setForm({ ...form, contactWhatsapp: e.target.value })
                }
                placeholder="+265 98 123 4567"
              />
              <p className="text-xs text-muted-text mt-1">
                Include your country code. Only students with an active
                mentorship will see this.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
