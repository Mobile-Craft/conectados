import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type ViewStyle } from 'react-native';

export interface GradientFillProps {
  /** Paradas del degradado, de un token del tema (por ejemplo `accentGradient`). */
  colors: readonly [string, string, ...string[]];
  /** Ocupa todo su contenedor (por defecto) o lleva su propio tamaño. */
  fill?: boolean;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Degradado lineal en diagonal suave (unos 110°), como el acento de Aurora. Decorativo: no recibe
 * toques ni lo lee el lector de pantalla. Genérico: no conoce el dominio.
 */
export function GradientFill({ colors, fill = true, borderRadius, style }: GradientFillProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      pointerEvents="none"
      style={[fill && StyleSheet.absoluteFill, { borderRadius }, style]}
    />
  );
}
