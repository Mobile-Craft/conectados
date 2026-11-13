import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { createStyles } from '../theme';

type ScreenProps = {
  children: ReactNode;
  /** Centra el contenido en ambos ejes. Por defecto, true. */
  centered?: boolean;
  style?: ViewStyle;
};

/** Contenedor base de una pantalla, con el fondo del tema. Genérico: no conoce el dominio. */
export function Screen({ children, centered = true, style }: ScreenProps) {
  const styles = useStyles();
  return <View style={[styles.base, centered && styles.centered, style]}>{children}</View>;
}

const useStyles = createStyles((t) => ({
  base: { flex: 1, padding: t.space[6], gap: t.space[3], backgroundColor: t.colors.bg },
  centered: { alignItems: 'center', justifyContent: 'center' },
}));
