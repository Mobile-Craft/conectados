import { over } from './color';
import type { Theme } from './theme';

// Contraste WCAG 2.x: (L1 + 0.05) / (L2 + 0.05), con L la luminancia relativa.
export const MIN_TEXT_CONTRAST = 4.5;

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminancia relativa de un color #RRGGBB. */
export function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) throw new Error(`Color no válido para contraste: ${hex}`);
  const n = Number.parseInt(match[1], 16);
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  );
}

export function contrastRatio(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export interface ColorPair {
  name: string;
  fg: string;
  bg: string;
}

/**
 * Lo que puede quedar detrás de un texto en una pantalla con aurora: el fondo solo y el fondo con
 * cada mancha de la aurora en su punto más intenso. Es el peor caso: el desenfoque del cristal y
 * el degradado de cada mancha solo lo suavizan.
 */
export function backdrops({ colors: c }: Theme): { name: string; color: string }[] {
  return [
    { name: 'fondo', color: c.bg },
    ...c.aurora.map((color, i) => ({
      name: `aurora ${i + 1}`,
      color: over({ color, alpha: c.auroraOpacity }, c.bg),
    })),
  ];
}

/**
 * Todos los pares texto/fondo que la app puede mostrar con este tema. Para el texto sobre la
 * aurora y el cristal, cada par es el peor de los fondos posibles.
 */
export function textPairs(theme: Theme): ColorPair[] {
  const { colors: c, components: k } = theme;
  const pairs: ColorPair[] = [];
  const add = (name: string, fg: string, bg: string) => pairs.push({ name, fg, bg });

  const layers: Record<string, (backdrop: string) => string> = {
    fondo: (b) => b,
    cristal: (b) => over(c.glass, b),
    'cristal fuerte': (b) => over(c.glassStrong, b),
    hoja: (b) => over(c.glassStrong, over(c.overlay, b)),
  };
  const behind = backdrops(theme);

  for (const fgName of [
    'textPrimary',
    'textSecondary',
    'textMuted',
    'accent',
    'success',
    'warning',
    'danger',
  ] as const) {
    const fg = c[fgName];
    for (const [layerName, layer] of Object.entries(layers)) {
      const worst = behind
        .map((b) => ({ name: b.name, bg: layer(b.color) }))
        .sort((x, y) => contrastRatio(fg, x.bg) - contrastRatio(fg, y.bg))[0];
      if (worst) add(`${fgName} / ${layerName} (peor: ${worst.name})`, fg, worst.bg);
    }
    add(`${fgName} / surfaceRaised`, fg, c.surfaceRaised);
  }

  c.accentGradient.forEach((stop, i) =>
    add(`accentContrast / degradado ${i + 1}`, c.accentContrast, stop),
  );
  c.accentGradientPressed.forEach((stop, i) =>
    add(`accentContrast / degradado presionado ${i + 1}`, c.accentContrast, stop),
  );
  add('dangerContrast / danger', c.dangerContrast, c.danger);
  add('success / successSubtle', c.success, c.successSubtle);
  add('warning / warningSubtle', c.warning, c.warningSubtle);
  add('danger / dangerSubtle', c.danger, c.dangerSubtle);
  c.intensity.forEach((level, i) => add(`intensity${i + 1}`, level.text, level.bg));
  add('toast', k.toast.text, k.toast.bg);
  return pairs;
}
