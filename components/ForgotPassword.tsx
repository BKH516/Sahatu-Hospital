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
      }, 2000);
    } catch (err: any) {
      setError(SanitizationUtils.sanitizeText(err.message || t('forgotPassword.codeError')));
    } finally {
      setLoading(false);
    }
  };

  const isRTL = i18n.dir() === 'rtl';

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Check password strength
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
      }, 2000);
    } catch (err: any) {
      setError(SanitizationUtils.sanitizeText(err.message || t('forgotPassword.resetError')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-sky-50 via-teal-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-12">
      <div className="relative w-full max-w-5xl h-[540px]">
        <div className="absolute inset-0 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-800/60 shadow-[0_25px_80px_-20px_rgba(13,148,136,0.35)]" />

        <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
          <section className={`p-6 sm:p-8 flex flex-col gap-6 border-b lg:border-b-0 ${isRTL ? 'lg:border-l' : 'lg:border-r'} border-white/50 dark:border-gray-800/80 bg-gradient-to-br from-white/80 via-white/60 to-teal-50/60 dark:from-gray-900/40 dark:via-gray-900/30 dark:to-teal-950/20 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none`}>
            <header className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </span>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-teal-500 dark:text-teal-300 font-semibold">
                    {t('forgotPassword.title')}
                  </p>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    {t('forgotPassword.emailStepDescription')}
                  </h1>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-500 dark:text-teal-300">
                  {t('common.secureArea') || 'Secure Area'}
                </span>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {t('common.sslProtected')}
                </p>
              </div>
            </header>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'md:[direction:rtl]' : ''}`}>
              <div className="rounded-2xl border border-teal-100/70 dark:border-teal-900/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-inner">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  {t('forgotPassword.codeSent')}
                </p>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-500 text-white font-bold">60</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t('forgotPassword.resetStepDescription')}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-100/80 dark:border-sky-900/60 bg-gradient-to-br from-sky-50/90 to-white/80 dark:from-sky-950/30 dark:to-gray-900/50 p-4 flex flex-col justify-between">
                <div className={`flex justify-between items-center text-[11px] uppercase font-semibold tracking-wide ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sky-500 dark:text-sky-300">{t('common.helpCenter') || 'Help Center'}</span>
                  <span className="text-gray-400 dark:text-gray-500">24/7</span>
                </div>
                <div className={`mt-2 text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                  <p>{t('common.supportEmail') || 'support@sahtee.com'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {t('common.supportMessage') || 'We respond within 15 minutes.'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`mt-auto grid grid-cols-3 gap-4 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : ''}`}>
              {['identity', 'security', 'recovery'].map((key, index) => (
                <div key={key} className="rounded-xl border border-white/40 dark:border-gray-800/70 bg-white/60 dark:bg-gray-900/50 px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-500 dark:text-teal-300">
                    0{index + 1}
                  </p>
                  <p className="mt-1 font-medium text-gray-700 dark:text-gray-200">
                    {t(`forgotPassword.timeline.${key}.title`, key)}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    {t(`forgotPassword.timeline.${key}.description`, 'Secure your account in minutes.')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Card className="rounded-none rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none border-transparent shadow-none bg-white/80 dark:bg-gray-900/80 flex flex-col">
            <div className="p-6 border-b border-gray-100/80 dark:border-gray-800/70">
              <CardHeader className={`p-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <CardTitle className="text-lg font-bold text-teal-700 dark:text-teal-300">
                  {step === 'email' ? t('forgotPassword.sendCode') : t('forgotPassword.resetPassword')}
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {step === 'email'
                    ? t('forgotPassword.emailStepDescription')
                    : t('forgotPassword.resetStepDescription')}
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="flex-1 p-6 flex flex-col gap-4">
              {success && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 px-4 py-3 text-emerald-700 dark:text-emerald-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 px-4 py-3 text-red-600 dark:text-red-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {step === 'email' ? (
                <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                  <div className={`flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <Input
                        label={t('forgotPassword.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="info@hospital.com"
                        className="bg-transparent"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    section="hospital"
                    className="h-12 text-sm font-semibold tracking-wide uppercase"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common.sending')}
                      </span>
                    ) : (
                      t('forgotPassword.sendCode')
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isRTL ? 'sm:[direction:rtl]' : ''}`}>
                    <Input
                      label={t('forgotPassword.verificationCode')}
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      placeholder="123456"
                      className="bg-white dark:bg-gray-900"
                    />
                    <div className="relative">
                      <Input
                        label={t('forgotPassword.newPassword')}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="bg-white dark:bg-gray-900 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-9 text-gray-400 hover:text-teal-500 transition-colors`}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <div className="mt-2">
                        <PasswordStrengthMeter password={password} />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    section="hospital"
                    className="h-12 text-sm font-semibold tracking-wide uppercase"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common.savingText')}
                      </span>
                    ) : (
                      t('forgotPassword.resetPassword')
                    )}
                  </Button>
                </form>
              )}

              <div className={`mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div>
                  <p className="font-semibold text-gray-600 dark:text-gray-300">
                    {t('common.needHelp') || 'Need help?'}
                  </p>
                  <p>{t('common.chatWithUs') || 'Chat with our support team'}</p>
                </div>
                <button
                  onClick={onBack}
                  type="button"
                  className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-300 font-semibold hover:text-teal-700 dark:hover:text-teal-200 transition"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('forgotPassword.backToLogin')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

