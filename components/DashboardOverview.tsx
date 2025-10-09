import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { HospitalIcon, SettingsIcon, ClockIcon, UserIcon, CalendarIcon } from './ui/icons';
import { getDashboardStats, DashboardStats } from '../services/statsService';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  userFullName?: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, userFullName }) => {
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
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);


  // الحصول على الوقت الحالي لتحديد رسالة الترحيب
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  // الحصول على التاريخ الحالي
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('ar-EG', options);
  };

  // الحصول على الاسم الكامل
  const getDisplayName = () => {
    if (userFullName && userFullName !== '') return userFullName;
    return 'مستشفى صحتي';
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* رسالة الترحيب الشخصية */}
      <div className="bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* خلفية زخرفية */}
        <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-white/10 rounded-full -translate-y-10 md:-translate-y-16 translate-x-10 md:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full translate-y-8 md:translate-y-12 -translate-x-8 md:-translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
            {/* رسالة الترحيب */}
            <div className="text-center lg:text-right flex-1 w-full">
              <div className="mb-2 sm:mb-3 md:mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 md:mb-2 leading-tight">
                  {getGreeting()}، {getDisplayName()}
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-teal-100 mb-1 sm:mb-2 md:mb-3">
                  مرحباً بك في لوحة التحكم الخاصة بالمستشفى
                </p>
                <p className="text-[10px] xs:text-xs md:text-sm text-teal-200 opacity-90">
                  {getCurrentDate()}
                </p>
              </div>
              
              {/* معلومات سريعة */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-md sm:rounded-lg md:rounded-xl px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-4 md:py-2 border border-white/30">
                  <span className="text-sm sm:text-base md:text-lg">🏥</span>
                  <span className="mr-1 md:mr-2 font-medium text-[10px] sm:text-xs md:text-sm">مستشفى صحتي</span>
                </div>
                <div className="text-center group cursor-pointer" onClick={() => onNavigate('services')}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-md sm:rounded-lg md:rounded-xl px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-4 md:py-2 border border-white/30 hover:bg-white/30 transition-colors">
                    <span className="text-sm sm:text-base md:text-lg">📱</span>
                    <span className="mr-1 md:mr-2 font-medium text-[10px] sm:text-xs md:text-sm">إدارة ذكية</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-md sm:rounded-lg md:rounded-xl px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-4 md:py-2 border border-white/30">
                  <span className="text-sm sm:text-base md:text-lg">⚡</span>
                  <span className="mr-1 md:mr-2 font-medium text-[10px] sm:text-xs md:text-sm">سرعة في الأداء</span>
                </div>
              </div>
            </div>

            {/* أيقونة ترحيبية */}
            <div className="flex-shrink-0 hidden sm:block">
              <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <HospitalIcon className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* عرض حالة التحميل */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mr-4 text-gray-600 dark:text-gray-300">جاري تحميل الإحصائيات...</p>
        </div>
      )}

      {/* إحصائيات جدول الأيام */}
      {!loading && stats && (
        <>
      <div className="grid grid-cols-1 gap-4 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-r-4 border-r-green-500">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  إحصائيات جدول أيام العمل
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                  الأيام المتاحة للعمل في المستشفى
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-green-400 font-medium mb-0.5 sm:mb-1">إجمالي أيام العمل</p>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100">{stats.workDays.total}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
                        </div>
                      </div>
                </div>
                    
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/20 rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                      <div>
                        <p className="text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-green-400 font-medium mb-1 sm:mb-2">أيام العمل المتاحة</p>
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
                            <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">لا توجد أيام عمل محددة</span>
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
                    <ClockIcon className="w-4 h-4 mr-2" />
                    إدارة أيام العمل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* إحصائيات جدول الخدمات */}
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-r-4 border-r-blue-500">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <SettingsIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  إحصائيات جدول الخدمات
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                  الخدمات الطبية المتاحة في المستشفى
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg md:rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-blue-700 dark:text-blue-400 font-medium mb-0.5 sm:mb-1">إجمالي الخدمات</p>
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
                          <p className="text-[10px] sm:text-xs md:text-sm text-cyan-700 dark:text-cyan-400 font-medium mb-0.5 sm:mb-1">متوسط السعر</p>
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100 truncate">{stats.services.averagePrice.toFixed(2)} ل.س</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-lg md:rounded-xl border border-indigo-200 dark:border-indigo-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs md:text-sm text-indigo-700 dark:text-indigo-400 font-medium mb-0.5 sm:mb-1">السعة الإجمالية</p>
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
                <SettingsIcon className="w-4 h-4 mr-2" />
                إدارة الخدمات
              </Button>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* إحصائيات جدول الحجوزات */}
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-r-4 border-r-purple-500">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  إحصائيات جدول الحجوزات
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
                  حالة وتفاصيل حجوزات المرضى
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
                  {/* الصف الأول: إحصائيات عامة */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-4">
                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-purple-700 dark:text-purple-400 font-medium mb-0.5 md:mb-1 leading-tight">إجمالي الحجوزات</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.reservations.total}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-yellow-200 dark:border-yellow-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-yellow-700 dark:text-yellow-400 font-medium mb-0.5 md:mb-1 leading-tight">قيد الانتظار</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.reservations.pending}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-green-200 dark:border-green-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-green-400 font-medium mb-0.5 md:mb-1 leading-tight">مؤكدة</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-green-900 dark:text-green-100">{stats.reservations.confirmed}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-red-200 dark:border-red-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-red-700 dark:text-red-400 font-medium mb-0.5 md:mb-1 leading-tight">ملغاة</p>
                        <p className="text-base xs:text-lg sm:text-xl md:text-3xl font-bold text-red-900 dark:text-red-100">{stats.reservations.cancelled}</p>
                      </div>
                    </div>
                  </div>

                  {/* الصف الثاني: إحصائيات الوقت */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-4">
                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-teal-200 dark:border-teal-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-teal-700 dark:text-teal-400 font-medium mb-0.5 md:mb-1 leading-tight">مكتملة</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-teal-900 dark:text-teal-100">{stats.reservations.completed}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-blue-700 dark:text-blue-400 font-medium mb-0.5 md:mb-1 leading-tight">حجوزات اليوم</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.reservations.today}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-indigo-700 dark:text-indigo-400 font-medium mb-0.5 md:mb-1 leading-tight">هذا الأسبوع</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.reservations.thisWeek}</p>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 rounded-md sm:rounded-lg md:rounded-xl border border-pink-200 dark:border-pink-700">
                      <div className="text-center">
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-pink-700 dark:text-pink-400 font-medium mb-0.5 md:mb-1 leading-tight">هذا الشهر</p>
                        <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-pink-900 dark:text-pink-100">{stats.reservations.thisMonth}</p>
              </div>
            </div>
      </div>

                  {/* الصف الثالث: الإيرادات */}
                  <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-lg md:rounded-xl border-2 border-emerald-300 dark:border-emerald-700">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs md:text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-0.5 sm:mb-1">إجمالي الإيرادات</p>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-900 dark:text-emerald-100 truncate">{stats.reservations.revenue.toFixed(2)} ل.س</p>
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
                <CalendarIcon className="w-4 h-4 mr-2" />
                    عرض جميع الحجوزات
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
