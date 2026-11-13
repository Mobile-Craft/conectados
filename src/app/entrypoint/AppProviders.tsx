import type { ReactNode } from 'react';
import { AuthProvider } from '@/entities/session';
import { AppTheme } from './AppTheme';
import { I18nRoot } from './I18nRoot';
import { ProfileSync } from './ProfileSync';
import { SplashGate } from './SplashGate';
import { ThemeRoot } from './ThemeRoot';

/**
 * Punto único donde se envuelven los proveedores globales (sesión, tema, i18n, datos).
 * La sesión va antes que el tema y ProfileSync: los dos se sincronizan con el perfil de quien
 * la tiene.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nRoot>
      <AuthProvider>
        <ProfileSync />
        <ThemeRoot>
          <AppTheme>
            <SplashGate>{children}</SplashGate>
          </AppTheme>
        </ThemeRoot>
      </AuthProvider>
    </I18nRoot>
  );
}
