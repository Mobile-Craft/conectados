import { beforeEach, describe, expect, it } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LANGUAGE_PREFERENCE_STORAGE_KEY,
  useLanguagePreferenceStore,
} from './language-preference-store';

const store = useLanguagePreferenceStore;

describe('preferencia de idioma persistida', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    store.setState({ preference: 'system', syncedUserId: null, syncedLanguage: null });
  });

  it('por defecto sigue al teléfono y queda hidratada al arrancar', async () => {
    await store.persist.rehydrate();
    expect(store.getState()).toMatchObject({ preference: 'system', hydrated: true });
  });

  it('guarda la elección en el dispositivo', async () => {
    store.getState().setPreference('en');
    const saved = JSON.parse((await AsyncStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY)) ?? '{}');
    expect(saved.state).toEqual({ preference: 'en', syncedUserId: null, syncedLanguage: null });
    expect(saved.state).not.toHaveProperty('hydrated');
  });

  it('la recupera al reabrir la app', async () => {
    await AsyncStorage.setItem(
      LANGUAGE_PREFERENCE_STORAGE_KEY,
      JSON.stringify({
        state: { preference: 'en', syncedUserId: 'u1', syncedLanguage: 'en' },
        version: 1,
      }),
    );
    await store.persist.rehydrate();
    expect(store.getState()).toMatchObject({
      preference: 'en',
      syncedUserId: 'u1',
      hydrated: true,
    });
  });

  it('si lo guardado está corrupto, sigue con el idioma del teléfono', async () => {
    await AsyncStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, '{no es json');
    await store.persist.rehydrate();
    expect(store.getState()).toMatchObject({ preference: 'system', hydrated: true });
  });
});
