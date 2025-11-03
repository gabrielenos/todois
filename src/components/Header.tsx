'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from './ProfileModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Left side - can add breadcrumbs or title here */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              📝 Todo App
            </h2>
          </div>

          {/* Right side - User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{user?.username || 'username'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40">
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @{user?.username || 'username'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <span className="text-xl">👤</span>
                      <div>
                        <p className="font-medium">Profil Saya</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Edit profil dan password
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <span className="text-xl">⚙️</span>
                      <div>
                        <p className="font-medium">Pengaturan</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Tema dan preferensi
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <span className="text-xl">🚪</span>
                      <div>
                        <p className="font-medium">Keluar</p>
                        <p className="text-xs text-red-500 dark:text-red-500">
                          Logout dari akun
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
}
