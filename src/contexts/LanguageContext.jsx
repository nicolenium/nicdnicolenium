
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/i18n/translations.js';
import pb from '@/lib/pocketbaseClient.js';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // 1. Check local storage
    const stored = localStorage.getItem('app_language');
    if (stored && translations[stored]) return stored;
    
    // 2. Check browser locale
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) return browserLang;

    // 3. Fallback to English
    return 'en';
  });

  const [isReady, setIsReady] = useState(false);

  const applyLanguage = useCallback((lang) => {
    if (!translations[lang]) lang = 'en';
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    
    // Update HTML attributes
    const isRtl = ['ar', 'he'].includes(lang);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    const initLanguage = async () => {
      let savedLang = localStorage.getItem('app_language') || navigator.language.split('-')[0];
      if (!translations[savedLang]) savedLang = 'en';
      
      // Sync with PocketBase if authenticated
      if (pb.authStore.isValid && pb.authStore.model?.id) {
        try {
          const user = await pb.collection('users').getOne(pb.authStore.model.id, { $autoCancel: false });
          if (user.language && translations[user.language]) {
            savedLang = user.language;
          }
        } catch (err) {
          console.warn("Failed to fetch user language preference", err);
        }
      }
      
      applyLanguage(savedLang);
      setIsReady(true);
    };
    initLanguage();

    const handleStorageChange = (e) => {
      if (e.key === 'app_language' && e.newValue) {
        applyLanguage(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [applyLanguage]);

  const setLanguage = async (lang) => {
    if (translations[lang]) {
      applyLanguage(lang);
      
      if (pb.authStore.isValid && pb.authStore.model?.id) {
        try {
          await pb.collection('users').update(pb.authStore.model.id, {
            language: lang
          }, { $autoCancel: false });
        } catch (error) {
          console.error('Failed to save language preference:', error);
        }
      }
    }
  };

  const t = useCallback((path, fallbacks = {}) => {
    if (!path) return '';
    const keys = path.split('.');
    
    const resolvePath = (dict) => {
      let current = dict;
      for (const key of keys) {
        if (current && current[key] !== undefined) {
          current = current[key];
        } else {
          return undefined;
        }
      }
      return current;
    };

    let result = resolvePath(translations[language]);
    if (result === undefined) result = resolvePath(translations['en']); // Fallback to English key
    
    if (typeof result === 'string' && Object.keys(fallbacks).length > 0) {
      return result.replace(/\{\{(\w+)\}\}/g, (_, key) => fallbacks[key] || '');
    }

    return result !== undefined ? result : path;
  }, [language]);

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: Object.keys(translations) }}>
      {children}
    </LanguageContext.Provider>
  );
};
