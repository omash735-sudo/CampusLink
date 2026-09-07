// app/mentor/profile/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MentorProfilePage() {
  const [form, setForm] = useState({
    bio: 'I am a passionate mentor with experience in social work and youth development. I enjoy helping students navigate their academic journey and discover their career path.',
    expertise: ['Academic Support', 'Study Skills', 'Career Guidance', 'Research'],
    subjects: ['Research Methods', 'Social Work Practice', 'Youth Development', 'Case Management'],
    mentorType: 'Student',
    maxMentees: 5,
    availability: 'available',
    visibility: 'public'
  });

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mentor Profile</h1>
          <div className="flex gap-3">
            <Link 
              href="/mentor/profile/preview" 
              className="border border-primary-green text-primary-green px-4 py-2 text-sm font-medium hover:bg-primary-green hover:text-white transition-colors"
            >
              Preview Profile
            </Link>
            <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-2 border-primary-green bg-primary-green/10 flex items-center justify-center text-2xl font-bold text-primary-green overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
                  alt="Mentor"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Omash Mashiri</h2>
                <p className="text-muted-text">Student Mentor • Social Work & Youth Development</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">Verified Mentor</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">Available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Bio */}
            <div>
              <label className="label-text">Biography</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell students about yourself and why you want to mentor..."
              />
            </div>

            {/* Expertise */}
            <div>
              <label className="label-text">Areas of Expertise</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.expertise.map((item) => (
                  <span key={item} className="bg-gray-100 px-3 py-1 text-sm flex items-center gap-2">
                    {item}
                    <button className="text-muted-text hover:text-red-500">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add expertise..."
                  className="border border-gray-300 bg-white px-3 py-1 text-sm focus:border-primary-green focus:outline-none"
                />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="label-text">Subjects / Courses</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.subjects.map((item) => (
                  <span key={item} className="bg-primary-green/10 text-primary-green px-3 py-1 text-sm flex items-center gap-2">
                    {item}
                    <button className="text-primary-green hover:text-red-500">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add subject..."
                  className="border border-gray-300 bg-white px-3 py-1 text-sm focus:border-primary-green focus:outline-none"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Mentor Type</label>
                <select className="input-field" value={form.mentorType} onChange={(e) => setForm({ ...form, mentorType: e.target.value })}>
                  <option value="Student">Student Mentor</option>
                  <option value="Alumni">Alumni Mentor</option>
                  <option value="Professional">Professional Mentor</option>
                </select>
              </div>
              <div>
                <label className="label-text">Maximum Mentees</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.maxMentees}
                  onChange={(e) => setForm({ ...form, maxMentees: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="label-text">Availability</label>
                <select className="input-field" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="limited">Limited Availability</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <label className="label-text">Profile Visibility</label>
                <select className="input-field" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
