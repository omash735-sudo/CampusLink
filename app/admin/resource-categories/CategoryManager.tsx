// app/admin/resource-categories/CategoryManager.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    sortOrder: 0,
  });

  const resetForm = () => {
    setForm({ name: '', description: '', sortOrder: 0 });
    setEditingId(null);
  };

  const refresh = async () => {
    const res = await fetch('/api/admin/resource-categories');
    if (res.ok) setCategories(await res.json());
    router.refresh();
  };

  const handleSave = async () => {
    if (form.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const url = editingId
        ? `/api/admin/resource-categories/${editingId}`
        : '/api/admin/resource-categories';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          sortOrder: Number(form.sortOrder) || 0,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      resetForm();
      await refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description || '',
      sortOrder: c.sortOrder,
    });
  };

  const handleDeactivate = async (id: string) => {
    if (
      !confirm(
        'Deactivate this category? Existing resources keep it, but it will no longer appear in the add form.'
      )
    )
      return;
    setBusy(true);
    try {
      await fetch(`/api/admin/resource-categories/${id}`, { method: 'DELETE' });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleReactivate = async (c: Category) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/resource-categories/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: c.name,
          description: c.description,
          sortOrder: c.sortOrder,
          isActive: true,
        }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="label-text">Name *</label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Economics"
            />
          </div>
          <div>
            <label className="label-text">Sort Order</label>
            <input
              type="number"
              className="input-field"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <div>
          <label className="label-text">Description (optional)</label>
          <input
            type="text"
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {error && (
          <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={busy}
            className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving...' : editingId ? 'Save Changes' : 'Add Category'}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories yet. Add one above.
          </div>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {c.name}
                  {!c.isActive && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5">
                      Inactive
                    </span>
                  )}
                </p>
                {c.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {c.description}
                  </p>
                )}
                <p className="text-xs text-gray-400">Order: {c.sortOrder}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(c)}
                  disabled={busy}
                  className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
                >
                  Edit
                </button>
                {c.isActive ? (
                  <button
                    onClick={() => handleDeactivate(c.id)}
                    disabled={busy}
                    className="text-xs border border-red-300 text-red-600 px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(c)}
                    disabled={busy}
                    className="text-xs border border-green-300 text-green-700 px-3 py-1.5 hover:bg-green-50 disabled:opacity-50"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
