import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from './ui/icons';
import { getAllReservations, getReservationsByStatus, updateReservationStatus, Reservation } from '../services/statsService';
import { showToast } from '../utils';

// استخدام interface من statsService

const ReservationsView: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get only pending reservations
      const data = await getReservationsByStatus('pending');
      setReservations(data);
    } catch (e: any) {
      setError('فشل في جلب الحجوزات. تحقق من اتصال الخادم.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleUpdateReservationStatus = async (id: number, status: string) => {
    const loadingToast = showToast.loading('جاري تحديث حالة الحجز...');
    try {
      const ok = await updateReservationStatus(id, status);
      showToast.dismiss(loadingToast);
      if (ok) {
        await fetchReservations();
        showToast.success(`تم تحديث حالة الحجز إلى: ${getStatusText(status)}`);
      } else {
        showToast.error('فشل في تحديث حالة الحجز');
      }
    } catch (e) {
      showToast.dismiss(loadingToast);
      showToast.error('حدث خطأ أثناء تحديث حالة الحجز');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const filteredReservations = reservations
    .filter(reservation => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesUser = reservation.user_name.toLowerCase().includes(query);
        const matchesService = reservation.service_name.toLowerCase().includes(query);
        if (!matchesUser && !matchesService) return false;
      }
      
      // Filter by date range
      if (dateFrom && reservation.start_date < dateFrom) return false;
      if (dateTo && reservation.start_date > dateTo) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  // Count statistics
  const pendingCount = reservations.length;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              <button 
                onClick={fetchReservations}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                الحجوزات قيد الانتظار
              </CardTitle>
              <CardDescription>
                عرض وإدارة الحجوزات التي تحتاج إلى مراجعة وتأكيد
              </CardDescription>
            </div>
            <Button 
              onClick={fetchReservations}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Badge */}
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-200 dark:bg-yellow-800/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  لديك <span className="font-bold text-lg">{pendingCount}</span> حجز قيد الانتظار
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  يرجى مراجعة وتأكيد أو إلغاء الحجوزات
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                بحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اسم المريض أو الخدمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                من تاريخ
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                إلى تاريخ
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ترتيب حسب
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">التاريخ (الأحدث أولاً)</option>
                <option value="price">السعر (الأعلى أولاً)</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || dateFrom || dateTo) && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                عدد النتائج: <span className="font-semibold text-purple-600">{filteredReservations.length}</span> من أصل {reservations.length}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setDateFrom('');
                  setDateTo('');
                  setSortBy('date');
                }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                مسح الفلاتر
              </Button>
          </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري التحميل...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {/* Patient Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">المريض</span>
                        </div>
                        <div className="pl-6">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {reservation.user_name}
                          </p>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">الخدمة</span>
                        </div>
                        <div className="pl-6">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {reservation.service_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {reservation.price} ل.س
                          </p>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">التاريخ</span>
                        </div>
                        <div className="pl-6">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            من: {new Date(reservation.start_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            إلى: {new Date(reservation.end_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircleIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">الحالة</span>
                        </div>
                        <div className="pl-6 space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                          </span>
                          
                          <div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm w-full xs:w-auto"
                              >
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                تأكيد
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                                className="text-xs sm:text-sm w-full xs:w-auto"
                              >
                                <XCircleIcon className="w-3 h-3 mr-1" />
                                إلغاء
                              </Button>
                            </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredReservations.length === 0 && !loading && (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">لا توجد حجوزات قيد الانتظار</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">جميع الحجوزات تم معالجتها</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsView;
