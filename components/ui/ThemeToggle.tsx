import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex-shrink-0"
      aria-label={theme === 'light' ? t('theme.enableDark') : t('theme.enableLight')}
      title={theme === 'light' ? t('theme.darkMode') : t('theme.lightMode')}
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

