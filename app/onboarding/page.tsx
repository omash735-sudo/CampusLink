// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    bio: '',
    programme: '',
    year: '',
    interests: [],
    academicInterests: '',
    visibility: 'public',
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to CampusLink</h1>
          <p className="text-muted-text mt-2">Let's get your profile set up.</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 w-8 rounded-full ${s <= step ? 'bg-primary-green' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold">Tell us about yourself</h2>
              <div>
                <label className="label-text">Bio</label>
                <textarea
                  rows={4}
                  className="input-field"
                  placeholder="Share a brief description about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold">Your Programme</h2>
              <div>
                <label className="label-text">Programme</label>
                <select className="input-field" value={form.programme} onChange={(e) => setForm({ ...form, programme: e.target.value })}>
                  <option value="">Select your programme</option>
                  <option value="Social Work">Social Work & Youth Development</option>
                  <option value="Agricultural Economics">Agricultural Economics</option>
                  <option value="Food Science">Food Science & Technology</option>
                </select>
              </div>
              <div>
                <label className="label-text">Year</label>
                <select className="input-field" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                  <option value="">Select your year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold">Your Interests</h2>
              <p className="text-sm text-muted-text mb-3">Select topics you're interested in.</p>
              <div className="grid grid-cols-2 gap-2">
                {['Technology', 'Research', 'Entrepreneurship', 'Sports', 'Music', 'Art', 'Photography', 'Gaming'].map((interest) => (
                  <label key={interest} className="flex items-center gap-2 border border-gray-200 p-3 hover:border-primary-green cursor-pointer">
                    <input type="checkbox" className="accent-primary-green" />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-bold">Academic Interests</h2>
              <div>
                <label className="label-text">What are you interested in studying?</label>
                <textarea
                  rows={4}
                  className="input-field"
                  placeholder="e.g. Social development, Agricultural policy, Food security..."
                  value={form.academicInterests}
                  onChange={(e) => setForm({ ...form, academicInterests: e.target.value })}
                />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-bold">Privacy Preferences</h2>
              <div>
                <label className="label-text">Who can see your profile?</label>
                <select className="input-field" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                  <option value="public">Public (Anyone on campus)</option>
                  <option value="connections">Connections Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="bg-off-white p-4 border border-gray-200 mt-4">
                <p className="text-sm text-muted-text">
                  You can change these settings at any time in your profile settings.
                </p>
              </div>
            </>
          )}

          <button 
            onClick={handleNext}
            className="bg-primary-green text-white w-full py-3 font-medium hover:bg-deep-green transition-colors mt-4"
          >
            {step < 5 ? 'Continue' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}
