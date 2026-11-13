import { toRgba } from './color';
import type { SemanticColors } from './semantic';

// Capa 3 · De componente (plan 3.1). Cada componente lee sus colores de aquí, y estos salen de
// la capa semántica: cambiar un tema nunca obliga a tocar un componente. Los translúcidos ya
// vienen como rgba() listos para un estilo.

export function componentColors(c: SemanticColors) {
  const glass = toRgba(c.glass);
  const glassStrong = toRgba(c.glassStrong);
  const glassBorder = toRgba(c.glassBorder);

  return {
    glass: { bg: glass, bgStrong: glassStrong, border: glassBorder },
    aurora: { stops: c.aurora, opacity: c.auroraOpacity },
    questionCard: {
      bg: glass,
      border: glassBorder,
      text: c.textPrimary,
      meta: c.textSecondary,
    },
    button: {
      primary: {
        gradient: c.accentGradient,
        gradientPressed: c.accentGradientPressed,
        text: c.accentContrast,
        glow: c.aurora[1],
      },
      secondary: { bg: glass, bgPressed: glassStrong, text: c.textPrimary, border: glassBorder },
      ghost: { bg: 'transparent', bgPressed: glass, text: c.accent },
      danger: { bg: c.danger, bgPressed: c.danger, text: c.dangerContrast },
    },
    chip: {
      bg: glass,
      text: c.textPrimary,
      border: glassBorder,
      bgPressed: glassStrong,
      selectedGradient: c.accentGradient,
      selectedText: c.accentContrast,
    },
    chipIntensity: c.intensity,
    avatar: { gradient: c.accentGradient, text: c.accentContrast, ring: glassBorder },
    input: {
      bg: glass,
      text: c.textPrimary,
      placeholder: c.textMuted,
      border: glassBorder,
      focusBorder: c.accent,
      errorText: c.danger,
    },
    sheet: {
      bg: glassStrong,
      fallbackBg: c.surfaceRaised,
      border: glassBorder,
      handle: c.borderStrong,
      overlay: toRgba(c.overlay),
    },
    toast: { bg: c.textPrimary, text: c.bg },
    skeleton: { bg: glassStrong },
  };
}

export type ComponentColors = ReturnType<typeof componentColors>;
