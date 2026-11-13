import type { SemanticColors } from './semantic';

// Capa 3 · De componente (plan 3.1). Cada componente lee sus colores de aquí, y estos salen de
// la capa semántica: cambiar un tema nunca obliga a tocar un componente.

export function componentColors(c: SemanticColors) {
  return {
    questionCard: {
      bg: c.surfaceRaised,
      text: c.textPrimary,
      meta: c.textSecondary,
      border: c.border,
    },
    button: {
      primary: { bg: c.accent, bgPressed: c.accentPressed, text: c.accentContrast },
      secondary: {
        bg: c.surface,
        bgPressed: c.surfaceSunken,
        text: c.textPrimary,
        border: c.borderStrong,
      },
      ghost: { bg: c.bg, bgPressed: c.surfaceSunken, text: c.accent },
      danger: { bg: c.danger, bgPressed: c.danger, text: c.surface },
    },
    chip: {
      bg: c.surface,
      text: c.textSecondary,
      border: c.border,
      selectedBg: c.accentSubtle,
      selectedText: c.textPrimary,
      selectedBorder: c.accent,
    },
    chipIntensity: c.intensity,
    input: {
      bg: c.surface,
      text: c.textPrimary,
      placeholder: c.textMuted,
      border: c.borderStrong,
      focusBorder: c.accent,
      errorText: c.danger,
    },
    toast: { bg: c.textPrimary, text: c.bg },
    skeleton: { bg: c.surfaceSunken, highlight: c.border },
  };
}

export type ComponentColors = ReturnType<typeof componentColors>;
