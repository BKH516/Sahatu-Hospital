import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    
    // Update document direction and language
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const { t } = useTranslation();
  const currentLang = i18n.language === 'ar' ? 'ar' : 'en';
  const otherLang = currentLang === 'ar' ? 'en' : 'ar';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex-shrink-0"
      aria-label={`${t('language.switchTo')} ${otherLang === 'ar' ? t('language.arabic') : t('language.english')}`}
      title={`${t('language.switchTo')} ${otherLang === 'ar' ? t('language.arabic') : t('language.english')}`}
    >
      <Languages className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">
        {currentLang === 'ar' ? t('language.arabicShort') : t('language.englishShort')}
      </span>
    </button>
  );
};

export default LanguageToggle;

