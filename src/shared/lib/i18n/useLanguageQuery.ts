import { useEffect, useEffectEvent, useState } from 'react';
import type { Language } from './detect';
import { useLanguage } from './useLanguage';

export interface LanguageQuery<T> {
  data: T | undefined;
  error: Error | null;
  /** true mientras no hay respuesta para el idioma activo. */
  loading: boolean;
  language: Language;
}

interface Result<T> {
  key: string;
  data?: T;
  error: Error | null;
}

/**
 * Pide datos que dependen del idioma (el catálogo, las preguntas) y los vuelve a pedir en cuanto
 * cambia, sin reiniciar la app (HU-2.2). Mientras llega la respuesta del idioma nuevo no devuelve
 * la del anterior: es mejor un estado de carga que un set en otro idioma. Las respuestas que
 * llegan tarde, de un idioma o una clave que ya no tocan, se descartan.
 *
 * `key` identifica la consulta sin el idioma (por ejemplo, `pack:<slug>`).
 */
export function useLanguageQuery<T>(
  key: string,
  fetch: (language: Language) => Promise<T>,
): LanguageQuery<T> {
  const language = useLanguage();
  const fullKey = `${language}:${key}`;
  const [result, setResult] = useState<Result<T> | null>(null);
  const run = useEffectEvent(() => fetch(language));

  useEffect(() => {
    let cancelled = false;
    run().then(
      (data) => {
        if (!cancelled) setResult({ key: fullKey, data, error: null });
      },
      (error: unknown) => {
        if (!cancelled) {
          const failure = error instanceof Error ? error : new Error(String(error));
          setResult({ key: fullKey, error: failure });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [fullKey]);

  const current = result?.key === fullKey ? result : null;
  return {
    data: current?.data,
    error: current?.error ?? null,
    loading: current === null,
    language,
  };
}
