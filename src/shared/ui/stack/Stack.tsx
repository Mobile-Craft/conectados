import type { ReactNode } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme, type Theme } from '../theme';

export interface StackProps extends ViewProps {
  children?: ReactNode;
  /** `column` (por defecto) apila; `row` alinea en fila. */
  direction?: 'column' | 'row';
  /** Separación entre hijos, en pasos de la escala de espaciado. */
  gap?: keyof Theme['space'];
  /** Relleno interior, en pasos de la escala de espaciado. */
  padding?: keyof Theme['space'];
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
}

/** Contenedor de maquetación con espaciado de la escala. Sin colores ni dominio. */
export function Stack({
  direction = 'column',
  gap = 0,
  padding,
  align,
  justify,
  wrap,
  style,
  ...rest
}: StackProps) {
  const { space } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: space[gap],
          padding: padding === undefined ? undefined : space[padding],
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : undefined,
        },
        style,
      ]}
      {...rest}
    />
  );
}
