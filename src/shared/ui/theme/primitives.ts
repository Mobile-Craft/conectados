// Capa 1 · Primitivos (plan 3.1). Valores crudos sin significado: ningún componente los usa
// directamente; los temas (capa semántica) eligen de aquí. Este es el único sitio con colores
// literales, y la regla de lint lo permite solo en esta carpeta.

/** Rampas de color de 50 (más claro) a 950 (más oscuro). */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',
  /** Arena: neutros cálidos para el tema claro y el texto del oscuro. */
  sand: {
    50: '#FAF7F2',
    100: '#F3EEE6',
    200: '#E6DFD3',
    300: '#D2C8B8',
    400: '#ADA291',
    500: '#857A6A',
    600: '#665C4F',
    700: '#4A4239',
    800: '#302B25',
    900: '#1F1B17',
    950: '#14110E',
  },
  /** Tinta: azul violáceo profundo para el tema oscuro, pensado para jugar de noche. */
  ink: {
    50: '#F1F0F7',
    100: '#DEDCEB',
    200: '#BEBAD6',
    300: '#9C97BE',
    400: '#7B75A3',
    500: '#5E5885',
    600: '#48436B',
    700: '#363252',
    800: '#26233B',
    900: '#1A1829',
    950: '#100F1B',
  },
  /** Coral: el acento de la marca. */
  coral: {
    50: '#FFF2EC',
    100: '#FFE0D3',
    200: '#FFC0A8',
    300: '#FF9B78',
    400: '#FF7A4F',
    500: '#F25A2C',
    600: '#B53B15',
    700: '#923012',
    800: '#7E2A15',
    900: '#5A1E10',
  },
  green: {
    100: '#D8F3E2',
    300: '#7FD6A2',
    400: '#4CBF7D',
    700: '#1D6B40',
    800: '#17532F',
  },
  amber: {
    100: '#FDEFC8',
    300: '#F7CB5C',
    400: '#F0B429',
    700: '#8A5A00',
    800: '#6B4500',
  },
  red: {
    100: '#FDE0DE',
    300: '#F7928A',
    400: '#F2685D',
    700: '#B42318',
    800: '#8E1B13',
    900: '#5C120C',
  },
  /** Velos translúcidos para fondos de hojas y modales. */
  scrim: {
    light: 'rgba(20, 17, 14, 0.48)',
    dark: 'rgba(4, 3, 10, 0.64)',
  },
} as const;

/**
 * Familias: una display con carácter para la pregunta (Fraunces) y una sans neutra para la
 * interfaz (Inter). Con fuentes propias, cada peso es su propia familia en React Native.
 */
export const fontFamily = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_600SemiBold_Italic',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export interface TextStyleToken {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

/** Escala tipográfica en pt. La pregunta va de 28 a 40 según su largo (plan 3.1). */
export const typeScale = {
  questionL: { fontFamily: fontFamily.display, fontSize: 40, lineHeight: 48, letterSpacing: -0.4 },
  questionM: { fontFamily: fontFamily.display, fontSize: 34, lineHeight: 42, letterSpacing: -0.3 },
  questionS: { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 36, letterSpacing: -0.2 },
  title1: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  title2: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  title3: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  callout: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
} as const satisfies Record<string, TextStyleToken>;

/** Espaciado en base 4: `space[4]` = 16 pt. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

/** Duraciones en ms: el movimiento va de 180 a 240 ms (plan 3.1). */
export const duration = {
  instant: 100,
  fast: 180,
  base: 210,
  slow: 240,
} as const;

/** Curva suave (cubic-bezier) para entradas y salidas. */
export const easing = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.3, 0, 0, 1],
} as const;

/** Área táctil mínima (plan 3.3). */
export const minTouchTarget = 44;
