import { API_CONFIG, API_ENDPOINTS, TokenManager } from '../config/apiConfig';
import { WorkSchedule } from '../types';
import i18n from '../i18n';

// Generic API fetch client with error handling
async function apiFetch<T>(path: string, options: RequestInit = {}, fallback?: T): Promise<T> {
  const token = TokenManager.getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  const method = (options.method || 'GET').toUpperCase();

  const currentLang =
    i18n?.language ||
    localStorage.getItem('i18nextLng') ||
    sessionStorage.getItem('i18nextLng') ||
    'ar';

  headers.set('Accept-Language', currentLang);
  
  // Allow FormData without Content-Type, otherwise JSON
  if (options.body instanceof FormData) {
    headers.delete('Content-Type');
  } else if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
    
    const requestUrl = new URL(`${API_CONFIG.BASE_URL}${path}`, API_CONFIG.BASE_URL);
    if (method === 'GET') {
      requestUrl.searchParams.set('lang', currentLang);
    }

    const response = await fetch(requestUrl.toString(), { 
      ...options, 
      headers,
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      throw new Error(err.message || 'API error');
    }
    
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
      return null as T;
    }
    
    return (await response.json()) as T;
  } catch (e) {
    // If fallback is provided, use it instead of throwing
    if (fallback !== undefined) {
      // API call failed, using fallback
      return fallback;
    }
    
    throw e;
  }
}

export interface DashboardStats {
  // إحصائيات جدول الأيام
  workDays: {
    total: number;
    days: string[];
  };
  // إحصائيات جدول الخدمات
  services: {
    total: number;
    averagePrice: number;
    totalCapacity: number;
  };
  // إحصائيات جدول الحجوزات
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    revenue: number;
  };
}

// Hospital Reservation Interface (simplified from API)
export interface Reservation {
  id: number;
  user_name: string;
  service_name: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  start_date: string;
  end_date: string;
}

export interface Service {
  id: number;
  doctor_id: number;
  name: string;
  price: string;
  duration_minutes: number;
  capacity?: number;
  created_at: string;
  updated_at: string;
}

const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  workDays: {
    total: 0,
    days: []
  },
  services: {
    total: 0,
    averagePrice: 0,
    totalCapacity: 0
  },
  reservations: {
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    revenue: 0
  }
};

// Fetch all reservations with fallback
export const getAllReservations = async (): Promise<Reservation[]> => {
  const reservations = await apiFetch<Reservation[]>(
    API_ENDPOINTS.HOSPITAL_RESERVATIONS,
    {},
    []
  );
  return reservations || [];
};

// Fetch reservations by status with fallback
export const getReservationsByStatus = async (status: string): Promise<Reservation[]> => {
  // Hospital API doesn't support filtering by status, so we get all and filter
  const allReservations = await getAllReservations();
  return allReservations.filter(r => r.status === status);
};

// Fetch pending reservations
export const getPendingReservations = async (): Promise<Reservation[]> => {
  return getReservationsByStatus('pending');
};

// Confirm a reservation
export const confirmReservation = async (id: number): Promise<void> => {
  await updateReservationStatus(id, 'confirmed');
};

// Cancel a reservation
export const cancelReservation = async (id: number): Promise<void> => {
  await updateReservationStatus(id, 'cancelled');
};

// Fetch all services with fallback (using hospital services endpoint)
export const getAllServices = async (): Promise<Service[]> => {
  const services = await apiFetch<Service[]>(
    API_ENDPOINTS.HOSPITAL_SERVICES,
    {},
    []
  );
  return services || [];
};

// Fetch all work schedules with fallback
export const getAllWorkSchedules = async (): Promise<WorkSchedule[]> => {
  const schedules = await apiFetch<WorkSchedule[]>(
    API_ENDPOINTS.HOSPITAL_WORK_SCHEDULES,
    {},
    []
  );
  return schedules || [];
};

// Update reservation status (using PATCH with query parameter as per Postman)
export const updateReservationStatus = async (id: number, status: string): Promise<boolean> => {
  try {
    await apiFetch(
      `${API_ENDPOINTS.HOSPITAL_RESERVATIONS_UPDATE_STATUS(id)}?status=${encodeURIComponent(status)}`,
      {
        method: 'PATCH'
      }
    );
    return true;
  } catch (error) {
    throw error;
  }
};

// Get comprehensive dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch all data in parallel with fallbacks
    const [allReservations, services, workSchedules] = await Promise.all([
      getAllReservations(),
      getAllServices(),
      getAllWorkSchedules()
    ]);

    // Calculate dates
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Calculate start of week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // Filter reservations by date
    const todayReservations = allReservations.filter(r => r.start_date === today);
    const weeklyReservations = allReservations.filter(r => r.start_date >= startOfWeekStr);
    const monthlyReservations = allReservations.filter(r => r.start_date >= startOfMonth && r.start_date <= endOfMonth);

    // Filter reservations by status
    const pendingReservations = allReservations.filter(r => r.status === 'pending');
    const confirmedReservations = allReservations.filter(r => r.status === 'confirmed');
    const completedReservations = allReservations.filter(r => r.status === 'completed');
    const cancelledReservations = allReservations.filter(r => r.status === 'cancelled');

    // Calculate total revenue from all reservations
    const totalRevenue = allReservations.reduce((total, reservation) => {
      return total + (reservation.price || 0);
    }, 0);

    // Calculate average service price and total capacity
    const averageServicePrice = services.length > 0 
      ? services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) / services.length 
      : 0;
    
    const totalCapacity = services.reduce((sum, s) => sum + (s.capacity || 0), 0);

    // Get work days list
    const workDaysList = workSchedules.map(ws => ws.day_of_week);

    return {
      workDays: {
        total: workSchedules.length,
        days: workDaysList
      },
      services: {
        total: services.length,
        averagePrice: Math.round(averageServicePrice * 100) / 100,
        totalCapacity: totalCapacity
      },
      reservations: {
        total: allReservations.length,
        pending: pendingReservations.length,
        confirmed: confirmedReservations.length,
        cancelled: cancelledReservations.length,
        completed: completedReservations.length,
        today: todayReservations.length,
        thisWeek: weeklyReservations.length,
        thisMonth: monthlyReservations.length,
        revenue: totalRevenue
      }
    };
  } catch (error) {
    return DEFAULT_DASHBOARD_STATS;
  }
};
