import React, { useState, useEffect, useRef } from 'react';
import { HospitalIcon } from './ui/icons';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import ThemeToggle from './ui/ThemeToggle';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFeatureClick = (index: number) => {
    setSelectedFeature(index);
    setShowFeatureModal(true);
  };

  const closeModal = () => {
    setShowFeatureModal(false);
    setSelectedFeature(null);
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "أمان متقدم",
      description: "حماية شاملة لبيانات المستشفى والمرضى بتقنيات التشفير المتقدمة",
      detailedDescription: `
        • تشفير SSL/TLS 256-bit لحماية البيانات
        • نظام مصادقة متعدد المستويات
        • نسخ احتياطية يومية تلقائية
        • مراقبة أمنية على مدار الساعة
        • امتثال لمعايير الأمان الدولية (HIPAA, GDPR)
        • حماية من التهديدات السيبرانية
        • نظام تسجيل شامل لجميع العمليات
      `
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "أداء فائق",
      description: "سرعة عالية في المعالجة مع واجهة سهلة الاستخدام",
      detailedDescription: `
        • معالجة فورية للبيانات والطلبات
        • خوادم عالية الأداء مع SSD
        • شبكة CDN عالمية للوصول السريع
        • واجهة مستخدم بديهية ومتجاوبة
        • تحميل سريع للصفحات (< 2 ثانية)
        • دعم العمل على جميع الأجهزة
        • تحديثات تلقائية بدون توقف الخدمة
      `
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: "إدارة شاملة",
      description: "نظام متكامل لإدارة جميع العمليات الطبية والإدارية",
      detailedDescription: `
        • إدارة كاملة لملفات المرضى
        • نظام حجز المواعيد المتقدم
        • إدارة الصيدلية والمخزون
        • نظام الفواتير والمدفوعات
        • إدارة الموظفين والجدول الزمني
        • تتبع العمليات الجراحية
        • نظام الإشعارات والتنبيهات
        • تكامل مع الأجهزة الطبية
      `
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      title: "دعم فني متقدم",
      description: "دعم فني على مدار الساعة مع حلول سريعة ومبتكرة",
      detailedDescription: `
        • دعم فني متاح 24/7 على مدار السنة
        • فريق من الخبراء المتخصصين في التقنيات الطبية
        • استجابة فورية للاستفسارات والمشاكل
        • تدريب شامل للموظفين على استخدام النظام
        • صيانة دورية وحديثات تلقائية
        • نظام تذكرة متقدم لتتبع الطلبات
        • دعم عن بُعد لحل المشاكل فوراً
        • وثائق شاملة وأدلة استخدام تفصيلية
      `
    }
  ];

  const stats = [
    { number: "500+", label: "مستشفى" },
    { number: "50K+", label: "مريض" },
    { number: "99.9%", label: "وقت التشغيل" },
    { number: "24/7", label: "دعم فني" }
  ];

  return (
    <div className="landing-root min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* 3D Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `,
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) rotate(${scrollY * 0.1}deg)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px) rotate(${-scrollY * 0.1}deg)`
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 px-2 sm:px-4 lg:px-8 py-2 sm:py-4 backdrop-blur-sm overflow-hidden w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 w-full min-w-0 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 flex-shrink-0"
              style={{
                transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                boxShadow: `0 10px 25px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)`
              }}
            >
              <HospitalIcon className="w-5 h-5 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                صحتي
              </h1>
              <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-400">
                منصة طبية متكاملة
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0 mr-1.5 sm:mr-2 lg:mr-3 ml-5 sm:ml-2 lg:ml-3">
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
            <Button
              onClick={onNavigateToLogin}
              section="hospital"
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform flex-shrink-0 whitespace-nowrap"
            >
              تسجيل دخول
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-2 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-24 min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center justify-center lg:justify-between max-w-2xl mx-auto lg:max-w-none lg:mx-0">
            {/* Left Side - Content */}
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-3 sm:space-y-4 lg:space-y-8 max-w-2xl mx-auto lg:max-w-none lg:mx-0 lg:w-full self-center">
              <div className="space-y-3 sm:space-y-3 md:space-y-4 lg:space-y-6 w-full flex flex-col items-center lg:items-end">
                <h2 
                  className="text-3xl max-[360px]:text-[1.9rem] sm:text-2xl md:text-3xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  style={{
                    textShadow: `0 0 20px rgba(20, 184, 166, 0.3)`
                  }}
                >
                  مستقبل الرعاية الصحية
                  <span
                    className="block mt-0 lg:mt-2 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent font-extrabold antialiased drop-shadow-sm lg:drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
                    style={{ WebkitTextStroke: '0.2px rgba(0,0,0,0.2)' }}
                  >
                    يبدأ معنا
                  </span>
                </h2>
                <p 
                  className="text-base max-[360px]:text-[1.05rem] sm:text-sm md:text-base lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl px-2 sm:px-0"
                >
                  منصة صحتي توفر حلولاً متكاملة لإدارة المستشفيات والعيادات الطبية 
                  بأحدث التقنيات وأعلى معايير الأمان
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center w-full">
                <Button
                  onClick={onNavigateToRegister}
                  section="hospital"
                  className="px-5 py-[14px] max-[360px]:px-6 max-[360px]:py-[14px] sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base max-[360px]:text-[1.05rem] sm:text-base lg:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0284c7 100%)',
                    boxShadow: '0 10px 30px rgba(13, 148, 136, 0.4)'
                  }}
                >
                  إنشاء حساب جديد
                </Button>
                <Button
                  onClick={onNavigateToLogin}
                  variant="outline"
                  className="px-5 py-[14px] max-[360px]:px-6 max-[360px]:py-[14px] sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base max-[360px]:text-[1.05rem] sm:text-base lg:text-lg font-semibold border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(13, 148, 136, 0.2)'
                  }}
                >
                  تسجيل الدخول
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3 lg:gap-6 pt-3 sm:pt-4 lg:pt-8 w-full max-w-2xl mx-auto lg:max-w-none justify-items-center lg:justify-items-start">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center p-3 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 w-full"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="text-xl max-[360px]:text-[1.25rem] sm:text-base md:text-xl lg:text-3xl font-bold text-teal-600 dark:text-teal-400">
                      {stat.number}
                    </div>
                    <div className="text-sm max-[360px]:text-[0.9rem] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - 3D Visual */}
            <div className="w-full flex justify-center items-center lg:block lg:w-auto">
              <div className="relative px-3 sm:px-4 lg:px-0 w-full max-w-lg mx-auto lg:max-w-none">
                <div className="relative z-10 w-full">
                  <div 
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-4 md:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 w-full"
                  style={{
                    boxShadow: `
                      0 25px 50px -12px rgba(0, 0, 0, 0.25),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `
                  }}
                >
                  <div className="space-y-4 sm:space-y-4 lg:space-y-6">
                    <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-3">
                      <div className="w-10 h-10 max-[360px]:w-11 max-[360px]:h-11 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <HospitalIcon className="w-6 h-6 max-[360px]:w-7 max-[360px]:h-7 sm:w-5 sm:h-5 md:w-6 md:h-7 text-white" />
                      </div>
                      <div className="text-center sm:text-right">
                        <h3 className="text-lg max-[360px]:text-xl sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">
                          لوحة التحكم الرئيسية
                        </h3>
                        <p className="text-base max-[360px]:text-[1.05rem] sm:text-sm text-gray-600 dark:text-gray-400">
                          إدارة شاملة لجميع العمليات
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-3 md:gap-4">
                        {[
                        { value: "1,247", label: "مريض نشط", color: "teal" },
                        { value: "89", label: "طبيب", color: "blue" },
                        { value: "156", label: "موعد اليوم", color: "cyan" },
                        { value: "12", label: "غرفة متاحة", color: "indigo" }
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className={`bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-lg sm:rounded-xl p-3 sm:p-3 md:p-4 transform transition-all duration-300 hover:scale-105 text-center`}
                        >
                          <div className={`text-xl max-[360px]:text-[1.25rem] sm:text-base md:text-xl lg:text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
                            {item.value}
                          </div>
                          <div className="text-sm max-[360px]:text-[0.9rem] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 3D Background decorations */}
                <div 
                  className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-full blur-3xl pointer-events-none -z-10"
                  style={{
                    transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px) rotate(${scrollY * 0.1}deg)`
                  }}
                />
                <div 
                  className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl pointer-events-none -z-10"
                  style={{
                    transform: `translate(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px) rotate(${-scrollY * 0.1}deg)`
                  }}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-2 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-24 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-3 md:space-y-4 lg:space-y-6 mb-6 sm:mb-6 lg:mb-16 w-full px-2 sm:px-0 flex flex-col items-center mx-auto transform-gpu translate-x-3 sm:translate-x-0">
            <h2 
              className="text-xl sm:text-xl md:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mx-auto text-center inline-block"
              style={{
                textShadow: `0 0 20px rgba(20, 184, 166, 0.3)`
              }}
            >
              لماذا تختار منصة صحتي؟
            </h2>
            <p className="text-sm sm:text-sm md:text-base lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
              نحن نقدم حلولاً متقدمة ومبتكرة لإدارة المستشفيات والعيادات الطبية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 justify-items-center mx-auto transform-gpu translate-x-3 sm:translate-x-0">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-500 hover:shadow-xl border-2 ${
                  activeFeature === index 
                    ? 'border-teal-500 shadow-xl' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                } backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 w-full max-w-sm`}
                onClick={() => {
                  setActiveFeature(index);
                  handleFeatureClick(index);
                }}
                style={{
                  boxShadow: activeFeature === index 
                    ? '0 20px 40px -10px rgba(13, 148, 136, 0.4)' 
                    : '0 8px 20px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                <CardContent className="p-5 sm:p-6 text-center space-y-4 sm:space-y-4 w-full">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    activeFeature === index
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                  }`}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 sm:mb-3">
                      {feature.description}
                    </p>
                    <div className="text-xs sm:text-xs md:text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                      اضغط للمزيد ←
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-2 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-12 text-white shadow-2xl backdrop-blur-sm"
            style={{
              background: `
                linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0284c7 100%),
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
              `,
              boxShadow: `
                0 25px 50px -12px rgba(13, 148, 136, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            }}
          >
            <h2 className="text-2xl max-[360px]:text-[1.7rem] sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-sm max-[360px]:text-base sm:text-sm md:text-base lg:text-2xl mb-4 sm:mb-6 lg:mb-8 opacity-90 px-2 sm:px-0">
              انضم إلى مئات المستشفيات التي تثق بمنصة صحتي
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center w-full px-2 sm:px-0">
              <Button
                onClick={onNavigateToRegister}
                className="px-5 py-3 max-[360px]:px-6 max-[360px]:py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm max-[360px]:text-base sm:text-base lg:text-lg font-semibold bg-white text-teal-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                إنشاء حساب جديد
              </Button>
              <Button
                onClick={onNavigateToLogin}
                variant="outline"
                className="px-5 py-3 max-[360px]:px-6 max-[360px]:py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm max-[360px]:text-base sm:text-base lg:text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-teal-600 transition-all duration-300 transform hover:scale-105"
              >
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 bg-gray-900 dark:bg-black backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <HospitalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-base md:text-lg font-bold text-white">صحتي</h3>
                  <p className="text-xs sm:text-xs text-gray-400">منصة طبية متكاملة</p>
                </div>
              </div>
              <p className="text-sm sm:text-sm text-gray-400 leading-relaxed">
                نحن ملتزمون بتقديم أفضل الحلول التقنية لقطاع الرعاية الصحية
              </p>
            </div>
            
            <div className="space-y-2 sm:space-y-4">
              <h4 className="text-base sm:text-base md:text-lg font-semibold text-white">روابط سريعة</h4>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">الخدمات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأسعار</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الدعم</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
              </ul>
            </div>
            
            <div className="space-y-2 sm:space-y-4">
              <h4 className="text-base sm:text-base md:text-lg font-semibold text-white">تواصل معنا</h4>
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-sm text-gray-400">
                <p>📧 info@sahtee.com</p>
                <p>📞 +966 50 123 4567</p>
                <p>📍 الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 text-center text-sm sm:text-sm text-gray-400">
            <p>&copy; 2024 منصة صحتي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Feature Details Modal */}
      {showFeatureModal && selectedFeature !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `
                  radial-gradient(circle at 30% 70%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)
                `,
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
              }}
            />
          </div>

          <div 
            className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden border border-white/20 dark:border-gray-700/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.01}deg) rotateX(${mousePosition.y * 0.01}deg)`,
              boxShadow: `
                0 32px 64px -12px rgba(0, 0, 0, 0.6),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            }}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 flex-shrink-0">
                      <div className="text-white scale-110 sm:scale-125">
                        {features[selectedFeature].icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white drop-shadow-lg leading-tight">
                        {features[selectedFeature].title}
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium hidden sm:block">
                        اكتشف المزيد عن هذه الميزة المذهلة
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:scale-110 flex-shrink-0"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Description Card */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-teal-200/50 dark:border-teal-700/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 dark:bg-teal-800/50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-teal-900 dark:text-teal-100 mb-2 sm:mb-3">
                        نظرة عامة
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 sm:mb-4 text-sm sm:text-base">
                        {features[selectedFeature].description}
                      </p>
                      <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-sm sm:text-sm max-h-32 sm:max-h-none overflow-y-auto">
                        {features[selectedFeature].detailedDescription}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg sm:text-lg">المزايا الرئيسية</h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>حلول متطورة ومبتكرة</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>دعم فني على مدار الساعة</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>سهولة في الاستخدام</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>تكامل مع الأنظمة الموجودة</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-green-900 dark:text-green-100 text-lg sm:text-lg">النتائج المتوقعة</h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>تحسين الكفاءة بنسبة 40%</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>تقليل الأخطاء بنسبة 60%</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>توفير الوقت والجهد</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>رضا العملاء والمرضى</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h4 className="text-lg sm:text-lg font-bold text-gray-900 dark:text-white">
                      جاهز لتجربة هذه الميزة؟
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-base">
                      انضم إلى مئات المستشفيات التي تثق بمنصة صحتي
                    </p>
                    <div className="flex flex-col gap-2 sm:gap-4 justify-center pt-2">
                      <Button
                        onClick={onNavigateToRegister}
                        section="hospital"
                        className="w-full px-5 sm:px-8 py-3 sm:py-3 text-sm sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0284c7 100%)',
                          boxShadow: '0 10px 30px rgba(13, 148, 136, 0.4)'
                        }}
                      >
                        جرب المنصة الآن
                      </Button>
                      <Button
                        onClick={closeModal}
                        variant="outline"
                        className="w-full px-5 sm:px-8 py-3 sm:py-3 text-sm sm:text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                      >
                        إغلاق
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;