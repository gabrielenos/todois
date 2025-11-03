'use client';

import { useState } from 'react';

interface OnboardingProps {
  onComplete: (preferences: {
    taskManagement: string;
    theme: 'light' | 'dark';
    language: 'id' | 'en';
  }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [taskManagement, setTaskManagement] = useState('');

  const taskOptions = [
    { value: 'none', label: 'Tidak menggunakan sistem khusus', icon: '📝' },
    { value: 'paper', label: 'Menggunakan catatan kertas', icon: '📄' },
    { value: 'notes', label: 'Aplikasi notes di HP', icon: '📱' },
    { value: 'spreadsheet', label: 'Excel/Google Sheets', icon: '📊' },
    { value: 'other', label: 'Aplikasi todo list lainnya', icon: '✅' },
  ];

  const handleNext = () => {
    if (step === 1 && !taskManagement) return;
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete({ taskManagement, theme: 'light', language: 'id' });
    }
  };

  const handleSkip = () => {
    onComplete({ taskManagement: 'none', theme: 'light', language: 'id' });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 z-50">
      <div className="max-w-2xl w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Langkah {step} dari 2
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Lewati →
            </button>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Task Management */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                Selamat Datang!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Bagaimana Anda mengelola tugas saat ini?
              </p>
            </div>

            <div className="space-y-3">
              {taskOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTaskManagement(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${
                    taskManagement === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                  }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {option.label}
                  </span>
                  {taskManagement === option.value && (
                    <svg className="w-6 h-6 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Welcome Message */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Selamat Datang!
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                Kami sangat senang Anda bergabung! 😊
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 mb-6">
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                        Kelola Tugas dengan Mudah
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Atur semua tugas Anda dalam satu tempat yang rapi dan terorganisir
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                        Tingkatkan Produktivitas
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Pantau progress dan capai target Anda dengan lebih efektif
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                        Raih Kesuksesan
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Wujudkan impian Anda dengan perencanaan yang lebih baik
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  💡 <strong>Tips:</strong> Mulai dengan menambahkan tugas pertama Anda dan rasakan perbedaannya!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              ← Kembali
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !taskManagement}
            className={`flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              step === 1 && !taskManagement ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === 2 ? '🎉 Mulai Sekarang!' : 'Lanjut →'}
          </button>
        </div>
      </div>
    </div>
  );
}
