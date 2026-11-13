import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import type { AuthChangeEvent, Session } from '@/shared/api';
import { AuthProvider, useAuth } from './AuthProvider';

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

const mockAuth = {
  listener: null as Listener | null,
  unsubscribe: jest.fn(),
  stopAutoRefresh: jest.fn(),
};

jest.mock('@/shared/api', () => ({
  syncAutoRefreshWithAppState: () => mockAuth.stopAutoRefresh,
  supabase: {
    auth: {
      onAuthStateChange: (listener: Listener) => {
        mockAuth.listener = listener;
        return { data: { subscription: { unsubscribe: mockAuth.unsubscribe } } };
      },
    },
  },
}));

const session = (isAnonymous: boolean) =>
  ({ access_token: 't', user: { id: 'u1', is_anonymous: isAnonymous } }) as unknown as Session;

async function emit(event: AuthChangeEvent, value: Session | null) {
  await act(async () => mockAuth.listener?.(event, value));
}

function Status() {
  const { status, session: current } = useAuth();
  return <Text testID="status">{`${status}:${current?.user.id ?? '-'}`}</Text>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    mockAuth.listener = null;
    mockAuth.unsubscribe.mockClear();
    mockAuth.stopAutoRefresh.mockClear();
  });

  it('empieza en loading y pasa a anonymous si no hay sesión guardada', async () => {
    await render(
      <AuthProvider>
        <Status />
      </AuthProvider>,
    );
    expect(screen.getByTestId('status')).toHaveTextContent('loading:-');
    await emit('INITIAL_SESSION', null);
    expect(screen.getByTestId('status')).toHaveTextContent('anonymous:-');
  });

  it('distingue invitado (sesión anónima) de cuenta y vuelve a anonymous al salir', async () => {
    await render(
      <AuthProvider>
        <Status />
      </AuthProvider>,
    );
    await emit('INITIAL_SESSION', session(true));
    expect(screen.getByTestId('status')).toHaveTextContent('guest:u1');
    await emit('USER_UPDATED', session(false));
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated:u1');
    await emit('TOKEN_REFRESHED', session(false));
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated:u1');
    await emit('SIGNED_OUT', null);
    expect(screen.getByTestId('status')).toHaveTextContent('anonymous:-');
  });

  it('cancela la suscripción y el refresco al desmontarse', async () => {
    const { unmount } = await render(
      <AuthProvider>
        <Status />
      </AuthProvider>,
    );
    await unmount();
    expect(mockAuth.unsubscribe).toHaveBeenCalledTimes(1);
    expect(mockAuth.stopAutoRefresh).toHaveBeenCalledTimes(1);
  });

  it('useAuth fuera del proveedor falla con un mensaje claro', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(render(<Status />)).rejects.toThrow('useAuth se usa dentro de <AuthProvider>.');
  });
});
