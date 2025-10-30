import React, { lazy, Suspense, useState } from 'react';
import { useApp } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import { toasterConfig } from './utils';

// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const RegisterPage = lazy(() => import('./components/RegisterPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">جاري التحميل...</p>
    </div>
  </div>
);

type AppView = 'landing' | 'login' | 'register';

const App: React.FC = () => {
  const { isAuthenticated, login, logout } = useApp();
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const handleAuthSuccess = (newToken: string, remember: boolean = false) => {
    login(newToken, remember);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  const handleNavigateToLogin = () => {
    setCurrentView('login');
  };

  const handleNavigateToRegister = () => {
    setCurrentView('register');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <>
      <Toaster {...toasterConfig} />
      <Suspense fallback={<LoadingFallback />}>
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : currentView === 'login' ? (
          <LoginPage 
            onAuthSuccess={handleAuthSuccess} 
            onBack={handleBackToLanding}
            onNavigateToRegister={handleNavigateToRegister}
          />
        ) : currentView === 'register' ? (
          <RegisterPage 
            onAuthSuccess={handleAuthSuccess} 
            onBack={handleBackToLanding}
            onNavigateToLogin={handleNavigateToLogin}
          />
        ) : (
          <LandingPage 
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToRegister={handleNavigateToRegister}
          />
        )}
      </Suspense>
    </>
  );
};

export default App;
