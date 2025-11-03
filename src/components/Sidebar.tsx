'use client';

import { usePreferences } from '@/context/PreferencesContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { t } = usePreferences();

  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: '📊' },
    { id: 'todos', label: t('sidebar.todos'), icon: '✅' },
    { id: 'contacts', label: t('sidebar.contacts'), icon: '📧' },
    { id: 'calendar', label: t('sidebar.calendar'), icon: '📅' },
    { id: 'notes', label: t('sidebar.notes'), icon: '📝' },
    { id: 'statistics', label: t('sidebar.statistics'), icon: '📈' },
    { id: 'settings', label: t('sidebar.settings'), icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📝 Todo App
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('sidebar.subtitle')}
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-xs text-gray-500 dark:text-gray-500">
          <p className="mb-1">📝 Todo App v1.0</p>
          <p>© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
