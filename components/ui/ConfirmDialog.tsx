import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  type = 'warning',
  loading = false,
}) => {
  const { t } = useTranslation();
  const defaultConfirmText = confirmText || t('common.confirm');
  const defaultCancelText = cancelText || t('common.cancel');
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getConfirmButtonVariant = () => {
    return type === 'danger' ? 'destructive' : 'default';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md dark:bg-gray-800 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="text-center pb-3">
          {getIcon()}
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </CardTitle>
          <CardDescription className="text-base mt-2 text-gray-600 dark:text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              {defaultCancelText}
            </Button>
            <Button 
              onClick={onConfirm}
              variant={getConfirmButtonVariant()}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.loading')}
                </span>
              ) : (
                defaultConfirmText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmDialog;

