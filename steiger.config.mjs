import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

// Steiger solo reconoce las capas estándar de FSD. La capa `screens` (D-17, en lugar de `pages`
// para no confundirla con las rutas de expo-router) la vigila ESLint con eslint-plugin-boundaries.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Como no ve `screens`, no cuenta lo que las pantallas usan de las capas de abajo: una entidad
    // usada solo por pantallas le parece huérfana. Los límites entre capas siguen en ESLint.
    rules: { 'fsd/insignificant-slice': 'off' },
  },
]);
