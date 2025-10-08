import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      aria-label={theme === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل الوضع النهاري'}
      title={theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;

