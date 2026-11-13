import { describe, expect, it } from '@jest/globals';
import { findI18nProblems, usedKeys } from './i18n-keys';

describe('findI18nProblems', () => {
  const es = { a: { title: 'Hola', items_one: '1 cosa', items_other: '{{count}} cosas' }, b: 'B' };
  const en = { a: { title: 'Hi', items_one: '1 thing', items_other: '{{count}} things' }, b: 'B' };
  const code = "t('a.title'); i18n.t(\"a.items\", { count }); t('b');";

  it('todo en orden: mismas claves, todas usadas y definidas (plurales incluidos)', () => {
    expect(findI18nProblems({ es, en }, [code])).toEqual({
      missing: [],
      undefinedKeys: [],
      orphans: [],
    });
  });

  it('detecta la clave que falta en un idioma', () => {
    const { a } = en;
    const { missing } = findI18nProblems({ es, en: { a } }, [code]);
    expect(missing).toEqual([{ language: 'en', key: 'b' }]);
  });

  it('detecta la clave que el código usa y no existe, y la que sobra', () => {
    const problems = findI18nProblems({ es, en }, ["t('a.title'); t('a.items'); t('c.nueva')"]);
    expect(problems.undefinedKeys).toEqual(['c.nueva']);
    expect(problems.orphans).toEqual(['b']);
  });

  it('una plantilla t(`a.${x}`) cuenta como uso de todo lo que empieza por "a."', () => {
    expect(usedKeys('t(`theme.${value}`)')).toEqual({ exact: [], prefixes: ['theme.'] });
    const { orphans } = findI18nProblems({ es, en }, ['t(`a.${x}`); t("b")']);
    expect(orphans).toEqual([]);
  });
});
