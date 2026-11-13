import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Language } from './detect';
import { i18n } from './i18n';
import { useLanguageQuery } from './useLanguageQuery';

const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

/** Promesas que la prueba resuelve a mano, para controlar el orden de las respuestas. */
function deferredFetch() {
  const pending: { language: Language; resolve: (value: string) => void }[] = [];
  const fetch = jest.fn(
    (language: Language) =>
      new Promise<string>((resolve) => {
        pending.push({ language, resolve });
      }),
  );
  const answer = (call: number, value: string) => {
    const request = pending[call];
    if (!request) throw new Error(`No hubo petición ${call}`);
    request.resolve(value);
  };
  return { fetch, answer };
}

describe('useLanguageQuery', () => {
  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('pide en el idioma activo y vuelve a pedir al cambiarlo', async () => {
    const { fetch, answer } = deferredFetch();
    const { result } = await renderHook(() => useLanguageQuery('packs', fetch), { wrapper });
    expect(result.current).toMatchObject({ loading: true, data: undefined, language: 'es' });
    expect(fetch).toHaveBeenLastCalledWith('es');

    await act(async () => answer(0, 'catálogo'));
    expect(result.current).toMatchObject({ loading: false, data: 'catálogo' });

    await act(async () => {
      await i18n.changeLanguage('en');
    });
    expect(fetch).toHaveBeenLastCalledWith('en');
    // Mientras llega el inglés no se muestra el español.
    expect(result.current).toMatchObject({ loading: true, data: undefined, language: 'en' });

    await act(async () => answer(1, 'catalog'));
    expect(result.current).toMatchObject({ loading: false, data: 'catalog' });
  });

  it('descarta la respuesta de un idioma que ya no toca', async () => {
    const { fetch, answer } = deferredFetch();
    const { result } = await renderHook(() => useLanguageQuery('packs', fetch), { wrapper });
    await act(async () => {
      await i18n.changeLanguage('en');
    });
    await act(async () => answer(1, 'catalog'));
    await act(async () => answer(0, 'catálogo')); // llega tarde
    expect(result.current.data).toBe('catalog');
  });

  it('devuelve el error sin romper', async () => {
    const fetch = jest.fn(async () => {
      throw new Error('sin red');
    });
    const { result } = await renderHook(() => useLanguageQuery('packs', fetch), { wrapper });
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.error?.message).toBe('sin red');
  });
});
