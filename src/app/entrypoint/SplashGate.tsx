import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/entities/session';

// Al cargar el módulo, antes del primer render: la splash nativa sigue visible hasta que la
// sesión guardada se haya leído. Así nunca asoma una pantalla de login que luego desaparece.
void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 200 });

/** No muestra la app mientras la sesión está en `loading`; al resolverse, quita la splash. */
export function SplashGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const ready = status !== 'loading';

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  return ready ? children : null;
}
