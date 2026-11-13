import { useLocales } from 'expo-localization';
import { useEffect, type ReactNode } from 'react';
import { detectLanguage, i18n, I18nextProvider } from '@/shared/lib';

/**
 * Da los textos a toda la app y sigue el idioma del teléfono: si el usuario lo cambia en los
 * ajustes del sistema, la app cambia al volver, sin reiniciarse (HU-2.1). Elegir idioma dentro
 * de la app llega con su propia historia.
 */
export function I18nRoot({ children }: { children: ReactNode }) {
  const locales = useLocales();
  const language = detectLanguage(locales);

  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
