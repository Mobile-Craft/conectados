# Conectados

App móvil (Expo + Supabase) para jugar en persona con sets de preguntas. Su diferenciador: generar con IA un set a partir de una historia propia, escrita o narrada.

## Requisitos

- Node 22 o superior y npm.
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm i -g eas-cli`) con sesión iniciada (`eas login`).
- Para compilar en local (opcional): Xcode (iOS) y Android Studio con el SDK (Android).
- La app **no usa Expo Go**: se ejecuta en un _development build_ propio, porque usa librerías nativas (por ejemplo, el login de Google).

## Arranque

```bash
npm install
cp .env.example .env    # APP_VARIANT=development
```

### 1. Proyecto en EAS

Ya está enlazado: cuenta `tavarezdev`, `projectId` fijado en `app.config.ts`. Para otra cuenta haría falta `eas init` y cambiar `owner` y `easProjectId` allí.

### 2. Generar e instalar el development build

```bash
eas build --profile development --platform android   # APK instalable
eas build --profile development --platform ios       # requiere cuenta de Apple Developer
```

- **Android:** abre en el teléfono el enlace o el QR que da EAS e instala el APK.
- **iOS:** antes registra el iPhone con `eas device:create`. Después instala desde el enlace de la build.
- **Simulador de iOS:** `eas build --profile development-simulator --platform ios`.

Alternativa sin la nube: `npx expo run:android --device` o `npx expo run:ios --device` (genera `ios/` y `android/`, que no se versionan).

### 3. Levantar el servidor de desarrollo

```bash
npm start               # expo start --dev-client
```

Abre la app **Conectados (Dev)** en el teléfono. Se conecta al servidor (misma red Wi‑Fi, o escaneando el QR). Los cambios de JavaScript se recargan al momento. Solo hay que generar otro build cuando cambian dependencias nativas o `app.config.ts`.

## Variantes

`APP_VARIANT` controla la identidad de la app, para poder tener instaladas a la vez la de desarrollo y la publicada:

| Variante                | Nombre           | Bundle id / package              |
| ----------------------- | ---------------- | -------------------------------- |
| `development`           | Conectados (Dev) | `com.mobilecraft.conectados.dev` |
| `preview`, `production` | Conectados       | `com.mobilecraft.conectados`     |

Los perfiles de `eas.json` ya fijan su variante.

## Scripts

| Script                            | Qué hace                                         |
| --------------------------------- | ------------------------------------------------ |
| `npm start`                       | Servidor de desarrollo para el development build |
| `npm run typecheck`               | TypeScript en modo estricto                      |
| `npm run lint`                    | ESLint (incluida la regla de capas) y Steiger    |
| `npm run format` / `format:check` | Prettier                                         |

## Arquitectura

Rutas finas en `app/` (expo-router): cada archivo solo reexporta una pantalla. El código vive en `src/`, organizado con [Feature-Sliced Design](https://feature-sliced.design):

```
src/
  app/        arranque y proveedores globales
  screens/    una pantalla por slice
  widgets/    bloques grandes de interfaz
  features/   acciones del usuario
  entities/   conceptos del dominio
  shared/     ui (componentes genéricos), config, lib…
```

- Cada capa importa solo de las que tiene debajo, y un slice nunca importa de un slice hermano.
- Desde fuera, un slice (o un segmento de `shared`) se usa solo por su `index.ts`.
- `npm run lint` hace cumplir estas reglas: `eslint-plugin-boundaries` vigila las seis capas, y Steiger revisa la estructura FSD de las capas estándar (no reconoce `screens`, que sustituye a `pages` para no confundirla con las rutas de expo-router).
- Estilos con `StyleSheet` de React Native y los tokens del tema. No se usan Tailwind, NativeWind ni Tamagui.
- Alias de imports: `@/` apunta a `src/`.
