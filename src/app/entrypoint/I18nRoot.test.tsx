import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { i18n, useTranslation } from '@/shared/lib';
import { Text, ThemeProvider } from '@/shared/ui';
import { I18nRoot } from './I18nRoot';

const mockDevice = { languageCode: 'es' };
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
});
