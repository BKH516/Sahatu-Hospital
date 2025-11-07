import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { HospitalIcon, SettingsIcon, ClockIcon, UserIcon, CalendarIcon } from './ui/icons';
import { getDashboardStats, DashboardStats } from '../services/statsService';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  userFullName?: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, userFullName }) => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        // Error loading dashboard stats
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [i18n.language]);


  // Get greeting based on time and language
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting.morning');
    if (hour < 17) return t('dashboard.greeting.afternoon');
    return t('dashboard.greeting.evening');
  };

  // Get current date formatted according to language
  const getCurrentDate = () => {
    const now = new Date();
    const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString(locale, options);
  };

  // Get display name
  const getDisplayName = () => {
    if (userFullName && userFullName !== '') return userFullName;
    return t('dashboard.overview.hospitalName');
  };

  return (
    <div className="space-y-4 md:space-y-8 w-full max-w-6xl mx-auto">
      {/* Welcome Section - Redesigned */}
      <div className="bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        </div>
        
        <div className="relative z-10 p-4 sm:p-5 md:p-6">
          {/* Main Content Container */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-4 sm:mb-5">
            {/* Left Section: Text Content */}
            <div className="flex-1 w-full min-w-0">
              <div className="mb-2">
                <p className="text-xs sm:text-sm text-teal-100/90 font-medium mb-1">
                  {t('dashboard.welcome')}
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 leading-tight">
                  {getGreeting()}, {getDisplayName()}
                </h1>
                <div className="flex items-center gap-1.5 text-teal-100/90">
                  <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <p className="text-xs sm:text-sm">
                    {getCurrentDate()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Section: Hospital Icon */}
            <div className={`flex-shrink-0 ${i18n.language === 'ar' ? 'sm:order-first' : ''}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/25 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/40 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <HospitalIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>
          </div>
          
          {/* Feature Badges - Compact Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2.5 border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl flex-shrink-0" role="img" aria-label="hospital">🏥</span>
                <span className="font-medium text-xs sm:text-sm text-white">
                  {t('dashboard.overview.hospitalName')}
                </span>
              </div>
            </div>
            
            <div 
              className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2.5 border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer shadow-md active:scale-95"
              onClick={() => onNavigate('services')}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl flex-shrink-0" role="img" aria-label="smart">📱</span>
                <span className="font-medium text-xs sm:text-sm text-white">
                  {t('dashboard.overview.smartManagement')}
                </span>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2.5 border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl flex-shrink-0" role="img" aria-label="fast">⚡</span>
                <span className="font-medium text-xs sm:text-sm text-white">
                  {t('dashboard.overview.fastPerformance')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className={`${i18n.language === 'ar' ? 'ml-4' : 'mr-4'} text-gray-600 dark:text-gray-300`}>{t('dashboard.overview.loading')}</p>
        </div>
      )}

      {/* Work Days Statistics */}
      {!loading && stats && (
        <>
      <div className="grid grid-cols-1 gap-4 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-r-4 border-r-green-500">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  {t('dashboard.overview.workDays.title')}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                  {t('dashboard.overview.workDays.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-green-400 font-medium mb-0.5 sm:mb-1">{t('dashboard.overview.workDays.total')}</p>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100">{stats.workDays.total}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
                        </div>
                      </div>
                </div>
                    
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/20 rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                      <div>
                        <p className="text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-green-400 font-medium mb-1 sm:mb-2">{t('dashboard.overview.workDays.available')}</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                          {stats.workDays.days.length > 0 ? (
                            stats.workDays.days.map((day, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 md:px-3 md:py-1 bg-green-500 text-white text-[10px] md:text-xs font-medium rounded-full shadow-sm"
                              >
                                {day}
                  </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{t('dashboard.overview.workDays.noDays')}</span>
                          )}
                        </div>
                      </div>
                </div>
              </div>
                  
              <Button 
                    onClick={() => onNavigate('schedule')} 
                className="w-full md:w-auto text-sm"
                section="hospital"
              >
                    <ClockIcon className={`w-4 h-4 ${i18n.language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('dashboard.overview.workDays.manage')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Services Statistics */}
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-r-4 border-r-blue-500">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <SettingsIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  {t('dashboard.overview.services.title')}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                  {t('dashboard.overview.services.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg md:rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-blue-700 dark:text-blue-400 font-medium mb-0.5 sm:mb-1">{t('dashboard.overview.services.total')}</p>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.services.total}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 rounded-lg md:rounded-xl border border-cyan-200 dark:border-cyan-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-cyan-700 dark:text-cyan-400 font-medium mb-0.5 sm:mb-1">{t('dashboard.overview.services.averagePrice')}</p>
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100 truncate">{stats.services.averagePrice.toFixed(2)} {t('dashboard.services.currency')}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-lg md:rounded-xl border border-indigo-200 dark:border-indigo-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-indigo-700 dark:text-indigo-400 font-medium mb-0.5 sm:mb-1">{t('dashboard.overview.services.totalCapacity')}</p>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-100">{stats.services.totalCapacity}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl">📊</span>
                        </div>
                      </div>
                    </div>
              </div>
                  
              <Button 
                onClick={() => onNavigate('services')} 
                    className="w-full md:w-auto text-sm"
                section="services"
              >
                <SettingsIcon className={`w-4 h-4 ${i18n.language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('dashboard.overview.services.manage')}
              </Button>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Reservations Statistics */}
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-r-4 border-r-purple-500">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  {t('dashboard.overview.reservations.title')}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                  {t('dashboard.overview.reservations.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
                  {/* First Row: General Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-4">
                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-purple-700 dark:text-purple-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.total')}</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.reservations.total}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-yellow-200 dark:border-yellow-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-yellow-700 dark:text-yellow-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.pending')}</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.reservations.pending}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-green-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.confirmed')}</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-green-900 dark:text-green-100">{stats.reservations.confirmed}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-red-200 dark:border-red-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-red-700 dark:text-red-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.cancelled')}</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-red-900 dark:text-red-100">{stats.reservations.cancelled}</p>
                      </div>
                    </div>
                  </div>

                  {/* Second Row: Time Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-4">
                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-teal-200 dark:border-teal-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-teal-700 dark:text-teal-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.completed')}</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-teal-900 dark:text-teal-100">{stats.reservations.completed}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-blue-700 dark:text-blue-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.today')}</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.reservations.today}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-indigo-700 dark:text-indigo-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.thisWeek')}</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.reservations.thisWeek}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-pink-200 dark:border-pink-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-pink-700 dark:text-pink-400 font-medium mb-0.5 md:mb-1 leading-tight">{t('dashboard.overview.reservations.thisMonth')}</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-pink-900 dark:text-pink-100">{stats.reservations.thisMonth}</p>
              </div>
            </div>
      </div>

                  {/* Third Row: Revenue */}
                  <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-lg md:rounded-xl border-2 border-emerald-300 dark:border-emerald-700">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs md:text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-0.5 sm:mb-1">{t('dashboard.overview.reservations.revenue')}</p>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-900 dark:text-emerald-100 truncate">{stats.reservations.revenue.toFixed(2)} {t('dashboard.services.currency')}</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">💵</span>
                      </div>
                    </div>
              </div>

              <Button 
                onClick={() => onNavigate('reservations')} 
                    className="w-full md:w-auto text-sm"
                section="services"
              >
                <CalendarIcon className={`w-4 h-4 ${i18n.language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('dashboard.overview.reservations.viewAll')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
