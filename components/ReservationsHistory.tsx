import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from './ui/icons';
import { getAllReservations, Reservation } from '../services/statsService';

const ReservationsHistory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllReservations();
      // Filter only confirmed and cancelled reservations
      const historyReservations = data.filter(r => r.status === 'confirmed' || r.status === 'cancelled');
      setReservations(historyReservations);
    } catch (e: any) {
      setError(t('reservationsHistory.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [i18n.language, t]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case 'confirmed':
        return t('reservationsHistory.confirmedLabel');
      case 'cancelled':
        return t('reservationsHistory.cancelledLabel');
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <AlertCircleIcon className="w-4 h-4" />;
    }
  };

  const filteredReservations = reservations
    .filter(reservation => {
      // Filter by status
      if (filter !== 'all' && reservation.status !== filter) return false;
      
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
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;
  const totalRevenue = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + r.price, 0);

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
                {t('reservationsHistory.retry')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">{t('reservationsHistory.confirmedCount')}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300 mt-1 sm:mt-2">{confirmedCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-200 dark:bg-green-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">{t('reservationsHistory.cancelledCount')}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 dark:text-red-300 mt-1 sm:mt-2">{cancelledCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-200 dark:bg-red-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">{t('reservationsHistory.totalRevenue')}</p>
                <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1 sm:mt-2 truncate">{totalRevenue.toFixed(0)} {t('dashboard.services.currency')}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-200 dark:bg-blue-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse text-right' : ''}`}>
            <div className="space-y-1">
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                {t('reservationsHistory.title')}
              </CardTitle>
              <CardDescription className={isRTL ? 'text-right' : ''}>
                {t('reservationsHistory.description')}
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {t('reservationsHistory.refresh')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filters */}
          <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'justify-end' : ''}`}>
            {[
              { key: 'all', label: t('reservationsHistory.allRecords'), icon: '📊' },
              { key: 'confirmed', label: t('reservationsHistory.confirmed'), icon: '✅' },
              { key: 'cancelled', label: t('reservationsHistory.cancelled'), icon: '❌' }
            ].map(({ key, label, icon }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as any)}
                className={`${filter === key ? 'bg-indigo-600 hover:bg-indigo-700' : ''} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <span className={isRTL ? 'mr-2' : 'ml-2'}>{icon}</span>
                {label}
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('reservationsHistory.search')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('reservationsHistory.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isRTL ? 'pl-10 pr-3 text-right' : 'pl-3 pr-10'}`}
                />
                <svg
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`}
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
                {t('reservationsHistory.dateFrom')}
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                autoComplete="off"
                className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isRTL ? 'pl-3 pr-3 text-right' : 'px-3'}`}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('reservationsHistory.dateTo')}
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                autoComplete="off"
                className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isRTL ? 'pl-3 pr-3 text-right' : 'px-3'}`}
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('reservationsHistory.sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isRTL ? 'pl-3 pr-3 text-right' : 'px-3'}`}
              >
                <option value="date">{t('reservationsHistory.sortDate')}</option>
                <option value="price">{t('reservationsHistory.sortPrice')}</option>
                <option value="status">{t('reservationsHistory.sortStatus')}</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || dateFrom || dateTo || filter !== 'all') && (
            <div className={`mb-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <p className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : ''}`}>
                {t('reservationsHistory.resultsCount')} <span className="font-semibold text-indigo-600">{filteredReservations.length}</span> {t('reservationsHistory.of')} {reservations.length}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setDateFrom('');
                  setDateTo('');
                  setFilter('all');
                  setSortBy('date');
                }}
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t('reservationsHistory.clearFilters')}
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">{t('reservationsHistory.loading')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="rounded-2xl border border-indigo-100 dark:border-indigo-500/30 bg-white/85 dark:bg-gray-900/70 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Patient Info */}
                      <div className={`flex flex-col items-center gap-2 text-center ${isRTL ? 'sm:items-end sm:text-right' : 'sm:items-start sm:text-left'}`}>
                        <div className={`flex items-center gap-2 justify-center ${isRTL ? 'sm:justify-end sm:flex-row-reverse' : 'sm:justify-start'}`}>
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{t('reservationsHistory.patient')}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {reservation.user_name}
                          </p>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className={`flex flex-col items-center gap-2 text-center ${isRTL ? 'sm:items-end sm:text-right' : 'sm:items-start sm:text-left'}`}>
                        <div className={`flex items-center gap-2 justify-center ${isRTL ? 'sm:justify-end sm:flex-row-reverse' : 'sm:justify-start'}`}>
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{t('reservationsHistory.service')}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {reservation.service_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {reservation.price} {t('dashboard.services.currency')}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className={`flex flex-col items-center gap-2 text-center ${isRTL ? 'sm:items-end sm:text-right' : 'sm:items-start sm:text-left'}`}>
                        <div className={`flex items-center gap-2 justify-center ${isRTL ? 'sm:justify-end sm:flex-row-reverse' : 'sm:justify-start'}`}>
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{t('reservationsHistory.date')}</span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          <p>
                            {t('reservationsHistory.from')}: {new Date(reservation.start_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p>
                            {t('reservationsHistory.to')}: {new Date(reservation.end_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className={`flex flex-col items-center gap-2 text-center ${isRTL ? 'sm:items-end sm:text-right' : 'sm:items-start sm:text-left'}`}>
                        <div className={`flex items-center gap-2 justify-center ${isRTL ? 'sm:justify-end sm:flex-row-reverse' : 'sm:justify-start'}`}>
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <AlertCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{t('reservationsHistory.status')}</span>
                        </div>
                        <div className={`flex justify-center ${isRTL ? 'sm:justify-end' : 'sm:justify-start'}`}>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusIcon(reservation.status)}
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredReservations.length === 0 && (
                <div className="text-center p-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">{t('reservationsHistory.noRecords')}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsHistory;

