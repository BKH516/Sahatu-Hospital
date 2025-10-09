import React from 'react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/**
 * Modern Icon Action Buttons Component
 * أزرار أيقونات عصرية ومتطورة
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  size = 'sm',
  disabled = false,
}) => {
  const buttonSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Edit Button - أيقونة قلم بدائرة أزرق */}
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          disabled={disabled}
          title="تعديل"
          className={`
            ${buttonSizes[size]}
            relative group overflow-hidden
            bg-gradient-to-br from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            dark:from-blue-600 dark:to-blue-700
            dark:hover:from-blue-700 dark:hover:to-blue-800
            text-white font-semibold rounded-full
            shadow-lg hover:shadow-xl hover:shadow-blue-500/50
            transform hover:-translate-y-1 hover:scale-110
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:transform-none disabled:hover:shadow-lg
            flex items-center justify-center
            border-2 border-blue-400/30
          `}
        >
          {/* Glow pulse effect */}
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></span>
          
          {/* Rotating glow */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-spin"></span>
          
          {/* Edit Icon - قلم */}
          <svg className={`${iconSizes[size]} relative z-10 group-hover:rotate-12 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      {/* Delete Button - أيقونة سلة المهملات بدائرة حمراء */}
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          disabled={disabled}
          title="حذف"
          className={`
            ${buttonSizes[size]}
            relative group overflow-hidden
            bg-gradient-to-br from-red-500 to-rose-600
            hover:from-red-600 hover:to-rose-700
            dark:from-red-600 dark:to-rose-700
            dark:hover:from-red-700 dark:hover:to-rose-800
            text-white font-semibold rounded-full
            shadow-lg hover:shadow-xl hover:shadow-red-500/50
            transform hover:-translate-y-1 hover:scale-110
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:transform-none disabled:hover:shadow-lg
            flex items-center justify-center
            border-2 border-red-400/30
          `}
        >
          {/* Glow pulse effect */}
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></span>
          
          {/* Shake animation on hover */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></span>
          
          {/* Delete Icon - سلة مهملات */}
          <svg className={`${iconSizes[size]} relative z-10 group-hover:scale-110 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;

