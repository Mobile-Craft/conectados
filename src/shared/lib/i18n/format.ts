import type { Language } from './detect';

// Formato según el idioma activo (HU-2.1). Envuelve Intl: así las fechas y los números se leen
// como en el país del idioma, sin escribir el formato a mano.

export function formatNumber(
  value: number,
  language: Language,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(language, options).format(value);
}

export function formatDate(
  date: Date | number,
  language: Language,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  return new Intl.DateTimeFormat(language, options).format(date);
}

/** "hace 3 días", "in 2 hours": la unidad más grande que tenga sentido. */
export function formatRelative(
  date: Date | number,
  language: Language,
  now: Date | number = Date.now(),
) {
  const seconds = Math.round((Number(date) - Number(now)) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  const format = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(seconds, 'second');
}
