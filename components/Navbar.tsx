import React from 'react';
import { Menu } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

interface NavbarProps {
  onLogout: () => void;
  onMenuClick: () => void;
  userFullName?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onMenuClick, userFullName, activeTab, onTabChange }) => {

  // Navigation items
  const navItems = [
    { key: 'overview', label: 'الرئيسية', icon: '🏠' },
    { key: 'services', label: 'الخدمات', icon: '🏥' },
    { key: 'schedule', label: 'الجدول', icon: '📅' },
    { key: 'reservations', label: 'الحجوزات', icon: '⏳' },
    { key: 'history', label: 'السجل', icon: '📜' },
    { key: 'profile', label: 'الملف الشخصي', icon: '👤' }
  ];

  const handleTabClick = (tabKey: string) => {
    if (onTabChange) {
      onTabChange(tabKey);
    }
  };

  return (
    <header className="w-full h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm z-30 fixed top-0 right-0 left-0 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Mobile Menu & Logo & User */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all duration-200"
              onClick={onMenuClick}
              aria-label="فتح القائمة الجانبية"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div>
              <img 
                src={`${import.meta.env.BASE_URL}assets/sihatelogo.png`}
                alt="صحتي لوجو" 
                className="h-16 w-auto object-contain"
              />
            </div>
            
            {/* User Info */}
            {userFullName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.75 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-sm font-medium">{userFullName}</span>
              </div>
            )}
          </div>

          {/* Center Section - Navigation Items */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-fit ${
                  activeTab === item.key
                    ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Logout button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
