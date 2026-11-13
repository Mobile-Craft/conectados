import { beforeEach, describe, expect, it } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_PREFERENCE_STORAGE_KEY, useThemePreferenceStore } from './theme-preference-store';

const store = useThemePreferenceStore;

describe('preferencia de tema persistida', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    store.setState({ preference: 'system', syncedUserId: null, syncedPreference: null });
  });

  it('por defecto sigue al sistema y queda hidratada al arrancar', async () => {
    await store.persist.rehydrate();
    expect(store.getState().preference).toBe('system');
    expect(store.getState().hydrated).toBe(true);
  });

  it('guarda la elección en el dispositivo', async () => {
    store.getState().setPreference('dark');
    const saved = JSON.parse((await AsyncStorage.getItem(THEME_PREFERENCE_STORAGE_KEY)) ?? '{}');
    expect(saved.state).toEqual({ preference: 'dark', syncedUserId: null, syncedPreference: null });
    expect(saved.state).not.toHaveProperty('hydrated');
  });

  it('la recupera entre sesiones (al reabrir la app)', async () => {
    await AsyncStorage.setItem(
      THEME_PREFERENCE_STORAGE_KEY,
      JSON.stringify({
        state: { preference: 'light', syncedUserId: 'u1', syncedPreference: 'light' },
        version: 1,
      }),
    );
    await store.persist.rehydrate();
    expect(store.getState()).toMatchObject({
      preference: 'light',
      syncedUserId: 'u1',
      hydrated: true,
    });
  });

  it('si lo guardado está corrupto, sigue con el valor por defecto', async () => {
    await AsyncStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, '{no es json');
    await store.persist.rehydrate();
    expect(store.getState().preference).toBe('system');
    expect(store.getState().hydrated).toBe(true);
  });
});
