// app/mentors/become-a-mentor/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BecomeAMentorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    programme: '',
    year: '',
    expertise: '',
    subjects: '',
    availability: '',
    preferences: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock submission
    setTimeout(() => {
      setLoading(false);
      router.push('/mentors/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Become a Mentor</h1>
        <p className="text-muted-text mb-8">Share your knowledge and experience with fellow students.</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`h-0.5 w-8 ${s < step ? 'bg-primary-green' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">About You</h2>
              <div>
                <label className="label-text">Bio</label>
                <textarea
                  rows={4}
                  className="input-field"
                  placeholder="Tell students about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Programme</label>
                  <input type="text" className="input-field" placeholder="Your programme" />
                </div>
                <div>
                  <label className="label-text">Year</label>
                  <select className="input-field">
                    <option value="">Select year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">What Can You Help With?</h2>
              <div>
                <label className="label-text">Areas of Expertise</label>
                <select className="input-field" multiple>
                  <option>Academic Support</option>
                  <option>Career Guidance</option>
                  <option>Study Skills</option>
                  <option>University Life</option>
                  <option>Entrepreneurship</option>
                  <option>Research</option>
                </select>
                <p className="text-xs text-muted-text mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
              <div>
                <label className="label-text">Subjects</label>
                <input type="text" className="input-field" placeholder="e.g. Agricultural Economics, Research Methods" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Availability</h2>
              <div>
                <label className="label-text">When are you available?</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <label key={day} className="flex items-center gap-2 border border-gray-200 p-2 hover:border-primary-green cursor-pointer">
                      <input type="checkbox" className="accent-primary-green" />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-text">Preferred time</label>
                <select className="input-field">
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Mentorship Preferences</h2>
              <div>
                <label className="label-text">Preferred format</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['One-on-One', 'Group', 'Online', 'In Person'].map((format) => (
                    <label key={format} className="flex items-center gap-2 border border-gray-200 p-3 hover:border-primary-green cursor-pointer">
                      <input type="radio" name="format" className="accent-primary-green" />
                      <span className="text-sm">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-off-white p-4 border border-gray-200">
                <p className="text-sm text-muted-text">
                  By submitting this application, you agree to the CampusLink Mentorship Guidelines.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              className="border border-gray-300 px-6 py-2 text-sm hover:border-primary-green transition-colors"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(Math.min(4, step + 1))}
                className="bg-primary-green text-white px-6 py-2 text-sm hover:bg-deep-green transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-green text-white px-6 py-2 text-sm hover:bg-deep-green transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
