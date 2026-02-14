import { createContext, useState, useCallback, type ReactNode } from 'react';
import en from './en';
import es from './es';
import type { TranslationKeys } from './es';

export type Locale = 'en' | 'es';

const translations: Record<Locale, Record<TranslationKeys, string>> = { en, es };

export type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKeys) => string;
};

export const I18nContext = createContext<I18nContextType | null>(null);

function detectLocale(): Locale {
  const stored = localStorage.getItem('locale');
  if (stored === 'en' || stored === 'es') return stored;
  return navigator.language.startsWith('es') ? 'es' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem('locale', l);
    setLocaleState(l);
  }, []);

  const t = useCallback((key: TranslationKeys) => {
    return translations[locale][key] ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
