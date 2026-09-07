// app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, SettingsIcon, BellIcon, LockIcon, GlobeIcon, LogOutIcon } from '@/components/icons';

export default function SettingsPage() {
  const router = useRouter();
  const [section, setSection] = useState('account');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: '',
    programme: '',
    year: '',
    interests: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setForm({
          fullName: data.user.fullName || '',
          username: data.user.username || '',
          email: data.user.email || '',
          bio: data.user.bio || '',
          programme: data.user.programme || '',
          year: data.user.year || '',
          interests: data.user.interests?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year) || null,
          interests: form.interests.split(',').map((s: string) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('userRole');
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
            <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="md:col-span-3 h-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 p-4 space-y-1">
              <button 
                onClick={() => setSection('account')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  section === 'account' ? 'bg-primary-green/10 text-primary-green font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <UserIcon className="inline h-4 w-4 mr-2" />
                Account
              </button>
              <button 
                onClick={() => setSection('profile')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  section === 'profile' ? 'bg-primary-green/10 text-primary-green font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <SettingsIcon className="inline h-4 w-4 mr-2" />
                Profile
              </button>
              <button 
                onClick={() => setSection('privacy')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  section === 'privacy' ? 'bg-primary-green/10 text-primary-green font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <LockIcon className="inline h-4 w-4 mr-2" />
                Privacy
              </button>
              <button 
                onClick={() => setSection('notifications')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  section === 'notifications' ? 'bg-primary-green/10 text-primary-green font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <BellIcon className="inline h-4 w-4 mr-2" />
                Notifications
              </button>
              <button 
                onClick={() => setSection('appearance')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  section === 'appearance' ? 'bg-primary-green/10 text-primary-green font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <GlobeIcon className="inline h-4 w-4 mr-2" />
                Appearance
              </button>
              <div className="border-t border-gray-200 my-2"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOutIcon className="inline h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white border border-gray-200 p-6">
              {section === 'account' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Account Settings</h2>
                  <div>
                    <label className="label-text">Full Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label-text">Username</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label-text">Email</label>
                    <input
                      type="email"
                      className="input-field"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      disabled
                    />
                    <p className="text-xs text-muted-text mt-1">Email cannot be changed</p>
                  </div>
                  <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
                    Change Password
                  </button>
                </div>
              )}

              {section === 'profile' && (
                <form onSubmit={handleSave} className="space-y-4">
                  <h2 className="text-xl font-bold">Profile Settings</h2>
                  <div>
                    <label className="label-text">Bio</label>
                    <textarea
                      rows={4}
                      className="input-field"
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell students about yourself..."
                    />
                  </div>
                  <div>
                    <label className="label-text">Programme</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.programme}
                      onChange={(e) => setForm({ ...form, programme: e.target.value })}
                      placeholder="e.g. Social Work & Youth Development"
                    />
                  </div>
                  <div>
                    <label className="label-text">Year</label>
                    <select
                      className="input-field"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                    >
                      <option value="">Select year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Interests</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.interests}
                      onChange={(e) => setForm({ ...form, interests: e.target.value })}
                      placeholder="e.g. Technology, Research, Sports"
                    />
                    <p className="text-xs text-muted-text mt-1">Separate multiple interests with commas</p>
                  </div>
                  {error && (
                    <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="border border-green-400 bg-green-50 p-3 text-sm text-green-700">
                      Settings updated successfully!
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {section === 'privacy' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Privacy Settings</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-text">Who can see your profile</p>
                      </div>
                      <select className="border border-gray-300 px-3 py-1 text-sm">
                        <option>Public</option>
                        <option>Connections Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">Connection Requests</p>
                        <p className="text-sm text-muted-text">Who can send you connection requests</p>
                      </div>
                      <select className="border border-gray-300 px-3 py-1 text-sm">
                        <option>Everyone</option>
                        <option>Connections of Connections</option>
                        <option>No One</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mentorship Requests</p>
                        <p className="text-sm text-muted-text">Who can request mentorship from you</p>
                      </div>
                      <select className="border border-gray-300 px-3 py-1 text-sm">
                        <option>Everyone</option>
                        <option>Connections Only</option>
                        <option>No One</option>
                      </select>
                    </div>
                  </div>
                  <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
                    Save Changes
                  </button>
                </div>
              )}

              {section === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Notification Settings</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">Announcements</p>
                        <p className="text-sm text-muted-text">Campus announcements and updates</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-primary-green" />
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">Events</p>
                        <p className="text-sm text-muted-text">Upcoming events and reminders</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-primary-green" />
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">Mentorship</p>
                        <p className="text-sm text-muted-text">Mentorship requests and updates</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-primary-green" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Resources</p>
                        <p className="text-sm text-muted-text">New academic resources</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-primary-green" />
                    </div>
                  </div>
                  <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
                    Save Changes
                  </button>
                </div>
              )}

              {section === 'appearance' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Appearance</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-muted-text">Choose your preferred theme</p>
                      </div>
                      <select className="border border-gray-300 px-3 py-1 text-sm">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                  </div>
                  <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
