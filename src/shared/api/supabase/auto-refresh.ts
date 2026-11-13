import { AppState, Platform } from 'react-native';
import { supabase } from './client';

/**
 * En el móvil, Supabase no sabe si la app está al frente. El refresco automático se enciende al
 * volver a primer plano (si el token caducó tras una hora en segundo plano, se renueva al
 * instante) y se apaga en segundo plano, donde los temporizadores no son fiables.
 * En web, Supabase ya lo hace solo con la visibilidad de la pestaña.
 * Devuelve la función que deja de escuchar.
 */
export function syncAutoRefreshWithAppState(): () => void {
  if (Platform.OS === 'web') return () => {};

  const apply = (state: string | null | undefined) => {
    if (state === 'active') void supabase.auth.startAutoRefresh();
    else void supabase.auth.stopAutoRefresh();
  };

  apply(AppState.currentState);
  const subscription = AppState.addEventListener('change', apply);
  return () => {
    subscription.remove();
    void supabase.auth.stopAutoRefresh();
  };
}
