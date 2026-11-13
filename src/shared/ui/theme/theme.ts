import { componentColors, type ComponentColors } from './components';
import { duration, easing, minTouchTarget, radius, space, typeScale } from './primitives';
import { darkColors, lightColors, type SemanticColors } from './semantic';

export type ColorScheme = 'light' | 'dark';

/** Todo lo que un componente puede leer del tema activo. */
export interface Theme {
  scheme: ColorScheme;
  colors: SemanticColors;
  components: ComponentColors;
  type: typeof typeScale;
  space: typeof space;
  radius: typeof radius;
  duration: typeof duration;
  easing: typeof easing;
  minTouchTarget: number;
}

function createTheme(scheme: ColorScheme, colors: SemanticColors): Theme {
  return {
    scheme,
    colors,
    components: componentColors(colors),
    type: typeScale,
    space,
    radius,
    duration,
    easing,
    minTouchTarget,
  };
}

export const themes: Record<ColorScheme, Theme> = {
  light: createTheme('light', lightColors),
  dark: createTheme('dark', darkColors),
};
