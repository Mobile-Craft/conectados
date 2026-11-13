import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text, useColorScheme } from 'react-native';
import { createStyles, ThemeProvider, useTheme } from './ThemeProvider';
import { themes } from './theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'),
}));
const systemScheme = jest.mocked(useColorScheme);

const useStyles = createStyles((t) => ({ title: { color: t.colors.textPrimary } }));
const seen: object[] = [];

function Probe() {
  const theme = useTheme();
  const styles = useStyles();
  seen.push(styles);
  return <Text style={styles.title}>{theme.scheme}</Text>;
}

describe('ThemeProvider', () => {
  it('sigue al sistema cuando no se fija un tema', async () => {
    systemScheme.mockReturnValue('dark');
    await render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText('dark')).toHaveStyle({ color: themes.dark.colors.textPrimary });
  });

  it('cambia en caliente si el sistema cambia', async () => {
    systemScheme.mockReturnValue('light');
    const tree = () => (
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    const { rerender } = await render(tree());
    expect(screen.getByText('light')).toHaveStyle({ color: themes.light.colors.textPrimary });
    systemScheme.mockReturnValue('dark');
    await rerender(tree());
    expect(screen.getByText('dark')).toHaveStyle({ color: themes.dark.colors.textPrimary });
  });

  it('un tema fijado manda sobre el del sistema', async () => {
    systemScheme.mockReturnValue('dark');
    await render(
      <ThemeProvider scheme="light">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText('light')).toBeTruthy();
  });

  it('createStyles crea la hoja una vez por tema y la reutiliza', async () => {
    seen.length = 0;
    const tree = (scheme: 'light' | 'dark') => (
      <ThemeProvider scheme={scheme}>
        <Probe />
      </ThemeProvider>
    );
    const { rerender } = await render(tree('light'));
    await rerender(tree('dark'));
    await rerender(tree('light'));
    expect(seen[0]).toBe(seen[2]);
    expect(seen[0]).not.toBe(seen[1]);
  });

  it('useTheme fuera del proveedor falla con un mensaje claro', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(render(<Probe />)).rejects.toThrow('useTheme se usa dentro de <ThemeProvider>.');
  });
});
