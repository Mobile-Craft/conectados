import { useEffect, useState } from 'react';
import { Animated, type DimensionValue } from 'react-native';
import { useReducedMotion } from '@/shared/lib';
import { createStyles, useTheme, type Theme } from '../theme';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: keyof Theme['radius'];
}

/**
 * Bloque que ocupa el lugar de un contenido que aún carga. Es decorativo: el lector de pantalla
 * no lo lee (anuncia la carga quien lo usa). Con "Reducir movimiento" no late.
 */
export function Skeleton({ width = '100%', height = 16, radius = 'md' }: SkeletonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: theme.duration.slow * 3,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: theme.duration.slow * 3,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [reducedMotion, opacity, theme.duration.slow]);

  return (
    <Animated.View
      testID="skeleton"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.base, { width, height, borderRadius: theme.radius[radius], opacity }]}
    />
  );
}

const useStyles = createStyles((t) => ({
  base: { backgroundColor: t.components.skeleton.bg },
}));
