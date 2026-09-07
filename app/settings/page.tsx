// app/settings/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserIcon, SettingsIcon, BellIcon, LockIcon, GlobeIcon, LogOutIcon } from '@/components/icons';

export default function SettingsPage() {
  const [section, setSection] = useState('account');

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
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                    <input type="text" className="input-field" value="Omash Mashiri" />
                  </div>
                  <div>
                    <label className="label-text">Username</label>
                    <input type="text" className="input-field" value="omash.mashiri" />
                  </div>
                  <div>
                    <label className="label-text">Email</label>
                    <input type="email" className="input-field" value="omash@example.com" />
                  </div>
                  <div>
                    <label className="label-text">Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                    <button className="text-sm text-primary-green hover:underline mt-1">Change Password</button>
                  </div>
                  <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
                    Save Changes
                  </button>
                </div>
              )}

              {section === 'profile' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Profile Settings</h2>
                  <div>
                    <label className="label-text">Bio</label>
                    <textarea rows={4} className="input-field" placeholder="Tell students about yourself..." />
                  </div>
                  <div>
                    <label className="label-text">Programme</label>
                    <select className="input-field">
                      <option>Social Work & Youth Development</option>
                      <option>Agricultural Economics</option>
                      <option>Food Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Year</label>
                    <select className="input-field">
                      <option>Year 1</option>
                      <option>Year 2</option>
                      <option selected>Year 3</option>
                      <option>Year 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Interests</label>
                    <input type="text" className="input-field" placeholder="Technology, Research, Entrepreneurship" />
                  </div>
                  <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
                    Save Changes
                  </button>
                </div>
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
