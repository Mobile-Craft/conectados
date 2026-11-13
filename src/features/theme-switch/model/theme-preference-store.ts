import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemePreference } from '@/shared/ui';

interface ThemePreferenceState {
  preference: ThemePreference;
  /** Cuenta cuyo perfil ya se sincronizó en este dispositivo. */
  syncedUserId: string | null;
  /** Último valor que se sabe guardado en el perfil de esa cuenta. */
  syncedPreference: ThemePreference | null;
  /** true cuando ya se leyó lo guardado: antes no se pinta nada (sin parpadeo). */
  hydrated: boolean;
  setPreference: (preference: ThemePreference) => void;
  markSynced: (userId: string, preference: ThemePreference) => void;
}

export const THEME_PREFERENCE_STORAGE_KEY = 'conectados.theme-preference';

export const useThemePreferenceStore = create<ThemePreferenceState>()(
  persist(
    (set) => ({
      preference: 'system',
      syncedUserId: null,
      syncedPreference: null,
      hydrated: false,
      setPreference: (preference) => set({ preference }),
      markSynced: (userId, preference) =>
        set({ syncedUserId: userId, syncedPreference: preference }),
    }),
    {
      name: THEME_PREFERENCE_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ preference, syncedUserId, syncedPreference }) => ({
        preference,
        syncedUserId,
        syncedPreference,
      }),
      // Aunque la lectura falle, la app sigue con el valor por defecto (sistema).
      onRehydrateStorage: () => () => useThemePreferenceStore.setState({ hydrated: true }),
    },
  ),
);

export const useThemePreference = () => useThemePreferenceStore((s) => s.preference);
export const useThemePreferenceHydrated = () => useThemePreferenceStore((s) => s.hydrated);
