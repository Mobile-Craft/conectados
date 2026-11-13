import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { AuroraBackground } from '../aurora/AuroraBackground';
import { createStyles } from '../theme';

type ScreenProps = {
  children: ReactNode;
  /** Centra el contenido en ambos ejes. Por defecto, true. */
  centered?: boolean;
  /** Pinta la aurora detrás del contenido. Por defecto, true. */
  aurora?: boolean;
  style?: ViewStyle;
};

/**
 * Contenedor base de una pantalla: el fondo del tema y, detrás de todo, la aurora. Genérico: no
 * conoce el dominio.
 */
export function Screen({ children, centered = true, aurora = true, style }: ScreenProps) {
  const styles = useStyles();
  return (
    <View style={styles.root}>
      {aurora ? <AuroraBackground /> : null}
      <View style={[styles.content, centered && styles.centered, style]}>{children}</View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: { flex: 1, overflow: 'hidden', backgroundColor: t.colors.bg },
  content: { flex: 1, padding: t.space[6], gap: t.space[3] },
  centered: { alignItems: 'center', justifyContent: 'center' },
}));
