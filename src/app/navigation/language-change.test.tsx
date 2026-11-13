import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, screen } from '@testing-library/react-native';
import path from 'node:path';
import { useLanguagePreferenceStore } from '@/features/language-switch';
import { i18n } from '@/shared/lib';

// Mismo montaje que navigation.test.tsx: las rutas reales de app/, sin Supabase ni splash.
interface RouterTesting {
  renderRouter: (dir: string, options: { initialUrl: string }) => Promise<unknown>;
}
const { renderRouter } = jest.requireActual<RouterTesting>('expo-router/testing-library');

jest.mock('@/shared/api', () => ({}));
jest.mock('@/shared/config', () => ({ APP_NAME: 'Conectados', env: {} }));
jest.mock('@/entities/session', () => ({
  AuthProvider: ({ children }: { children: unknown }) => children,
  useAuth: () => ({ status: 'anonymous', session: null }),
}));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(async () => true),
  setOptions: jest.fn(),
  hide: jest.fn(),
}));
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

const APP_DIR = path.resolve(__dirname, '../../../app');

/** Todas las pantallas que ve el usuario. El catálogo interno /dev/components va en español. */
const ROUTES = [
  '/',
  '/stories',
  '/profile',
  '/pack/primera-cita',
  '/game',
  '/game/play',
  '/game/summary',
  '/story/new',
  '/settings',
  '/about',
  '/no-existe',
];

type Tree = { [key: string]: string | Tree };

function leaves(tree: Tree, prefix = ''): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [[`${prefix}${key}`, value]] : leaves(value, `${prefix}${key}.`),
  );
}

// Los textos de cada idioma, tal como los tiene cargados la app.
const es = i18n.getResourceBundle('es', 'translation') as Tree;
const en = i18n.getResourceBundle('en', 'translation') as Tree;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Patrones de los textos que solo existen en español (los que en inglés se escriben distinto).
 * Las interpolaciones ({{count}}, {{name}}…) aceptan cualquier valor.
 */
const englishByKey = new Map(leaves(en));
const spanishOnly = leaves(es)
  .filter(([key, text]) => englishByKey.get(key) !== text)
  .map(([key, text]) => ({
    key,
    pattern: new RegExp(
      `^${text
        .split(/\{\{[^}]+\}\}/)
        .map(escape)
        .join('.+')}$`,
    ),
  }));
const englishOnly = new Set(
  leaves(en)
    .filter(([key, text]) => englishByKey.get(key) === text && !text.includes('{{'))
    .filter(([key, text]) => leaves(es).find(([k]) => k === key)?.[1] !== text)
    .map(([, text]) => text),
);

const TEXT_PROPS = ['accessibilityLabel', 'accessibilityHint', 'placeholder', 'title'];

/** Lo que el usuario puede leer u oír en pantalla: textos y etiquetas de accesibilidad. */
function visibleTexts(): string[] {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (node === null || node === undefined) return;
    if (typeof node === 'string') {
      found.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const element = node as { props?: Record<string, unknown>; children?: unknown };
    for (const prop of TEXT_PROPS) {
      const value = element.props?.[prop];
      if (typeof value === 'string') found.push(value);
    }
    walk(element.children);
  };
  walk(screen.toJSON());
  return found.map((text) => text.trim()).filter(Boolean);
}

describe('cambiar de idioma en Ajustes cambia todas las pantallas (HU-2.2)', () => {
  afterEach(async () => {
    useLanguagePreferenceStore.setState({ preference: 'system' });
    await i18n.changeLanguage('es');
  });

  it.each(ROUTES)('%s pasa entera al inglés, sin reiniciar', async (route) => {
    useLanguagePreferenceStore.setState({ preference: 'system', hydrated: true });
    await renderRouter(APP_DIR, { initialUrl: route });
    await act(async () => {});

    await act(async () => useLanguagePreferenceStore.getState().setPreference('en'));
    const texts = visibleTexts();

    const leftovers = texts.flatMap((text) =>
      spanishOnly.filter(({ pattern }) => pattern.test(text)).map(({ key }) => `${key}: "${text}"`),
    );
    expect(leftovers).toEqual([]);
    expect(texts.some((text) => englishOnly.has(text))).toBe(true);
  });
});
