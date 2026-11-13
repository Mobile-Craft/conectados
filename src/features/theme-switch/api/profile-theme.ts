import { supabase } from '@/shared/api';
import { THEME_PREFERENCES, type ThemePreference } from '@/shared/ui';

const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.includes(value as ThemePreference);

/** La preferencia guardada en el perfil, o null si no se pudo leer. */
export async function fetchProfileTheme(userId: string): Promise<ThemePreference | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('theme_pref')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return isThemePreference(data.theme_pref) ? data.theme_pref : null;
}

/** Guarda la preferencia en el perfil. Devuelve false si no se pudo (sin red, por ejemplo). */
export async function saveProfileTheme(userId: string, preference: ThemePreference) {
  const { error } = await supabase
    .from('profiles')
    .update({ theme_pref: preference })
    .eq('id', userId);
  return !error;
}
