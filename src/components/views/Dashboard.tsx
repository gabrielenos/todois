'use client';

import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useState, useEffect } from 'react';
import { apiGetTodos, ApiTodo } from '@/lib/api';

export default function Dashboard() {
  const { user, token } = useAuth();
  const { t } = usePreferences();
  const [todos, setTodos] = useState<ApiTodo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiGetTodos(token);
        setTodos(data);
      } catch (error) {
        // Silently handle error - just set empty todos
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, [token]);

  // Hitung statistik dari data real
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const inProgressTodos = todos.filter(t => !t.completed && !isOverdue(t.due_date)).length;
  const overdueTodos = todos.filter(t => !t.completed && isOverdue(t.due_date)).length;

  function isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  const stats = [
    { labelKey: 'dashboard.totalTasks', value: totalTodos.toString(), icon: '✅', color: 'from-blue-500 to-blue-600' },
    { labelKey: 'dashboard.completed', value: completedTodos.toString(), icon: '🎉', color: 'from-green-500 to-green-600' },
    { labelKey: 'dashboard.inProgress', value: inProgressTodos.toString(), icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
    { labelKey: 'dashboard.overdue', value: overdueTodos.toString(), icon: '⚠️', color: 'from-red-500 to-red-600' },
  ];

  // Ambil 5 tugas terbaru
  const recentTodos = [...todos]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('dashboard.welcome')}, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('dashboard.summary')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {t(stat.labelKey)}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          📋 {t('dashboard.recentTasks')}
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('common.loading')}
          </div>
        ) : recentTodos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('dashboard.noTasks')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t('dashboard.startAdding')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                      {todo.text}
                    </p>
                    {todo.completed && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                  {todo.category && (
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                      {todo.category}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {todo.priority && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      todo.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : todo.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {todo.priority === 'high' ? t('todo.priorityHigh') : todo.priority === 'medium' ? t('todo.priorityMedium') : t('todo.priorityLow')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
