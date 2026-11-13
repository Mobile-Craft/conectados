import { createContext, useContext, type ReactNode } from 'react';
import {
  StyleSheet,
  useColorScheme,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { themes, type ColorScheme, type Theme } from './theme';

type NamedStyles<T> = { [K in keyof T]: ViewStyle | TextStyle | ImageStyle };

const ThemeContext = createContext<Theme | null>(null);

/**
 * Da el tema activo a toda la app. Sin `scheme`, sigue al sistema y cambia en caliente.
 * La preferencia del usuario (claro, oscuro o sistema) llega con la HU-1.2.
 */
export function ThemeProvider({ scheme, children }: { scheme?: ColorScheme; children: ReactNode }) {
  const system = useColorScheme();
  const active: ColorScheme = scheme ?? (system === 'dark' ? 'dark' : 'light');
  return <ThemeContext.Provider value={themes[active]}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme se usa dentro de <ThemeProvider>.');
  return theme;
}

/**
 * Estilos a partir de los tokens del tema activo. Se escribe fuera del componente y devuelve un
 * hook; cada tema crea su StyleSheet una sola vez.
 *
 *   const useStyles = createStyles((t) => ({ title: { ...t.type.title1, color: t.colors.textPrimary } }));
 *   const styles = useStyles();
 */
export function createStyles<T extends NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new Map<ColorScheme, T>();
  return function useStyles(): T {
    const theme = useTheme();
    let styles = cache.get(theme.scheme);
    if (!styles) {
      styles = StyleSheet.create(factory(theme));
      cache.set(theme.scheme, styles);
    }
    return styles;
  };
}
