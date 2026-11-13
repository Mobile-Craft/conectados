/** Idiomas de la app (plan: es / en). El primero que no se reconoce cae al de respaldo. */
export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Si el teléfono no está en un idioma que tengamos, inglés (HU-2.1). */
export const FALLBACK_LANGUAGE: Language = 'en';

export function isSupported(code: string | null | undefined): code is Language {
  return SUPPORTED_LANGUAGES.includes(code as Language);
}

/**
 * El idioma para la app según los del teléfono, en su orden de preferencia: el primero que
 * tengamos; si ninguno, el de respaldo. Acepta "es", "es-MX" o "es_MX".
 */
export function detectLanguage(
  deviceLocales: readonly { languageCode?: string | null }[],
): Language {
  for (const locale of deviceLocales) {
    const code = locale.languageCode?.toLowerCase().split(/[-_]/)[0];
    if (isSupported(code)) return code;
  }
  return FALLBACK_LANGUAGE;
}

/** Lo que el usuario elige en Ajustes: seguir al teléfono o fijar un idioma (HU-2.2). */
export const LANGUAGE_PREFERENCES = ['system', ...SUPPORTED_LANGUAGES] as const;
export type LanguagePreference = (typeof LANGUAGE_PREFERENCES)[number];

export function isLanguagePreference(value: unknown): value is LanguagePreference {
  return LANGUAGE_PREFERENCES.includes(value as LanguagePreference);
}

/** El idioma que usa la app: el elegido, o con "Automático" el del teléfono. */
export function resolveLanguage(
  preference: LanguagePreference,
  deviceLocales: readonly { languageCode?: string | null }[],
): Language {
  return preference === 'system' ? detectLanguage(deviceLocales) : preference;
}
