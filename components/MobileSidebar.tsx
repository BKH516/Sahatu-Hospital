import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const menuItems = [
    { 
      id: 'overview', 
      label: t('dashboard.navigation.overview'), 
      icon: HomeIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    },
    { 
      id: 'services', 
      label: t('dashboard.navigation.services'), 
      icon: SettingsIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    },
    { 
      id: 'schedule', 
      label: t('dashboard.navigation.workSchedule'), 
      icon: ClockIcon,
      activeColor: 'from-teal-600 to-blue-600',
      hoverColor: 'hover:bg-teal-50'
    },
    { 
      id: 'reservations', 
      label: t('dashboard.navigation.reservations'), 
      icon: CalendarIcon,
      activeColor: 'from-purple-600 to-indigo-600',
      hoverColor: 'hover:bg-purple-50'
    },
    { 
      id: 'history', 
      label: t('dashboard.navigation.reservationHistory'), 
      icon: DocumentTextIcon,
      activeColor: 'from-indigo-600 to-purple-600',
      hoverColor: 'hover:bg-indigo-50'
    },
    { 
      id: 'profile', 
      label: t('dashboard.navigation.profile'), 
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
          className="fixed inset-0 bg-black/55 dark:bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 h-full w-[17rem] sm:w-72 max-w-full z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isRTL ? 'right-0' : 'left-0'
        } ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}`}
      >
        <div
          className={`h-full w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-2xl border border-gray-200/70 dark:border-gray-800/70 transition-colors duration-200 ${
            isRTL ? 'border-l' : 'border-r'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 opacity-95" />
              <div className="relative px-6 pt-6 pb-5 flex flex-col gap-4 text-white">
                <button
                  onClick={onClose}
                  className={`absolute top-5 p-2 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 transition-all duration-200 ${
                    isRTL ? 'left-5' : 'right-5'
                  }`}
                  aria-label={t('common.close') || 'Close'}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>

                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                    <span className="text-white text-lg font-semibold">S</span>
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h1 className="text-lg font-semibold leading-tight">{t('mobileSidebar.platformName')}</h1>
                    <p className="text-xs text-white/80">{t('mobileSidebar.dashboard')}</p>
                  </div>
                </div>

                <div className={`text-xs text-white/80 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('mobileSidebar.manageHospital')}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <p className={`text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('mobileSidebar.quickAccess')}
              </p>
              <ul className="space-y-2.5">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const current = activeTab === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onTabChange(item.id as MobileSidebarProps['activeTab']);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 shadow-sm ${
                          current
                            ? `bg-gradient-to-${isRTL ? 'l' : 'r'} ${item.activeColor} text-white shadow-lg shadow-${isRTL ? 'teal' : 'blue'}-500/30`
                            : 'bg-white/60 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/60 hover:border-teal-400/60 hover:bg-white dark:hover:bg-gray-800'
                        } ${isRTL ? 'flex-row-reverse text-right gap-3' : 'flex-row text-left gap-3'}`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`p-2 rounded-lg ${
                              current
                                ? 'bg-white/20'
                                : 'bg-teal-100/70 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300'
                            }`}
                          >
                            <IconComponent className={`w-5 h-5 ${current ? 'text-white' : ''}`} />
                          </span>
                          <span className="font-medium text-sm">{item.label}</span>
                        </span>
                        {!current && (
                          <BriefcaseIcon className={`w-4 h-4 text-gray-300 dark:text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Support / Footer */}
            <div className="px-4 pb-6">
              <div className="rounded-2xl bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-800/70 dark:via-gray-800/40 dark:to-gray-800/20 border border-gray-200/70 dark:border-gray-700/60 p-4">
                <h2 className={`text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('mobileSidebar.supportTitle')}
                </h2>
                <p className={`text-xs text-gray-500 dark:text-gray-400 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('mobileSidebar.supportDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
