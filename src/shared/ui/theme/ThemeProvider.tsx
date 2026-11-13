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

/** Lo que elige el usuario: un tema fijo o seguir al sistema (HU-1.2). */
export type ThemePreference = ColorScheme | 'system';

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

const ThemeContext = createContext<Theme | null>(null);

/** El tema que toca mostrar según la preferencia y lo que dice el sistema ahora mismo. */
export function resolveScheme(
  preference: ThemePreference,
  system: string | null | undefined,
): ColorScheme {
  if (preference !== 'system') return preference;
  return system === 'dark' ? 'dark' : 'light';
}

/**
 * Da el tema activo a toda la app. Con `preference="system"` (por defecto) sigue al sistema y
 * cambia en caliente, sin reabrir la app; con `light` o `dark` lo fija.
 */
export function ThemeProvider({
  preference = 'system',
  children,
}: {
  preference?: ThemePreference;
  children: ReactNode;
}) {
  const system = useColorScheme();
  const active = resolveScheme(preference, system);
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
