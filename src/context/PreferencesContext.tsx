'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'id' | 'en';

interface PreferencesContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Translations
const translations = {
  id: {
    // Auth
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.email': 'Email',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.name': 'Nama Lengkap',
    'auth.confirmPassword': 'Konfirmasi Password',
    'auth.alreadyHaveAccount': 'Sudah punya akun?',
    'auth.dontHaveAccount': 'Belum punya akun?',
    'auth.loginHere': 'Masuk di sini',
    'auth.registerHere': 'Daftar di sini',
    
    // Onboarding
    'onboarding.welcome': 'Selamat Datang',
    'onboarding.getStarted': 'Mari Mulai',
    'onboarding.skip': 'Lewati',
    'onboarding.next': 'Lanjut',
    'onboarding.finish': 'Selesai',
    
    // Dashboard
    'dashboard.welcome': 'Selamat Datang',
    'dashboard.summary': 'Ini adalah ringkasan aktivitas Anda hari ini',
    'dashboard.totalTasks': 'Total Tugas',
    'dashboard.completed': 'Selesai',
    'dashboard.inProgress': 'Dalam Progress',
    'dashboard.overdue': 'Tertunda',
    'dashboard.recentTasks': 'Tugas Terbaru',
    'dashboard.noTasks': 'Belum Ada Tugas',
    'dashboard.startAdding': 'Mulai tambahkan tugas baru di halaman Todo List',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.todos': 'Todo List',
    'sidebar.contacts': 'Kontak Masuk',
    'sidebar.calendar': 'Kalender',
    'sidebar.notes': 'Catatan',
    'sidebar.statistics': 'Statistik',
    'sidebar.settings': 'Pengaturan',
    'sidebar.subtitle': 'Kelola tugas Anda',
    
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.todoList': 'Todo List',
    'menu.contacts': 'Kontak Masuk',
    'menu.calendar': 'Kalender',
    'menu.notes': 'Catatan',
    'menu.statistics': 'Statistik',
    'menu.profile': 'Profil Saya',
    'menu.settings': 'Pengaturan',
    'menu.logout': 'Keluar',
    
    // Todo
    'todo.title': 'Todo List',
    'todo.subtitle': 'Kelola semua tugas dan aktivitas Anda',
    'todo.myTasks': 'Tugas Saya',
    'todo.allTasks': 'Kelola semua tugas Anda',
    'todo.addTask': 'Tambah Tugas',
    'todo.searchPlaceholder': 'Cari tugas...',
    'todo.noTasks': 'Belum ada tugas',
    'todo.category': 'Kategori',
    'todo.priority': 'Prioritas',
    'todo.deadline': 'Deadline',
    'todo.description': 'Deskripsi',
    'todo.priorityHigh': 'Tinggi',
    'todo.priorityMedium': 'Sedang',
    'todo.priorityLow': 'Rendah',
    'todo.filterAll': 'Semua',
    'todo.filterActive': 'Aktif',
    'todo.filterCompleted': 'Selesai',
    'todo.allCategories': 'Semua Kategori',
    'todo.allPriorities': 'Semua Prioritas',
    'todo.sortNewest': 'Urutkan: Terbaru',
    'todo.sortPriority': 'Urutkan: Prioritas',
    'todo.sortDeadline': 'Urutkan: Deadline',
    'todo.categorySchool': 'Sekolah',
    'todo.categoryWork': 'Kerja',
    'todo.categoryPersonal': 'Pribadi',
    'todo.categoryOther': 'Lainnya',
    'todo.noCompletedTasks': 'Belum Ada Tugas Selesai',
    'todo.allTasksCompleted': 'Semua Tugas Sudah Selesai!',
    'todo.completeTasksToSee': 'Selesaikan tugas untuk melihatnya di sini',
    'todo.greatJobAllDone': 'Kerja bagus! Semua tugas telah diselesaikan',
    'todo.startByAdding': 'Mulai dengan menambahkan tugas baru di atas',
    'todo.activeTasks': 'tugas aktif',
    'todo.errorAdding': 'Gagal menambahkan tugas. Pastikan backend server sudah berjalan.',
    'todo.delete': 'Hapus',
    'todo.clearCompleted': 'Hapus Selesai',
    'todo.edit': 'Edit',
    'todo.save': 'Simpan',
    'todo.cancel': 'Batal',
    'todo.tasks': 'Tugas',
    'todo.notifEmptyTitle': 'Silakan isi judul tugas terlebih dahulu! 📝',
    'todo.notifMustLogin': 'Anda harus login terlebih dahulu! 🔐',
    'todo.notifSuccess': 'Tugas berhasil ditambahkan! ✅',
    'todo.notifError': 'Gagal menambahkan tugas. Coba lagi! ❌',
    
    // Calendar
    'calendar.title': 'Kalender',
    'calendar.subtitle': 'Kelola jadwal dan acara Anda',
    'calendar.upcomingEvents': 'Acara Mendatang',
    'calendar.noEvents': 'Belum Ada Acara',
    'calendar.addEvent': 'Tambah Acara',
    'calendar.eventTitle': 'Judul Acara',
    'calendar.date': 'Tanggal',
    'calendar.time': 'Waktu',
    'calendar.color': 'Warna',
    'calendar.cancel': 'Batal',
    'calendar.save': 'Simpan',
    'calendar.clickToAdd': 'Klik tombol di bawah untuk menambah acara',
    'calendar.today': 'Hari Ini',
    'calendar.monthJan': 'Januari',
    'calendar.monthFeb': 'Februari',
    'calendar.monthMar': 'Maret',
    'calendar.monthApr': 'April',
    'calendar.monthMay': 'Mei',
    'calendar.monthJun': 'Juni',
    'calendar.monthJul': 'Juli',
    'calendar.monthAug': 'Agustus',
    'calendar.monthSep': 'September',
    'calendar.monthOct': 'Oktober',
    'calendar.monthNov': 'November',
    'calendar.monthDec': 'Desember',
    'calendar.daySun': 'Min',
    'calendar.dayMon': 'Sen',
    'calendar.dayTue': 'Sel',
    'calendar.dayWed': 'Rab',
    'calendar.dayThu': 'Kam',
    'calendar.dayFri': 'Jum',
    'calendar.daySat': 'Sab',
    
    // Contacts
    'contacts.title': 'Kontak Masuk',
    'contacts.subtitle': 'Kelola pesan dan pertanyaan dari pengguna',
    'contacts.noMessages': 'Belum Ada Pesan',
    'contacts.startReceiving': 'Pesan dari pengguna akan muncul di sini',
    'contacts.messageList': 'Daftar Pesan',
    'contacts.featureNote': 'Fitur ini akan aktif setelah integrasi dengan form kontak',
    'contacts.statusUnread': 'Belum Dibaca',
    'contacts.statusRead': 'Sudah Dibaca',
    'contacts.statusReplied': 'Sudah Dibalas',
    
    // Notes
    'notes.title': 'Catatan',
    'notes.subtitle': 'Simpan ide dan catatan penting Anda',
    'notes.addNew': 'Catatan Baru',
    'notes.totalNotes': 'Total Catatan',
    'notes.noNotes': 'Belum ada catatan',
    'notes.loading': 'Memuat catatan...',
    'notes.noteTitle': 'Judul',
    'notes.category': 'Kategori',
    'notes.content': 'Isi Catatan',
    'notes.color': 'Warna',
    'notes.cancel': 'Batal',
    'notes.save': 'Simpan Catatan',
    'notes.titleRequired': 'Judul catatan harus diisi!',
    'notes.addNewNote': 'Tambah Catatan Baru',
    
    // Statistics
    'statistics.title': 'Statistik',
    'statistics.subtitle': 'Analisis produktivitas dan performa Anda',
    'statistics.completedTasks': 'Tugas Selesai',
    'statistics.completionRate': 'Tingkat Penyelesaian',
    'statistics.avgPerDay': 'Rata-rata/Hari',
    'statistics.streak': 'Hari Beruntun',
    'statistics.weeklyProductivity': 'Produktivitas Mingguan',
    'statistics.categoryDistribution': 'Distribusi Kategori',
    
    // Settings
    'settings.title': 'Pengaturan',
    'settings.subtitle': 'Kelola preferensi aplikasi Anda',
    'settings.appearance': 'Tampilan',
    'settings.darkMode': 'Mode Gelap',
    'settings.language': 'Bahasa',
    'settings.indonesian': 'Bahasa Indonesia',
    'settings.english': 'English',
    
    // Profile
    'profile.myProfile': 'Profil Saya',
    'profile.editProfile': 'Edit profil dan ubah password',
    'profile.name': 'Nama',
    'profile.username': 'Username',
    'profile.currentPassword': 'Password Saat Ini',
    'profile.newPassword': 'Password Baru',
    'profile.confirmNewPassword': 'Konfirmasi Password Baru',
    'profile.saveChanges': 'Simpan Perubahan',
    'profile.close': 'Tutup',
    
    // Common
    'common.loading': 'Memuat...',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.all': 'Semua',
    'common.active': 'Aktif',
    'common.completed': 'Selesai',
  },
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.loginHere': 'Login here',
    'auth.registerHere': 'Register now',
    
    // Onboarding
    'onboarding.welcome': 'Welcome',
    'onboarding.getStarted': "Let's Get Started",
    'onboarding.skip': 'Skip',
    'onboarding.next': 'Next',
    'onboarding.finish': 'Finish',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.summary': "Here's your activity summary for today",
    'dashboard.totalTasks': 'Total Tasks',
    'dashboard.completed': 'Completed',
    'dashboard.inProgress': 'In Progress',
    'dashboard.overdue': 'Overdue',
    'dashboard.recentTasks': 'Recent Tasks',
    'dashboard.noTasks': 'No Tasks Yet',
    'dashboard.startAdding': 'Start adding new tasks in the Todo List page',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.todos': 'Todo List',
    'sidebar.contacts': 'Inbox',
    'sidebar.calendar': 'Calendar',
    'sidebar.notes': 'Notes',
    'sidebar.statistics': 'Statistics',
    'sidebar.settings': 'Settings',
    'sidebar.subtitle': 'Manage your tasks',
    
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.todoList': 'Todo List',
    'menu.contacts': 'Inbox',
    'menu.calendar': 'Calendar',
    'menu.notes': 'Notes',
    'menu.statistics': 'Statistics',
    'menu.profile': 'My Profile',
    'menu.settings': 'Settings',
    'menu.logout': 'Logout',
    
    // Todo
    'todo.title': 'Todo List',
    'todo.subtitle': 'Manage all your tasks and activities',
    'todo.myTasks': 'My Tasks',
    'todo.allTasks': 'Manage all your tasks',
    'todo.addTask': 'Add Task',
    'todo.searchPlaceholder': 'Search tasks...',
    'todo.noTasks': 'No tasks yet',
    'todo.category': 'Category',
    'todo.priority': 'Priority',
    'todo.deadline': 'Deadline',
    'todo.description': 'Description',
    'todo.priorityHigh': 'High',
    'todo.priorityMedium': 'Medium',
    'todo.priorityLow': 'Low',
    'todo.filterAll': 'All',
    'todo.filterActive': 'Active',
    'todo.filterCompleted': 'Completed',
    'todo.allCategories': 'All Categories',
    'todo.allPriorities': 'All Priorities',
    'todo.sortNewest': 'Sort: Newest',
    'todo.sortPriority': 'Sort: Priority',
    'todo.sortDeadline': 'Sort: Deadline',
    'todo.categorySchool': 'School',
    'todo.categoryWork': 'Work',
    'todo.categoryPersonal': 'Personal',
    'todo.categoryOther': 'Other',
    'todo.noCompletedTasks': 'No Completed Tasks',
    'todo.allTasksCompleted': 'All Tasks Completed!',
    'todo.completeTasksToSee': 'Complete tasks to see them here',
    'todo.greatJobAllDone': 'Great job! All tasks completed',
    'todo.startByAdding': 'Start by adding a new task above',
    'todo.activeTasks': 'active tasks',
    'todo.errorAdding': 'Failed to add task. Make sure backend server is running.',
    'todo.delete': 'Delete',
    'todo.clearCompleted': 'Clear Completed',
    'todo.edit': 'Edit',
    'todo.save': 'Save',
    'todo.cancel': 'Cancel',
    'todo.tasks': 'Tasks',
    'todo.notifEmptyTitle': 'Please fill in the task title first! 📝',
    'todo.notifMustLogin': 'You must login first! 🔐',
    'todo.notifSuccess': 'Task added successfully! ✅',
    'todo.notifError': 'Failed to add task. Try again! ❌',
    
    // Calendar
    'calendar.title': 'Calendar',
    'calendar.subtitle': 'Manage your schedule and events',
    'calendar.upcomingEvents': 'Upcoming Events',
    'calendar.noEvents': 'No Events',
    'calendar.addEvent': 'Add Event',
    'calendar.eventTitle': 'Event Title',
    'calendar.date': 'Date',
    'calendar.time': 'Time',
    'calendar.color': 'Color',
    'calendar.cancel': 'Cancel',
    'calendar.save': 'Save',
    'calendar.clickToAdd': 'Click the button below to add an event',
    'calendar.today': 'Today',
    'calendar.monthJan': 'January',
    'calendar.monthFeb': 'February',
    'calendar.monthMar': 'March',
    'calendar.monthApr': 'April',
    'calendar.monthMay': 'May',
    'calendar.monthJun': 'June',
    'calendar.monthJul': 'July',
    'calendar.monthAug': 'August',
    'calendar.monthSep': 'September',
    'calendar.monthOct': 'October',
    'calendar.monthNov': 'November',
    'calendar.monthDec': 'December',
    'calendar.daySun': 'Sun',
    'calendar.dayMon': 'Mon',
    'calendar.dayTue': 'Tue',
    'calendar.dayWed': 'Wed',
    'calendar.dayThu': 'Thu',
    'calendar.dayFri': 'Fri',
    'calendar.daySat': 'Sat',
    
    // Contacts
    'contacts.title': 'Inbox',
    'contacts.subtitle': 'Manage messages and inquiries from users',
    'contacts.noMessages': 'No Messages',
    'contacts.startReceiving': 'Messages from users will appear here',
    'contacts.messageList': 'Message List',
    'contacts.featureNote': 'This feature will be active after contact form integration',
    'contacts.statusUnread': 'Unread',
    'contacts.statusRead': 'Read',
    'contacts.statusReplied': 'Replied',
    
    // Notes
    'notes.title': 'Notes',
    'notes.subtitle': 'Save your ideas and important notes',
    'notes.addNew': 'New Note',
    'notes.totalNotes': 'Total Notes',
    'notes.noNotes': 'No notes yet',
    'notes.loading': 'Loading notes...',
    'notes.noteTitle': 'Title',
    'notes.category': 'Category',
    'notes.content': 'Note Content',
    'notes.color': 'Color',
    'notes.cancel': 'Cancel',
    'notes.save': 'Save Note',
    'notes.titleRequired': 'Note title is required!',
    'notes.addNewNote': 'Add New Note',
    
    // Statistics
    'statistics.title': 'Statistics',
    'statistics.subtitle': 'Analyze your productivity and performance',
    'statistics.completedTasks': 'Completed Tasks',
    'statistics.completionRate': 'Completion Rate',
    'statistics.avgPerDay': 'Avg/Day',
    'statistics.streak': 'Day Streak',
    'statistics.weeklyProductivity': 'Weekly Productivity',
    'statistics.categoryDistribution': 'Category Distribution',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your app preferences',
    'settings.appearance': 'Appearance',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.indonesian': 'Bahasa Indonesia',
    'settings.english': 'English',
    
    // Profile
    'profile.myProfile': 'My Profile',
    'profile.editProfile': 'Edit profile and change password',
    'profile.name': 'Name',
    'profile.username': 'Username',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmNewPassword': 'Confirm New Password',
    'profile.saveChanges': 'Save Changes',
    'profile.close': 'Close',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.active': 'Active',
    'common.completed': 'Completed',
  },
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('id');
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    setMounted(true);
  }, []);

  // Listen for storage changes (for when onboarding sets preferences)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedLanguage = localStorage.getItem('language') as Language;
      
      if (savedTheme && savedTheme !== theme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      if (savedLanguage && savedLanguage !== language) {
        setLanguage(savedLanguage);
      }
    };

    // Check every 100ms for changes (simple polling)
    const interval = setInterval(handleStorageChange, 100);
    
    return () => clearInterval(interval);
  }, [theme, language]);

  // Apply theme whenever it changes
  useEffect(() => {
    if (!mounted) return;
    
    console.log('Applying theme:', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    
    console.log('HTML classes after apply:', document.documentElement.className);
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('PreferencesContext - toggleTheme called');
    console.log('Current theme:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('New theme:', newTheme);
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['id']] || key;
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
