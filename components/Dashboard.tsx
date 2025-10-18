import React, { useState, useEffect, useCallback } from 'react';
import { Hospital, HospitalService, WorkSchedule, Account } from '../types';
import * as api from '../services/apiService';
import { UserIcon, BriefcaseIcon, CalendarIcon, LogOutIcon, PlusCircleIcon, EditIcon, TrashIcon, HospitalIcon, ClockIcon } from './ui/icons';
import Navbar from './Navbar';
import MobileSidebar from './MobileSidebar';
import DashboardOverview from './DashboardOverview';
import ReservationsView from './ReservationsView';
import ReservationsHistory from './ReservationsHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { showToast } from '../utils';
import ConfirmDialog from './ui/ConfirmDialog';
import ActionButtons from './ui/ActionButtons';

type View = 'overview' | 'profile' | 'services' | 'schedule' | 'reservations' | 'history';

interface DashboardProps {
  onLogout: () => void;
}

// Sub-components defined outside the main component to prevent re-renders
const ProfileView: React.FC<{ hospital: Hospital | null; account: Account | null; refreshData: () => void }> = ({ hospital, account, refreshData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await api.updateProfile(formData);
            showToast.success("تم تحديث الملف الشخصي بنجاح");
            setIsEditing(false);
            refreshData();
        } catch (error: any) {
            showToast.error(`خطأ: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    if (!hospital || !account) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">جاري تحميل بيانات الملف الشخصي...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-teal-600" />
                        الملف الشخصي للمستشفى
                    </CardTitle>
                    <CardDescription>
                        عرض وتعديل معلومات المستشفى الأساسية
                    </CardDescription>
                </CardHeader>
                <CardContent>
                {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="اسم المستشفى"
                                    name="full_name"
                                    defaultValue={hospital.full_name}
                                    required
                                />
                                <Input
                                    label="العنوان"
                                    name="address"
                                    defaultValue={hospital.address}
                                    required
                                />
                                <Input
                                    label="رقم الهاتف"
                                    name="phone_number"
                                    defaultValue={account.phone_number}
                                    required
                                />
                        </div>
                        <div className="flex gap-4">
                                <Button type="submit" disabled={loading} section="hospital">
                                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </Button>
                                <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                                    إلغاء
                                </Button>
                        </div>
                    </form>
                ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">اسم المستشفى</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{hospital.full_name}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">العنوان</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{hospital.address}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">البريد الإلكتروني</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{account.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">رقم الهاتف</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{account.phone_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">الحالة</h4>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        account.is_approved === 'approved' 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                    }`}>
                                        {account.is_approved === 'approved' ? 'مقبول' : 'قيد الانتظار'}
                                    </span>
                                </div>
                                <Button onClick={() => setIsEditing(true)} section="hospital">
                                    <EditIcon className="w-4 h-4 mr-2" />
                                    تعديل الملف الشخصي
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
            console.error(error);
            showToast.error('فشل في جلب الخدمات');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleDeleteClick = (id: number) => {
        setConfirmDelete({ isOpen: true, serviceId: id });
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.serviceId) return;
        
        const loadingToast = showToast.loading('جاري حذف الخدمة...');
        try {
            await api.deleteService(confirmDelete.serviceId);
            showToast.dismiss(loadingToast);
            showToast.success('تم حذف الخدمة بنجاح');
            fetchServices();
        } catch (error) {
            showToast.dismiss(loadingToast);
            showToast.error('فشل في حذف الخدمة');
        } finally {
            setConfirmDelete({ isOpen: false, serviceId: null });
        }
    };
    
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const price = formData.get('price');
        const capacity = formData.get('capacity');

        const loadingToast = showToast.loading(editingService ? 'جاري تحديث الخدمة...' : 'جاري إضافة الخدمة...');
        try {
            if (editingService) {
                if(price && capacity) {
                     await api.updateService(editingService.id, Number(price), Number(capacity));
                }
            } else {
                await api.addService(formData);
            }
            showToast.dismiss(loadingToast);
            showToast.success(editingService ? 'تم تحديث الخدمة بنجاح' : 'تم إضافة الخدمة بنجاح');
            fetchServices();
            setIsModalOpen(false);
            setEditingService(null);
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(`فشل في حفظ الخدمة: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                                إدارة الخدمات الطبية
                            </CardTitle>
                            <CardDescription>
                                إضافة وتعديل الخدمات والأسعار والمواعيد
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={() => { setEditingService(null); setIsModalOpen(true); }} 
                            section="services"
                            className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
                        >
                            <PlusCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">إضافة خدمة جديدة</span>
                            <span className="xs:hidden">إضافة</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="block md:hidden space-y-3">
                                {services.map(service => (
                                    <Card key={service.id} className="border-r-4 border-r-blue-500">
                                        <CardContent className="p-3 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1 truncate">
                                                        {service.service_name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                            💰 {service.price} ل.س
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                                            👥 {service.capacity} مريض
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <ActionButtons
                                                    onEdit={() => { setEditingService(service); setIsModalOpen(true); }}
                                                    onDelete={() => handleDeleteClick(service.id)}
                                                    size="sm"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {services.length === 0 && (
                                    <div className="text-center p-8">
                                        <BriefcaseIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">لم تتم إضافة خدمات بعد.</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800">
                                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                اسم الخدمة
                                            </th>
                                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                السعر (ل.س)
                                            </th>
                                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                السعة (مريض)
                                            </th>
                                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(service => (
                                            <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 font-medium text-sm">
                                                    {service.service_name}
                                                </td>
                                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                                    {service.price}
                                                </td>
                                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                                                    {service.capacity}
                                                </td>
                                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                                                    <ActionButtons
                                                        onEdit={() => { setEditingService(service); setIsModalOpen(true); }}
                                                        onDelete={() => handleDeleteClick(service.id)}
                                                        size="sm"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        {services.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="border border-gray-200 dark:border-gray-700 px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    <BriefcaseIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                                    <p>لم تتم إضافة خدمات بعد.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle>{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {!editingService && (
                                    <Input
                                        label="اسم الخدمة"
                                        name="service_name"
                                        required
                                    />
                                )}
                                <Input
                                    label="السعر (ل.س)"
                                    name="price"
                                    type="number"
                                    defaultValue={editingService?.price}
                                    required
                                />
                                <Input
                                    label="السعة (عدد المرضى)"
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
                                        إلغاء
                                    </Button>
                                    <Button type="submit" section="services">
                                        حفظ
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
                title="تأكيد حذف الخدمة"
                description="هل أنت متأكد من حذف هذه الخدمة؟ لن تتمكن من التراجع عن هذا الإجراء."
                confirmText="حذف"
                cancelText="إلغاء"
                type="danger"
            />
        </div>
    );
};


const ScheduleView: React.FC = () => {
    const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; dayId: number | null }>({ 
        isOpen: false, 
        dayId: null 
    });
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysOfWeekArabic: { [key: string]: string } = {
        'Sunday': 'الأحد', 'Monday': 'الاثنين', 'Tuesday': 'الثلاثاء', 'Wednesday': 'الأربعاء', 
        'Thursday': 'الخميس', 'Friday': 'الجمعة', 'Saturday': 'السبت'
    };

    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getWorkSchedules();
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setError('فشل في جلب جدول العمل. تأكد من اتصال الخادم.');
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleAddDay = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const day = formData.get('day_of_week') as string;
        if (schedules.find(s => s.day_of_week.toLowerCase() === day.toLowerCase())) {
            showToast.warning('هذا اليوم مضاف بالفعل.');
            return;
        }
        const loadingToast = showToast.loading('جاري إضافة اليوم...');
        try {
            await api.addWorkSchedule(day);
            showToast.dismiss(loadingToast);
            showToast.success('تم إضافة اليوم بنجاح');
            fetchSchedules();
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(`فشل في إضافة اليوم: ${error.message}`);
        }
    };
    
    const handleDeleteDayClick = (id: number) => {
        setConfirmDelete({ isOpen: true, dayId: id });
    };

    const handleDeleteDayConfirm = async () => {
        if (!confirmDelete.dayId) return;
        
        const loadingToast = showToast.loading('جاري حذف اليوم...');
        try {
            await api.deleteWorkSchedule(confirmDelete.dayId);
            showToast.dismiss(loadingToast);
            showToast.success('تم حذف اليوم بنجاح');
            fetchSchedules();
        } catch (error: any) {
            showToast.dismiss(loadingToast);
            showToast.error(`فشل في حذف اليوم: ${error.message}`);
        } finally {
            setConfirmDelete({ isOpen: false, dayId: null });
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
                                onClick={fetchSchedules}
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
                                <CalendarIcon className="w-5 h-5 text-green-600" />
                                إضافة يوم عمل جديد
                            </CardTitle>
                            <CardDescription>
                                اختر الأيام التي يعمل فيها المستشفى
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={fetchSchedules}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
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
                    <form onSubmit={handleAddDay} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    اختر يوماً
                                </label>
                                <select 
                                    name="day_of_week" 
                                    id="day_of_week" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-black"
                                >
                           {daysOfWeek.map(day => (
                               <option key={day} value={day}>{daysOfWeekArabic[day]}</option>
                           ))}
                        </select>
                    </div>
                            <div className="flex items-end">
                                <Button type="submit" section="hospital" className="w-full md:w-auto text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                                    <PlusCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    إضافة اليوم
                                </Button>
                            </div>
                        </div>
                </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-green-600" />
                        أيام العمل الحالية
                    </CardTitle>
                    <CardDescription>
                        الأيام المحددة للعمل في المستشفى
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="block md:hidden space-y-3">
                                {schedules.map(schedule => (
                                    <Card key={schedule.id} className="border-r-4 border-r-green-500">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                                        {daysOfWeekArabic[schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1)] || schedule.day_of_week}
                                                    </span>
                                                </div>
                                                <ActionButtons
                                                    onDelete={() => handleDeleteDayClick(schedule.id)}
                                                    showEdit={false}
                                                    size="sm"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {schedules.length === 0 && (
                                    <div className="text-center p-8">
                                        <CalendarIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">لم تتم إضافة أيام عمل بعد.</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800">
                                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                يوم العمل
                                            </th>
                                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map(schedule => (
                                            <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <CalendarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                                            {daysOfWeekArabic[schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1)] || schedule.day_of_week}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                                                    <ActionButtons
                                                        onDelete={() => handleDeleteDayClick(schedule.id)}
                                                        showEdit={false}
                                                        size="sm"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        {schedules.length === 0 && (
                                            <tr>
                                                <td colSpan={2} className="border border-gray-200 dark:border-gray-700 px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    <CalendarIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                                    <p>لم تتم إضافة أيام عمل بعد.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, dayId: null })}
                onConfirm={handleDeleteDayConfirm}
                title="تأكيد حذف يوم العمل"
                description="هل أنت متأكد من حذف هذا اليوم من جدول العمل؟"
                confirmText="حذف"
                cancelText="إلغاء"
                type="danger"
            />
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
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
      console.error("Failed to fetch profile", error);
      onLogout(); // Logout on profile fetch failure
    } finally {
      setLoadingProfile(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleLogoutClick = async () => {
    try {
        await api.logout();
    } catch(error){
        console.error("Logout failed on server, logging out client-side.", error);
    } finally {
        onLogout();
    }
  };
  
  // دالة للتنقل بين التبويبات مع التحقق من النوع
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
        return null; // لا تظهر معلومات البانر للصفحة الرئيسية
      case 'profile':
        return {
          title: 'الملف الشخصي للمستشفى',
          description: 'عرض وتعديل معلومات المستشفى الأساسية',
          icon: '👤',
          color: 'from-teal-500 to-cyan-600'
        };
      case 'services':
        return {
          title: 'إدارة الخدمات الطبية',
          description: 'إدارة الخدمات والأسعار والمواعيد',
          icon: '🏥',
          color: 'from-blue-500 to-cyan-600'
        };
      case 'schedule':
        return {
          title: 'جدول أيام العمل',
          description: 'إدارة أوقات العمل الأسبوعية',
          icon: '📅',
          color: 'from-green-500 to-emerald-600'
        };
      case 'reservations':
        return {
          title: 'الحجوزات قيد الانتظار',
          description: 'عرض وإدارة الحجوزات التي تحتاج إلى مراجعة',
          icon: '⏳',
          color: 'from-purple-500 to-indigo-600'
        };
      case 'history':
        return {
          title: 'سجل الحجوزات',
          description: 'عرض جميع الحجوزات المؤكدة والملغاة',
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
      <div className="flex-1 flex flex-col pt-16">
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
          {/* Header Section - يظهر فقط في الأقسام المحددة */}
          {tabInfo && (
            <div className={`bg-gradient-to-r ${tabInfo.color} text-white shadow-lg w-full`}> 
              <div className="px-2 sm:px-4 py-3">
                <div className="flex items-center space-x-2 space-x-reverse">
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
