import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type ScreenProps = {
  children: ReactNode;
  /** Centra el contenido en ambos ejes. Por defecto, true. */
  centered?: boolean;
  style?: ViewStyle;
};

/** Contenedor base de una pantalla. Genérico: no conoce el dominio. */
export function Screen({ children, centered = true, style }: ScreenProps) {
  return <View style={[styles.base, centered && styles.centered, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { flex: 1, padding: 24, gap: 12 },
  centered: { alignItems: 'center', justifyContent: 'center' },
});
