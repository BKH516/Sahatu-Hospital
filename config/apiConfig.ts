/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */
import { EncryptionUtils } from '../utils/encryption';

// Environment-based API URL
export const API_CONFIG = {
  // Base URL - change this based on environment
  BASE_URL: import.meta.env.VITE_API_URL || 'https://sahtee.evra-co.com/api',
  
  // Hospital endpoints
  HOSPITAL_BASE: '/hospital',
  
  // Doctor endpoints (for stats)
  DOCTOR_BASE: '/doctor',
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Full endpoint paths
export const API_ENDPOINTS = {
  // Hospital Auth
  HOSPITAL_REGISTER: `${API_CONFIG.HOSPITAL_BASE}/register`,
  HOSPITAL_LOGIN: `${API_CONFIG.HOSPITAL_BASE}/login`,
  HOSPITAL_LOGOUT: `${API_CONFIG.HOSPITAL_BASE}/logout`,
  HOSPITAL_ME: `${API_CONFIG.HOSPITAL_BASE}/me`,
  HOSPITAL_EDIT_PROFILE: `${API_CONFIG.HOSPITAL_BASE}/edit-profile`,
  
  // Hospital Services
  HOSPITAL_SERVICES: `${API_CONFIG.HOSPITAL_BASE}/service`,
  HOSPITAL_SERVICE_BY_ID: (id: number) => `${API_CONFIG.HOSPITAL_BASE}/service/${id}`,
  
  // Hospital Work Schedules
  HOSPITAL_WORK_SCHEDULES: `${API_CONFIG.HOSPITAL_BASE}/work-schedules`,
  HOSPITAL_WORK_SCHEDULE_BY_ID: (id: number) => `${API_CONFIG.HOSPITAL_BASE}/work-schedules/${id}`,
  
  // Doctor Stats & Reservations
  DOCTOR_RESERVATIONS: `${API_CONFIG.DOCTOR_BASE}/reservations`,
  DOCTOR_RESERVATIONS_BY_STATUS: (status: string) => `${API_CONFIG.DOCTOR_BASE}/reservations?status=${encodeURIComponent(status)}`,
  DOCTOR_RESERVATIONS_BY_DATE: (from: string, to: string) => `${API_CONFIG.DOCTOR_BASE}/reservations?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  DOCTOR_RESERVATIONS_UPDATE_STATUS: (id: number) => `${API_CONFIG.DOCTOR_BASE}/reservations/updateStatus/${id}`,
  DOCTOR_SERVICES: `${API_CONFIG.DOCTOR_BASE}/services`,
  
  // Hospital Reservations (correct endpoints from Postman)
  HOSPITAL_RESERVATIONS: `${API_CONFIG.HOSPITAL_BASE}/reservations`,
  HOSPITAL_RESERVATIONS_BY_ID: (id: number) => `${API_CONFIG.HOSPITAL_BASE}/reservations/${id}`,
  HOSPITAL_RESERVATIONS_TRASHED: `${API_CONFIG.HOSPITAL_BASE}/reservations/trashed`,
  HOSPITAL_RESERVATIONS_UPDATE_STATUS: (id: number) => `${API_CONFIG.HOSPITAL_BASE}/reservations/${id}/status`,
  HOSPITAL_RESERVATIONS_DELETE: (id: number) => `${API_CONFIG.HOSPITAL_BASE}/reservations/${id}`,
  HOSPITAL_RESERVATIONS_RESTORE: (id: number) => `${API_CONFIG.HOSPITAL_BASE}/reservations/${id}/restore`,
  
  // Password Reset
  PASSWORD_FORGOT: '/password/forgot',
  PASSWORD_RESET: '/password/reset',
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sahtee_hospital_token',
  USER_DATA: 'sahtee_user_data',
  THEME: 'theme',
};

// Token management utilities
export const TokenManager = {
  getToken: (): string | null => {
    const encrypted = 
      sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!encrypted) return null;
    
    try {
      // Decrypt the token before returning
      return EncryptionUtils.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to decrypt token:', error);
      // If decryption fails, remove the corrupted token
      TokenManager.removeToken();
      return null;
    }
  },
  
  setToken: (token: string, remember: boolean = false): void => {
    try {
      // Encrypt the token before storing
      const encrypted = EncryptionUtils.encrypt(token);
      
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encrypted);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encrypted);
      }
    } catch (error) {
      console.error('Failed to encrypt token:', error);
      throw new Error('Failed to store authentication token');
    }
  },
  
  removeToken: (): void => {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  hasToken: (): boolean => {
    return !!TokenManager.getToken();
  }
};


