// Aritmética de color para los tokens: mezclar un color translúcido sobre otro y escribirlo como
// rgba() para React Native. Sin colores propios: solo transforma los de los primitivos.

/** Un color con transparencia: el cristal y los bordes de Aurora se definen así. */
export interface Tint {
  color: string;
  alpha: number;
}

function channels(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) throw new Error(`Color no válido: ${hex}`);
  const n = Number.parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** El color que se ve al poner `tint` encima de `base` (opaco, #RRGGBB). */
export function over(tint: Tint, base: string): string {
  const fg = channels(tint.color);
  const bg = channels(base);
  return `#${fg
    .map((v, i) => Math.round(v * tint.alpha + (bg[i] ?? 0) * (1 - tint.alpha)))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

/** El tinte como cadena rgba() para un estilo de React Native. */
export function toRgba({ color, alpha }: Tint): string {
  const [r, g, b] = channels(color);
  return ['rgba(', [r, g, b, alpha].join(', '), ')'].join('');
}
