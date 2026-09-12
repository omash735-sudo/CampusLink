// app/auth/register/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
  const [showPassword, setShowPassword] = useState(false);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    phone: '',
    programmeId: '',
    year: '',
  });

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

  const passwordChecks = useMemo(() => {
    const p = form.password;
    return {
      length: p.length >= 8,
      uppercase: /[A-Z]/.test(p),
      lowercase: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
      long: p.length >= 12,
    };
  }, [form.password]);

  const allPasswordRulesMet =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number;

  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '', width: '0%' };

    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (p.length < 6) {
      return { score: 1, label: 'Too short', color: 'bg-red-500', width: '20%' };
    }

    if (score <= 2) {
      return { score: 2, label: 'Weak', color: 'bg-red-500', width: '35%' };
    }
    if (score === 3) {
      return { score: 3, label: 'Fair', color: 'bg-yellow-500', width: '60%' };
    }
    if (score === 4) {
      return { score: 4, label: 'Good', color: 'bg-blue-500', width: '80%' };
    }
    return { score: 5, label: 'Strong', color: 'bg-primary-green', width: '100%' };
  }, [form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allPasswordRulesMet) {
      setError('Please make sure your password meets all the requirements below.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          username: form.username,
          phone: form.phone,
          programmeId: form.programmeId,
          year: parseInt(form.year),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/auth/register-success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupedProgrammes = programmes.reduce((acc, programme) => {
    const faculty = programme.faculty || 'Other';
    if (!acc[faculty]) acc[faculty] = [];
    acc[faculty].push(programme);
    return acc;
  }, {} as Record<string, Programme[]>);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl border border-gray-200 bg-white p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnzur.png"
              alt="CampusLink"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Join CampusLink</h1>
          <p className="text-muted-text mt-2">
            Create your account and start connecting
          </p>
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
            <label className="label-text">Phone Number</label>
            <input
              type="tel"
              required
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+265 991 234 567"
            />
          </div>

          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field pr-12"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-green transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {form.password.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-text">Strength</span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.score <= 2
                        ? 'text-red-600'
                        : passwordStrength.score === 3
                        ? 'text-yellow-600'
                        : passwordStrength.score === 4
                        ? 'text-blue-600'
                        : 'text-primary-green'
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}

            <ul className="mt-3 space-y-1 text-xs">
              <PasswordRule
                met={passwordChecks.length}
                label="At least 8 characters"
              />
              <PasswordRule
                met={passwordChecks.uppercase}
                label="Contains an uppercase letter"
              />
              <PasswordRule
                met={passwordChecks.lowercase}
                label="Contains a lowercase letter"
              />
              <PasswordRule
                met={passwordChecks.number}
                label="Contains a number"
              />
              <PasswordRule
                met={passwordChecks.special}
                label="Contains a symbol (optional, but recommended)"
                optional
              />
            </ul>
          </div>

          <div>
            <label className="label-text">Programme</label>
            <select
              className="input-field text-sm"
              value={form.programmeId}
              onChange={(e) => setForm({ ...form, programmeId: e.target.value })}
              required
              disabled={loadingProgrammes}
            >
              <option value="">
                {loadingProgrammes
                  ? 'Loading programmes...'
                  : 'Select your programme'}
              </option>
              {Object.entries(groupedProgrammes).map(([faculty, progs]) => (
                <optgroup key={faculty} label={faculty}>
                  {progs.map((programme) => (
                    <option key={programme.id} value={programme.id}>
                      {programme.name}
                      {programme.code ? ` (${programme.code})` : ''}
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

          <button
            type="submit"
            className="bg-primary-green text-white w-full py-3 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted-text">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary-green hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function PasswordRule({
  met,
  label,
  optional = false,
}: {
  met: boolean;
  label: string;
  optional?: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-2 ${
        met
          ? 'text-primary-green'
          : optional
          ? 'text-muted-text/70'
          : 'text-muted-text'
      }`}
    >
      {met ? <CheckIcon /> : <DotIcon />}
      <span>{label}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" strokeWidth={2} />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}
