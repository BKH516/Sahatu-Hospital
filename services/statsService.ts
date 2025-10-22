import { API_CONFIG, API_ENDPOINTS, TokenManager, STORAGE_KEYS } from '../config/apiConfig';
import { WorkSchedule } from '../types';

// Server availability tracking
let isServerAvailable = true;

// Get hospital ID from storage
const getHospitalId = (): number | null => {
  const userDataStr = sessionStorage.getItem(STORAGE_KEYS.USER_DATA) || localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userDataStr) return null;
  
  try {
    const [, hospital] = JSON.parse(userDataStr);
    return hospital?.id || null;
  } catch {
    return null;
  }
};

// Generic API fetch client with error handling
async function apiFetch<T>(path: string, options: RequestInit = {}, fallback?: T): Promise<T> {
  const token = TokenManager.getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  
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
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, { 
      ...options, 
      headers,
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    isServerAvailable = true;
    
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
    isServerAvailable = false;
    
    // If fallback is provided, use it instead of throwing
    if (fallback !== undefined) {
      // API call failed, using fallback
      return fallback;
    }
    
    throw e;
  }
}

export const getServerStatus = () => isServerAvailable;

export interface StatsData {
  totalReservations: number;
  pendingReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  confirmedReservations: number;
  totalServices: number;
  todayReservations: number;
  monthlyRevenue: number;
  weeklyReservations: number;
  totalWorkDays: number;
  averageServicePrice: number;
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

// Default empty stats
const DEFAULT_STATS: StatsData = {
  totalReservations: 0,
  pendingReservations: 0,
  completedReservations: 0,
  cancelledReservations: 0,
  confirmedReservations: 0,
  totalServices: 0,
  todayReservations: 0,
  monthlyRevenue: 0,
  weeklyReservations: 0,
  totalWorkDays: 0,
  averageServicePrice: 0
};

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

// Fetch reservations by date range with fallback
export const getReservationsByDate = async (from: string, to: string): Promise<Reservation[]> => {
  // Hospital API doesn't support date filtering, so we get all and filter
  const allReservations = await getAllReservations();
  return allReservations.filter(r => r.start_date >= from && r.start_date <= to);
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

// Calculate statistics from reservations and services
export const calculateStats = async (): Promise<StatsData> => {
  try {
    // Fetch all data with fallbacks
    const [allReservations, services] = await Promise.all([
      getAllReservations(),
      getAllServices()
    ]);

    // Calculate dates
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Calculate start of week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // Filter reservations
    const todayReservations = allReservations.filter(r => r.start_date === today);
    const monthlyReservations = allReservations.filter(r => r.start_date >= startOfMonth && r.start_date <= endOfMonth);
    const weeklyReservations = allReservations.filter(r => r.start_date >= startOfWeekStr);
    
    const pendingReservations = allReservations.filter(r => r.status === 'pending');
    const confirmedReservations = allReservations.filter(r => r.status === 'confirmed');
    const completedReservations = allReservations.filter(r => r.status === 'completed');
    const cancelledReservations = allReservations.filter(r => r.status === 'cancelled');

    // Calculate monthly revenue
    const monthlyRevenue = monthlyReservations.reduce((total, reservation) => {
      return total + (reservation.price || 0);
    }, 0);

    // Calculate average service price
    const averageServicePrice = services.length > 0 
      ? services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) / services.length 
      : 0;

    return {
      totalReservations: allReservations.length,
      pendingReservations: pendingReservations.length,
      completedReservations: completedReservations.length,
      confirmedReservations: confirmedReservations.length,
      cancelledReservations: cancelledReservations.length,
      totalServices: services.length,
      todayReservations: todayReservations.length,
      monthlyRevenue: monthlyRevenue,
      weeklyReservations: weeklyReservations.length,
      totalWorkDays: 0,
      averageServicePrice: averageServicePrice
    };
  } catch (error) {
    return DEFAULT_STATS;
  }
};

// Get quick stats (faster, less data)
export const getQuickStats = async (): Promise<Partial<StatsData>> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch in parallel with fallbacks
    const [pendingReservations, todayReservations, services] = await Promise.all([
      getReservationsByStatus('pending'),
      getReservationsByDate(today, today),
      getAllServices()
    ]);

    return {
      pendingReservations: pendingReservations.length,
      todayReservations: todayReservations.length,
      totalServices: services.length
    };
  } catch (error) {
    return {
      pendingReservations: 0,
      todayReservations: 0,
      totalServices: 0
    };
  }
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

// Get stats by period
export const getStatsByPeriod = async (startDate: string, endDate: string): Promise<StatsData> => {
  try {
    const [reservations, services] = await Promise.all([
      getReservationsByDate(startDate, endDate),
      getAllServices()
    ]);

    const pendingReservations = reservations.filter(r => r.status === 'pending');
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    const completedReservations = reservations.filter(r => r.status === 'completed');
    const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

    const revenue = reservations.reduce((total, reservation) => {
      return total + (reservation.price || 0);
    }, 0);

    // Calculate average service price
    const averageServicePrice = services.length > 0 
      ? services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) / services.length 
      : 0;

    return {
      totalReservations: reservations.length,
      pendingReservations: pendingReservations.length,
      completedReservations: completedReservations.length,
      confirmedReservations: confirmedReservations.length,
      cancelledReservations: cancelledReservations.length,
      totalServices: services.length,
      todayReservations: 0, // Not applicable for custom period
      monthlyRevenue: revenue,
      weeklyReservations: 0, // Not applicable for custom period
      totalWorkDays: 0,
      averageServicePrice: averageServicePrice
    };
  } catch (error) {
    return DEFAULT_STATS;
  }
};
