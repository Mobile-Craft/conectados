import { i18n } from '@/shared/lib';

/** Intensidad de una pregunta o de un set: siempre con número y etiqueta, nunca solo color. */
export interface Intensity {
  level: 1 | 2 | 3 | 4 | 5;
  /** Ya en el idioma activo (viene del catálogo). */
  label: string;
}

/** "Intensa · 4": lo que se lee en el chip, con el formato del idioma activo. */
export function intensityText({ level, label }: Intensity): string {
  return i18n.t('question.intensity', { label, level });
}

/** "Intensidad: Intensa · 4": lo que dice el lector de pantalla. */
export function intensitySpoken(intensity: Intensity): string {
  return i18n.t('question.intensitySpoken', { value: intensityText(intensity) });
}
