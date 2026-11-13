import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectLanguage, FALLBACK_LANGUAGE, type Language } from './detect';
import en from './locales/en.json';
import es from './locales/es.json';

export const resources = { es: { translation: es }, en: { translation: en } } as const;

/**
 * Instancia única de i18next. Se inicia al importar, con los textos ya en el paquete: el primer
 * render ya sale en el idioma del teléfono, sin parpadeo. Las claves que falten caen al inglés.
 */
export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(getLocales()),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
  initAsync: false,
});

export function currentLanguage(): Language {
  return (i18n.language as Language) ?? FALLBACK_LANGUAGE;
}
