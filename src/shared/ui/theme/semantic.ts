import { palette } from './primitives';

// Capa 2 · Semánticos (plan 3.1). Nombran el papel de un color, no su tono. Claro y oscuro se
// diseñan por separado: el oscuro no es el claro invertido, porque la app se usa de noche.

export interface IntensityColors {
  bg: string;
  text: string;
}

export interface SemanticColors {
  bg: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentPressed: string;
  accentSubtle: string;
  accentContrast: string;
  border: string;
  borderStrong: string;
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
  overlay: string;
  /** Intensidad de un set, de 1 (suave) a 5 (intensa). Siempre con número y etiqueta. */
  intensity: readonly [
    IntensityColors,
    IntensityColors,
    IntensityColors,
    IntensityColors,
    IntensityColors,
  ];
}

const { sand, ink, coral, green, amber, red, white, scrim } = palette;

export const lightColors: SemanticColors = {
  bg: sand[50],
  surface: white,
  surfaceRaised: white,
  surfaceSunken: sand[100],
  textPrimary: sand[900],
  textSecondary: sand[700],
  textMuted: sand[600],
  accent: coral[600],
  accentPressed: coral[700],
  accentSubtle: coral[50],
  accentContrast: white,
  border: sand[200],
  borderStrong: sand[300],
  success: green[700],
  successSubtle: green[100],
  warning: amber[700],
  warningSubtle: amber[100],
  danger: red[700],
  dangerSubtle: red[100],
  overlay: scrim.light,
  intensity: [
    { bg: green[100], text: green[800] },
    { bg: amber[100], text: amber[800] },
    { bg: coral[100], text: coral[800] },
    { bg: red[100], text: red[800] },
    { bg: red[700], text: white },
  ],
};

export const darkColors: SemanticColors = {
  bg: ink[950],
  surface: ink[900],
  surfaceRaised: ink[800],
  surfaceSunken: ink[950],
  textPrimary: sand[50],
  textSecondary: sand[200],
  textMuted: ink[300],
  accent: coral[400],
  accentPressed: coral[300],
  accentSubtle: coral[900],
  accentContrast: ink[950],
  border: ink[700],
  borderStrong: ink[600],
  success: green[300],
  successSubtle: green[800],
  warning: amber[300],
  warningSubtle: amber[800],
  danger: red[300],
  dangerSubtle: red[900],
  overlay: scrim.dark,
  intensity: [
    { bg: green[800], text: green[100] },
    { bg: amber[800], text: amber[100] },
    { bg: coral[800], text: coral[100] },
    { bg: red[800], text: red[100] },
    { bg: red[400], text: ink[950] },
  ],
};
