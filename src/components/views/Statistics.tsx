'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { apiGetTodos, ApiTodo } from '@/lib/api';

export default function Statistics() {
  const { token } = useAuth();
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
        console.error('Error loading todos:', error);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, [token]);

  // Calculate real statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // Category statistics from real data
  const categoryMap = new Map<string, number>();
  todos.forEach(todo => {
    const category = todo.category || 'Lainnya';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  const categoryStats = Array.from(categoryMap.entries()).map(([name, count], index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
    ];
    return {
      name,
      count,
      color: colors[index % colors.length],
    };
  }).sort((a, b) => b.count - a.count);

  // Weekly data - last 7 days
  const getDayName = (dayIndex: number) => {
    const dayKeys = [
      'calendar.daySun', 'calendar.dayMon', 'calendar.dayTue', 'calendar.dayWed',
      'calendar.dayThu', 'calendar.dayFri', 'calendar.daySat'
    ];
    return t(dayKeys[dayIndex]);
  };

  const weeklyData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayTodos = todos.filter(todo => {
      const todoDate = new Date(todo.created_at);
      return todoDate >= date && todoDate < nextDate;
    });
    
    const completed = dayTodos.filter(t => t.completed).length;
    const total = dayTodos.length;
    
    weeklyData.push({
      day: getDayName(date.getDay()),
      completed,
      total,
    });
  }

  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1);
  const avgPerDay = totalTodos > 0 ? (totalTodos / 7).toFixed(1) : '0.0';

  // Calculate streak (consecutive days with completed todos)
  let streak = 0;
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const hasCompleted = todos.some(todo => {
      const todoDate = new Date(todo.created_at);
      return todo.completed && todoDate >= date && todoDate < nextDate;
    });
    
    if (hasCompleted) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          📈 {t('statistics.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('statistics.subtitle')}
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Memuat statistik...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-3xl font-bold mb-1">{completedTodos}</p>
              <p className="text-blue-100">{t('statistics.completedTasks')}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-3xl font-bold mb-1">{completionRate}%</p>
              <p className="text-green-100">{t('statistics.completionRate')}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-4xl mb-2">⏱️</div>
              <p className="text-3xl font-bold mb-1">{avgPerDay}</p>
              <p className="text-yellow-100">{t('statistics.avgPerDay')}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-3xl font-bold mb-1">{streak}</p>
              <p className="text-purple-100">{t('statistics.streak')}</p>
            </div>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            📊 {t('statistics.weeklyProductivity')}
          </h2>
          <div className="space-y-4">
            {weeklyData.map((data) => {
              const percentage = (data.completed / data.total) * 100;
              const height = (data.completed / maxCompleted) * 100;
              
              return (
                <div key={data.day}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                      {data.day}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-xs font-bold text-white">
                              {data.completed}/{data.total}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white w-12 text-right">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            🎨 {t('statistics.categoryDistribution')}
          </h2>
          <div className="space-y-6">
            {categoryStats.map((category) => {
              const total = categoryStats.reduce((sum, c) => sum + c.count, 0);
              const percentage = (category.count / total) * 100;
              
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.count} tugas ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie Chart Representation */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {categoryStats.map((category, index) => {
                  const total = categoryStats.reduce((sum, c) => sum + c.count, 0);
                  const percentage = (category.count / total) * 100;
                  const prevPercentages = categoryStats
                    .slice(0, index)
                    .reduce((sum, c) => sum + (c.count / total) * 100, 0);
                  
                  const circumference = 2 * Math.PI * 40;
                  const offset = circumference - (percentage / 100) * circumference;
                  const rotation = (prevPercentages / 100) * 360;
                  
                  return (
                    <circle
                      key={category.name}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="20"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      style={{
                        transformOrigin: '50% 50%',
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                  <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                  <linearGradient id="gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
