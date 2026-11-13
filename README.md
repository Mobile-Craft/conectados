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

## Supabase

El backend es Supabase (proyecto `conectados-dev`, organización `conectados`). El CLI se usa siempre por `npm run sb -- <comando>`: lee el token de la cuenta de Conectados del llavero de macOS y no toca la sesión global del CLI.

Una vez por equipo:

```bash
# En Terminal (no en un chat): token de supabase.com/dashboard/account/tokens
security add-generic-password -U -a conectados -s supabase-access-token -w '<token>'
npm run sb -- link --project-ref bevmpvgtghwwtivdpmyk
```

- **Migraciones** en `supabase/migrations/`. Una migración publicada no se edita: los cambios van en una nueva (`npm run sb -- migration new <nombre>`).
- **Reconstruir dev desde cero:** `npm run sb -- db reset --linked` (borra los datos de dev y aplica todas las migraciones). Pide la contraseña de la base; está en el llavero, como `supabase-db-conectados-dev`.
- **Pruebas de la base:** `npm run db:test` corre las pruebas pgTAP de `supabase/tests/database` contra dev (RLS del catálogo por perfil: anónimo, invitado, menor, adulto y autor). Cada archivo trabaja en una transacción que se deshace. Necesita `psql` (`brew install libpq`) y la contraseña del llavero.
- **Acceso por enlace:** un set con `visibility = 'link'` solo se lee si la petición trae su slug en la cabecera `x-pack-slug`; nunca sale en listados ni en `search_packs`.
- **Tipos:** `npm run db:types` regenera `src/shared/api/supabase/database.types.ts` desde el esquema. Ejecútalo tras cada migración.
- **Claves:** la app usa la URL y la clave _publishable_ (`EXPO_PUBLIC_SUPABASE_*` en `.env` y en las variables de EAS). Las claves `secret` y `service_role` nunca van al cliente ni al repositorio.
- **Sesión:** el cliente único es `supabase` de `@/shared/api`. La sesión se guarda en `expo-secure-store` (en trozos, porque pasa de 2048 bytes) y el refresco automático se enciende al volver la app al frente. `useAuth()` de `@/entities/session` da el estado: `loading` · `authenticated` · `guest` (sesión anónima) · `anonymous` (sin sesión). La splash nativa se mantiene mientras el estado es `loading`.

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
| `npm test`                        | Pruebas unitarias (Jest con `jest-expo`)         |
| `npm run check:contrast`          | Informe de contraste AA de ambos temas           |
| `npm run typecheck`               | TypeScript en modo estricto                      |
| `npm run lint`                    | ESLint (incluida la regla de capas) y Steiger    |
| `npm run format` / `format:check` | Prettier                                         |

## Sistema de diseño

Los tokens viven en `src/shared/ui/theme/`, en tres capas (plan 3.1):

- **Primitivos** (`primitives.ts`): paleta, escala tipográfica (Fraunces para la pregunta, Inter para la interfaz), espaciado en base 4, radios y duraciones. Es el único archivo con colores literales.
- **Semánticos** (`semantic.ts`): `bg`, `surface`, `textPrimary`, `accent`… Claro y oscuro se diseñan por separado.
- **De componente** (`components.ts`): `questionCard`, `button`, `chip`… Solo leen semánticos.

Los estilos se escriben con `createStyles((t) => ({ … }))` de `@/shared/ui`, que crea un `StyleSheet` por tema. Una regla de ESLint prohíbe colores literales fuera de los primitivos, y `npm test` comprueba que cada par texto/fondo de ambos temas cumpla 4.5:1 (`npm run check:contrast` da el informe).

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
