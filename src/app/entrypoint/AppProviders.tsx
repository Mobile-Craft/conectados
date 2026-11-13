import type { ReactNode } from 'react';

/**
 * Punto único donde se envuelven los proveedores globales (tema, i18n, sesión, datos).
 * Por ahora no hay ninguno; las historias siguientes los añaden aquí.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
