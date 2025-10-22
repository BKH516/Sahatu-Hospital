import { HospitalService, WorkSchedule, Account, Hospital } from '../types';
import { API_CONFIG, API_ENDPOINTS, TokenManager } from '../config/apiConfig';
import { CSRFProtection } from '../utils/csrfProtection';
import { RateLimiter } from '../utils/rateLimiter';

// Error types for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Rate limiters for different endpoints
const loginRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute
const registerRateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes

// Generic fetch wrapper with error handling and fallback
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {},
  fallback?: T
): Promise<T> {
  const token = TokenManager.getToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Add CSRF token for state-changing requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = CSRFProtection.getToken();
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  // Let the browser set Content-Type for FormData, which includes the boundary.
  if (options.body instanceof FormData) {
    headers.delete('Content-Type');
  } else if (options.body && !headers.has('Content-Type')) {
    // Assume JSON for other body types unless specified.
    headers.set('Content-Type', 'application/json');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, { 
      ...options, 
      headers,
      signal: controller.signal 
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      
      // Handle token expiration (401 Unauthorized)
      if (response.status === 401) {
        // Clear token and trigger logout
        TokenManager.removeToken();
        window.dispatchEvent(new Event('token-expired'));
      }
      
      throw new ApiError(
        errorData.message || 'An unknown API error occurred',
        response.status,
        errorData.code
      );
    }

    // Handle responses that might not have a body, like 204 No Content.
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
      return null as T;
    }
    
    return await response.json();
  } catch (error) {
    // If we have a fallback and the error is network-related, use it
    if (fallback !== undefined && (error instanceof TypeError || (error as Error).name === 'AbortError')) {
      // API call failed, using fallback data
      return fallback;
    }
    
    // Re-throw ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
    }
    
    // Handle timeout
    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Request timeout. Please try again.', 0, 'TIMEOUT');
    }
    
    // Unknown error
    throw new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
  }
}

// Auth
export const registerHospital = (data: FormData) => {
  const email = data.get('email') as string;
  
  // Check rate limit
  if (!registerRateLimiter.canMakeRequest(email)) {
    const waitTime = Math.ceil(registerRateLimiter.getTimeUntilNextRequest(email) / 1000);
    throw new ApiError(
      `لقد تجاوزت الحد الأقصى لمحاولات التسجيل. يرجى الانتظار ${waitTime} ثانية`,
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }
  
  return fetchApi<{ message: string }>(API_ENDPOINTS.HOSPITAL_REGISTER, {
    method: 'POST',
    body: data,
  }).then(response => {
    // Reset rate limit on successful registration
    registerRateLimiter.reset(email);
    return response;
  });
};

export const loginWithPassword = (data: FormData) => {
  const object: { [key: string]: any } = {};
  data.forEach((value, key) => {
    object[key] = value;
  });
  
  const email = object.email as string;
  
  // Check rate limit
  if (!loginRateLimiter.canMakeRequest(email)) {
    const waitTime = Math.ceil(loginRateLimiter.getTimeUntilNextRequest(email) / 1000);
    throw new ApiError(
      `لقد تجاوزت الحد الأقصى لمحاولات تسجيل الدخول. يرجى الانتظار ${waitTime} ثانية`,
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }

  return fetchApi<{ message: string, token: string }>(API_ENDPOINTS.HOSPITAL_LOGIN, {
    method: 'POST',
    body: JSON.stringify(object),
  }).then(response => {
    // Reset rate limit on successful login
    loginRateLimiter.reset(email);
    return response;
  });
};

export const logout = () => {
  return fetchApi<{ message: string }>(API_ENDPOINTS.HOSPITAL_LOGOUT, { 
    method: 'POST' 
  }).finally(() => {
    // Always clear token on logout, even if API fails
    TokenManager.removeToken();
  });
};

// Profile with fallback
export const getMe = (): Promise<[Account, Hospital]> => {
  return fetchApi<[Account, Hospital]>(API_ENDPOINTS.HOSPITAL_ME);
};

export const updateProfile = (data: FormData) => {
  return fetchApi(API_ENDPOINTS.HOSPITAL_EDIT_PROFILE, {
    method: 'POST',
    body: data,
  });
};

// Services with fallback
export const getServices = (): Promise<HospitalService[]> => {
  return fetchApi<HospitalService[]>(API_ENDPOINTS.HOSPITAL_SERVICES, {}, []);
};

export const addService = (data: FormData) => {
  return fetchApi<HospitalService>(API_ENDPOINTS.HOSPITAL_SERVICES, {
    method: 'POST',
    body: data,
  });
};

export const updateService = (id: number, price: number, capacity: number) => {
  return fetchApi<HospitalService>(API_ENDPOINTS.HOSPITAL_SERVICE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify({ price, capacity }),
  });
};

export const deleteService = (id: number): Promise<void> => {
  return fetchApi(API_ENDPOINTS.HOSPITAL_SERVICE_BY_ID(id), { 
    method: 'DELETE' 
  });
};

// Work Schedules with fallback
export const getWorkSchedules = (): Promise<WorkSchedule[]> => {
  return fetchApi<WorkSchedule[]>(API_ENDPOINTS.HOSPITAL_WORK_SCHEDULES, {}, []);
};

export const addWorkSchedule = (day_of_week: string) => {
  const formData = new FormData();
  formData.append('day_of_week', day_of_week);
  return fetchApi<WorkSchedule>(API_ENDPOINTS.HOSPITAL_WORK_SCHEDULES, {
    method: 'POST',
    body: formData,
  });
};

export const deleteWorkSchedule = (id: number): Promise<void> => {
  return fetchApi(API_ENDPOINTS.HOSPITAL_WORK_SCHEDULE_BY_ID(id), { 
    method: 'DELETE' 
  });
};

// Password Reset
const passwordResetRateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes

export const forgotPassword = (email: string) => {
  // Check rate limit
  if (!passwordResetRateLimiter.canMakeRequest(email)) {
    const waitTime = Math.ceil(passwordResetRateLimiter.getTimeUntilNextRequest(email) / 1000);
    throw new ApiError(
      `لقد تجاوزت الحد الأقصى للمحاولات. يرجى الانتظار ${waitTime} ثانية`,
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }

  const formData = new FormData();
  formData.append('email', email);
  
  return fetchApi<{ message: string }>(API_ENDPOINTS.PASSWORD_FORGOT, {
    method: 'POST',
    body: formData,
  }).then(response => {
    // Reset rate limit on successful request
    passwordResetRateLimiter.reset(email);
    return response;
  });
};

export const resetPassword = (email: string, code: string, password: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('code', code);
  formData.append('password', password);
  
  return fetchApi<{ message: string }>(API_ENDPOINTS.PASSWORD_RESET, {
    method: 'POST',
    body: formData,
  });
};
