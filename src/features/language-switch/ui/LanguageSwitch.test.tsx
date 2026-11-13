import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/shared/ui';
import { useLanguagePreferenceStore } from '../model/language-preference-store';
import { LanguageSwitch } from './LanguageSwitch';

describe('LanguageSwitch', () => {
  it('ofrece Automático, Español y English, y guarda la elección al instante', async () => {
    useLanguagePreferenceStore.setState({ preference: 'system' });
    await render(
      <ThemeProvider>
        <LanguageSwitch />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('Idioma')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Automático' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Español' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('radio', { name: 'English' }));
    expect(useLanguagePreferenceStore.getState().preference).toBe('en');
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
  });
});
