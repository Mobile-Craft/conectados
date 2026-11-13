import { useEffect, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { useThemePreference, useThemeProfileSync } from '@/features/theme-switch';
import { ThemeProvider } from '@/shared/ui';

/**
 * Aplica la preferencia de tema guardada y la mantiene sincronizada con el perfil. También la
 * pasa al sistema (`Appearance`), para que lo nativo —teclado, alertas, selectores— siga el
 * mismo tema que la app; con "Automático" se quita el ajuste y manda el del teléfono.
 */
export function ThemeRoot({ children }: { children: ReactNode }) {
  useThemeProfileSync();
  const preference = useThemePreference();

  useEffect(() => {
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  }, [preference]);

  return <ThemeProvider preference={preference}>{children}</ThemeProvider>;
}
