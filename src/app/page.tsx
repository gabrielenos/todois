'use client';

import { useAuth, AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import MainLayout from '@/components/MainLayout';
import Login from '@/components/Login';
import Onboarding from '@/components/Onboarding';

function AppContent() {
  const { isAuthenticated, needsOnboarding, completeOnboarding } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return <MainLayout />;
}

export default function Home() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PreferencesProvider>
  );
}
