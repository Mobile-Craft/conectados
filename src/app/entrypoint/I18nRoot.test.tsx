import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, screen } from '@testing-library/react-native';
import { useLanguagePreferenceStore } from '@/features/language-switch';
import { i18n, useTranslation } from '@/shared/lib';
import { Text, ThemeProvider } from '@/shared/ui';
import { I18nRoot } from './I18nRoot';

const mockDevice = { languageCode: 'es' };
// La feature trae la sincronización con el perfil; aquí no hace falta Supabase.
jest.mock('@/shared/api', () => ({ supabase: {} }));
jest.mock('@/entities/session', () => ({
  useAuth: () => ({ status: 'anonymous', session: null }),
}));
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'es' }],
  useLocales: () => [{ languageCode: mockDevice.languageCode }],
}));

function Tab() {
  const { t } = useTranslation();
  return <Text>{t('nav.tabs.discover')}</Text>;
}

const app = () => (
  <I18nRoot>
    <ThemeProvider preference="light">
      <Tab />
    </ThemeProvider>
  </I18nRoot>
);

describe('I18nRoot', () => {
  afterEach(async () => {
    mockDevice.languageCode = 'es';
    useLanguagePreferenceStore.setState({ preference: 'system' });
    await i18n.changeLanguage('es');
  });

  it('sigue el idioma del teléfono cuando cambia, sin reiniciar', async () => {
    const view = await render(app());
    expect(screen.getByText('Descubrir')).toBeOnTheScreen();
    mockDevice.languageCode = 'en';
    await view.rerender(app());
    expect(await screen.findByText('Discover')).toBeOnTheScreen();
  });

  it('un idioma que la app no tiene cae al inglés', async () => {
    mockDevice.languageCode = 'fr';
    await render(app());
    expect(await screen.findByText('Discover')).toBeOnTheScreen();
  });

  it('el idioma elegido en Ajustes manda sobre el del teléfono, y cambia al momento', async () => {
    await render(app());
    expect(screen.getByText('Descubrir')).toBeOnTheScreen();
    await act(async () => useLanguagePreferenceStore.getState().setPreference('en'));
    expect(screen.getByText('Discover')).toBeOnTheScreen();
    mockDevice.languageCode = 'fr';
    await act(async () => useLanguagePreferenceStore.getState().setPreference('es'));
    expect(screen.getByText('Descubrir')).toBeOnTheScreen();
  });

  it('volver a Automático vuelve al idioma del teléfono', async () => {
    useLanguagePreferenceStore.setState({ preference: 'en' });
    await render(app());
    expect(screen.getByText('Discover')).toBeOnTheScreen();
    await act(async () => useLanguagePreferenceStore.getState().setPreference('system'));
    expect(screen.getByText('Descubrir')).toBeOnTheScreen();
  });
});
