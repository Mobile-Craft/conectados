import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import type { ThemePreference } from '@/shared/ui';
import { fetchProfileTheme, saveProfileTheme } from '../api/profile-theme';
import { useThemePreferenceStore } from './theme-preference-store';
import { useThemeProfileSync } from './useThemeProfileSync';

const mockAuth: { userId: string | null } = { userId: null };
jest.mock('@/entities/session', () => ({
  useAuth: () => ({
    status: mockAuth.userId ? 'authenticated' : 'anonymous',
    session: mockAuth.userId ? { user: { id: mockAuth.userId } } : null,
  }),
}));
jest.mock('../api/profile-theme', () => ({
  fetchProfileTheme: jest.fn(),
  saveProfileTheme: jest.fn(async () => true),
}));

const fetchTheme = jest.mocked(fetchProfileTheme);
const saveTheme = jest.mocked(saveProfileTheme);
const store = useThemePreferenceStore;

function Sync() {
  useThemeProfileSync();
  return null;
}

async function mount() {
  await render(<Sync />);
  await act(async () => {}); // deja terminar las promesas de la sincronización
}

function setLocal(
  preference: ThemePreference,
  synced: { id: string; pref: ThemePreference } | null,
) {
  store.setState({
    hydrated: true,
    preference,
    syncedUserId: synced?.id ?? null,
    syncedPreference: synced?.pref ?? null,
  });
}

describe('sincronización del tema con el perfil', () => {
  beforeEach(() => {
    fetchTheme.mockReset();
    saveTheme.mockReset();
    saveTheme.mockResolvedValue(true);
    mockAuth.userId = null;
  });

  it('sin sesión no toca el perfil', async () => {
    setLocal('dark', null);
    await mount();
    expect(fetchTheme).not.toHaveBeenCalled();
    expect(saveTheme).not.toHaveBeenCalled();
  });

  it('cuenta nueva con elección en el perfil: la aplica en el dispositivo', async () => {
    mockAuth.userId = 'u1';
    setLocal('system', null);
    fetchTheme.mockResolvedValue('dark');
    await mount();
    expect(store.getState()).toMatchObject({
      preference: 'dark',
      syncedUserId: 'u1',
      syncedPreference: 'dark',
    });
    expect(saveTheme).not.toHaveBeenCalled();
  });

  it('cuenta nueva con el perfil en "system": sube la elección local', async () => {
    mockAuth.userId = 'u1';
    setLocal('light', null);
    fetchTheme.mockResolvedValue('system');
    await mount();
    expect(saveTheme).toHaveBeenCalledWith('u1', 'light');
    expect(store.getState()).toMatchObject({
      preference: 'light',
      syncedUserId: 'u1',
      syncedPreference: 'light',
    });
  });

  it('cuenta ya sincronizada: sube cada cambio local y no repite lo ya guardado', async () => {
    mockAuth.userId = 'u1';
    setLocal('light', { id: 'u1', pref: 'light' });
    await mount();
    expect(saveTheme).not.toHaveBeenCalled();
    await act(async () => store.getState().setPreference('dark'));
    expect(fetchTheme).not.toHaveBeenCalled();
    expect(saveTheme).toHaveBeenCalledTimes(1);
    expect(saveTheme).toHaveBeenCalledWith('u1', 'dark');
    expect(store.getState().syncedPreference).toBe('dark');
  });

  it('sin red: no marca nada como sincronizado y reintenta en el siguiente cambio', async () => {
    mockAuth.userId = 'u1';
    setLocal('light', { id: 'u1', pref: 'light' });
    saveTheme.mockResolvedValue(false);
    await mount();
    await act(async () => store.getState().setPreference('dark'));
    expect(store.getState().syncedPreference).toBe('light');
    saveTheme.mockResolvedValue(true);
    await act(async () => store.getState().setPreference('system'));
    expect(store.getState().syncedPreference).toBe('system');
  });

  it('si no puede leer el perfil, no cambia el tema local', async () => {
    mockAuth.userId = 'u1';
    setLocal('dark', null);
    fetchTheme.mockResolvedValue(null);
    await mount();
    expect(store.getState()).toMatchObject({ preference: 'dark', syncedUserId: null });
    expect(saveTheme).not.toHaveBeenCalled();
  });
});
