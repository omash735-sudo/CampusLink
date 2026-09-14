// app/apply/publications/ApplyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  initialMotivation: string;
  initialExperience: string;
}

export function ApplyForm({ initialMotivation, initialExperience }: Props) {
  const router = useRouter();
  const [motivation, setMotivation] = useState(initialMotivation);
  const [experience, setExperience] = useState(initialExperience);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('You must agree to the terms before applying.');
      return;
    }

    if (motivation.trim().length < 50) {
      setError('Please write at least 50 characters explaining why you want to join.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/apply/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motivation: motivation.trim(),
          experience: experience.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');

      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label-text">Why do you want to join?</label>
        <textarea
          rows={5}
          required
          minLength={50}
          maxLength={1000}
          className="input-field"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Tell us why you want to help run the CampusLink Publications Office. What would you bring to the role?"
        />
        <p className="text-xs text-muted-text mt-1">
          {motivation.length} / 1000 characters · minimum 50
        </p>
      </div>

      <div>
        <label className="label-text">Relevant experience (optional)</label>
        <textarea
          rows={3}
          maxLength={500}
          className="input-field"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Any writing, editing, social media, or student-organisation experience."
        />
      </div>

      <div className="border border-gray-200 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 mt-0.5 flex-shrink-0"
            required
          />
          <span className="text-sm">
            I understand that being a Publications Officer is a voluntary role
            and I agree to the CampusLink{' '}
            <Link href="/terms" target="_blank" className="text-primary-green hover:underline">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" target="_blank" className="text-primary-green hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
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
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
