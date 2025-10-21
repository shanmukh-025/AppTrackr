import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotesModal.css';

const NotesModal = ({ isOpen, onClose, targetId, targetCompany, targetPosition, type = 'application' }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && targetId) {
      const fetchNotes = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('token');

          if (!token) return;

          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/notes/target/${targetId}?type=${type}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setNotes(response.data.notes || []);
        } catch (error) {
          console.error('Error fetching notes:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchNotes();
    }
  }, [isOpen, targetId, type]);

  // Removed separate fetchNotes function since it's now in useEffect

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert('Please enter a note');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/notes/add`,
        {
          type,
          targetId,
          targetCompany,
          targetPosition,
          content: newNote,
          isPinned: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotes([response.data.note, ...notes]);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      const token = localStorage.getItem('token');

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/notes/delete/${noteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotes(notes.filter((note) => note.id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    }
  };

  const handleTogglePin = async (noteId, isPinned) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/notes/update/${noteId}`,
        { isPinned: !isPinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotes(
          notes.map((note) =>
            note.id === noteId ? { ...note, isPinned: !isPinned } : note
          )
        );
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📝 Notes</h2>
            <p className="modal-subtitle">
              {targetCompany} - {targetPosition}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="note-input-section">
            <textarea
              className="note-input"
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              disabled={isSaving}
              rows="3"
            />
            <button
              className="note-add-btn"
              onClick={handleAddNote}
              disabled={isSaving || !newNote.trim()}
            >
              {isSaving ? 'Saving...' : '+ Add Note'}
            </button>
          </div>

          <div className="notes-list">
            {isLoading ? (
              <p className="loading">Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="empty">No notes yet. Add one above!</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className={`note-item ${note.isPinned ? 'pinned' : ''}`}>
                  <div className="note-header">
                    <button
                      className={`pin-btn ${note.isPinned ? 'pinned' : ''}`}
                      onClick={() => handleTogglePin(note.id, note.isPinned)}
                      title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                      {note.isPinned ? '📌' : '📍'}
                    </button>
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="note-content">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
