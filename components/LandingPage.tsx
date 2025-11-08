import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HospitalIcon } from './ui/icons';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import ThemeToggle from './ui/ThemeToggle';
import LanguageToggle from './ui/LanguageToggle';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { t, i18n } = useTranslation();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const isRTL = i18n.language === 'ar';
  const cardTextDirection = isRTL ? 'text-right' : 'text-left';
  const cardIconAlignment = isRTL ? 'self-end' : 'self-start';
  const cardLinkAlignment = isRTL ? 'self-end' : 'self-start';

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
      title: t('landing.features.advancedSecurity.title'),
      description: t('landing.features.advancedSecurity.description'),
      detailedDescription: t('landing.features.advancedSecurity.details')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('landing.features.highPerformance.title'),
      description: t('landing.features.highPerformance.description'),
      detailedDescription: t('landing.features.highPerformance.details')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: t('landing.features.comprehensiveManagement.title'),
      description: t('landing.features.comprehensiveManagement.description'),
      detailedDescription: t('landing.features.comprehensiveManagement.details')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      title: t('landing.features.advancedSupport.title'),
      description: t('landing.features.advancedSupport.description'),
      detailedDescription: t('landing.features.advancedSupport.details')
    }
  ];

  const stats = [
    { number: "500+", label: t('landing.stats.hospitals') },
    { number: "50K+", label: t('landing.stats.patients') },
    { number: "99.9%", label: t('landing.stats.uptime') },
    { number: "24/7", label: t('landing.stats.support') }
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
                {t('common.appName')}
              </h1>
              <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-400">
                {t('common.appTagline')}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0 ${isRTL ? 'mr-1.5 sm:mr-2 lg:mr-3 ml-5 sm:ml-2 lg:ml-3' : 'ml-1.5 sm:ml-2 lg:ml-3 mr-5 sm:mr-2 lg:mr-3'}`}>
            <div className="flex-shrink-0">
              <LanguageToggle />
            </div>
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
            <Button
              onClick={onNavigateToLogin}
              section="hospital"
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform flex-shrink-0 whitespace-nowrap"
            >
              {t('landing.loginButton')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - New Professional Design */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background with Medical Theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary gradient orbs */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 sm:w-[32rem] sm:h-[32rem] bg-gradient-to-br from-teal-400/20 via-cyan-400/15 to-transparent rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px)`,
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-gradient-to-tl from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl"
            style={{
              transform: `translate(${-mousePosition.x * 0.12}px, ${-mousePosition.y * 0.12}px)`,
            }}
          />
          
          {/* Medical grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.05)_1px,transparent_1px)]" />
          
          {/* Animated lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/10 to-transparent" 
            style={{ transform: `translateY(${Math.sin(scrollY * 0.005) * 15}px)` }} 
          />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10 lg:space-y-12">
            
            {/* Badge with pulse effect */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-teal-200/60 dark:border-teal-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300">
                {t('landing.badge')}
              </span>
            </div>

            {/* Main Title with elegant styling */}
            <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                <span className="block mb-3 sm:mb-4">
                  {t('landing.title')}
                </span>
                <span className="block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t('landing.titleSub')}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto px-4">
              {t('landing.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
              <Button
                onClick={onNavigateToRegister}
                section="hospital"
                className="group relative px-7 py-3 sm:px-8 sm:py-3.5 lg:px-10 lg:py-4 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0284c7 100%)',
                  boxShadow: '0 10px 30px rgba(13, 148, 136, 0.35)'
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('landing.createAccount')}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
              
              <Button
                onClick={onNavigateToLogin}
                variant="outline"
                className="group px-7 py-3 sm:px-8 sm:py-3.5 lg:px-10 lg:py-4 text-sm sm:text-base font-semibold border-2 border-teal-600 dark:border-teal-400 text-teal-600 dark:text-white hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm bg-white/70 dark:bg-gray-800/70"
                style={{
                  boxShadow: '0 4px 20px rgba(13, 148, 136, 0.2)'
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('landing.login')}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
              </Button>
            </div>

            {/* Stats Cards - Modern Grid Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-8 sm:pt-10 lg:pt-12 w-full max-w-5xl">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/50 p-5 sm:p-6 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xl hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Gradient accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 pt-6 sm:pt-8 pb-24 sm:pb-20 md:pb-16 lg:pb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-700/30">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('landing.trustBadges.secure')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-700/30">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('landing.trustBadges.fastAndEasy')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-700/30">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('landing.trustBadges.support247')}</span>
              </div>
            </div>
          </div>

          {/* Floating Medical Icon - Centered Visual Element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 pointer-events-none opacity-10 dark:opacity-5 z-0"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 0.05}px), calc(-50% + ${mousePosition.y * 0.05}px))`,
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HospitalIcon className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 text-teal-500/30 dark:text-teal-400/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-16 left-1/2 transform -translate-x-1/2 opacity-60 hover:opacity-100 transition-opacity z-10">
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{t('landing.discoverMoreShort')}</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 animate-bounce group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-8 sm:py-12 lg:py-24 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm ${i18n.language === 'ar' ? 'px-2 sm:px-4 lg:px-8' : ''}`}>
        <div className={`max-w-7xl mx-auto w-full ${i18n.language === 'en' ? 'px-4 sm:px-4 lg:px-8' : 'px-2 sm:px-4 lg:px-8'}`}>
          <div className="text-center space-y-3 sm:space-y-3 md:space-y-4 lg:space-y-6 mb-6 sm:mb-6 lg:mb-16 w-full">
            <h2 
              className="text-xl sm:text-xl md:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white text-center"
              style={{
                textShadow: `0 0 20px rgba(20, 184, 166, 0.3)`
              }}
            >
              {t('landing.features.whyChoose')}
            </h2>
            <p className="text-sm sm:text-sm md:text-base lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.features.whyChooseDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex justify-center">
                <Card
                  className={`cursor-pointer transition-all duration-500 hover:shadow-xl border-2 ${
                    activeFeature === index 
                      ? 'border-teal-500 shadow-xl' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                  } backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 w-full max-w-sm flex flex-col h-full`}
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
                <CardContent className={`p-5 sm:p-6 space-y-4 sm:space-y-4 w-full flex flex-col h-full ${cardTextDirection}`}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${cardIconAlignment} ${
                    activeFeature === index
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                  }`}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <h3 className="text-lg sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 sm:mb-3">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`text-xs sm:text-xs md:text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline ${cardLinkAlignment}`}>
                    {t('landing.features.clickForMore')}
                  </div>
                </CardContent>
              </Card>
              </div>
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
              {t('landing.features.readyToStart')}
            </h2>
            <p className="text-sm max-[360px]:text-base sm:text-sm md:text-base lg:text-2xl mb-4 sm:mb-6 lg:mb-8 opacity-90 px-2 sm:px-0">
              {t('landing.features.joinHundreds')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center w-full px-2 sm:px-0">
              <Button
                onClick={onNavigateToRegister}
                className="px-5 py-3 max-[360px]:px-6 max-[360px]:py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm max-[360px]:text-base sm:text-base lg:text-lg font-semibold bg-white text-teal-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {t('landing.createAccount')}
              </Button>
              <Button
                onClick={onNavigateToLogin}
                variant="outline"
                className="px-5 py-3 max-[360px]:px-6 max-[360px]:py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm max-[360px]:text-base sm:text-base lg:text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-teal-600 transition-all duration-300 transform hover:scale-105"
              >
                {t('landing.login')}
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
                  <h3 className="text-base sm:text-base md:text-lg font-bold text-white">{t('common.appName')}</h3>
                  <p className="text-xs sm:text-xs text-gray-400">{t('common.appTagline')}</p>
                </div>
              </div>
              <p className="text-sm sm:text-sm text-gray-400 leading-relaxed">
                {t('landing.footer.commitment')}
              </p>
            </div>
            
            <div className="space-y-2 sm:space-y-4">
              <h4 className="text-base sm:text-base md:text-lg font-semibold text-white">{t('landing.footer.quickLinks')}</h4>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.services')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.pricing')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.support')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.contactUs')}</a></li>
              </ul>
            </div>
            
            <div className="space-y-2 sm:space-y-4">
              <h4 className="text-base sm:text-base md:text-lg font-semibold text-white">{t('landing.footer.contact')}</h4>
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-sm text-gray-400">
                <p>{t('landing.footer.email')}</p>
                <p>{t('landing.footer.phone')}</p>
                <p>{t('landing.footer.address')}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 text-center text-sm sm:text-sm text-gray-400">
            <p dangerouslySetInnerHTML={{ __html: t('landing.footer.copyright') }}></p>
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
                        {t('landing.features.discoverMore')}
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
                        {t('landing.features.overview')}
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
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg sm:text-lg">
                        {t('landing.features.mainFeatures')}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.advancedSolutions')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.support247')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.easyToUse')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.systemIntegration')}</span>
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
                      <h4 className="font-bold text-green-900 dark:text-green-100 text-lg sm:text-lg">
                        {t('landing.features.expectedResults')}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.efficiency40')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.errors60')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.timeSaving')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-800 dark:text-green-200 text-base sm:text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>{t('landing.features.customerSatisfaction')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h4 className="text-lg sm:text-lg font-bold text-gray-900 dark:text-white">
                      {t('landing.features.readyToTry')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-base">
                      {t('landing.features.joinHundreds')}
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
                        {t('landing.features.tryPlatform')}
                      </Button>
                      <Button
                        onClick={closeModal}
                        variant="outline"
                        className="w-full px-5 sm:px-8 py-3 sm:py-3 text-sm sm:text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                      >
                        {t('common.close')}
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