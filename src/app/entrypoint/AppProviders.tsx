import type { ReactNode } from 'react';
import { AuthProvider } from '@/entities/session';
import { ThemeProvider } from '@/shared/ui';
import { AppTheme } from './AppTheme';
import { SplashGate } from './SplashGate';

/**
 * Punto único donde se envuelven los proveedores globales (tema, i18n, sesión, datos).
 * Las historias siguientes añaden aquí los que faltan.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppTheme>
        <AuthProvider>
          <SplashGate>{children}</SplashGate>
        </AuthProvider>
      </AppTheme>
    </ThemeProvider>
  );
}
