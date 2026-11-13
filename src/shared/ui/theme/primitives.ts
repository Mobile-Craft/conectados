// Capa 1 · Primitivos (plan 3.1). Valores crudos sin significado: ningún componente los usa
// directamente; los temas (capa semántica) eligen de aquí. Este es el único sitio con colores
// literales, y la regla de lint lo permite solo en esta carpeta.
//
// Dirección visual: Aurora líquida (elegida por el dueño el 13-nov). Cristal translúcido sobre
// una aurora que deriva despacio, acento en degradado coral → magenta → violeta, formas muy
// redondeadas. Oscuro de primera.

/** Rampas de color de 50 (más claro) a 950 (más oscuro). */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',
  /** Noche: lilas y tintas violáceas. Fondo y textos de ambos temas. */
  night: {
    50: '#F5F3FF',
    100: '#E6E3F7',
    200: '#C9C4E4',
    300: '#C0BBDD',
    400: '#8E88B3',
    500: '#635D87',
    600: '#4D4868',
    700: '#3A3552',
    800: '#221F36',
    900: '#17142A',
    950: '#0B0A14',
  },
  /** Bruma: el fondo claro, un blanco con un punto lila. */
  haze: {
    50: '#F4F2FA',
    100: '#EAE7F4',
    200: '#DCD8EC',
  },
  coral: {
    100: '#FFE0D3',
    300: '#FFB39E',
    400: '#FF6A45',
    500: '#E8502E',
    600: '#D93D1E',
    700: '#D2381F',
    800: '#A82A14',
    900: '#7E2A15',
  },
  magenta: {
    400: '#E0418F',
    500: '#C8306F',
    600: '#C3307A',
    700: '#A8255F',
    800: '#962166',
  },
  violet: {
    200: '#D6CCFF',
    300: '#C4B5FF',
    400: '#7A5CFF',
    500: '#7052FF',
    600: '#5B3FE0',
    700: '#4A2FC0',
    800: '#3F28A8',
  },
  green: {
    100: '#D8F3E2',
    300: '#7EE0A8',
    700: '#1D6B40',
    800: '#17532F',
  },
  amber: {
    100: '#FDEFC8',
    300: '#FFD27A',
    700: '#8A5A00',
    800: '#6B4500',
  },
  red: {
    100: '#FDE0DE',
    300: '#FFA39B',
    400: '#F2685D',
    700: '#B42318',
    800: '#8E1B13',
    900: '#5C120C',
  },
  /** Velos para fondos de hojas y modales. */
  scrim: {
    light: { color: '#17142A', alpha: 0.4 },
    dark: { color: '#04030A', alpha: 0.6 },
  },
} as const;

/** Opacidades del cristal y de la aurora. El contraste AA se comprueba con estos valores. */
export const translucency = {
  /** Cristal oscuro: blanco muy tenue. Al 12 % en lo presionado y lo destacado. */
  glassDark: 0.07,
  glassDarkStrong: 0.12,
  glassDarkBorder: 0.16,
  /** Cristal claro: blanco lechoso con borde de tinta. */
  glassLight: 0.62,
  glassLightStrong: 0.8,
  glassLightBorder: 0.1,
  /**
   * Intensidad máxima de cada mancha de la aurora, en su centro. Más alta, el texto secundario
   * que pasa por encima baja de 4.5:1.
   */
  auroraDark: 0.3,
  auroraLight: 0.25,
} as const;

/**
 * Familias: Unbounded, ancha y redonda, para la pregunta y los títulos; Inter para la interfaz.
 * Con fuentes propias, cada peso es su propia familia en React Native.
 */
export const fontFamily = {
  display: 'Unbounded_500Medium',
  displayStrong: 'Unbounded_600SemiBold',
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
  textTransform?: 'uppercase';
}

/** Escala tipográfica en pt. La pregunta va de 28 a 40 según su largo (plan 3.1). */
export const typeScale = {
  questionL: { fontFamily: fontFamily.display, fontSize: 40, lineHeight: 50, letterSpacing: -0.6 },
  questionM: { fontFamily: fontFamily.display, fontSize: 34, lineHeight: 43, letterSpacing: -0.5 },
  questionS: { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 35, letterSpacing: -0.3 },
  title1: {
    fontFamily: fontFamily.displayStrong,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  title2: {
    fontFamily: fontFamily.displayStrong,
    fontSize: 22,
    lineHeight: 29,
    letterSpacing: -0.2,
  },
  title3: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  callout: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  /** Antetítulo en versalitas, como la categoría encima de la pregunta. */
  overline: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyleToken>;

/**
 * Cuánto puede crecer cada estilo con el tamaño de texto del sistema. La tipografía de pantalla
 * (Unbounded) ya nace grande y es muy ancha: sin tope, al máximo del sistema una palabra no cabe
 * en la línea y se parte por la mitad. Las etiquetas de controles (botones, selectores) tienen un
 * ancho acotado y llegan al 200 % (lo que pide HU-1.3). El texto corrido crece sin límite.
 */
export const maxFontScale: Partial<Record<keyof typeof typeScale, number>> = {
  questionL: 1.3,
  questionM: 1.3,
  questionS: 1.3,
  title1: 1.5,
  title2: 1.6,
  label: 2,
};

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

/** Formas muy redondeadas: la carta de pregunta usa `xxl` y los botones y chips, `full`. */
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 32,
  full: 999,
} as const;

/** Desenfoque del cristal (intensidad de 1 a 100 de expo-blur). */
export const blur = {
  glass: 40,
  sheet: 60,
} as const;

/** Duraciones en ms: el movimiento va de 180 a 240 ms (plan 3.1). */
export const duration = {
  instant: 100,
  fast: 180,
  base: 210,
  slow: 240,
} as const;

/** La aurora deriva en un ciclo lento, de ida y vuelta. No es una transición: va aparte. */
export const ambientDuration = 18_000;

/** Curva suave (cubic-bezier) para entradas y salidas. */
export const easing = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.3, 0, 0, 1],
} as const;

/** Área táctil mínima (plan 3.3). */
export const minTouchTarget = 44;
