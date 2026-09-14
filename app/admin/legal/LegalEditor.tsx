// app/admin/legal/LegalEditor.tsx
'use client';

import { useState } from 'react';

interface Props {
  docType: 'terms' | 'privacy';
  initialTitle: string;
  initialContent: string;
  initialVersion: string;
}

export function LegalEditor({
  docType,
  initialTitle,
  initialContent,
  initialVersion,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [version, setVersion] = useState(initialVersion);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType, title, content, version }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setStatus({ ok: true, msg: 'Saved successfully.' });
    } catch (err: any) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4 capitalize">
        {docType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="label-text">Title</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="label-text">Version</label>
          <input
            type="text"
            className="input-field"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="v1.0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Bump this when you make a material change. Users with an older
            version will be prompted to re-accept.
          </p>
        </div>

        <div>
          <label className="label-text">Content (Markdown)</label>
          <textarea
            rows={24}
            className="input-field font-mono text-xs"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Section Heading&#10;&#10;Your text here.&#10;&#10;- Bullet point&#10;- Another point"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use Markdown: `# ` for headings, `**bold**`, `- ` for bullets, `[link](url)` for links.
          </p>
        </div>

        {status && (
          <div
            className={`border p-3 text-sm ${
              status.ok
                ? 'border-green-400 bg-green-50 text-green-700'
                : 'border-red-400 bg-red-50 text-red-700'
            }`}
          >
            {status.msg}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
