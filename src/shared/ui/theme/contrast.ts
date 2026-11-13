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

/** Todos los pares texto/fondo que la app puede mostrar con este tema. */
export function textPairs({ colors: c, components: k }: Theme): ColorPair[] {
  const pairs: ColorPair[] = [];
  const add = (name: string, fg: string, bg: string) => pairs.push({ name, fg, bg });

  for (const [bgName, bg] of Object.entries({
    bg: c.bg,
    surface: c.surface,
    surfaceRaised: c.surfaceRaised,
    surfaceSunken: c.surfaceSunken,
  })) {
    for (const fgName of [
      'textPrimary',
      'textSecondary',
      'textMuted',
      'accent',
      'success',
      'warning',
      'danger',
    ] as const) {
      add(`${fgName} / ${bgName}`, c[fgName], bg);
    }
  }
  add('accentContrast / accent', c.accentContrast, c.accent);
  add('accentContrast / accentPressed', c.accentContrast, c.accentPressed);
  add('textPrimary / accentSubtle', c.textPrimary, c.accentSubtle);
  add('success / successSubtle', c.success, c.successSubtle);
  add('warning / warningSubtle', c.warning, c.warningSubtle);
  add('danger / dangerSubtle', c.danger, c.dangerSubtle);
  c.intensity.forEach((level, i) => add(`intensity${i + 1}`, level.text, level.bg));

  add('questionCard text', k.questionCard.text, k.questionCard.bg);
  add('questionCard meta', k.questionCard.meta, k.questionCard.bg);
  for (const [variant, b] of Object.entries(k.button)) {
    add(`button.${variant}`, b.text, b.bg);
    add(`button.${variant} pressed`, b.text, b.bgPressed);
  }
  add('chip', k.chip.text, k.chip.bg);
  add('chip selected', k.chip.selectedText, k.chip.selectedBg);
  add('input text', k.input.text, k.input.bg);
  add('input placeholder', k.input.placeholder, k.input.bg);
  add('input error', k.input.errorText, k.input.bg);
  add('toast', k.toast.text, k.toast.bg);
  return pairs;
}
