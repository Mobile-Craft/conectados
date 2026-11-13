import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { createStyles, useTheme, type Theme } from '../theme';

export type TextVariant = keyof Theme['type'];
export type TextTone =
  'primary' | 'secondary' | 'muted' | 'accent' | 'onAccent' | 'success' | 'warning' | 'danger';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  children: ReactNode;
  /** Estilo de la escala tipográfica. Por defecto, `body`. */
  variant?: TextVariant;
  /** Color por su papel. Por defecto, `primary`. */
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
  style?: RNTextProps['style'];
}

/**
 * Texto con la escala y los colores del tema. Respeta el tamaño de texto del sistema; solo la
 * tipografía de pantalla tiene un tope (`maxFontScale`), y se puede cambiar con
 * `maxFontSizeMultiplier`. Nunca trunca salvo que se pida con `numberOfLines`.
 */
export function Text({ variant = 'body', tone = 'primary', align, style, ...rest }: TextProps) {
  const styles = useStyles();
  const { maxFontScale } = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={maxFontScale[variant]}
      style={[styles[variant], styles[tone], align && { textAlign: align }, style]}
      {...rest}
    />
  );
}

const useStyles = createStyles((t) => ({
  ...t.type,
  primary: { color: t.colors.textPrimary },
  secondary: { color: t.colors.textSecondary },
  muted: { color: t.colors.textMuted },
  accent: { color: t.colors.accent },
  onAccent: { color: t.colors.accentContrast },
  success: { color: t.colors.success },
  warning: { color: t.colors.warning },
  danger: { color: t.colors.danger },
}));
