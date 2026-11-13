import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useReducedMotion } from '@/shared/lib';
import { useTheme } from '../theme';

// Las tres manchas de la maqueta: posición del centro y radios, en fracciones de la capa (que es
// un 40 % más grande que la pantalla, para que al derivar nunca se vea el borde).
const BLOBS = [
  { stop: 0, cx: '18%', cy: '18%', rx: '40%', ry: '32%' },
  { stop: 2, cx: '85%', cy: '30%', rx: '42%', ry: '36%' },
  { stop: 1, cx: '55%', cy: '92%', rx: '46%', ry: '34%' },
] as const;

/**
 * Fondo de aurora: tres manchas de color difuminadas que derivan despacio (18 s, ida y vuelta).
 * Con "Reducir movimiento" se queda quieta. Es decorativa: no recibe toques ni la lee el lector
 * de pantalla. Va detrás de todo, dentro de un contenedor con el fondo del tema.
 */
export function AuroraBackground() {
  const { components, ambientDuration } = useTheme();
  const { stops, opacity } = components.aurora;
  const reducedMotion = useReducedMotion();
  const [drift] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion) {
      drift.stopAnimation();
      drift.setValue(0);
      return;
    }
    const half = ambientDuration / 2;
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: half, easing: ease, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: half, easing: ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, drift, ambientDuration]);

  const transform = [
    { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
    { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) },
    { rotate: drift.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '8deg'] }) },
  ];

  return (
    <Animated.View
      testID="aurora"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.layer, { transform }]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          {BLOBS.map((blob, i) => (
            <RadialGradient
              key={i}
              id={`aurora-${i}`}
              cx={blob.cx}
              cy={blob.cy}
              rx={blob.rx}
              ry={blob.ry}
              fx={blob.cx}
              fy={blob.cy}
              gradientUnits="objectBoundingBox"
            >
              <Stop offset="0" stopColor={stops[blob.stop]} stopOpacity={opacity} />
              <Stop offset="0.4" stopColor={stops[blob.stop]} stopOpacity={opacity * 0.6} />
              <Stop offset="1" stopColor={stops[blob.stop]} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {BLOBS.map((_, i) => (
          <Rect key={i} x="0" y="0" width="100%" height="100%" fill={`url(#aurora-${i})`} />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: '-20%', left: '-20%', right: '-20%', bottom: '-20%' },
});
