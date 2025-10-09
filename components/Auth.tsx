import React, { useState } from 'react';
import { registerHospital, loginWithPassword } from '../services/apiService';
import { HospitalIcon } from './ui/icons';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SanitizationUtils } from '../utils/sanitization';
import { CSRFProtection } from '../utils/csrfProtection';
import { PasswordSecurity } from '../utils/passwordSecurity';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import ForgotPassword from './ForgotPassword';
import { showToast } from '../utils';

interface AuthProps {
  onAuthSuccess: (token: string, remember?: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      setLoading(false);
      return;
    }

    try {
      await registerHospital(formData);
      showToast.success('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.', 3000);
      setTimeout(() => {
        setIsRegister(false);
        setSuccess(null);
        setPassword('');
      }, 3000);
    } catch (err: any) {
      const errorMessage = SanitizationUtils.sanitizeText(err.message || 'حدث خطأ أثناء التسجيل');
      showToast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const email = SanitizationUtils.sanitizeEmail(formData.get('email') as string);
    formData.set('email', email);
    
    try {
      const data = await loginWithPassword(formData);
      showToast.success('تم تسجيل الدخول بنجاح!', 2000);
      
      CSRFProtection.generateToken();
      
      setTimeout(() => {
        onAuthSuccess(data.token, rememberMe);
      }, 1000);
    } catch (err: any) {
      const errorMessage = SanitizationUtils.sanitizeText(err.message || 'حدث خطأ أثناء تسجيل الدخول');
      showToast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPassword('');
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 overflow-x-hidden py-4 sm:py-6 lg:py-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-100/50 to-transparent dark:from-teal-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-100/50 to-transparent dark:from-cyan-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 xl:gap-10 items-center w-full">
          
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
                    صحتي
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-base xl:text-lg font-medium">
                    منصة طبية متكاملة
                  </p>
                </div>
              </div>
              
              <p className="text-lg xl:text-xl text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                {isRegister 
                  ? 'انضم إلى مئات المستشفيات التي تثق بنا'
                  : 'مرحباً بعودتك إلى منصتك الطبية'
                }
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 xl:gap-4">
              <div className="flex items-start gap-3 p-4 xl:p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">أمان متقدم</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">تشفير متقدم</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 xl:p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">أداء فائق</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">سرعة عالية</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 xl:p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">سهل الاستخدام</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">واجهة بديهية</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 xl:p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">موثوق به</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">معتمد رسمياً</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-5 xl:p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm xl:text-base mb-2 leading-relaxed">
                    منصة رائعة ساعدتنا في تحسين إدارة الحجوزات
                  </p>
                  <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white">د. أحمد محمد</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">مستشفى النور</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== RIGHT SIDE - FORM ========== */}
          <div className="w-full lg:max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-3 sm:mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl shadow-xl flex items-center justify-center">
                <HospitalIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="mb-3 sm:mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => isRegister && switchMode()}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    !isRegister
                      ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => !isRegister && switchMode()}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    isRegister
                      ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  إنشاء حساب
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {isRegister ? 'سجّل مستشفاك الآن' : 'أهلاً بعودتك'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {isRegister 
                  ? 'املأ البيانات للانضمام إلى المنصة'
                  : 'أدخل بياناتك للمتابعة'
                }
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
            <Card className="border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                {isRegister ? (
                  /* ========== REGISTER FORM ========== */
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="اسم المستشفى"
                        name="hospital_name"
                        type="text"
                        required
                        placeholder="مستشفى الأمل"
                      />
                      <Input
                        label="الرمز الفريد"
                        name="unique_code"
                        type="text"
                        required
                        placeholder="HOSP-001"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="البريد الإلكتروني"
                        name="email"
                        type="email"
                        required
                        placeholder="info@hospital.com"
                      />
                      <Input
                        label="رقم الهاتف"
                        name="phone_number"
                        type="text"
                        required
                        placeholder="+966 50 123 4567"
                      />
                    </div>

                    <Input
                      label="العنوان"
                      name="address"
                      type="text"
                      required
                      placeholder="شارع الملك فهد، الرياض"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Input
                          label="كلمة المرور"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-[38px] text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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
                          label="تأكيد كلمة المرور"
                          name="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-3 top-[38px] text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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
                          جاري الإنشاء...
                        </span>
                      ) : (
                        'إنشاء الحساب'
                      )}
                    </Button>
                  </form>
                ) : (
                  /* ========== LOGIN FORM ========== */
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      label="البريد الإلكتروني"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="info@hospital.com"
                    />

                    <div className="relative">
                      <Input
                        label="كلمة المرور"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-[38px] text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-teal-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors select-none">
                          تذكرني
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </button>
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
                          جاري التحقق...
                        </span>
                      ) : (
                        'تسجيل الدخول'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <p className="mt-3 sm:mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              محمي بتشفير SSL 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
