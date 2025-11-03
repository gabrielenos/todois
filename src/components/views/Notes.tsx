'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { apiGetNotes, apiCreateNote, apiDeleteNote, ApiNote } from '@/lib/api';

export default function Notes() {
  const { token } = useAuth();
  const { t } = usePreferences();
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: '',
    color: 'yellow'
  });

  // Load notes from backend
  useEffect(() => {
    if (!token) return;
    
    const loadNotes = async () => {
      try {
        setLoading(true);
        const data = await apiGetNotes(token);
        setNotes(data);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [token]);

  // Calculate category stats
  const categoryStats = notes.reduce((acc, note) => {
    const cat = note.category || 'Lainnya';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleCreateNote = async () => {
    if (!token || !newNote.title.trim()) {
      alert(t('notes.titleRequired'));
      return;
    }

    try {
      const created = await apiCreateNote(token, {
        title: newNote.title,
        content: newNote.content || null,
        category: newNote.category || null,
        color: newNote.color
      });
      
      setNotes([created, ...notes]);
      setShowCreateModal(false);
      setNewNote({ title: '', content: '', category: '', color: 'yellow' });
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Gagal membuat catatan. Pastikan backend server sudah running.');
    }
  };

  const getColorClass = (color: string) => {
    const colors = {
      yellow: 'from-yellow-400 to-yellow-500',
      blue: 'from-blue-400 to-blue-500',
      green: 'from-green-400 to-green-500',
      purple: 'from-purple-400 to-purple-500',
      pink: 'from-pink-400 to-pink-500',
    };
    return colors[color as keyof typeof colors] || colors.yellow;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('notes.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            📝 {t('notes.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('notes.subtitle')}
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
        >
          ➕ {t('notes.addNew')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{notes.length}</p>
              <p className="text-gray-600 dark:text-gray-400">{t('notes.totalNotes')}</p>
            </div>
          </div>
        </div>
        {Object.entries(categoryStats).slice(0, 3).map(([category, count], index) => {
          const icons = ['💡', '💼', '👤', '📚'];
          const colors = ['yellow', 'blue', 'green', 'purple'];
          return (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${colors[index]}-500 to-${colors[index]}-600 rounded-xl flex items-center justify-center text-2xl`}>
                  {icons[index]}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{count}</p>
                  <p className="text-gray-600 dark:text-gray-400">{category}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(note.id)}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 hover:shadow-xl transition-all cursor-pointer ${
              selectedNote === note.id
                ? 'border-blue-500 scale-105'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {/* Note Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`px-3 py-1 bg-gradient-to-r ${getColorClass(note.color)} text-white rounded-full text-sm font-medium`}>
                {note.category}
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ⋮
              </button>
            </div>

            {/* Note Content */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {note.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {note.content}
            </p>

            {/* Note Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
              <span>📅 {formatDate(note.updated_at)}</span>
              <button className="text-blue-500 hover:text-blue-600 font-medium">
                Baca →
              </button>
            </div>
          </div>
        ))}

        {/* Add New Note Card */}
        <div 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer flex items-center justify-center min-h-[250px]"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">➕</div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {t('notes.addNewNote')}
            </p>
          </div>
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              ➕ {t('notes.addNew')}
            </h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('notes.noteTitle')} *
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Masukkan judul catatan..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('notes.category')}
                </label>
                <input
                  type="text"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Ide, Kerja, Pribadi..."
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('notes.color')}
                </label>
                <div className="flex gap-3">
                  {['yellow', 'blue', 'green', 'purple', 'pink'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewNote({ ...newNote, color })}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        newNote.color === color ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'
                      } bg-gradient-to-br ${getColorClass(color)}`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('notes.content')}
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Tulis catatan Anda di sini..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: '', content: '', category: '', color: 'yellow' });
                }}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
              >
                {t('notes.cancel')}
              </button>
              <button
                onClick={handleCreateNote}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                {t('notes.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
