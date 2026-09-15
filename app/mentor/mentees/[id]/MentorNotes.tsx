// app/mentor/mentees/[id]/MentorNotes.tsx
'use client';

import { useState } from 'react';

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Props {
  menteeId: string;
  initialNotes: Note[];
}

export function MentorNotes({ menteeId, initialNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/mentors/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menteeId, content: newNote.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setNotes([
        { id: data.note.id, content: data.note.content, createdAt: data.note.createdAt },
        ...notes,
      ]);
      setNewNote('');
      setShowAdd(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    try {
      await fetch(`/api/mentors/notes?id=${id}`, { method: 'DELETE' });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Private Notes</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm text-primary-green hover:underline"
        >
          Add Note
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 border border-gray-200 bg-off-white">
          <textarea
            rows={3}
            className="input-field"
            placeholder="Add private note about this mentee..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-primary-green text-white px-4 py-1.5 text-sm hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setNewNote('');
                setError('');
              }}
              className="border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-muted-text text-sm">No private notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="border-l-4 border-primary-green pl-3 py-2 bg-off-white">
              <p className="text-sm">{note.content}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-text">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-xs text-red-500 hover:underline"
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
