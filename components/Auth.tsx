import React, { useState } from 'react';
import { registerHospital, loginWithPassword } from '../services/apiService';
import { HospitalIcon } from './ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
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
    
    // Sanitize inputs before processing
    const email = SanitizationUtils.sanitizeEmail(formData.get('email') as string);
    const phone = SanitizationUtils.sanitizePhone(formData.get('phone_number') as string);
    
    formData.set('email', email);
    formData.set('phone_number', phone);
    
    // Get password values
    const pwd = formData.get('password') as string;
    const passwordConfirmation = formData.get('password_confirmation');
    
    // Check password strength
    const passwordStrength = PasswordSecurity.checkStrength(pwd);
    if (!passwordStrength.isStrong) {
      setError(passwordStrength.feedback.join('. '));
      setLoading(false);
      return;
    }
    
    // Validate password match
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
        setPassword(''); // Clear password state
      }, 3000);
    } catch (err: any) {
      // Sanitize error message before displaying
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
    
    // Sanitize email input
    const email = SanitizationUtils.sanitizeEmail(formData.get('email') as string);
    formData.set('email', email);
    
    try {
      const data = await loginWithPassword(formData);
      showToast.success('تم تسجيل الدخول بنجاح!', 2000);
      
      // Generate CSRF token for secure requests
      CSRFProtection.generateToken();
      
      setTimeout(() => {
        onAuthSuccess(data.token, rememberMe);
      }, 1000);
    } catch (err: any) {
      // Sanitize error message before displaying
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
  };

  // Show ForgotPassword component if requested
  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 transition-all duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 dark:bg-teal-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100 dark:bg-cyan-950 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-6xl h-[95vh] shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl relative z-10 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Illustration/Image */}
        <div className="hidden lg:flex bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-8 flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10 text-center space-y-8">
            {/* Medical Illustration */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Main Hospital Icon Circle */}
                <div className="w-48 h-48 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <svg className="w-28 h-28 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                
                {/* Floating Medical Icons */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                
                <div className="absolute -bottom-2 -left-4 w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 animate-pulse">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div className="absolute top-1/2 -right-8 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 animate-pulse delay-100">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                نظام صحتي
              </h1>
              <p className="text-xl text-white/90 font-medium leading-relaxed max-w-md mx-auto">
                {isRegister 
                  ? 'انضم إلى منصتنا الطبية المتقدمة وابدأ في إدارة مستشفاك بكفاءة عالية'
                  : 'إدارة متقدمة للحجوزات والمرضى بأعلى معايير الجودة والأمان'
                }
              </p>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs text-white/90 font-medium">آمن ومحمي</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs text-white/90 font-medium">سريع وفعال</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-white/90 font-medium">موثوق</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col h-full overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-3 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <CardHeader className="text-center space-y-2 relative z-10 p-0">
          <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-xl border-2 border-white/30 transform transition-transform duration-300 hover:scale-110">
                <HospitalIcon className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
          </div>
          <div>
              <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                {isRegister ? 'إنشاء حساب جديد' : 'مرحباً بعودتك'}
            </CardTitle>
              <CardDescription className="text-white/90 text-sm mt-1 font-medium">
                {isRegister ? 'سجّل مستشفاك الآن وابدأ إدارة الحجوزات بكفاءة' : 'سجّل الدخول للوصول إلى لوحة التحكم'}
            </CardDescription>
        </div>
        </CardHeader>
        </div>
        
        <CardContent className="p-3 space-y-2.5 overflow-y-auto flex-1 scrollbar-thin">
          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 text-sm" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 text-sm" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}
          
          {/* Form Section with Animation */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isRegister ? (
              <form onSubmit={handleRegister} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Hospital Name */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                <Input
                  label="اسم المستشفى"
                  name="hospital_name"
                  type="text"
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="مستشفى الأمل"
                    />
                  </div>

                  {/* Unique Code */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                <Input
                  label="الرمز الفريد"
                  name="unique_code"
                  type="text"
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="HOSP-001"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                <Input
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="info@hospital.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                <Input
                  label="رقم الهاتف"
                  name="phone_number"
                  type="text"
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="+966 50 123 4567"
                    />
                  </div>

                  {/* Address - Full Width */}
                  <div className="relative col-span-2">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <Input
                      label="العنوان"
                      name="address"
                      type="text"
                      required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="شارع الملك فهد، الرياض"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                <Input
                  label="كلمة المرور"
                  name="password"
                      type={showPassword ? "text" : "password"}
                  required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-9 top-[34px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
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

                  {/* Password Confirmation */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                <Input
                  label="تأكيد كلمة المرور"
                  name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-9 top-[34px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
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
                  className="w-full h-10 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
              <form onSubmit={handleLogin} className="space-y-2">
              <div className="space-y-2">
                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                <Input
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="info@hospital.com"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                <Input
                  label="كلمة المرور"
                  name="password"
                      type={showPassword ? "text" : "password"}
                  required
                      className="pr-9 text-sm h-9 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-9 top-[34px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-teal-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer transition-all"
                  />
                      <label htmlFor="rememberMe" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    تذكرني
                  </label>
                </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors underline decoration-2 underline-offset-2"
                    >
                      نسيت كلمة المرور؟
                    </button>
            </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  section="hospital" 
                  className="w-full h-10 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
          </div>

          {/* Switch Mode */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                أو
              </span>
            </div>
          </div>

          <div className="text-center pb-2">
            <button 
              onClick={switchMode}
              type="button"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-200"
            >
              {isRegister ? (
                <>
                  <span>لديك حساب بالفعل؟</span>
                  <span className="underline decoration-2 underline-offset-4 group-hover:decoration-teal-700 dark:group-hover:decoration-teal-300">
                    تسجيل الدخول
                  </span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>ليس لديك حساب؟</span>
                  <span className="underline decoration-2 underline-offset-4 group-hover:decoration-teal-700 dark:group-hover:decoration-teal-300">
                    إنشاء حساب جديد
                  </span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </>
              )}
          </button>
        </div>
        </CardContent>

        {/* Footer Decoration */}
        <div className="h-1 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 lg:hidden"></div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
