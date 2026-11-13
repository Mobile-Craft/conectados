import type { ColorValue } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type IconName = 'compass' | 'book' | 'user' | 'close';

export interface IconProps {
  name: IconName;
  color: ColorValue;
  size?: number;
  /** Trazo más grueso, para marcar la pestaña activa. */
  strong?: boolean;
}

// Trazos redondeados en una caja de 24, a juego con las formas de Aurora.
const PATHS: Record<IconName, string> = {
  compass: 'M15.5 8.5l-2 5-5 2 2-5 5-2z',
  book: 'M5 5.5A2.5 2.5 0 017.5 3H19v15H7.5A2.5 2.5 0 005 20.5v-15zM5 20.5A2.5 2.5 0 017.5 18H19v3H7.5',
  user: 'M4.5 20.5c1.2-3.4 4.1-5.5 7.5-5.5s6.3 2.1 7.5 5.5',
  close: 'M6 6l12 12M18 6L6 18',
};

/**
 * Iconos de línea de la app. Decorativos: quien los usa pone el nombre accesible (la pestaña, el
 * botón). Genérico: no conoce el dominio.
 */
export function Icon({ name, color, size = 24, strong = false }: IconProps) {
  const stroke = {
    stroke: color,
    strokeWidth: strong ? 2.2 : 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {name === 'compass' ? <Circle cx={12} cy={12} r={9} {...stroke} /> : null}
      {name === 'user' ? <Circle cx={12} cy={8.5} r={3.5} {...stroke} /> : null}
      <Path d={PATHS[name]} {...stroke} />
    </Svg>
  );
}
