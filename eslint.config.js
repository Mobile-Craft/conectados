const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');
const boundaries = require('eslint-plugin-boundaries');

// Capas de Feature-Sliced Design (plan 10.4, D-17), de arriba abajo. Cada una solo importa de
// las que tiene debajo. `routes` son las rutas finas de expo-router en app/.
const LAYERS = ['app', 'screens', 'widgets', 'features', 'entities', 'shared'];
const SLICED = ['screens', 'widgets', 'features', 'entities'];

const below = (layer) => LAYERS.slice(LAYERS.indexOf(layer) + 1);

// Colores literales (plan 3.1, HU-1.1): los componentes solo usan tokens del tema. Los valores
// crudos viven en los primitivos; color.ts solo hace la aritmética (mezclar, escribir rgba()).
const COLOR_PRIMITIVES = ['src/shared/ui/theme/primitives.ts', 'src/shared/ui/theme/color.ts'];
const COLOR_PROPS =
  '/^(?:color|backgroundColor|border(?:Top|Right|Bottom|Left|Start|End|Block|Inline)?Color|shadowColor|textShadowColor|textDecorationColor|tintColor|overlayColor|placeholderTextColor|selectionColor|cursorColor|underlineColorAndroid)$/';
const NO_COLOR_LITERALS = [
  {
    selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
    message: 'Color literal: usa un token del tema (useTheme / createStyles).',
  },
  {
    selector: 'Literal[value=/^\\s*(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\\(/i]',
    message: 'Color literal: usa un token del tema (useTheme / createStyles).',
  },
  {
    selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b|(?:rgba?|hsla?)\\(/i]',
    message: 'Color literal en plantilla: usa un token del tema.',
  },
  {
    selector: `Property[key.name=${COLOR_PROPS}] > Literal[value=/^(?!transparent$)[a-zA-Z]+$/]`,
    message: 'Color con nombre: usa un token del tema.',
  },
  {
    selector: `JSXAttribute[name.name=${COLOR_PROPS}] > Literal`,
    message: 'Color literal en una prop: usa un token del tema.',
  },
];

// Textos visibles (HU-2.1): ninguno se escribe a mano en un componente; van en los archivos de
// idioma y se leen con t(). Se vigilan el texto entre etiquetas JSX, las props que muestran texto
// y Alert.alert. El catálogo /dev/components es interno y queda fuera.
const TEXT_PROPS =
  '/^(label|title|description|actionLabel|accessibilityLabel|accessibilityHint|placeholder|message|helper|error|closeLabel|text|category)$/';
const HAS_LETTERS = '/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/';
const NO_TEXT_LITERALS = [
  {
    selector: `JSXAttribute[name.name=${TEXT_PROPS}] > Literal[value=${HAS_LETTERS}]`,
    message: 'Texto visible escrito a mano: ponlo en los archivos de idioma y usa t().',
  },
  {
    selector: `JSXAttribute[name.name=${TEXT_PROPS}] > JSXExpressionContainer > Literal[value=${HAS_LETTERS}]`,
    message: 'Texto visible escrito a mano: ponlo en los archivos de idioma y usa t().',
  },
  {
    selector: `JSXText[value=${HAS_LETTERS}]`,
    message: 'Texto visible escrito a mano: ponlo en los archivos de idioma y usa t().',
  },
  {
    selector: `CallExpression[callee.object.name='Alert'][callee.property.name='alert'] > Literal[value=${HAS_LETTERS}]`,
    message: 'Texto visible escrito a mano: ponlo en los archivos de idioma y usa t().',
  },
];
const TEXT_EXEMPT = ['src/screens/dev-components/**'];

module.exports = defineConfig([
  globalIgnores(['dist/*', '.expo/*', 'ios/*', 'android/*', 'node_modules/*']),
  expoConfig,
  {
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: true,
      },
    },
    // TypeScript ya comprueba los nombres de un `import * as`; la regla de import da falsos
    // positivos con paquetes que reexportan con `export *` (expo-splash-screen).
    rules: { 'import/namespace': 'off' },
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: true,
      },
      'boundaries/elements': [
        { type: 'routes', pattern: 'app/**', partialMatch: false },
        { type: 'app', pattern: 'src/app' },
        ...SLICED.map((type) => ({
          type,
          pattern: `src/${type}/*`,
          capture: ['slice'],
        })),
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
      ],
    },
    rules: {
      // Orden de capas: hacia abajo sí; hacia arriba o entre slices hermanos, no. Desde fuera, un
      // slice (o un segmento de shared) solo se usa por su API pública, el index.ts.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'routes' } },
              allow: {
                to: { element: { types: ['app', 'screens'], fileInternalPath: 'index.ts' } },
              },
            },
            ...LAYERS.map((layer) => ({
              from: { element: { type: layer } },
              allow: { to: { element: { types: below(layer), fileInternalPath: 'index.ts' } } },
            })),
            // Dentro del mismo slice o segmento, libre.
            ...SLICED.map((type) => ({
              from: { element: { type } },
              allow: {
                to: { element: { type, captured: { slice: '{{ from.element.captured.slice }}' } } },
              },
            })),
            {
              from: { element: { type: 'shared' } },
              allow: {
                to: {
                  element: {
                    type: 'shared',
                    captured: { segment: '{{ from.element.captured.segment }}' },
                  },
                },
              },
            },
            // shared no tiene slices: un segmento usa otro por su index.ts. app es la raíz: libre.
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared', fileInternalPath: 'index.ts' } } },
            },
            { from: { element: { type: 'app' } }, allow: { to: { element: { type: 'app' } } } },
          ],
        },
      ],
    },
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    // Las pruebas usan colores de referencia (WCAG); la regla es para el código de la app.
    ignores: [...COLOR_PRIMITIVES, '**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', ...NO_COLOR_LITERALS] },
  },
  {
    // Mismo código de la app, ahora también sin textos a mano. Esta regla sustituye a la de
    // arriba en estos archivos, así que repite los colores.
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    ignores: [...COLOR_PRIMITIVES, ...TEXT_EXEMPT, '**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', ...NO_COLOR_LITERALS, ...NO_TEXT_LITERALS] },
  },
  prettierConfig,
]);
