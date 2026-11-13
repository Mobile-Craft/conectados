import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/shared/ui';
import { useThemePreferenceStore } from '../model/theme-preference-store';
import { ThemeSwitch } from './ThemeSwitch';

describe('ThemeSwitch', () => {
  it('muestra las tres opciones y cambia la preferencia al instante', async () => {
    useThemePreferenceStore.setState({ preference: 'system' });
    await render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>,
    );
    expect(screen.getByRole('radio', { name: 'Automático' })).toBeChecked();
    await fireEvent.press(screen.getByRole('radio', { name: 'Oscuro' }));
    expect(useThemePreferenceStore.getState().preference).toBe('dark');
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeTruthy();
  });
});
