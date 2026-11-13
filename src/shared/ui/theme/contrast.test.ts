import { describe, expect, it } from '@jest/globals';
import { contrastRatio, MIN_TEXT_CONTRAST, textPairs } from './contrast';
import { themes } from './theme';

describe('contrastRatio', () => {
  it('coincide con los valores de referencia de WCAG', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    // #767676 es el gris más claro que cumple AA sobre blanco.
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
    expect(contrastRatio('#FFFFFF', '#767676')).toBeCloseTo(4.54, 2);
  });

  it('rechaza formatos que no sean #RRGGBB', () => {
    expect(() => contrastRatio('red', '#FFFFFF')).toThrow('Color no válido');
  });
});

// Un caso por par y tema: `npm run check:contrast` los lista con su ratio.
describe.each(Object.values(themes))('contraste AA · tema $scheme', (theme) => {
  const pairs = textPairs(theme).map((p) => ({ ...p, ratio: contrastRatio(p.fg, p.bg) }));

  it.each(pairs.map((p) => [`${p.name} · ${p.ratio.toFixed(2)}:1`, p.ratio] as const))(
    '%s',
    (_name, ratio) => {
      expect(ratio).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    },
  );
});
