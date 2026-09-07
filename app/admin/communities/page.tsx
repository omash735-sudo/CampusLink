// app/admin/communities/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  whatsappLink: string;
  isActive: boolean;
  memberCount: number;
  createdAt: string;
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Community | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    whatsappLink: '',
    isActive: true,
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/communities');
      const data = await res.json();
      if (res.ok) {
        setCommunities(data);
      }
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing 
        ? `/api/admin/communities/${editing.id}`
        : '/api/admin/communities';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }),
      });

      if (res.ok) {
        await loadCommunities();
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', description: '', category: '', whatsappLink: '', isActive: true });
      }
    } catch (error) {
      console.error('Failed to save community:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this community?')) return;
    try {
      await fetch(`/api/admin/communities/${id}`, { method: 'DELETE' });
      await loadCommunities();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleEdit = (community: Community) => {
    setEditing(community);
    setForm({
      name: community.name,
      description: community.description || '',
      category: community.category || '',
      whatsappLink: community.whatsappLink || '',
      isActive: community.isActive,
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Communities</h1>
          <p className="text-sm text-gray-500">{communities.length} total communities</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setForm({ name: '', description: '', category: '', whatsappLink: '', isActive: true });
          }}
          className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Community
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? 'Edit Community' : 'Add Community'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Social Work Students"
              />
            </div>
            <div>
              <label className="label-text">Description</label>
              <textarea
                rows={3}
                className="input-field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Community description..."
              />
            </div>
            <div>
              <label className="label-text">Category</label>
              <input
                type="text"
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Academic, Social, Sports"
              />
            </div>
            <div>
              <label className="label-text">WhatsApp Link</label>
              <input
                type="url"
                className="input-field"
                value={form.whatsappLink}
                onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
              />
              <p className="text-xs text-muted-text mt-1">WhatsApp group invite link</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm">Active</label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((community) => (
          <div key={community.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{community.name}</h3>
                  <span className={`text-xs px-2 py-0.5 ${
                    community.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {community.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {community.description && (
                  <p className="text-sm text-gray-500 mt-1">{community.description}</p>
                )}
                <p className="text-sm text-gray-500">{community.category || 'No category'}</p>
                {community.whatsappLink && (
                  <p className="text-sm text-gray-500 truncate">WhatsApp: {community.whatsappLink}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{community.memberCount} members</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(community)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(community.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && !showForm && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No communities found.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary-green hover:underline text-sm mt-2 inline-block"
          >
            Add your first community
          </button>
        </div>
      )}
    </div>
  );
}
