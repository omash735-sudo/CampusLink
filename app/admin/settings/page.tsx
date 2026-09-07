// app/admin/settings/page.tsx
'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'CampusLink',
    platformDescription: 'Your digital community for campus life.',
    contactEmail: 'admin@campuslink.com',
    contactPhone: '+265 9817 892 298',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    // In production, save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500">Manage platform settings</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="label-text">Platform Name</label>
            <input
              type="text"
              className="input-field"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">Platform Description</label>
            <textarea
              rows={3}
              className="input-field"
              value={settings.platformDescription}
              onChange={(e) => setSettings({ ...settings, platformDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">Contact Email</label>
            <input
              type="email"
              className="input-field"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">Contact Phone</label>
            <input
              type="text"
              className="input-field"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {success && (
            <p className="text-green-600 text-sm">Settings saved successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
}
