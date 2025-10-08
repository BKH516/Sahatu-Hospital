import React, { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SanitizationUtils } from '../utils/sanitization';
import { PasswordSecurity } from '../utils/passwordSecurity';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
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
      setSuccess(response.message || 'تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني');
      setEmail(sanitizedEmail);
      setTimeout(() => {
        setStep('reset');
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(SanitizationUtils.sanitizeText(err.message || 'حدث خطأ أثناء إرسال رمز إعادة التعيين'));
    } finally {
      setLoading(false);
    }
  };

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
      setSuccess(response.message || 'تم إعادة تعيين كلمة المرور بنجاح!');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err: any) {
      setError(SanitizationUtils.sanitizeText(err.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 transition-all duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 dark:bg-teal-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100 dark:bg-cyan-950 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl relative z-10">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <CardHeader className="text-center space-y-2 relative z-10 p-0">
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-xl border-2 border-white/30">
                <svg className="h-10 w-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription className="text-white/90 text-sm mt-1 font-medium">
              {step === 'email' 
                ? 'أدخل بريدك الإلكتروني لإرسال رمز إعادة التعيين'
                : 'أدخل الرمز وكلمة المرور الجديدة'
              }
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300" role="alert">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300" role="alert">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pr-10 focus:border-teal-500 focus:ring-teal-500"
                  placeholder="info@hospital.com"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                section="hospital" 
                className="w-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </span>
                ) : (
                  'إرسال رمز التحقق'
                )}
              </Button>
            </form>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <Input
                  label="رمز التحقق"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="pr-10 focus:border-teal-500 focus:ring-teal-500"
                  placeholder="123456"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-[34px] text-teal-600 dark:text-teal-400 pointer-events-none z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  label="كلمة المرور الجديدة"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 focus:border-teal-500 focus:ring-teal-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-10 top-[34px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <PasswordStrengthMeter password={password} />
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                section="hospital" 
                className="w-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الحفظ...
                  </span>
                ) : (
                  'إعادة تعيين كلمة المرور'
                )}
              </Button>
            </form>
          )}

          {/* Back to Login */}
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

          <div className="text-center">
            <button
              onClick={onBack}
              type="button"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-200"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" />
              </svg>
              <span className="underline decoration-2 underline-offset-4 group-hover:decoration-teal-700 dark:group-hover:decoration-teal-300">
                العودة لتسجيل الدخول
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;

