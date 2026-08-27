// app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/auth/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    programme: '',
    year: '',
    campus: 'LUANAR City Campus',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
          },
        },
      });

      if (authError) throw authError;

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            fullName: formData.fullName,
            username: formData.username,
            campus: formData.campus,
            programme: formData.programme,
            year: parseInt(formData.year),
            role: 'student',
          });

        if (profileError) throw profileError;
      }

      router.push('/onboarding');
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-off-white px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 bg-white p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 border-2 border-primary-green bg-white"></div>
          </div>
          <h1 className="text-2xl font-semibold text-primary-text">
            Join CampusLink
          </h1>
          <p className="mt-2 text-muted-text">
            Create your account and start connecting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="label-text">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label htmlFor="username" className="label-text">
              Username
            </label>
            <Input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. john.doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="label-text">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-text">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="programme" className="label-text">
              Programme
            </label>
            <select
              id="programme"
              className="input-field"
              value={formData.programme}
              onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
              required
            >
              <option value="">Select your programme</option>
              <option value="BSc Agricultural Economics">BSc Agricultural Economics</option>
              <option value="BSc Animal Science">BSc Animal Science</option>
              <option value="BSc Food Science & Technology">BSc Food Science & Technology</option>
              <option value="BSc Social Work & Youth Development">BSc Social Work & Youth Development</option>
              <option value="BSc Environmental Science">BSc Environmental Science</option>
              <option value="BSc Engineering">BSc Engineering</option>
            </select>
          </div>

          <div>
            <label htmlFor="year" className="label-text">
              Year of Study
            </label>
            <select
              id="year"
              className="input-field"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
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
            <div className="rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-text">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-green hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
