import type { ReactNode } from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import { GlassSurface } from '../glass/GlassSurface';
import { createStyles, type Theme } from '../theme';

export type CardVariant = 'glass' | 'outlined' | 'filled';

export interface CardProps {
  children: ReactNode;
  /**
   * `glass` (por defecto): cristal desenfocado sobre la aurora. `outlined`: cristal sin
   * desenfoque y borde marcado, para listas largas. `filled`: cristal más opaco.
   */
  variant?: CardVariant;
  padding?: keyof Theme['space'];
  radius?: keyof Theme['radius'];
  /** Si se pasa, toda la tarjeta es un botón; `accessibilityLabel` resume lo que contiene. */
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

/** Superficie de cristal que agrupa contenido. Genérica: no conoce el dominio. */
export function Card({
  children,
  variant = 'glass',
  padding = 4,
  radius = 'xl',
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
}: CardProps) {
  const styles = useStyles();
  const surface = (pressed: boolean, label?: string) => (
    <GlassSurface
      accessible={label !== undefined}
      accessibilityRole={label !== undefined ? 'text' : undefined}
      accessibilityLabel={label}
      blurred={variant === 'glass'}
      strong={variant === 'filled' || pressed}
      radius={radius}
      padding={padding}
      style={[styles.base, variant === 'outlined' && styles.outlined, style]}
    >
      {children}
    </GlassSurface>
  );

  if (!onPress) return surface(false, accessibilityLabel);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.touchable, pressed && styles.pressed]}
    >
      {({ pressed }) => surface(pressed)}
    </Pressable>
  );
}

const useStyles = createStyles((t) => ({
  base: { gap: t.space[2] },
  outlined: { borderColor: t.colors.borderStrong },
  touchable: { minHeight: t.minTouchTarget },
  pressed: { transform: [{ scale: 0.99 }] },
}));
