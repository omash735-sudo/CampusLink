// app/clubs/register/ClubRegisterForm.tsx
'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Academic',
  'Sports',
  'Arts & Culture',
  'Technology',
  'Entrepreneurship',
  'Community Service',
  'Religious',
  'Political',
  'Social',
  'Other',
];

export function ClubRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clubName: '',
    category: '',
    description: '',
    proposedBy: '',
    contactEmail: '',
    contactPhone: '',
    membershipInfo: '',
    meetingInfo: '',
    socialLinks: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/clubs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary-green/10 flex items-center justify-center">
          <svg
            className="h-7 w-7 text-primary-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Application Submitted</h2>
        <p className="text-muted-text">
          Thank you for registering your club. We'll review your details and
          get back to you by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-text">Club Name *</label>
        <input
          type="text"
          required
          className="input-field"
          value={form.clubName}
          onChange={(e) => setForm({ ...form, clubName: e.target.value })}
        />
      </div>

      <div>
        <label className="label-text">Category</label>
        <select
          className="input-field"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-text">Description *</label>
        <textarea
          rows={5}
          required
          minLength={20}
          className="input-field"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What does your club do? Who can join? What activities do you run?"
        />
      </div>

      <div>
        <label className="label-text">Proposed By *</label>
        <input
          type="text"
          required
          className="input-field"
          value={form.proposedBy}
          onChange={(e) => setForm({ ...form, proposedBy: e.target.value })}
          placeholder="Your full name or role"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Contact Email *</label>
          <input
            type="email"
            required
            className="input-field"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          />
        </div>
        <div>
          <label className="label-text">Contact Phone / WhatsApp</label>
          <input
            type="tel"
            className="input-field"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label-text">Membership Info</label>
        <textarea
          rows={2}
          className="input-field"
          value={form.membershipInfo}
          onChange={(e) => setForm({ ...form, membershipInfo: e.target.value })}
          placeholder="How do people join? Any fees or requirements?"
        />
      </div>

      <div>
        <label className="label-text">Meeting Info</label>
        <textarea
          rows={2}
          className="input-field"
          value={form.meetingInfo}
          onChange={(e) => setForm({ ...form, meetingInfo: e.target.value })}
          placeholder="When and where do you meet?"
        />
      </div>

      <div>
        <label className="label-text">Social Links</label>
        <textarea
          rows={2}
          className="input-field"
          value={form.socialLinks}
          onChange={(e) => setForm({ ...form, socialLinks: e.target.value })}
          placeholder="Instagram, WhatsApp group, website — one per line"
        />
      </div>

      {error && (
        <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary-green text-white w-full py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Club'}
      </button>
    </form>
  );
}
