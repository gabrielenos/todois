'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiLogin, apiMe, apiRegister, apiUpdateProfile } from '@/lib/api';

interface User {
  username: string;
  name: string;
}

interface UserPreferences {
  taskManagement: string;
  theme: 'light' | 'dark';
  language: 'id' | 'en';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; message?: string; needsOnboarding?: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  updateProfile: (name: string) => Promise<boolean>;
  needsOnboarding: boolean;
  completeOnboarding: (preferences: UserPreferences) => void;
  preferences: UserPreferences | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users - dalam produksi, ini harus dari backend/database
const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrator' },
  { username: 'user', password: 'user123', name: 'User Demo' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // Load user dari localStorage saat komponen mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const savedPreferences = localStorage.getItem('userPreferences');
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch {
        // Ignore parse errors
      }
    }
    
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setUser(parsed);
        setToken(token);
        // Optional: verify token by calling /me
        apiMe(token).catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        });
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiLogin(email, password);
      const userData: User = { username: res.user.username, name: res.user.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', res.access_token);
      setToken(res.access_token);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, username: string, email: string, password: string): Promise<{ success: boolean; message?: string; needsOnboarding?: boolean }> => {
    try {
      const res = await apiRegister(name, username, email, password);
      const userData: User = { username: res.user.username, name: res.user.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', res.access_token);
      setToken(res.access_token);
      setNeedsOnboarding(true); // Show onboarding for new users
      return { success: true, needsOnboarding: true };
    } catch (e: any) {
      // Ganti pesan error yang lebih user-friendly
      let errorMsg = e?.message || 'Tidak dapat mendaftar';
      if (errorMsg.includes('fetch') || errorMsg.includes('Failed')) {
        errorMsg = 'Tidak dapat mendaftar. Pastikan server sudah berjalan.';
      }
      return { success: false, message: errorMsg };
    }
  };

  const completeOnboarding = (userPreferences: UserPreferences) => {
    setPreferences(userPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    
    // Apply theme preference
    localStorage.setItem('theme', userPreferences.theme);
    if (userPreferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply language preference
    localStorage.setItem('language', userPreferences.language);
    
    setNeedsOnboarding(false);
    
    // Force reload to apply preferences
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const updateProfile = async (name: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const updatedUser = await apiUpdateProfile(token, name);
      const userData: User = { username: updatedUser.username, name: updatedUser.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setToken(null);
    setNeedsOnboarding(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user, 
      token, 
      updateProfile,
      needsOnboarding,
      completeOnboarding,
      preferences
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

