import { useEffect } from 'react';
import { useAuth } from '@/entities/session';
import { useLanguage } from '@/shared/lib';
import { saveProfileLocale } from '../api/profile-locale';
import { useLanguagePreferenceStore } from './language-preference-store';

/**
 * Mantiene `profiles.locale` igual al idioma activo de la app cuando hay sesión: al elegir otro en
 * Ajustes y también, con "Automático", al cambiar el del teléfono.
 *
 * Solo sube, no baja: `profiles.locale` guarda el idioma efectivo (es o en, con `es` por defecto),
 * así que no distingue "eligió español" de "nunca eligió". La elección vive en el dispositivo.
 * Sin red, no rompe nada: se reintenta en el siguiente cambio o arranque.
 */
export function useLanguageProfileSync() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const language = useLanguage();
  const hydrated = useLanguagePreferenceStore((s) => s.hydrated);
  const syncedUserId = useLanguagePreferenceStore((s) => s.syncedUserId);
  const syncedLanguage = useLanguagePreferenceStore((s) => s.syncedLanguage);
  const markSynced = useLanguagePreferenceStore((s) => s.markSynced);

  useEffect(() => {
    if (!hydrated || !userId) return;
    if (syncedUserId === userId && syncedLanguage === language) return;
    let cancelled = false;

    void saveProfileLocale(userId, language).then((saved) => {
      if (saved && !cancelled) markSynced(userId, language);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, userId, language, syncedUserId, syncedLanguage, markSynced]);
}
