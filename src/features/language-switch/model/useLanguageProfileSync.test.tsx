import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import { i18n, I18nextProvider, type Language } from '@/shared/lib';
import { saveProfileLocale } from '../api/profile-locale';
import { useLanguagePreferenceStore } from './language-preference-store';
import { useLanguageProfileSync } from './useLanguageProfileSync';

const mockAuth: { userId: string | null } = { userId: null };
jest.mock('@/entities/session', () => ({
  useAuth: () => ({
    status: mockAuth.userId ? 'authenticated' : 'anonymous',
    session: mockAuth.userId ? { user: { id: mockAuth.userId } } : null,
  }),
}));
jest.mock('../api/profile-locale', () => ({ saveProfileLocale: jest.fn(async () => true) }));

const save = jest.mocked(saveProfileLocale);
const store = useLanguagePreferenceStore;

function Sync() {
  useLanguageProfileSync();
  return null;
}

async function mount() {
  await render(
    <I18nextProvider i18n={i18n}>
      <Sync />
    </I18nextProvider>,
  );
  await act(async () => {}); // deja terminar la promesa del guardado
}

function setSynced(synced: { id: string; language: Language } | null) {
  store.setState({
    hydrated: true,
    syncedUserId: synced?.id ?? null,
    syncedLanguage: synced?.language ?? null,
  });
}

describe('idioma guardado en profiles.locale', () => {
  beforeEach(async () => {
    save.mockReset();
    save.mockResolvedValue(true);
    mockAuth.userId = null;
    await i18n.changeLanguage('es');
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('sin sesión no toca el perfil', async () => {
    setSynced(null);
    await mount();
    expect(save).not.toHaveBeenCalled();
  });

  it('cuenta nueva en este dispositivo: sube el idioma activo', async () => {
    mockAuth.userId = 'u1';
    setSynced(null);
    await mount();
    expect(save).toHaveBeenCalledWith('u1', 'es');
    expect(store.getState()).toMatchObject({ syncedUserId: 'u1', syncedLanguage: 'es' });
  });

  it('al cambiar de idioma lo sube una vez, y no repite lo ya guardado', async () => {
    mockAuth.userId = 'u1';
    setSynced({ id: 'u1', language: 'es' });
    await mount();
    expect(save).not.toHaveBeenCalled();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('u1', 'en');
    expect(store.getState().syncedLanguage).toBe('en');
  });

  it('sin red: no lo marca como guardado y reintenta en el siguiente cambio', async () => {
    mockAuth.userId = 'u1';
    setSynced({ id: 'u1', language: 'es' });
    save.mockResolvedValue(false);
    await mount();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
    expect(store.getState().syncedLanguage).toBe('es');
    save.mockResolvedValue(true);
    await act(async () => {
      await i18n.changeLanguage('es');
      await i18n.changeLanguage('en');
    });
    expect(store.getState().syncedLanguage).toBe('en');
  });

  it('antes de leer lo guardado no sube nada', async () => {
    mockAuth.userId = 'u1';
    store.setState({ hydrated: false, syncedUserId: null, syncedLanguage: null });
    await mount();
    expect(save).not.toHaveBeenCalled();
  });
});
