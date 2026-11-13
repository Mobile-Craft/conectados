import { over, type Tint } from './color';
import { palette, translucency } from './primitives';

// Capa 2 · Semánticos (plan 3.1). Nombran el papel de un color, no su tono. Claro y oscuro se
// diseñan por separado: el oscuro no es el claro invertido, porque la app se usa de noche.

export interface IntensityColors {
  bg: string;
  text: string;
}

/** Tres paradas de un degradado: coral → magenta → violeta. */
export type GradientStops = readonly [string, string, string];

export interface SemanticColors {
  bg: string;
  /** Equivalentes opacos del cristal sobre el fondo: para lo que no admite transparencia. */
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  /** Cristal translúcido: relleno, relleno destacado (o presionado) y borde. */
  glass: Tint;
  glassStrong: Tint;
  glassBorder: Tint;
  /** Los tres colores de la aurora y su intensidad máxima. Decorativos: nunca llevan texto. */
  aurora: GradientStops;
  auroraOpacity: number;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  /** Acento sólido para texto, enlaces y foco. */
  accent: string;
  /** Acento en degradado para lo que lleva texto blanco encima (botón principal, chip elegido). */
  accentGradient: GradientStops;
  accentGradientPressed: GradientStops;
  accentContrast: string;
  border: string;
  borderStrong: string;
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  /** Texto sobre un fondo `danger` sólido. */
  dangerContrast: string;
  dangerSubtle: string;
  overlay: Tint;
  /** Intensidad de un set, de 1 (suave) a 5 (intensa). Siempre con número y etiqueta. */
  intensity: readonly [
    IntensityColors,
    IntensityColors,
    IntensityColors,
    IntensityColors,
    IntensityColors,
  ];
}

const { night, haze, coral, magenta, violet, green, amber, red, white, scrim } = palette;
const t = translucency;

const darkBg = night[950];
const lightBg = haze[50];

export const lightColors: SemanticColors = {
  bg: lightBg,
  surface: over({ color: white, alpha: t.glassLight }, lightBg),
  surfaceRaised: white,
  surfaceSunken: haze[100],
  glass: { color: white, alpha: t.glassLight },
  glassStrong: { color: white, alpha: t.glassLightStrong },
  glassBorder: { color: night[900], alpha: t.glassLightBorder },
  aurora: [coral[500], magenta[600], violet[600]],
  auroraOpacity: t.auroraLight,
  textPrimary: night[900],
  textSecondary: night[700],
  textMuted: night[600],
  accent: violet[700],
  accentGradient: [coral[700], magenta[600], violet[600]],
  accentGradientPressed: [coral[800], magenta[800], violet[800]],
  accentContrast: white,
  border: haze[200],
  borderStrong: night[300],
  success: green[800],
  successSubtle: green[100],
  warning: amber[800],
  warningSubtle: amber[100],
  danger: red[800],
  dangerContrast: white,
  dangerSubtle: red[100],
  overlay: scrim.light,
  intensity: [
    { bg: green[100], text: green[800] },
    { bg: amber[100], text: amber[800] },
    { bg: coral[100], text: coral[900] },
    { bg: red[100], text: red[800] },
    { bg: red[700], text: white },
  ],
};

export const darkColors: SemanticColors = {
  bg: darkBg,
  surface: over({ color: white, alpha: t.glassDark }, darkBg),
  surfaceRaised: night[800],
  surfaceSunken: darkBg,
  glass: { color: white, alpha: t.glassDark },
  glassStrong: { color: white, alpha: t.glassDarkStrong },
  glassBorder: { color: white, alpha: t.glassDarkBorder },
  aurora: [coral[400], magenta[400], violet[400]],
  auroraOpacity: t.auroraDark,
  textPrimary: night[50],
  textSecondary: night[200],
  textMuted: night[300],
  accent: violet[200],
  accentGradient: [coral[600], magenta[500], violet[500]],
  accentGradientPressed: [coral[800], magenta[700], violet[600]],
  accentContrast: white,
  border: night[700],
  borderStrong: night[500],
  success: green[300],
  successSubtle: green[800],
  warning: amber[300],
  warningSubtle: amber[800],
  danger: red[300],
  dangerContrast: night[950],
  dangerSubtle: red[900],
  overlay: scrim.dark,
  intensity: [
    { bg: green[800], text: green[100] },
    { bg: amber[800], text: amber[100] },
    { bg: coral[900], text: coral[100] },
    { bg: red[800], text: red[100] },
    { bg: red[400], text: night[950] },
  ],
};
