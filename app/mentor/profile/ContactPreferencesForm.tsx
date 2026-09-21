// app/mentor/profile/ContactPreferencesForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Method = 'whatsapp' | 'campuslink' | 'both';

interface Props {
  initialPreferredContactMethod: string | null;
  initialContactWhatsapp: string | null;
}

export function ContactPreferencesForm({
  initialPreferredContactMethod,
  initialContactWhatsapp,
}: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<Method>(
    (initialPreferredContactMethod as Method) || 'whatsapp'
  );
  const [whatsapp, setWhatsapp] = useState(initialContactWhatsapp || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    kind: 'ok' | 'err';
    text: string;
  } | null>(null);

  const needsWhatsapp = method === 'whatsapp' || method === 'both';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/mentor/contact-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredContactMethod: method,
          contactWhatsapp: needsWhatsapp ? whatsapp : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setMessage({ kind: 'ok', text: 'Contact preferences saved.' });
      router.refresh();
    } catch (err: any) {
      setMessage({ kind: 'err', text: err.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold mb-2">Contact Preferences</h2>
      <p className="text-sm text-muted-text mb-6">
        Choose how your mentees should reach you. This appears on your active
        mentorships so students know the right channel.
      </p>

      <fieldset className="space-y-3 mb-6">
        <legend className="sr-only">Preferred contact method</legend>

        <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4 hover:border-primary-green transition-colors">
          <input
            type="radio"
            name="method"
            value="whatsapp"
            checked={method === 'whatsapp'}
            onChange={() => setMethod('whatsapp')}
            className="mt-1"
          />
          <div>
            <p className="font-medium text-sm">WhatsApp</p>
            <p className="text-xs text-muted-text mt-0.5">
              Mentees reach you through WhatsApp. Your number is only shared
              with students you are actively mentoring.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4 hover:border-primary-green transition-colors">
          <input
            type="radio"
            name="method"
            value="campuslink"
            checked={method === 'campuslink'}
            onChange={() => setMethod('campuslink')}
            className="mt-1"
          />
          <div>
            <p className="font-medium text-sm">CampusLink Messages</p>
            <p className="text-xs text-muted-text mt-0.5">
              Messaging inside CampusLink. <em>(Coming soon — no messages will
              be delivered yet.)</em>
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer border border-gray-200 p-4 hover:border-primary-green transition-colors">
          <input
            type="radio"
            name="method"
            value="both"
            checked={method === 'both'}
            onChange={() => setMethod('both')}
            className="mt-1"
          />
          <div>
            <p className="font-medium text-sm">Both</p>
            <p className="text-xs text-muted-text mt-0.5">
              Students can reach you on either WhatsApp or CampusLink.
            </p>
          </div>
        </label>
      </fieldset>

      {needsWhatsapp && (
        <div className="mb-6">
          <label className="label-text">WhatsApp Number</label>
          <input
            type="tel"
            className="input-field"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+265 98 123 4567"
            required={needsWhatsapp}
          />
          <p className="text-xs text-muted-text mt-1">
            Include your country code. Only students with an active mentorship
            will see this.
          </p>
        </div>
      )}

      {message && (
        <div
          className={`p-3 text-sm border mb-4 ${
            message.kind === 'ok'
              ? 'border-green-300 bg-green-50 text-green-800'
              : 'border-red-300 bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || (needsWhatsapp && !whatsapp.trim())}
          className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
}
