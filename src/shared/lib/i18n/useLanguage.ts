import { useTranslation } from 'react-i18next';
import { FALLBACK_LANGUAGE, isSupported, type Language } from './detect';

/** El idioma activo de la app. Vuelve a pintar al cambiarlo (react-i18next avisa del cambio). */
export function useLanguage(): Language {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return isSupported(language) ? language : FALLBACK_LANGUAGE;
}
