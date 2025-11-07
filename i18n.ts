import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';

// Configuration
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources: {
      ar: {
        translation: arTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    fallbackLng: 'ar', // Default language
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language
      caches: ['localStorage'],
      // Key to store language in localStorage
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Set initial document direction and language
const currentLang = i18n.language || 'ar';
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;

