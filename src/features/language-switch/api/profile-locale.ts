import { supabase } from '@/shared/api';
import type { Language } from '@/shared/lib';

/**
 * Guarda en el perfil el idioma con el que se usa la app (lo leen el servidor y el catálogo).
 * Devuelve false si no se pudo (sin red, por ejemplo).
 */
export async function saveProfileLocale(userId: string, language: Language) {
  const { error } = await supabase.from('profiles').update({ locale: language }).eq('id', userId);
  return !error;
}
