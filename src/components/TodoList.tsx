'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { apiGetTodos, apiCreateTodo, apiUpdateTodo, apiDeleteTodo, apiClearCompleted, ApiTodo } from '@/lib/api';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  category?: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export default function TodoList() {
  const { user, token } = useAuth();
  const { t } = usePreferences();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // New states for enhanced features
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [description, setDescription] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'deadline'>('date');
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const CATEGORIES = ['Sekolah', 'Kerja', 'Pribadi', 'Lainnya'];
  
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'Sekolah': t('todo.categorySchool'),
      'Kerja': t('todo.categoryWork'),
      'Pribadi': t('todo.categoryPersonal'),
      'Lainnya': t('todo.categoryOther'),
    };
    return labels[category] || category;
  };
  const PRIORITIES = [
    { value: 'high', labelKey: 'todo.priorityHigh', color: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'medium', labelKey: 'todo.priorityMedium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'low', labelKey: 'todo.priorityLow', color: 'bg-green-100 text-green-700 border-green-300' },
  ];

  // Load from backend
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const data: ApiTodo[] = await apiGetTodos(token);
        const mapped: Todo[] = data.map(t => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          createdAt: new Date(t.created_at),
          dueDate: t.due_date ? new Date(t.due_date) : undefined,
          category: t.category || undefined,
          priority: (t.priority as 'high' | 'medium' | 'low') || 'medium',
          description: t.description || undefined,
        }));
        setTodos(mapped.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } catch (error) {
        console.error('Tidak dapat memuat todos. Pastikan server sudah berjalan.');
      }
    };
    load();
  }, [token]);

  // Helper functions
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isUpcoming = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // CREATE - Tambah todo baru
  const addTodo = async () => {
    console.log('addTodo called!', { inputValue, token: !!token });
    if (inputValue.trim() === '') {
      showNotification(t('todo.notifEmptyTitle'), 'warning');
      return;
    }
    
    if (!token) {
      showNotification(t('todo.notifMustLogin'), 'error');
      return;
    }
    
    try {
      console.log('Adding todo:', { text: inputValue, category: selectedCategory, priority: selectedPriority });
      
      const created = await apiCreateTodo(token, {
        text: inputValue,
        completed: false,
        due_date: selectedDueDate ? new Date(selectedDueDate).toISOString() : null,
        category: selectedCategory || null,
        priority: selectedPriority,
        description: description || null,
      });
      
      console.log('Todo created:', created);
      
      const newTodo: Todo = {
        id: created.id,
        text: created.text,
        completed: created.completed,
        createdAt: new Date(created.created_at),
        dueDate: created.due_date ? new Date(created.due_date) : undefined,
        category: created.category || undefined,
        priority: (created.priority as 'high' | 'medium' | 'low') || 'medium',
        description: created.description || undefined,
      };
      
      setTodos([newTodo, ...todos]);
      setInputValue('');
      setSelectedDueDate('');
      setSelectedCategory('');
      setSelectedPriority('medium');
      setDescription('');
      
      showNotification(t('todo.notifSuccess'), 'success');
      console.log('Todo added successfully!');
    } catch (error) {
      console.error('Error adding todo:', error);
      showNotification(t('todo.notifError'), 'error');
    }
  };

  // UPDATE - Toggle status completed
  const toggleTodo = async (id: number) => {
    if (!token) return;
    const target = todos.find(t => t.id === id);
    if (!target) return;
    const updated = await apiUpdateTodo(token, id, { completed: !target.completed });
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: updated.text,
            completed: updated.completed,
            dueDate: updated.due_date ? new Date(updated.due_date) : undefined,
          }
        : todo
    ));
  };

  // UPDATE - Edit todo text
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async (id: number) => {
    if (editingText.trim() === '' || !token) return;
    const updated = await apiUpdateTodo(token, id, { text: editingText });
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: updated.text,
            completed: updated.completed,
            dueDate: updated.due_date ? new Date(updated.due_date) : undefined,
          }
        : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // DELETE - Hapus todo
  const deleteTodo = async (id: number) => {
    if (!token) return;
    await apiDeleteTodo(token, id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // DELETE ALL - Hapus semua completed todos
  const clearCompleted = async () => {
    if (!token) return;
    await apiClearCompleted(token);
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Sort function
  const sortTodos = (todosToSort: Todo[]) => {
    return [...todosToSort].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'deadline') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  // Filter todos berdasarkan search dan status
  const filteredTodos = sortTodos(todos.filter(todo => {
    // Filter berdasarkan status
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Filter berdasarkan search
    if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter berdasarkan kategori
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;

    // Filter berdasarkan prioritas
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    
    return true;
  }));

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const getPriorityColor = (priority: string) => {
    const p = PRIORITIES.find(pr => pr.value === priority);
    return p ? p.color : '';
  };

  const getPriorityLabel = (priority: string) => {
    const p = PRIORITIES.find(pr => pr.value === priority);
    return p ? t(p.labelKey) : priority;
  };

  return (
    <div className="relative flex gap-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden min-h-[700px] border border-gray-200/50 dark:border-gray-700/50">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 animate-slide-in-right flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-500 border-green-600 text-white' 
            : notification.type === 'error'
            ? 'bg-red-500 border-red-600 text-white'
            : 'bg-yellow-500 border-yellow-600 text-white'
        }`}>
          <span className="text-lg">
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : '⚠️'}
          </span>
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 overflow-hidden`}>
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`🔍 ${t('todo.searchPlaceholder')}`}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white text-sm transition-all shadow-sm hover:shadow-md"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 mb-6">
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="flex-1 text-left font-medium">{t('todo.tasks')}</span>
              <span className="text-sm">{activeCount}</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:shadow-md group"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                ✅ {t('todo.myTasks')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('todo.allTasks')}
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder={`✨ ${t('todo.addTask')}...`}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-gray-700 dark:text-white transition-all text-base"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="date"
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-gray-700 dark:text-white transition-all text-sm"
                />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-gray-700 dark:text-white transition-all text-sm"
                >
                  <option value="">{t('todo.category')}</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                  ))}
                </select>
                
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-gray-700 dark:text-white transition-all text-sm"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Button clicked!');
                    addTodo();
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 cursor-pointer relative z-10"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('todo.addTask')}
                  </span>
                </button>
              </div>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`📝 ${t('todo.description')}...`}
                className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-gray-700 dark:text-white transition-all text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border-2 border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('todo.filterAll')} <span className="ml-1 text-sm opacity-75">({todos.length})</span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filter === 'active'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border-2 border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('todo.filterActive')} <span className="ml-1 text-sm opacity-75">({activeCount})</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border-2 border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('todo.filterCompleted')} <span className="ml-1 text-sm opacity-75">({completedCount})</span>
          </button>
        </div>

        {/* Advanced Filters and Sort */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">{t('todo.allCategories')}</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">{t('todo.allPriorities')}</option>
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'deadline')}
            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="date">{t('todo.sortNewest')}</option>
            <option value="priority">{t('todo.sortPriority')}</option>
            <option value="deadline">{t('todo.sortDeadline')}</option>
          </select>
        </div>

        {/* Todo List */}
        <div className="space-y-4 mb-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <span className="text-5xl">
                  {filter === 'completed' && todos.length > 0
                    ? '🎉'
                    : filter === 'active' && todos.length > 0
                    ? '✨'
                    : '📝'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {filter === 'completed' && todos.length > 0
                  ? t('todo.noCompletedTasks')
                  : filter === 'active' && todos.length > 0
                  ? t('todo.allTasksCompleted')
                  : t('todo.noTasks')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'completed' && todos.length > 0
                  ? t('todo.completeTasksToSee')
                  : filter === 'active' && todos.length > 0
                  ? t('todo.greatJobAllDone')
                  : t('todo.startByAdding')}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                  todo.completed
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-sm'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-6 h-6 rounded-lg cursor-pointer accent-blue-500 transition-transform hover:scale-110"
                />

                {/* Todo Text or Edit Input */}
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    className="flex-1 px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white font-medium"
                    autoFocus
                  />
                ) : (
                  <div className="flex-1">
                    <span
                      className={`block text-base font-medium ${
                        todo.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {todo.dueDate && (
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                          todo.completed
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        }`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(todo.dueDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                        </span>
                      )}
                      {todo.category && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                          🏷️ {todo.category}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${getPriorityColor(todo.priority)}`}>
                        {todo.priority === 'high' && '🔴'}
                        {todo.priority === 'medium' && '🟡'}
                        {todo.priority === 'low' && '🟢'}
                        {getPriorityLabel(todo.priority)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
                      >
                        ✔️ {t('todo.save')}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
                      >
                        ❌ {t('todo.cancel')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={todo.completed}
                      >
                        ✏️ {t('todo.edit')}
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
                      >
                        🗑️ {t('todo.delete')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center pt-6 mt-6 border-t-2 border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {activeCount} {t('todo.activeTasks')}
              </p>
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('todo.clearCompleted')} ({completedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
