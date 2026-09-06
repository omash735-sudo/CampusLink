// app/auth/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Programme {
  id: string;
  name: string;
  code: string;
  faculty: string;
  degree: string;
  duration: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingProgrammes, setLoadingProgrammes] = useState(true);
  const [error, setError] = useState('');
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    programmeId: '',
    year: '',
  });

  // Fetch programmes on component mount
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const res = await fetch('/api/programmes');
        const data = await res.json();
        
        if (res.ok) {
          setProgrammes(data);
        } else {
          console.error('Failed to fetch programmes:', data.error);
        }
      } catch (err) {
        console.error('Error fetching programmes:', err);
      } finally {
        setLoadingProgrammes(false);
      }
    };

    fetchProgrammes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          username: form.username,
          programmeId: form.programmeId,
          year: parseInt(form.year),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/student/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Group programmes by faculty
  const groupedProgrammes = programmes.reduce((acc, programme) => {
    const faculty = programme.faculty || 'Other';
    if (!acc[faculty]) {
      acc[faculty] = [];
    }
    acc[faculty].push(programme);
    return acc;
  }, {} as Record<string, Programme[]>);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Join CampusLink</h1>
          <p className="text-muted-text mt-2">Create your account and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="frank banda"
            />
          </div>

          <div>
            <label className="label-text">Username</label>
            <input
              type="text"
              required
              className="input-field"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="frank.banda"
            />
          </div>

          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="frankbanda@gmail.com"
            />
          </div>

          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="label-text">Programme</label>
            <select
              className="input-field"
              value={form.programmeId}
              onChange={(e) => setForm({ ...form, programmeId: e.target.value })}
              required
              disabled={loadingProgrammes}
            >
              <option value="">
                {loadingProgrammes ? 'Loading programmes...' : 'Select your programme'}
              </option>
              
              {/* Option 1: Grouped by faculty */}
              {Object.entries(groupedProgrammes).map(([faculty, programmes]) => (
                <optgroup key={faculty} label={faculty}>
                  {programmes.map((programme) => (
                    <option key={programme.id} value={programme.id}>
                      {programme.name} ({programme.code})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {!loadingProgrammes && programmes.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No programmes available. Please contact support.
              </p>
            )}
          </div>

          <div>
            <label className="label-text">Year of Study</label>
            <select
              className="input-field"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
            >
              <option value="">Select your year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted-text">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-green hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
