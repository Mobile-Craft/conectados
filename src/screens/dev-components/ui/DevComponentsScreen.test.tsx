import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/shared/ui';
import { DevComponentsScreen } from './DevComponentsScreen';

// El tema y la sesión arrastran el cliente de Supabase, que pide variables de entorno; el
// catálogo no lo usa.
jest.mock('@/shared/api', () => ({}));
jest.mock('@/entities/session', () => ({
  useAuth: () => ({ status: 'signedOut', session: null }),
}));

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe('DevComponentsScreen', () => {
  it('muestra cada familia de componentes, el tema y abre la hoja y el aviso', async () => {
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider preference="dark">
          <DevComponentsScreen />
        </ThemeProvider>
      </SafeAreaProvider>,
    );
    for (const section of ['Tema', 'Carta de pregunta', 'Tarjeta de set', 'Botones', 'Chips']) {
      expect(screen.getByRole('header', { name: section })).toBeOnTheScreen();
    }
    expect(screen.getByLabelText('Tema').props.accessibilityRole).toBe('radiogroup');

    await fireEvent.press(screen.getByRole('button', { name: 'Abrir hoja' }));
    expect(screen.getByRole('header', { name: 'Opciones de la partida' })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Mostrar aviso' }));
    expect(screen.getByRole('alert', { name: 'Pregunta saltada' })).toBeOnTheScreen();
    await act(async () => {});
  });
});
