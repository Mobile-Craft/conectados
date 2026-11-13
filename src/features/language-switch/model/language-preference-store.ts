import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Language, LanguagePreference } from '@/shared/lib';

interface LanguagePreferenceState {
  preference: LanguagePreference;
  /** Cuenta cuyo `profiles.locale` ya se actualizó desde este dispositivo. */
  syncedUserId: string | null;
  /** Último idioma que se sabe guardado en el perfil de esa cuenta. */
  syncedLanguage: Language | null;
  /** true cuando ya se leyó lo guardado: antes no se pinta nada (sin cambiar de idioma a la vista). */
  hydrated: boolean;
  setPreference: (preference: LanguagePreference) => void;
  markSynced: (userId: string, language: Language) => void;
}

export const LANGUAGE_PREFERENCE_STORAGE_KEY = 'conectados.language-preference';

export const useLanguagePreferenceStore = create<LanguagePreferenceState>()(
  persist(
    (set) => ({
      preference: 'system',
      syncedUserId: null,
      syncedLanguage: null,
      hydrated: false,
      setPreference: (preference) => set({ preference }),
      markSynced: (userId, language) => set({ syncedUserId: userId, syncedLanguage: language }),
    }),
    {
      name: LANGUAGE_PREFERENCE_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ preference, syncedUserId, syncedLanguage }) => ({
        preference,
        syncedUserId,
        syncedLanguage,
      }),
      // Aunque la lectura falle, la app sigue con el idioma del teléfono.
      onRehydrateStorage: () => () => useLanguagePreferenceStore.setState({ hydrated: true }),
    },
  ),
);

export const useLanguagePreference = () => useLanguagePreferenceStore((s) => s.preference);
export const useLanguagePreferenceHydrated = () => useLanguagePreferenceStore((s) => s.hydrated);
