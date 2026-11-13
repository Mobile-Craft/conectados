import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { Alert, type AlertButton } from 'react-native';
import path from 'node:path';

// Las utilidades de expo-router se cargan sin sus tipos: su archivo de tipos redeclara el módulo
// `expect` y tapa los matchers de Testing Library en todo el proyecto.
interface RouterTesting {
  renderRouter: (
    dir: string,
    options: { initialUrl: string },
  ) => Promise<{ getPathname(): string }>;
  testRouter: { canGoBack(): boolean; back(path?: string): Promise<void> };
}
const { renderRouter, testRouter } = jest.requireActual<RouterTesting>(
  'expo-router/testing-library',
);

// Monta las rutas reales de app/. Se simula lo que no hace falta para navegar: la sesión y
// Supabase (piden variables de entorno), la splash y las fuentes.
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

async function open(initialUrl: string) {
  return renderRouter(APP_DIR, { initialUrl });
}

describe('navegación (HU-1.4)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('arranca en Descubrir con las tres pestañas', async () => {
    const router = await open('/');
    expect(router.getPathname()).toBe('/');
    for (const tab of ['Descubrir', 'Mis historias', 'Perfil']) {
      expect(await screen.findByRole('button', { name: new RegExp(tab) })).toBeOnTheScreen();
    }
  });

  it('conectados://pack/<slug> abre el detalle de ese set', async () => {
    const router = await open('/pack/viejos-amigos');
    expect(router.getPathname()).toBe('/pack/viejos-amigos');
    expect(await screen.findByRole('header', { name: 'viejos-amigos' })).toBeOnTheScreen();
  });

  it('la partida ocupa la pantalla completa, sin pestañas, y vuelve al inicio al terminar', async () => {
    const router = await open('/pack/viejos-amigos');
    await fireEvent.press(await screen.findByRole('button', { name: 'Jugar' }));
    expect(router.getPathname()).toBe('/game');
    expect(screen.queryByRole('button', { name: /Mis historias/ })).toBeNull();

    await fireEvent.press(await screen.findByRole('button', { name: 'Empezar' }));
    expect(router.getPathname()).toBe('/game/play');
    await fireEvent.press(await screen.findByRole('button', { name: 'Terminar' }));
    expect(router.getPathname()).toBe('/game/summary');

    await fireEvent.press(await screen.findByRole('button', { name: 'Volver al inicio' }));
    expect(router.getPathname()).toBe('/');
    expect(await screen.findByRole('button', { name: /Mis historias/ })).toBeOnTheScreen();
  });

  it('un deep link deja Descubrir debajo: atrás vuelve al inicio, no cierra la app', async () => {
    const router = await open('/pack/primera-cita');
    expect(testRouter.canGoBack()).toBe(true);
    await testRouter.back();
    expect(router.getPathname()).toBe('/');
  });

  it('un enlace que no existe explica el error y lleva al inicio', async () => {
    const router = await open('/no-existe');
    expect(
      await screen.findByRole('header', { name: 'No encontramos esa página' }),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Ir al inicio' }));
    expect(router.getPathname()).toBe('/');
  });

  it('Android: atrás desde otra pestaña vuelve a Descubrir', async () => {
    const router = await open('/');
    await fireEvent.press(await screen.findByRole('button', { name: /Perfil/ }));
    expect(router.getPathname()).toBe('/profile');
    await testRouter.back();
    expect(router.getPathname()).toBe('/');
  });

  it('Android: atrás en plena partida pide confirmar; Salir cierra el flujo', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const router = await open('/pack/viejos-amigos');
    await fireEvent.press(await screen.findByRole('button', { name: 'Jugar' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Empezar' }));
    expect(router.getPathname()).toBe('/game/play');

    await act(() => testRouter.back());
    expect(router.getPathname()).toBe('/game/play');
    expect(alert).toHaveBeenCalledWith(
      '¿Salir de la partida?',
      expect.any(String),
      expect.any(Array),
    );

    const buttons = alert.mock.calls[0]?.[2] as AlertButton[];
    await act(async () => buttons.find((b) => b.text === 'Salir')?.onPress?.());
    expect(router.getPathname()).toBe('/pack/viejos-amigos');
  });

  it('Android: atrás en el resumen sale del flujo, no vuelve a la partida', async () => {
    const alert = jest.spyOn(Alert, 'alert');
    const router = await open('/pack/viejos-amigos');
    await fireEvent.press(await screen.findByRole('button', { name: 'Jugar' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Empezar' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Terminar' }));
    expect(router.getPathname()).toBe('/game/summary');
    expect(alert).not.toHaveBeenCalled();

    await testRouter.back();
    expect(router.getPathname()).toBe('/pack/viejos-amigos');
  });

  it('crear historia se abre como modal desde Mis historias', async () => {
    const router = await open('/stories');
    await fireEvent.press(await screen.findByRole('button', { name: 'Crear historia' }));
    expect(router.getPathname()).toBe('/story/new');
    await testRouter.back('/stories');
  });
});
