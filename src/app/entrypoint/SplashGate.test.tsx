import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from 'react-native';
import type { SessionStatus } from '@/entities/session';
import { SplashGate } from './SplashGate';

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(async () => true),
  setOptions: jest.fn(),
  hide: jest.fn(),
}));

const mockState: { status: SessionStatus } = { status: 'loading' };
jest.mock('@/entities/session', () => ({
  useAuth: () => ({ status: mockState.status, session: null }),
}));

const splash = jest.mocked(SplashScreen);

const app = () => (
  <SplashGate>
    <Text>Inicio</Text>
  </SplashGate>
);

describe('SplashGate', () => {
  beforeEach(() => {
    splash.hide.mockClear();
    mockState.status = 'loading';
  });

  it('retiene la splash nativa desde que carga el módulo', () => {
    expect(splash.preventAutoHideAsync).toHaveBeenCalledTimes(1);
  });

  it('mientras carga no pinta nada ni quita la splash', async () => {
    await render(app());
    expect(screen.queryByText('Inicio')).toBeNull();
    expect(splash.hide).not.toHaveBeenCalled();
  });

  it.each<SessionStatus>(['anonymous', 'guest', 'authenticated'])(
    'con la sesión resuelta (%s) pinta la app y quita la splash una vez',
    async (status) => {
      const { rerender } = await render(app());
      mockState.status = status;
      await rerender(app());
      expect(screen.getByText('Inicio')).toBeTruthy();
      await rerender(app());
      expect(splash.hide).toHaveBeenCalledTimes(1);
    },
  );
});
