'use client';

import { useState } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

export default function Contacts() {
  const { t } = usePreferences();
  // Data kosong - nanti bisa diintegrasikan dengan backend
  const [contacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      unread: { labelKey: 'contacts.statusUnread', color: 'bg-blue-100 text-blue-700 border-blue-300' },
      read: { labelKey: 'contacts.statusRead', color: 'bg-gray-100 text-gray-700 border-gray-300' },
      replied: { labelKey: 'contacts.statusReplied', color: 'bg-green-100 text-green-700 border-green-300' },
    };
    return badges[status as keyof typeof badges] || badges.unread;
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          📧 {t('contacts.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('contacts.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
              📬
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {contacts.filter(c => c.status === 'unread').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{t('contacts.statusUnread')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-2xl">
              📭
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {contacts.filter(c => c.status === 'read').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{t('contacts.statusRead')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {contacts.filter(c => c.status === 'replied').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{t('contacts.statusReplied')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {t('contacts.messageList')}
          </h2>
        </div>
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📧</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('contacts.noMessages')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t('contacts.startReceiving')}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              <span>💡</span>
              <span>{t('contacts.featureNote')}</span>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.map((contact) => {
              const badge = getStatusBadge(contact.status);
              return (
                <div
                  key={contact.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedContact === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                        {t(badge.labelKey)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.date}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    {contact.subject}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {contact.message}
                  </p>
                  {selectedContact === contact.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                          💬 Balas
                        </button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          ✓ Tandai Selesai
                        </button>
                        <button className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
