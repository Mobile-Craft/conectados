import { useLocales } from 'expo-localization';
import { useLayoutEffect, type ReactNode } from 'react';
import { useLanguagePreference } from '@/features/language-switch';
import { i18n, I18nextProvider, resolveLanguage } from '@/shared/lib';

/**
 * Da los textos a toda la app en el idioma que toca: el elegido en Ajustes o, con "Automático",
 * el del teléfono (HU-2.1, HU-2.2). Cualquier cambio se aplica al momento, sin reiniciar.
 *
 * Es un efecto de layout: se aplica antes de pintar y antes de que SplashGate quite la splash,
 * así nunca asoma un idioma y luego otro.
 */
export function I18nRoot({ children }: { children: ReactNode }) {
  const locales = useLocales();
  const preference = useLanguagePreference();
  const language = resolveLanguage(preference, locales);

  useLayoutEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
