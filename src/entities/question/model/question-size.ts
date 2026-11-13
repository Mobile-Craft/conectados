/** Tamaño de la pregunta según su largo: corta, grande; larga, más pequeña (plan 3.1, 28–40 pt). */
export type QuestionSize = 'questionL' | 'questionM' | 'questionS';

const ORDER: readonly QuestionSize[] = ['questionL', 'questionM', 'questionS'];

/**
 * Por el largo total y por la palabra más larga: la display es ancha y una palabra larga en
 * grande no cabe en la línea con el texto del sistema aumentado.
 */
export function questionSize(text: string): QuestionSize {
  const trimmed = text.trim();
  const byLength = trimmed.length <= 40 ? 0 : trimmed.length <= 80 ? 1 : 2;
  const words = trimmed.split(/\s+/).map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''));
  const longestWord = Math.max(0, ...words.map((w) => Array.from(w).length));
  const byWord = longestWord <= 8 ? 0 : longestWord <= 10 ? 1 : 2;
  return ORDER[Math.max(byLength, byWord)] ?? 'questionS';
}
