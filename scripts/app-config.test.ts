import { describe, expect, it } from '@jest/globals';
import config from '../app.config';
import { themes } from '../src/shared/ui/theme/theme';

describe('app.config', () => {
  it('la splash usa el fondo de cada tema, para que no haya salto de color al quitarla', () => {
    const plugin = config.plugins?.find((p) => Array.isArray(p) && p[0] === 'expo-splash-screen');
    const options = (
      plugin as [string, { backgroundColor: string; dark: { backgroundColor: string } }]
    )[1];
    expect(options.backgroundColor).toBe(themes.light.colors.bg);
    expect(options.dark.backgroundColor).toBe(themes.dark.colors.bg);
  });

  it('la app sigue al sistema, para que la preferencia pueda fijar claro u oscuro', () => {
    expect(config.userInterfaceStyle).toBe('automatic');
  });
});
