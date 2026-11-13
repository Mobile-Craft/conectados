import type { ReactNode } from 'react';
import { AuthProvider } from '@/entities/session';
import { SplashGate } from './SplashGate';

/**
 * Punto único donde se envuelven los proveedores globales (tema, i18n, sesión, datos).
 * Las historias siguientes añaden aquí los que faltan.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SplashGate>{children}</SplashGate>
    </AuthProvider>
  );
}
