import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { forgotPassword, resetPassword } from '../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/Input';
import { SanitizationUtils } from '../utils/sanitization';
import { PasswordSecurity } from '../utils/passwordSecurity';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isRTL = i18n.dir() === 'rtl';

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const sanitizedEmail = SanitizationUtils.sanitizeEmail(email);

    try {
      const response = await forgotPassword(sanitizedEmail);
      setSuccess(response.message || t('forgotPassword.codeSent'));
      setEmail(sanitizedEmail);
      setTimeout(() => {
        setStep('reset');
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(SanitizationUtils.sanitizeText(err.message || t('forgotPassword.codeError')));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const passwordStrength = PasswordSecurity.checkStrength(password);
    if (!passwordStrength.isStrong) {
      setError(passwordStrength.feedback.join('. '));
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, code, password);
      setSuccess(response.message || t('forgotPassword.resetSuccess'));
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err: any) {
      setError(SanitizationUtils.sanitizeText(err.message || t('forgotPassword.resetError')));
    } finally {
      setLoading(false);
    }
  };

  const stepText =
    step === 'email'
      ? t('forgotPassword.stepRequest', 'الخطوة 1 من 2: أرسل بريدك الإلكتروني')
      : t('forgotPassword.stepReset', 'الخطوة 2 من 2: أدخل الرمز وكلمة المرور الجديدة');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-teal-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg shadow-xl border border-teal-100/60 dark:border-teal-900/40 bg-white/90 dark:bg-gray-900/80 backdrop-blur">
        <CardHeader className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('forgotPassword.title', 'استعادة كلمة المرور')}
            </CardTitle>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200 transition"
            >
              <svg
                className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0 7-7m-7 7h18" />
                  </svg>
              {t('forgotPassword.backToLogin')}
            </button>
                </div>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {step === 'email'
                    ? t('forgotPassword.emailStepDescription')
                    : t('forgotPassword.resetStepDescription')}
                </CardDescription>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">{stepText}</p>
              </CardHeader>

        <CardContent className="space-y-4">
              {success && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
                  </svg>
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}

              {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {step === 'email' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
                      <Input
                        label={t('forgotPassword.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="info@hospital.com"
                      />

                  <Button
                    type="submit"
                    disabled={loading}
                    section="hospital"
                className="h-11 w-full text-sm font-semibold"
                  >
                    {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                        </svg>
                        {t('common.sending')}
                      </span>
                    ) : (
                      t('forgotPassword.sendCode')
                    )}
                  </Button>
                </form>
              ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
                    <Input
                      label={t('forgotPassword.verificationCode')}
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      placeholder="123456"
                    />

              <div className="space-y-2">
                    <div className="relative">
                      <Input
                        label={t('forgotPassword.newPassword')}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-9 text-gray-400 transition-colors hover:text-teal-500 ${
                      isRTL ? 'left-3' : 'right-3'
                    }`}
                      >
                        {showPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                          </svg>
                        ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                          </svg>
                        )}
                      </button>
                </div>
                        <PasswordStrengthMeter password={password} />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    section="hospital"
                className="h-11 w-full text-sm font-semibold"
                  >
                    {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                        </svg>
                        {t('common.savingText')}
                      </span>
                    ) : (
                      t('forgotPassword.resetPassword')
                    )}
                  </Button>
                </form>
              )}

          <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t(
              'forgotPassword.supportNote',
              'إذا احتجت مساعدة إضافية يمكن لفريق الدعم مساعدتك خلال دقائق.'
            )}
          </p>
            </CardContent>
          </Card>
    </div>
  );
};

export default ForgotPassword;