import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, Hospital } from '../types';
import { TokenManager } from '../config/apiConfig';
import { getMe } from '../services/apiService';
import { CSRFProtection } from '../utils/csrfProtection';

// App state interface
interface AppState {
  // Auth
  isAuthenticated: boolean;
  token: string | null;
  
  // User data
  account: Account | null;
  hospital: Hospital | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Theme state
  theme: 'light' | 'dark';
}

// App actions interface
interface AppActions {
  // Auth actions
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
  
  // User actions
  loadUserData: () => Promise<void>;
  updateUserData: (account: Account, hospital: Hospital) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Combined context type
interface AppContextType extends AppState, AppActions {}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider props
interface AppProviderProps {
  children: ReactNode;
}

// Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Get initial theme from localStorage or default to 'light'
  const getInitialTheme = (): 'light' | 'dark' => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return 'light';
  };

  const [state, setState] = useState<AppState>({
    isAuthenticated: TokenManager.hasToken(),
    token: TokenManager.getToken(),
    account: null,
    hospital: null,
    loading: false,
    error: null,
    theme: getInitialTheme(),
  });

  // Load user data on mount if authenticated
  useEffect(() => {
    if (state.isAuthenticated && !state.account) {
      loadUserData();
    }
  }, [state.isAuthenticated]);
  
  // Handle token expiration
  useEffect(() => {
    const handleTokenExpired = () => {
      logout();
      alert('انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.');
    };
    
    window.addEventListener('token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('token-expired', handleTokenExpired);
    };
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  // Auth actions
  const login = (token: string, remember: boolean = false) => {
    TokenManager.setToken(token, remember);
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      token,
      error: null,
    }));
  };

  const logout = () => {
    TokenManager.removeToken();
    // Clear user data from storage
    sessionStorage.removeItem('sahtee_user_data');
    localStorage.removeItem('sahtee_user_data');
    // Clear CSRF token
    CSRFProtection.clearToken();
    
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      token: null,
      account: null,
      hospital: null,
      error: null,
    }));
  };

  // User actions
  const loadUserData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const [account, hospital] = await getMe();
      
      // Save user data to storage for use in statsService
      const userData = [account, hospital];
      const userDataStr = JSON.stringify(userData);
      if (TokenManager.getToken() === sessionStorage.getItem('sahtee_hospital_token')) {
        sessionStorage.setItem('sahtee_user_data', userDataStr);
      } else {
        localStorage.setItem('sahtee_user_data', userDataStr);
      }
      
      setState(prev => ({
        ...prev,
        account,
        hospital,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load user data',
      }));
      
      // If unauthorized, logout
      if (error.statusCode === 401) {
        logout();
      }
    }
  };

  const updateUserData = (account: Account, hospital: Hospital) => {
    // Save to storage as well
    const userData = [account, hospital];
    const userDataStr = JSON.stringify(userData);
    if (TokenManager.getToken() === sessionStorage.getItem('sahtee_hospital_token')) {
      sessionStorage.setItem('sahtee_user_data', userDataStr);
    } else {
      localStorage.setItem('sahtee_user_data', userDataStr);
    }
    
    setState(prev => ({
      ...prev,
      account,
      hospital,
    }));
  };

  // UI actions
  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Theme actions
  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({
      ...prev,
      theme,
    }));
  };

  const value: AppContextType = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    loadUserData,
    updateUserData,
    setLoading,
    setError,
    clearError,
    toggleTheme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export context for advanced use cases
export default AppContext;


