import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { registerHospital } from '../services/apiService';
import { HospitalIcon } from './ui/icons';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/Input';
import { SanitizationUtils } from '../utils/sanitization';
import { PasswordSecurity } from '../utils/passwordSecurity';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { showToast } from '../utils';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';

interface RegisterPageProps {
  onAuthSuccess: (token: string, remember?: boolean) => void;
  onBack: () => void;
  onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onAuthSuccess, onBack, onNavigateToLogin }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const email = SanitizationUtils.sanitizeEmail(formData.get('email') as string);
    const phone = SanitizationUtils.sanitizePhone(formData.get('phone_number') as string);
    
    formData.set('email', email);
    formData.set('phone_number', phone);
    
    const pwd = formData.get('password') as string;
    const passwordConfirmation = formData.get('password_confirmation');
    
    const passwordStrength = PasswordSecurity.checkStrength(pwd);
    if (!passwordStrength.isStrong) {
      setError(passwordStrength.feedback.join('. '));
      setLoading(false);
      return;
    }
    
    if (pwd !== passwordConfirmation) {
      setError(t('auth.register.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      await registerHospital(formData);
      showToast.success(t('auth.register.success'), 3000);
      setTimeout(() => {
        onNavigateToLogin();
        setSuccess(null);
        setPassword('');
      }, 3000);
    } catch (err: any) {
      const errorMessage = SanitizationUtils.sanitizeText(err.message || t('auth.register.error'));
      showToast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 overflow-x-hidden py-4 sm:py-6 lg:py-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-100/50 to-transparent dark:from-teal-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-100/50 to-transparent dark:from-cyan-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className={`sticky top-4 flex w-full pb-6 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <div className={`flex items-center gap-2 sm:gap-3 rounded-full border border-gray-200 bg-white/95 px-2 py-2 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-600 transition-all duration-200 hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300 dark:hover:bg-teal-900/60"
              title={t('common.back')}
            >
              <svg
                className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0 7-7m-7 7h18" />
              </svg>
            </button>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 xl:gap-10 items-center justify-center w-full">
          
          {/* ========== LEFT SIDE - BRANDING (Desktop Only) ========== */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 xl:space-y-8">
            {/* Logo & Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <HospitalIcon className="w-9 h-9 xl:w-12 xl:h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {t('common.appName')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-base xl:text-lg font-medium">
                    {t('common.appTagline')}
                  </p>
                </div>
              </div>
              
              <p className="text-lg xl:text-xl text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                {t('auth.register.subtitle')}
              </p>
            </div>

            {/* Admin Registration Notice */}
            <div className="p-5 xl:p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-xl border-2 border-amber-200 dark:border-amber-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-amber-100 dark:bg-amber-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 xl:w-6 xl:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm xl:text-base font-bold text-amber-900 dark:text-amber-100 mb-2">
                    📋 {t('auth.register.howToRegister')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full flex-shrink-0 mt-0.5">1</span>
                      <p className="text-xs xl:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        {t('auth.register.step1')}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full flex-shrink-0 mt-0.5">2</span>
                      <p className="text-xs xl:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        {t('auth.register.step2')}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full flex-shrink-0 mt-0.5">3</span>
                      <p className="text-xs xl:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        {t('auth.register.step3')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
                    <p className="text-[10px] xl:text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>{t('auth.register.uniqueCodeNote')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== RIGHT SIDE - FORM ========== */}
          <div className="w-full lg:max-w-md mx-auto flex flex-col items-center">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-3 sm:mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl shadow-xl flex items-center justify-center">
                <HospitalIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('auth.register.title')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('auth.register.subtitleForm')}
              </p>
            </div>

            {/* Alerts */}
            {success && (
              <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700 animate-in slide-in-from-top fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700 animate-in slide-in-from-top fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Form Card */}
            <Card className="border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 w-full">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label={t('auth.register.hospitalName')}
                      name="hospital_name"
                      type="text"
                      required
                      placeholder={t('auth.register.hospitalNamePlaceholder')}
                      minLength={3}
                      maxLength={100}
                      title={t('auth.register.hospitalNameTitle')}
                    />
                    <div>
                      <Input
                        label={t('auth.register.uniqueCode')}
                        name="unique_code"
                        type="text"
                        required
                        placeholder="HOSP-001"
                        pattern="[A-Z0-9\-]+"
                        minLength={4}
                        maxLength={20}
                        title={t('auth.register.uniqueCodeTitle')}
                      />
                      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {t('auth.register.uniqueCodeHelper')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        label={t('auth.register.email')}
                        name="email"
                        type="email"
                        required
                        placeholder="info@hospital.com"
                        autoComplete="email"
                        title={t('auth.register.emailTitle')}
                      />
                      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                        {t('auth.register.emailExample')}
                      </p>
                    </div>
                    <div>
                      <Input
                        label={t('auth.register.phone')}
                        name="phone_number"
                        type="tel"
                        required
                        placeholder="+966 50 123 4567"
                        autoComplete="tel"
                        pattern="[+]?[0-9\s\-]+"
                        title={t('auth.register.phonePatternTitle')}
                      />
                      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                        {t('auth.register.phoneExample')}
                      </p>
                    </div>
                  </div>

                  <Input
                    label={t('auth.register.address')}
                    name="address"
                    type="text"
                    required
                    placeholder={t('auth.register.addressPlaceholder')}
                    minLength={10}
                    maxLength={200}
                    title={t('auth.register.addressTitle')}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Input
                        label={t('auth.register.password')}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`pr-12 ${i18n.language === 'ar' ? 'pl-12' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-[38px] text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors`}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <PasswordStrengthMeter password={password} />
                    </div>

                    <div className="relative">
                      <Input
                        label={t('auth.register.confirmPassword')}
                        name="password_confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className={`pr-12 ${i18n.language === 'ar' ? 'pl-12' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-[38px] text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors`}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    section="hospital"
                    className="w-full h-10 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('auth.register.creating')}
                      </span>
                    ) : (
                      t('auth.register.registerButton')
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t('auth.register.hasAccount')}
                  </p>
                  <button
                    onClick={onNavigateToLogin}
                    className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors hover:underline"
                  >
                    {t('auth.register.loginLink')}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Registration Instructions - Mobile Only */}
            <div className="lg:hidden mt-4 sm:mt-6 w-full">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700 shadow-lg w-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-3">
                        📋 {t('auth.register.howToRegister')}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full flex-shrink-0 mt-0.5">1</span>
                          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                            {t('auth.register.step1')}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full flex-shrink-0 mt-0.5">2</span>
                          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                            {t('auth.register.step2')}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full flex-shrink-0 mt-0.5">3</span>
                          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                            {t('auth.register.step3')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>{t('auth.register.uniqueCodeNote')}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <p className="mt-3 sm:mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              {t('common.sslProtected')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


