import { useLanguageProfileSync } from '@/features/language-switch';

/** Guarda en el perfil, cuando hay sesión, el idioma con el que se usa la app. No pinta nada. */
export function ProfileSync() {
  useLanguageProfileSync();
  return null;
}
