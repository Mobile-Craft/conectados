import type { ExpoConfig } from 'expo/config';

type AppVariant = 'development' | 'preview' | 'production';

const variant: AppVariant =
  process.env.APP_VARIANT === 'development' || process.env.APP_VARIANT === 'preview'
    ? process.env.APP_VARIANT
    : 'production';

const isDev = variant === 'development';
const baseId = 'com.mobilecraft.conectados';
const appId = isDev ? `${baseId}.dev` : baseId;

// Proyecto en EAS (cuenta tavarezdev). No es secreto: solo identifica el proyecto.
const easProjectId = '24e03272-21b1-4517-8522-2a7a0d79e1f4';

const config: ExpoConfig = {
  name: isDev ? 'Conectados (Dev)' : 'Conectados',
  slug: 'conectados',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'conectados',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: appId,
    icon: './assets/expo.icon',
  },
  android: {
    package: appId,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'server',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    // Rutas en app/ (raíz). Sin esto, SDK 58 toma src/app, que aquí es la capa app de FSD.
    ['expo-router', { root: './app' }],
    [
      'expo-splash-screen',
      {
        // El fondo de la splash es el `bg` de cada tema (sand.50 y ink.950 de los primitivos):
        // al quitarla no hay salto de color. La config no puede importar src/, así que una
        // prueba (app-config.test.ts) comprueba que coincidan.
        backgroundColor: '#F4F2FA',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
        dark: { backgroundColor: '#0B0A14' },
      },
    ],
    'expo-secure-store',
  ],
  owner: 'tavarezdev',
  extra: { eas: { projectId: easProjectId } },
  experiments: {
    typedRoutes: true,
  },
};

export default config;
