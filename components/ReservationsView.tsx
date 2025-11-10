import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from './ui/icons';
import { getPendingReservations, confirmReservation, cancelReservation, Reservation } from '../services/statsService';
import { showToast } from '../utils';
import ConfirmDialog from './ui/ConfirmDialog';
import EnhancedTable, { EnhancedTableColumn } from './ui/EnhancedTable';

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

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const reservationColumns: EnhancedTableColumn<Reservation>[] = [
    {
      id: 'patient',
      header: t('reservations.patient'),
      minWidth: '16rem',
      align: isRTL ? 'right' : 'left',
      render: (reservation) => (
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {reservation.user_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {reservation.id}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'service',
      header: t('reservations.service'),
      minWidth: '16rem',
      align: isRTL ? 'right' : 'left',
      render: (reservation) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{reservation.service_name}</p>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-300">
            {reservation.price} {t('dashboard.services.currency')}
          </span>
        </div>
      )
    },
    {
      id: 'start',
      header: t('reservations.startDate'),
      minWidth: '12rem',
      render: (reservation) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(reservation.start_date)}</span>
      )
    },
    {
      id: 'end',
      header: t('reservations.endDate'),
      minWidth: '12rem',
      render: (reservation) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(reservation.end_date)}</span>
      )
    },
    {
      id: 'actions',
      header: t('common.actions'),
      align: 'center',
      minWidth: '14rem',
      className: 'whitespace-nowrap',
      render: (reservation) => (
        <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            onClick={() => handleConfirmClick(reservation.id)}
            section="services"
            size="sm"
            className={`text-xs gap-2 rounded-full px-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <CheckCircleIcon className="w-4 h-4" />
            {t('reservations.confirm')}
          </Button>
          <Button
            onClick={() => handleCancelClick(reservation.id)}
            variant="outline"
            size="sm"
            className={`text-xs gap-2 rounded-full border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <XCircleIcon className="w-4 h-4" />
            {t('reservations.cancel')}
          </Button>
        </div>
      )
    }
  ];

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
        <CardHeader className="border-b border-slate-200/80 dark:border-slate-700/60 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex-1 space-y-1.5 lg:min-w-0 text-left">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100 justify-start">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                {t('reservations.pendingTitle')}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 text-left">
                {t('reservations.pendingDescription')}
              </CardDescription>
            </div>
            <Button
              onClick={fetchReservations}
              disabled={loading}
              variant="outline"
              size="sm"
              className={`w-full sm:w-auto flex items-center gap-2 rounded-full px-4 h-10 self-start lg:ml-auto ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
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
          <EnhancedTable<Reservation>
            data={reservations}
            columns={reservationColumns}
            getRowId={(reservation) => reservation.id}
            isRTL={isRTL}
            tone="purple"
            primaryColumnId="patient"
            loading={loading}
            loadingLabel={t('reservations.loading')}
            emptyState={{
              icon: <AlertCircleIcon className="w-10 h-10 text-purple-400" />,
              title: t('reservations.noPending'),
              description: t('reservations.pendingDescription')
            }}
            renderMobileCard={(reservation) => (
              <div className="p-5 space-y-5">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {reservation.user_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      #{reservation.id}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-2xl border border-purple-100/70 dark:border-purple-500/30 bg-gradient-to-br from-purple-50/70 via-violet-50/50 to-indigo-50/50 dark:from-purple-900/30 dark:via-violet-900/20 dark:to-indigo-900/20 p-4 space-y-2">
                    <p className={`text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300 ${isRTL ? 'text-right' : ''}`}>
                      {t('reservations.service')}
                    </p>
                    <p className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : ''}`}>
                      {reservation.service_name}
                    </p>
                    <p className={`text-sm font-semibold text-purple-600 dark:text-purple-300 ${isRTL ? 'text-right' : ''}`}>
                      {reservation.price} {t('dashboard.services.currency')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-indigo-100/70 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/70 via-slate-50/50 to-sky-50/50 dark:from-indigo-900/30 dark:via-slate-900/20 dark:to-sky-900/20 p-4 space-y-2">
                    <p className={`text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300 ${isRTL ? 'text-right' : ''}`}>
                      {`${t('reservations.startDate')} / ${t('reservations.endDate')}`}
                    </p>
                    <p className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                      {t('reservations.from')}: {formatDate(reservation.start_date)}
                    </p>
                    <p className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                      {t('reservations.to')}: {formatDate(reservation.end_date)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <Button
                    onClick={() => handleConfirmClick(reservation.id)}
                    section="services"
                    size="sm"
                    className={`w-full justify-center text-sm gap-2 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {t('reservations.confirm')}
                  </Button>
                  <Button
                    onClick={() => handleCancelClick(reservation.id)}
                    variant="outline"
                    size="sm"
                    className={`w-full justify-center text-sm gap-2 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {t('reservations.cancel')}
                  </Button>
                </div>
              </div>
            )}
          />
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
        type={confirmDialog.type === 'confirm' ? 'info' : 'danger'}
      />
    </div>
  );
};

export default ReservationsView;

