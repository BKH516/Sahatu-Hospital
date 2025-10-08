import React, { lazy, Suspense } from 'react';
import { useApp } from './context/AppContext';

// Lazy load components
const Auth = lazy(() => import('./components/Auth'));
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

const App: React.FC = () => {
  const { isAuthenticated, login, logout } = useApp();

  const handleAuthSuccess = (newToken: string, remember: boolean = false) => {
    login(newToken, remember);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </Suspense>
  );
};

export default App;
