import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from './ui/icons';
import { getPendingReservations, confirmReservation, cancelReservation, Reservation } from '../services/statsService';
import { showToast } from '../utils';
import ConfirmDialog from './ui/ConfirmDialog';

const ReservationsView: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'cancel';
    reservationId: number | null;
  }>({ isOpen: false, type: 'confirm', reservationId: null });

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingReservations();
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

  const handleConfirmClick = (id: number) => {
    setConfirmDialog({ isOpen: true, type: 'confirm', reservationId: id });
  };

  const handleCancelClick = (id: number) => {
    setConfirmDialog({ isOpen: true, type: 'cancel', reservationId: id });
  };

  const handleDialogConfirm = async () => {
    if (!confirmDialog.reservationId) return;

    const loadingToast = showToast.loading(
      confirmDialog.type === 'confirm' ? 'جاري تأكيد الحجز...' : 'جاري إلغاء الحجز...'
    );

    try {
      if (confirmDialog.type === 'confirm') {
        await confirmReservation(confirmDialog.reservationId);
        showToast.dismiss(loadingToast);
        showToast.success('تم تأكيد الحجز بنجاح');
      } else {
        await cancelReservation(confirmDialog.reservationId);
        showToast.dismiss(loadingToast);
        showToast.success('تم إلغاء الحجز بنجاح');
      }
      fetchReservations();
    } catch (error: any) {
      showToast.dismiss(loadingToast);
      showToast.error(`فشل في ${confirmDialog.type === 'confirm' ? 'تأكيد' : 'إلغاء'} الحجز: ${error.message}`);
    } finally {
      setConfirmDialog({ isOpen: false, type: 'confirm', reservationId: null });
    }
  };

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
                عرض وإدارة الحجوزات التي تحتاج إلى مراجعة
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="block md:hidden space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="border-r-4 border-r-purple-500">
                    <CardContent className="p-4 space-y-3">
                      {/* Patient Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">المريض</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {reservation.user_name}
                          </p>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">الخدمة</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {reservation.service_name}
                          </p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {reservation.price} ل.س
                          </p>
                        </div>
                      </div>

                      {/* Date Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">الفترة</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            من: {new Date(reservation.start_date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            إلى: {new Date(reservation.end_date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleConfirmClick(reservation.id)}
                          section="services"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          تأكيد
                        </Button>
                        <Button
                          onClick={() => handleCancelClick(reservation.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          إلغاء
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        اسم المريض
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        الخدمة
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        السعر (ل.س)
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        تاريخ البداية
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        تاريخ النهاية
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 font-medium text-sm">
                          {reservation.user_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                          {reservation.service_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {reservation.price}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                          {new Date(reservation.start_date).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                          {new Date(reservation.end_date).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleConfirmClick(reservation.id)}
                              section="services"
                              size="sm"
                              className="text-xs"
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              تأكيد
                            </Button>
                            <Button
                              onClick={() => handleCancelClick(reservation.id)}
                              variant="outline"
                              size="sm"
                              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <XCircleIcon className="w-4 h-4 mr-1" />
                              إلغاء
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="border border-gray-200 dark:border-gray-700 px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <AlertCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                          <p>لا توجد حجوزات قيد الانتظار.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Empty State */}
              {reservations.length === 0 && (
                <div className="block md:hidden text-center p-8">
                  <AlertCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">لا توجد حجوزات قيد الانتظار.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: 'confirm', reservationId: null })}
        onConfirm={handleDialogConfirm}
        title={confirmDialog.type === 'confirm' ? 'تأكيد الحجز' : 'إلغاء الحجز'}
        description={
          confirmDialog.type === 'confirm'
            ? 'هل أنت متأكد من تأكيد هذا الحجز؟'
            : 'هل أنت متأكد من إلغاء هذا الحجز؟ لن تتمكن من التراجع عن هذا الإجراء.'
        }
        confirmText={confirmDialog.type === 'confirm' ? 'تأكيد' : 'إلغاء الحجز'}
        cancelText="إلغاء"
        type={confirmDialog.type === 'confirm' ? 'success' : 'danger'}
      />
    </div>
  );
};

export default ReservationsView;

