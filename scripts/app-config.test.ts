import { describe, expect, it, jest } from '@jest/globals';
import type { ExpoConfig } from 'expo/config';
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

  it('abre los enlaces conectados:// (deep links)', () => {
    expect(config.scheme).toBe('conectados');
  });
});

describe('app.config · universal links', () => {
  function configWith(domain: string | undefined): ExpoConfig {
    const previous = process.env.APP_LINK_DOMAIN;
    if (domain === undefined) delete process.env.APP_LINK_DOMAIN;
    else process.env.APP_LINK_DOMAIN = domain;
    let loaded: ExpoConfig | undefined;
    jest.isolateModules(() => {
      loaded = (jest.requireActual('../app.config') as { default: ExpoConfig }).default;
    });
    if (previous === undefined) delete process.env.APP_LINK_DOMAIN;
    else process.env.APP_LINK_DOMAIN = previous;
    return loaded as ExpoConfig;
  }

  it('sin dominio no declara ninguno', () => {
    const c = configWith(undefined);
    expect(c.ios?.associatedDomains).toBeUndefined();
    expect(c.android?.intentFilters).toBeUndefined();
  });

  it('con dominio, iOS y Android abren https://<dominio>/pack/… en la app', () => {
    const c = configWith('conectados.example');
    expect(c.ios?.associatedDomains).toEqual(['applinks:conectados.example']);
    expect(c.android?.intentFilters?.[0]).toMatchObject({
      autoVerify: true,
      data: [{ scheme: 'https', host: 'conectados.example', pathPrefix: '/pack/' }],
    });
  });
});
