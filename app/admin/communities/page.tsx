// app/admin/communities/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@/components/icons';

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  whatsappLink: string | null;
  status: string;
  isActive: boolean;
  memberCount: number;
  submittedBy: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
}

type Tab = 'pending' | 'approved' | 'rejected';

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<Tab>('pending');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    whatsappLink: '',
    isActive: true,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/communities');
      if (res.ok) setCommunities(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...form,
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: '', description: '', category: '', whatsappLink: '', isActive: true });
      await load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this community?')) return;
    await fetch(`/api/admin/communities/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await load();
  };

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/communities/${id}/approve`, {
      method: 'POST',
      credentials: 'include',
    });
    await load();
  };

  const handleReject = async (id: string) => {
    const reviewNotes = prompt('Reason for rejection (optional):') || '';
    await fetch(`/api/admin/communities/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reviewNotes: reviewNotes || null }),
    });
    await load();
  };

  const byTab = (t: Tab) =>
    communities.filter((c) => c.status === t);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'pending', label: 'Pending', count: byTab('pending').length },
    { key: 'approved', label: 'Approved', count: byTab('approved').length },
    { key: 'rejected', label: 'Rejected', count: byTab('rejected').length },
  ];

  const visible = byTab(tab);

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Communities</h1>
          <p className="text-sm text-gray-500">
            {communities.length} total · {byTab('pending').length} pending review
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Community
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold">Add Community (pre-approved)</h2>
          <input
            required
            className="input-field"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="input-field"
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            required
            className="input-field"
            placeholder="https://chat.whatsapp.com/..."
            value={form.whatsappLink}
            onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-gray-300 px-6 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm ${
              tab === t.key
                ? 'bg-primary-green text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No communities in this tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{c.name}</h3>
                <span className={`text-xs px-2 py-0.5 ${
                  c.status === 'approved' ? 'bg-green-100 text-green-700'
                  : c.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-700'
                }`}>
                  {c.status}
                </span>
              </div>

              {c.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-3">{c.description}</p>
              )}

              {c.category && (
                <p className="text-xs text-gray-400 mt-1">{c.category}</p>
              )}

              {c.whatsappLink && (
                <a
                  href={c.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-green hover:underline mt-1 truncate"
                >
                  {c.whatsappLink}
                </a>
              )}

              {c.status === 'pending' && (
                <p className="text-xs text-gray-400 mt-1">
                  Submitted {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : ''}
                </p>
              )}

              {c.reviewNotes && (
                <p className="text-xs text-red-700 mt-1">
                  Rejection reason: {c.reviewNotes}
                </p>
              )}

              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 text-sm">
                {c.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(c.id)}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(c.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-gray-500 hover:text-red-600 ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
