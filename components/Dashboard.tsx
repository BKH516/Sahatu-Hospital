import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Hospital, HospitalService, WorkSchedule, Account } from '../types';
import * as api from '../services/apiService';
import { UserIcon, BriefcaseIcon, CalendarIcon, PlusCircleIcon, EditIcon, HospitalIcon, ClockIcon } from './ui/icons';
import Navbar from './Navbar';
import MobileSidebar from './MobileSidebar';
import DashboardOverview from './DashboardOverview';
import ReservationsView from './ReservationsView';
import ReservationsHistory from './ReservationsHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/Input';
import { showToast } from '../utils';
import ConfirmDialog from './ui/ConfirmDialog';
import ActionButtons from './ui/ActionButtons';
import EnhancedTable, { EnhancedTableColumn } from './ui/EnhancedTable';

type View = 'overview' | 'profile' | 'services' | 'schedule' | 'reservations' | 'history';

interface DashboardProps {
  onLogout: () => void;
}

// Sub-components defined outside the main component to prevent re-renders
const ProfileView: React.FC<{ hospital: Hospital | null; account: Account | null; refreshData: () => void }> = ({ hospital, account, refreshData }) => {
    const { t, i18n } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await api.updateProfile(formData);
            showToast.success(t('dashboard.profile.updateSuccess'));
            setIsEditing(false);
            refreshData();
        } catch (error: any) {
            showToast.error(`${t('common.error')}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    if (!hospital || !account) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">{t('dashboard.profile.loading')}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-teal-600" />
                        {t('dashboard.profile.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('dashboard.profile.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t('dashboard.profile.hospitalName')}
                                    name="full_name"
                                    defaultValue={hospital.full_name}
                                    required
                                />
                                <Input
                                    label={t('dashboard.profile.address')}
                                    name="address"
                                    defaultValue={hospital.address}
                                    required
                                />
                                <Input
                                    label={t('dashboard.profile.phone')}
                                    name="phone_number"
                                    defaultValue={account.phone_number}
                                    required
                                />
                        </div>
                        <div className="flex gap-4">
                                <Button type="submit" disabled={loading} section="hospital">
                                {loading ? t('common.saving') : t('common.saveChanges')}
                                </Button>
                                <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                                    {t('common.cancel')}
                                </Button>
                        </div>
                    </form>
                ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('dashboard.profile.hospitalName')}</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{hospital.full_name}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('dashboard.profile.address')}</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{hospital.address}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('dashboard.profile.email')}</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{account.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('dashboard.profile.phone')}</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{account.phone_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('dashboard.profile.status')}</h4>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        account.is_approved === 'approved' 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                    }`}>
                                        {account.is_approved === 'approved' ? t('dashboard.profile.approved') : t('dashboard.profile.pending')}
                                    </span>
                                </div>
                                <Button onClick={() => setIsEditing(true)} section="hospital">
                                    <EditIcon className={`w-4 h-4 ${i18n.language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                                    {t('dashboard.profile.editProfile')}
                                </Button>
                            </div>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
    );
};

const ServicesView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const [services, setServices] = useState<HospitalService[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<HospitalService | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; serviceId: number | null }>({ 
        isOpen: false, 
        serviceId: null 
    });

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getServices();
            setServices(data);
        } catch (error) {
            showToast.error(t('dashboard.services.saveError'));
        } finally {
            setLoading(false);
        }
    }, [i18n.language, t]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleDeleteClick = (id: number) => {
        setConfirmDelete({ isOpen: true, serviceId: id });
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.serviceId) return;
        
        const loadingToast = showToast.loading(t('dashboard.services.deleting'));
        try {
            await api.deleteService(confirmDelete.serviceId);
            showToast.dismiss(loadingToast);
            showToast.success(t('dashboard.services.deleteSuccess'));
            fetchServices();
        } catch (error) {
            showToast.dismiss(loadingToast);
            showToast.error(t('dashboard.services.deleteError'));
        } finally {
            setConfirmDelete({ isOpen: false, serviceId: null });
        }
    };
    
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const price = formData.get('price');
        const capacity = formData.get('capacity');

        const loadingToast = showToast.loading(editingService ? t('dashboard.services.updating') : t('dashboard.services.adding'));
        try {
            if (editingService) {
                if(price && capacity) {
                     await api.updateService(editingService.id, Number(price), Number(capacity));
                }
            } else {
                await api.addService(formData);
            }
            showToast.dismiss(loadingToast);
            showToast.success(editingService ? t('dashboard.services.updateSuccess') : t('dashboard.services.addSuccess'));
            fetchServices();
            setIsModalOpen(false);
            setEditingService(null);
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(`${t('dashboard.services.saveError')}: ${error.message}`);
        }
    };

    const serviceColumns: EnhancedTableColumn<HospitalService>[] = [
        {
            id: 'service',
            header: t('dashboard.services.serviceName'),
            minWidth: '16rem',
            align: isRTL ? 'right' : 'left',
            render: (service) => (
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                        <BriefcaseIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {service.service_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {service.id}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'price',
            header: t('dashboard.services.price'),
            align: 'center',
            minWidth: '10rem',
            render: (service) => (
                <span className="text-base font-semibold text-blue-600 dark:text-blue-300">
                    {service.price} {t('dashboard.services.currency')}
                </span>
            )
        },
        {
            id: 'capacity',
            header: t('dashboard.services.capacity'),
            align: 'center',
            minWidth: '8rem',
            render: (service) => (
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1 text-sm font-medium">
                    {service.capacity}
                </span>
            )
        },
        {
            id: 'actions',
            header: t('common.actions'),
            align: 'center',
            minWidth: '12rem',
            className: 'whitespace-nowrap',
            render: (service) => (
                <div className={`flex justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ActionButtons
                        onEdit={() => { setEditingService(service); setIsModalOpen(true); }}
                        onDelete={() => handleDeleteClick(service.id)}
                        size="sm"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto px-2 sm:px-0">
            <Card className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <CardHeader className="border-b border-slate-200/80 dark:border-slate-700/60 pb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                        <Button 
                            onClick={() => { setEditingService(null); setIsModalOpen(true); }} 
                            section="services"
                            className={`w-full sm:w-auto text-xs sm:text-sm px-4 h-10 rounded-full inline-flex items-center gap-2 shadow-sm self-start lg:order-2 lg:ml-auto ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <PlusCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">{t('dashboard.services.addService')}</span>
                            <span className="xs:hidden">{t('dashboard.services.add')}</span>
                        </Button>
                        <div className="flex-1 space-y-1.5 lg:min-w-0 lg:order-1 text-left">
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100 justify-start">
                                <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                                {t('dashboard.services.title')}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 text-left">
                                {t('dashboard.services.description')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <EnhancedTable<HospitalService>
                        data={services}
                        columns={serviceColumns}
                        getRowId={(service) => service.id}
                        isRTL={isRTL}
                        tone="blue"
                        primaryColumnId="service"
                        loading={loading}
                        loadingLabel={t('common.loading')}
                        emptyState={{
                            icon: <BriefcaseIcon className="w-10 h-10 text-blue-400" />,
                            title: t('dashboard.services.noServices'),
                            description: t('dashboard.services.description')
                        }}
                        renderMobileCard={(service) => (
                            <div className="p-5 space-y-4">
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shadow-inner">
                                        <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {service.service_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t('dashboard.services.capacity')}: <span className="font-medium text-gray-700 dark:text-gray-300">{service.capacity}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex items-center justify-between rounded-2xl border border-blue-100/70 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-900/20 px-4 py-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                                        {t('dashboard.services.price')}
                                    </span>
                                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                                        {service.price} {t('dashboard.services.currency')}
                                    </span>
                                </div>
                                <div className={`flex justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <ActionButtons
                                        onEdit={() => { setEditingService(service); setIsModalOpen(true); }}
                                        onDelete={() => handleDeleteClick(service.id)}
                                        size="sm"
                                    />
                                </div>
                            </div>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle>{editingService ? t('dashboard.services.editService') : t('dashboard.services.addService')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {!editingService && (
                                    <Input
                                        label={t('dashboard.services.serviceName')}
                                        name="service_name"
                                        required
                                    />
                                )}
                                <Input
                                    label={t('dashboard.services.price')}
                                    name="price"
                                    type="number"
                                    defaultValue={editingService?.price}
                                    required
                                />
                                <Input
                                    label={t('dashboard.services.capacity')}
                                    name="capacity"
                                    type="number"
                                    defaultValue={editingService?.capacity}
                                    required
                                />
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        variant="outline"
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button type="submit" section="services">
                                        {t('common.save')}
                                    </Button>
                            </div>
                        </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, serviceId: null })}
                onConfirm={handleDeleteConfirm}
                title={t('common.confirm')}
                description={t('dashboard.services.deleteConfirm')}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                type="danger"
            />
        </div>
    );
};


const ScheduleView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; dayId: number | null }>({ 
        isOpen: false, 
        dayId: null 
    });
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const getDayName = (day: string) => {
        const dayKey = day.toLowerCase() as 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
        const keyMap: { [key: string]: string } = {
            'sunday': 'sunday',
            'monday': 'monday',
            'tuesday': 'tuesday',
            'wednesday': 'wednesday',
            'thursday': 'thursday',
            'friday': 'friday',
            'saturday': 'saturday'
        };
        return t(`dashboard.schedule.${keyMap[day.toLowerCase()] || day.toLowerCase()}`);
    };

    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getWorkSchedules();
            setSchedules(data);
        } catch (error) {
            setError(t('dashboard.schedule.fetchError'));
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    }, [i18n.language, t]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleAddDay = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const day = formData.get('day_of_week') as string;
        if (schedules.find(s => s.day_of_week.toLowerCase() === day.toLowerCase())) {
            showToast.warning(t('dashboard.schedule.alreadyAdded'));
            return;
        }
        const loadingToast = showToast.loading(t('dashboard.schedule.adding'));
        try {
            await api.addWorkSchedule(day);
            showToast.dismiss(loadingToast);
            showToast.success(t('dashboard.schedule.addSuccess'));
            fetchSchedules();
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(`${t('dashboard.schedule.addError')}: ${error.message}`);
        }
    };
    
    const handleDeleteDayClick = (id: number) => {
        setConfirmDelete({ isOpen: true, dayId: id });
    };

    const handleDeleteDayConfirm = async () => {
        if (!confirmDelete.dayId) return;
        
        const loadingToast = showToast.loading(t('dashboard.schedule.deleting'));
        try {
            await api.deleteWorkSchedule(confirmDelete.dayId);
            showToast.dismiss(loadingToast);
            showToast.success(t('dashboard.schedule.deleteSuccess'));
            fetchSchedules();
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(`${t('dashboard.schedule.deleteError')}: ${error.message}`);
        } finally {
            setConfirmDelete({ isOpen: false, dayId: null });
        }
    };

    const scheduleColumns: EnhancedTableColumn<WorkSchedule>[] = [
        {
            id: 'day',
            header: t('dashboard.schedule.workDay'),
            minWidth: '18rem',
            align: isRTL ? 'right' : 'left',
            render: (schedule) => (
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {getDayName(schedule.day_of_week)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {schedule.day_of_week}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'actions',
            header: t('common.actions'),
            align: 'center',
            minWidth: '10rem',
            render: (schedule) => (
                <div className={`flex justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ActionButtons
                        onDelete={() => handleDeleteDayClick(schedule.id)}
                        showEdit={false}
                        size="sm"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 w-full max-w-5xl mx-auto px-2 sm:px-0">
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
                                onClick={fetchSchedules}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
                            >
                                {t('dashboard.schedule.retry')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <Card className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <CardHeader className="border-b border-slate-200/80 dark:border-slate-700/60 pb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                        <div className="flex-1 space-y-1.5 lg:min-w-0 text-left">
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100 justify-start">
                                <ClockIcon className="w-5 h-5 text-green-600" />
                                {t('dashboard.schedule.title')}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 text-left">
                                {t('dashboard.schedule.description')}
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={fetchSchedules}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className={`w-full sm:w-auto flex items-center gap-2 rounded-full px-4 h-10 self-start lg:ml-auto ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {t('dashboard.schedule.refresh')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddDay} className="space-y-4">
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : ''}`}>
                            <div>
                                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('dashboard.schedule.selectDay')}
                                </label>
                                <select 
                                    name="day_of_week" 
                                    id="day_of_week" 
                                    className={`flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-black ${isRTL ? 'pl-3 pr-8 text-right' : 'pl-3 pr-8'}`}
                                >
                           {daysOfWeek.map(day => (
                               <option key={day} value={day}>{getDayName(day)}</option>
                           ))}
                        </select>
                    </div>
                            <div className={`flex items-end ${isRTL ? 'justify-end' : ''}`}>
                                <Button
                                    type="submit"
                                    section="hospital"
                                    className={`w-full md:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10 ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    <PlusCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {t('dashboard.schedule.addDay')}
                                </Button>
                            </div>
                        </div>
                </form>
                </CardContent>
            </Card>

            <Card className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <CardHeader className="border-b border-slate-200/80 dark:border-slate-700/60 pb-6">
                    <div className={`space-y-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <CardTitle className={`flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100 ${isRTL ? 'flex-row-reverse justify-end text-right' : 'justify-start text-left'}`}>
                            <CalendarIcon className="w-5 h-5 text-green-600" />
                            {t('dashboard.schedule.currentDays')}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                            {t('dashboard.schedule.currentDaysDesc')}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <EnhancedTable<WorkSchedule>
                        data={schedules}
                        columns={scheduleColumns}
                        getRowId={(schedule) => schedule.id}
                        isRTL={isRTL}
                        tone="green"
                        primaryColumnId="day"
                        loading={loading}
                        loadingLabel={t('common.loading')}
                        emptyState={{
                            icon: <CalendarIcon className="w-10 h-10 text-emerald-400" />,
                            title: t('dashboard.schedule.noDays'),
                            description: t('dashboard.schedule.description')
                        }}
                        renderMobileCard={(schedule) => (
                            <div className="p-5 space-y-4">
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                                        <CalendarIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {getDayName(schedule.day_of_week)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {schedule.day_of_week}
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <ActionButtons
                                        onDelete={() => handleDeleteDayClick(schedule.id)}
                                        showEdit={false}
                                        size="sm"
                                    />
                                </div>
                            </div>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, dayId: null })}
                onConfirm={handleDeleteDayConfirm}
                title={t('common.confirm')}
                description={t('dashboard.schedule.deleteConfirm')}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                type="danger"
            />
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<View>('overview');
  const [profile, setProfile] = useState<{hospital: Hospital | null; account: Account | null}>({ hospital: null, account: null });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProfileData = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const [accountData, hospitalData] = await api.getMe();
      setProfile({ account: accountData, hospital: hospitalData });
    } catch (error) {
      onLogout(); // Logout on profile fetch failure
    } finally {
      setLoadingProfile(false);
    }
  }, [i18n.language, onLogout]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleLogoutClick = async () => {
    try {
        await api.logout();
    } catch(error){
        // Logout failed on server, logging out client-side
    } finally {
        onLogout();
    }
  };
  
  // Function to navigate between tabs with type checking
  const handleNavigate = (tab: string) => {
    if (tab === 'overview' || tab === 'profile' || tab === 'services' || tab === 'schedule' || tab === 'reservations' || tab === 'history') {
      setView(tab as View);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'overview':
        return <DashboardOverview onNavigate={handleNavigate} userFullName={profile.hospital?.full_name} />;
      case 'profile':
        return <ProfileView hospital={profile.hospital} account={profile.account} refreshData={fetchProfileData} />;
      case 'services':
        return <ServicesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'reservations':
        return <ReservationsView />;
      case 'history':
        return <ReservationsHistory />;
      default:
        return <DashboardOverview onNavigate={handleNavigate} userFullName={profile.hospital?.full_name} />;
    }
  };

  const getTabInfo = () => {
    switch (view) {
      case 'overview':
        return null;
      case 'profile':
        return {
          title: t('dashboard.profile.title'),
          description: t('dashboard.profile.description'),
          icon: '👤',
          color: 'from-teal-500 to-cyan-600'
        };
      case 'services':
        return {
          title: t('dashboard.services.title'),
          description: t('dashboard.services.description'),
          icon: '🏥',
          color: 'from-blue-500 to-cyan-600'
        };
      case 'schedule':
        return {
          title: t('dashboard.navigation.workSchedule'),
          description: t('dashboard.schedule.description'),
          icon: '📅',
          color: 'from-green-500 to-emerald-600'
        };
      case 'reservations':
        return {
          title: t('dashboard.navigation.reservations'),
          description: t('dashboard.navigation.reservations'),
          icon: '⏳',
          color: 'from-purple-500 to-indigo-600'
        };
      case 'history':
        return {
          title: t('dashboard.navigation.reservationHistory'),
          description: t('dashboard.navigation.history'),
          icon: '📜',
          color: 'from-indigo-500 to-purple-600'
        };
      default:
        return null;
    }
  };

  const tabInfo = getTabInfo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-x-hidden transition-colors duration-200">
      {/* Navbar with Navigation */}
      <Navbar 
        onLogout={handleLogoutClick} 
        onMenuClick={() => setSidebarOpen(true)} 
        userFullName={profile.hospital?.full_name}
        activeTab={view}
        onTabChange={handleNavigate}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={view as any}
        onTabChange={(tab: any) => {
          setView(tab as View);
        }}
      />

      {/* Main Layout - No Sidebar */}
      <div className="flex-1 flex flex-col pt-14 sm:pt-16">
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900 items-stretch">
          {/* Header Section - Only shown for specified sections */}
          {tabInfo && (
            <div className={`bg-gradient-to-r ${tabInfo.color} text-white shadow-lg w-full`}> 
              <div className="px-2 sm:px-4 py-3">
                <div className={`flex items-center gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="text-2xl">{tabInfo.icon}</div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold">{tabInfo.title}</h1>
                    <p className="mt-1 text-xs sm:text-sm opacity-90">{tabInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col overflow-x-hidden">
            {renderContent()}
        </div>
        </main>
        </div>
    </div>
  );
};

export default Dashboard;
