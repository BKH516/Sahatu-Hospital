import toast from 'react-hot-toast';

/**
 * Toast Notifications Utility
 * توفير إشعارات عصرية وجذابة بدلاً من alert() التقليدي
 */

// أنماط Toast مخصصة
const toastStyles = {
  success: {
    style: {
      background: '#10b981',
      color: '#fff',
      fontFamily: 'Cairo, sans-serif',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    style: {
      background: '#ef4444',
      color: '#fff',
      fontFamily: 'Cairo, sans-serif',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
  loading: {
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontFamily: 'Cairo, sans-serif',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3b82f6',
    },
  },
  warning: {
    style: {
      background: '#f59e0b',
      color: '#fff',
      fontFamily: 'Cairo, sans-serif',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#f59e0b',
    },
  },
  info: {
    style: {
      background: '#0d9488',
      color: '#fff',
      fontFamily: 'Cairo, sans-serif',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#0d9488',
    },
  },
};

export const showToast = {
  /**
   * عرض رسالة نجاح
   */
  success: (message: string, duration: number = 3000) => {
    toast.success(message, {
      duration,
      ...toastStyles.success,
    });
  },

  /**
   * عرض رسالة خطأ
   */
  error: (message: string, duration: number = 4000) => {
    toast.error(message, {
      duration,
      ...toastStyles.error,
    });
  },

  /**
   * عرض رسالة تحميل
   */
  loading: (message: string) => {
    return toast.loading(message, {
      ...toastStyles.loading,
    });
  },

  /**
   * عرض رسالة تحذير
   */
  warning: (message: string, duration: number = 3500) => {
    toast(message, {
      icon: '⚠️',
      duration,
      ...toastStyles.warning,
    });
  },

  /**
   * عرض رسالة معلومات
   */
  info: (message: string, duration: number = 3000) => {
    toast(message, {
      icon: 'ℹ️',
      duration,
      ...toastStyles.info,
    });
  },

  /**
   * إخفاء toast محدد
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  /**
   * وعد (Promise) مع حالات مختلفة
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        success: toastStyles.success,
        error: toastStyles.error,
        loading: toastStyles.loading,
      }
    );
  },
};

// تكوين عام للـ Toaster
export const toasterConfig = {
  position: 'top-center' as const,
  reverseOrder: false,
  gutter: 8,
  toastOptions: {
    duration: 3000,
    style: {
      fontFamily: 'Cairo, sans-serif',
    },
  },
};

