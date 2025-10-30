/**
 * Password Strength Meter Component
 * Displays visual feedback on password strength
 */
import React from 'react';
import { PasswordSecurity } from '../utils/passwordSecurity';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;
  
  const { score, feedback, isStrong } = PasswordSecurity.checkStrength(password);
  const percentage = (score / 6) * 100;
  
  // Determine color based on score
  const getColor = (): string => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getTextColor = (): string => {
    if (score <= 1) return 'text-red-600 dark:text-red-400';
    if (score <= 2) return 'text-orange-600 dark:text-orange-400';
    if (score <= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (score <= 4) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };
  
  const label = PasswordSecurity.getStrengthLabel(score);
  
  return (
  <div className="mt-1 space-y-1">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()}`}
            style={{
              transform: `scaleX(${percentage / 100})`,
              transformOrigin: 'left',
              transition: 'transform 300ms ease',
              willChange: 'transform'
            }}
          />
        </div>
        <span className={`text-[10px] sm:text-xs font-medium ${getTextColor()} whitespace-nowrap`}>
          {label}
        </span>
      </div>
      
      {/* Feedback messages - أكثر إحكاماً */}
      {feedback.length > 0 && !isStrong && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-md px-1.5 py-1 border border-orange-200 dark:border-orange-800">
          <ul className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 space-y-0.5">
            {feedback.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-orange-500 text-[8px] mt-0.5">●</span>
                <span className="leading-tight">{item}</span>
              </li>
            ))}
            {feedback.length > 2 && (
              <li className="text-[9px] text-orange-600 dark:text-orange-400 mt-0.5">
                +{feedback.length - 2} نصيحة أخرى
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Success message */}
      {isStrong && (
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md px-1.5 py-0.5 border border-green-200 dark:border-green-800">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium">كلمة مرور قوية!</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

