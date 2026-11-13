import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

// Steiger solo reconoce las capas estándar de FSD. La capa `screens` (D-17, en lugar de `pages`
// para no confundirla con las rutas de expo-router) la vigila ESLint con eslint-plugin-boundaries.
export default defineConfig([...fsd.configs.recommended]);
