/** Intensidad de una pregunta o de un set: siempre con número y etiqueta, nunca solo color. */
export interface Intensity {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
}

/** "Intensa · 4": lo que se lee en el chip. */
export function intensityText({ level, label }: Intensity): string {
  return `${label} · ${level}`;
}
