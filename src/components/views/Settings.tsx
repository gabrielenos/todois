'use client';

import { usePreferences } from '@/context/PreferencesContext';

export default function Settings() {
  const { theme, language, toggleTheme, setLanguage, t } = usePreferences();

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          ⚙️ {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-8">
          {/* Appearance Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t('settings.appearance')}
            </h3>
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {t('settings.darkMode')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t('settings.language')}
            </h3>
            <div className="space-y-3">
              {/* Indonesian */}
              <button
                onClick={() => setLanguage('id')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  language === 'id'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇮🇩</span>
                  <div className="text-left">
                    <p className="font-medium">{t('settings.indonesian')}</p>
                    <p className={`text-sm ${language === 'id' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      Bahasa Indonesia
                    </p>
                  </div>
                </div>
                {language === 'id' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* English */}
              <button
                onClick={() => setLanguage('en')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div className="text-left">
                    <p className="font-medium">{t('settings.english')}</p>
                    <p className={`text-sm ${language === 'en' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      English
                    </p>
                  </div>
                </div>
                {language === 'en' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                    {language === 'id' ? 'Informasi' : 'Information'}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {language === 'id' 
                      ? 'Pengaturan Anda akan tersimpan secara otomatis dan diterapkan di seluruh aplikasi.'
                      : 'Your settings will be saved automatically and applied throughout the app.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
