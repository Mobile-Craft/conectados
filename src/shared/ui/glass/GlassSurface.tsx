import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { createStyles, useTheme, type Theme } from '../theme';

export interface GlassSurfaceProps extends ViewProps {
  children?: ReactNode;
  /** Relleno más opaco: para lo presionado, lo destacado o lo que flota (hojas, menús). */
  strong?: boolean;
  /**
   * Desenfoca lo que hay detrás (iOS). Cuesta rendimiento: úsalo en superficies grandes, no en
   * cada chip. En Android se queda en el relleno translúcido, que ya cumple el contraste.
   */
  blurred?: boolean;
  radius?: keyof Theme['radius'];
  padding?: keyof Theme['space'];
}

/**
 * Superficie de cristal de Aurora: relleno translúcido, borde fino y, si se pide, desenfoque de
 * lo que tiene detrás. Genérica: no conoce el dominio. Es la base de Card, Sheet y compañía.
 */
export function GlassSurface({
  children,
  strong = false,
  blurred = false,
  radius = 'xl',
  padding,
  style,
  ...rest
}: GlassSurfaceProps) {
  const theme = useTheme();
  const styles = useStyles();
  const shape = {
    borderRadius: theme.radius[radius],
    padding: padding === undefined ? undefined : theme.space[padding],
  };

  return (
    <View style={[styles.base, shape, style]} {...rest}>
      {blurred && Platform.OS === 'ios' ? (
        <BlurView
          intensity={theme.blur.glass}
          tint={theme.scheme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, strong ? styles.fillStrong : styles.fill]}
      />
      {children}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: t.components.glass.border,
  },
  fill: { backgroundColor: t.components.glass.bg },
  fillStrong: { backgroundColor: t.components.glass.bgStrong },
}));
