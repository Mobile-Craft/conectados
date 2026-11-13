import { useEffect } from 'react';
import { useAuth } from '@/entities/session';
import { fetchProfileTheme, saveProfileTheme } from '../api/profile-theme';
import { useThemePreferenceStore } from './theme-preference-store';

/**
 * Sincroniza la preferencia de tema con `profiles.theme_pref` cuando hay sesión.
 * - Cuenta nueva en este dispositivo: si su perfil tiene una elección (claro u oscuro), se aplica;
 *   si tiene `system` (el valor por defecto), se sube la elección local para no perderla.
 * - Cuenta ya sincronizada: cada cambio local se sube.
 * Sin red, no rompe nada: se reintenta en el siguiente cambio o arranque.
 */
export function useThemeProfileSync() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const { hydrated, preference, syncedUserId, syncedPreference, setPreference, markSynced } =
    useThemePreferenceStore();

  useEffect(() => {
    if (!hydrated || !userId) return;
    let cancelled = false;

    async function sync(id: string) {
      if (syncedUserId !== id) {
        const remote = await fetchProfileTheme(id);
        if (cancelled || remote === null) return;
        if (remote !== 'system') {
          setPreference(remote);
          markSynced(id, remote);
          return;
        }
      } else if (syncedPreference === preference) {
        return;
      }
      if (await saveProfileTheme(id, preference)) {
        if (!cancelled) markSynced(id, preference);
      }
    }

    void sync(userId);
    return () => {
      cancelled = true;
    };
  }, [hydrated, userId, preference, syncedUserId, syncedPreference, setPreference, markSynced]);
}
