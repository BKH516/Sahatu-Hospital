import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from './ui/icons';
import { getPendingReservations, confirmReservation, cancelReservation, Reservation } from '../services/statsService';
import { showToast } from '../utils';
import ConfirmDialog from './ui/ConfirmDialog';

const ReservationsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
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
      setError(t('reservations.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [i18n.language, t]);

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
      confirmDialog.type === 'confirm' ? t('reservations.confirming') : t('reservations.cancelling')
    );

    try {
      if (confirmDialog.type === 'confirm') {
        await confirmReservation(confirmDialog.reservationId);
        showToast.dismiss(loadingToast);
        showToast.success(t('reservations.confirmSuccess'));
      } else {
        await cancelReservation(confirmDialog.reservationId);
        showToast.dismiss(loadingToast);
        showToast.success(t('reservations.cancelSuccess'));
      }
      fetchReservations();
    } catch (error: any) {
      showToast.dismiss(loadingToast);
      showToast.error(`${confirmDialog.type === 'confirm' ? t('reservations.confirmError') : t('reservations.cancelError')}: ${error.message}`);
    } finally {
      setConfirmDialog({ isOpen: false, type: 'confirm', reservationId: null });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto px-2 sm:px-0">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={isRTL ? 'mr-3' : 'ml-3'}>
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={fetchReservations}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
              >
                {t('reservations.retry')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full">
        <CardHeader>
          <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse text-right' : ''}`}>
            <div className="space-y-1">
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                {t('reservations.pendingTitle')}
              </CardTitle>
              <CardDescription className={isRTL ? 'text-right' : ''}>
                {t('reservations.pendingDescription')}
              </CardDescription>
            </div>
            <Button
              onClick={fetchReservations}
              disabled={loading}
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {t('reservations.refresh')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">{t('reservations.loading')}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="block md:hidden space-y-4 w-full">
                {reservations.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="w-full border border-purple-200 dark:border-purple-500/40 rounded-xl shadow-sm bg-white/85 dark:bg-gray-800/70 backdrop-blur"
                  >
                    <CardContent className="p-5 space-y-5 text-center">
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shadow-inner">
                            <UserIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-purple-500 dark:text-purple-300">
                            {t('reservations.patient')}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {reservation.user_name}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="rounded-xl border border-purple-100 dark:border-purple-500/30 bg-purple-50/40 dark:bg-purple-900/20 p-3 space-y-2">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-purple-200/70 dark:bg-purple-800/40 flex items-center justify-center">
                              <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                            </div>
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-purple-500 dark:text-purple-300">
                            {t('reservations.service')}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {reservation.service_name}
                          </p>
                          <p className="text-sm font-bold text-purple-600 dark:text-purple-300">
                            {reservation.price} {t('dashboard.services.currency')}
                          </p>
                        </div>

                        <div className="rounded-xl border border-indigo-100 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-900/20 p-3 space-y-2">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-200/70 dark:bg-indigo-800/40 flex items-center justify-center">
                              <ClockIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                            </div>
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                            {`${t('reservations.startDate')} / ${t('reservations.endDate')}`}
                          </p>
                          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            <p>
                              {t('reservations.from')}: {new Date(reservation.start_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p>
                              {t('reservations.to')}: {new Date(reservation.end_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <Button
                          onClick={() => handleConfirmClick(reservation.id)}
                          section="services"
                          size="sm"
                          className={`w-full justify-center text-sm gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          {t('reservations.confirm')}
                        </Button>
                        <Button
                          onClick={() => handleCancelClick(reservation.id)}
                          variant="outline"
                          size="sm"
                          className={`w-full justify-center text-sm gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <XCircleIcon className="w-4 h-4" />
                          {t('reservations.cancel')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block">
                <div className="w-full max-w-6xl mx-auto overflow-x-auto rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white/90 dark:bg-gray-900/60 shadow-sm shadow-purple-100/50">
                  <table className="min-w-[60rem] w-full text-sm text-gray-700 dark:text-gray-200">
                    <thead className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 text-purple-900 dark:text-purple-100 uppercase tracking-wide text-xs">
                      <tr>
                        <th className={`px-4 py-3 font-semibold border-b border-purple-100/70 dark:border-purple-900/40 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t('reservations.patient')}
                        </th>
                        <th className={`px-4 py-3 font-semibold border-b border-purple-100/70 dark:border-purple-900/40 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t('reservations.service')}
                        </th>
                        <th className={`px-4 py-3 font-semibold border-b border-purple-100/70 dark:border-purple-900/40 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t('reservations.price')}
                        </th>
                        <th className={`px-4 py-3 font-semibold border-b border-purple-100/70 dark:border-purple-900/40 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t('reservations.startDate')}
                        </th>
                        <th className={`px-4 py-3 font-semibold border-b border-purple-100/70 dark:border-purple-900/40 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t('reservations.endDate')}
                        </th>
                        <th className="px-4 py-3 font-semibold border-b border-purple-100/70 dark:border-purple-900/40 text-center">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="odd:bg-white even:bg-purple-50/40 dark:odd:bg-gray-900/60 dark:even:bg-gray-900/40 hover:bg-purple-100/40 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                            {reservation.user_name}
                          </td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {reservation.service_name}
                          </td>
                          <td className="px-4 py-4 font-semibold text-purple-600 dark:text-purple-300">
                            {reservation.price}
                          </td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {new Date(reservation.start_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {new Date(reservation.end_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-4">
                            <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Button
                                onClick={() => handleConfirmClick(reservation.id)}
                                section="services"
                                size="sm"
                                className={`text-xs gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                {t('reservations.confirm')}
                              </Button>
                              <Button
                                onClick={() => handleCancelClick(reservation.id)}
                                variant="outline"
                                size="sm"
                                className={`text-xs gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                <XCircleIcon className="w-4 h-4" />
                                {t('reservations.cancel')}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {reservations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            <AlertCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <p>{t('reservations.noPending')}</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Empty State */}
              {reservations.length === 0 && (
                <div className="block md:hidden text-center p-8">
                  <AlertCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">{t('reservations.noPending')}</p>
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
        title={confirmDialog.type === 'confirm' ? t('reservations.confirmDialogTitle') : t('reservations.cancelDialogTitle')}
        description={
          confirmDialog.type === 'confirm'
            ? t('reservations.confirmDialogDescription')
            : t('reservations.cancelDialogDescription')
        }
        confirmText={confirmDialog.type === 'confirm' ? t('reservations.confirm') : t('reservations.cancel')}
        cancelText={t('common.cancel')}
        type={confirmDialog.type === 'confirm' ? 'success' : 'danger'}
      />
    </div>
  );
};

export default ReservationsView;

