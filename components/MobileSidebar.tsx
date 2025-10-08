import React from 'react';
import { CloseIcon, CalendarIcon, ClockIcon, SettingsIcon, DocumentTextIcon, UserIcon, HomeIcon, BriefcaseIcon } from "./ui/icons";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'overview' | 'profile' | 'services' | 'schedule' | 'reservations' | 'history';
  onTabChange: (tab: 'overview' | 'profile' | 'services' | 'schedule' | 'reservations' | 'history') => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange 
}) => {
  const menuItems = [
    { 
      id: 'overview', 
      label: 'الرئيسية', 
      icon: HomeIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    },
    { 
      id: 'services', 
      label: 'الخدمات', 
      icon: SettingsIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    },
    { 
      id: 'schedule', 
      label: 'جدول العمل', 
      icon: ClockIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    },
    { 
      id: 'reservations', 
      label: 'الحجوزات', 
      icon: CalendarIcon,
      activeColor: 'from-purple-600 to-indigo-600',
      hoverColor: 'hover:bg-purple-50'
    },
    { 
      id: 'history', 
      label: 'سجل الحجوزات', 
      icon: DocumentTextIcon,
      activeColor: 'from-indigo-600 to-purple-600',
      hoverColor: 'hover:bg-indigo-50'
    },
    { 
      id: 'profile', 
      label: 'الملف الشخصي', 
      icon: UserIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full w-full relative bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-l border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-lg transition-colors duration-200 ease-in-out text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 pt-16">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ص</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">منصة صحتي</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">لوحة التحكم</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onTabChange(item.id as MobileSidebarProps["activeTab"]);
                        onClose();
                      }}
                      className={`
                        w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg
                        transition-all duration-200 ease-in-out text-right
                        ${isActive 
                          ? `bg-gradient-to-l ${item.activeColor} text-white shadow-lg` 
                          : `text-gray-600 dark:text-gray-300 ${item.hoverColor} dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white`
                        }
                      `}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
