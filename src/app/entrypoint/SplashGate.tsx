import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/entities/session';
import { useLanguagePreferenceHydrated } from '@/features/language-switch';
import { useThemePreferenceHydrated } from '@/features/theme-switch';
import { fontAssets } from '@/shared/ui';

// Al cargar el módulo, antes del primer render: la splash nativa sigue visible hasta que la
// sesión guardada se haya leído. Así nunca asoma una pantalla de login que luego desaparece.
void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 200 });

/**
 * No muestra la app mientras la sesión está en `loading`, faltan las fuentes o aún no se leyeron
 * las preferencias de tema e idioma (así nunca asoma un tema o un idioma y luego cambia); al
 * resolverse todo, quita la splash. Si una fuente falla, sigue con la del sistema antes que bloquear.
 */
export function SplashGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const themeHydrated = useThemePreferenceHydrated();
  const languageHydrated = useLanguagePreferenceHydrated();
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const ready =
    status !== 'loading' &&
    themeHydrated &&
    languageHydrated &&
    (fontsLoaded || fontError !== null);

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  return ready ? children : null;
}
