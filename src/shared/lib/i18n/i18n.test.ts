import { afterEach, describe, expect, it } from '@jest/globals';
import { detectLanguage, FALLBACK_LANGUAGE, isLanguagePreference, resolveLanguage } from './detect';
import { formatDate, formatNumber, formatRelative } from './format';
import { i18n } from './i18n';
import en from './locales/en.json';
import es from './locales/es.json';

function keys(tree: object, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('detectLanguage', () => {
  it('toma el primer idioma del teléfono que la app tiene', () => {
    expect(detectLanguage([{ languageCode: 'es' }])).toBe('es');
    expect(detectLanguage([{ languageCode: 'fr' }, { languageCode: 'en' }])).toBe('en');
    expect(detectLanguage([{ languageCode: 'ES' }])).toBe('es');
  });

  it('si el teléfono no está en ninguno, inglés de respaldo', () => {
    expect(FALLBACK_LANGUAGE).toBe('en');
    expect(detectLanguage([{ languageCode: 'fr' }, { languageCode: 'de' }])).toBe('en');
    expect(detectLanguage([])).toBe('en');
    expect(detectLanguage([{ languageCode: null }])).toBe('en');
  });
});

describe('resolveLanguage', () => {
  it('con "Automático" usa el idioma del teléfono', () => {
    expect(resolveLanguage('system', [{ languageCode: 'es' }])).toBe('es');
    expect(resolveLanguage('system', [{ languageCode: 'fr' }])).toBe('en');
  });

  it('un idioma elegido manda sobre el del teléfono', () => {
    expect(resolveLanguage('en', [{ languageCode: 'es' }])).toBe('en');
    expect(resolveLanguage('es', [{ languageCode: 'en' }])).toBe('es');
  });

  it('solo acepta preferencias conocidas', () => {
    expect(isLanguagePreference('system')).toBe(true);
    expect(isLanguagePreference('en')).toBe(true);
    expect(isLanguagePreference('fr')).toBe(false);
    expect(isLanguagePreference(null)).toBe(false);
  });
});

describe('i18n', () => {
  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('arranca en el idioma del teléfono, con inglés de respaldo', () => {
    expect(i18n.language).toBe('es');
    expect(i18n.options.fallbackLng).toEqual(['en']);
  });

  it('español e inglés tienen exactamente las mismas claves', () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });

  it('cambia de idioma en caliente', async () => {
    expect(i18n.t('nav.tabs.discover')).toBe('Descubrir');
    await i18n.changeLanguage('en');
    expect(i18n.t('nav.tabs.discover')).toBe('Discover');
  });

  it('plurales y números según el idioma', async () => {
    expect(i18n.t('pack.questions', { count: 1 })).toBe('1 pregunta');
    expect(i18n.t('pack.questions', { count: 12000 })).toBe('12.000 preguntas');
    await i18n.changeLanguage('en');
    expect(i18n.t('pack.questions', { count: 1 })).toBe('1 question');
    expect(i18n.t('pack.questions', { count: 12000 })).toBe('12,000 questions');
  });
});

describe('formato', () => {
  const date = new Date(2026, 10, 13, 18, 30);

  it('números con los separadores de cada idioma', () => {
    expect(formatNumber(12345.6, 'es')).toBe('12.345,6');
    expect(formatNumber(12345.6, 'en')).toBe('12,345.6');
    // En español el % va separado por un espacio duro, que Intl pone solo.
    expect(formatNumber(0.25, 'es', { style: 'percent' })).toMatch(/^25\s%$/);
  });

  it('fechas como se escriben en cada idioma', () => {
    expect(formatDate(date, 'es', { dateStyle: 'long' })).toBe('13 de noviembre de 2026');
    expect(formatDate(date, 'en', { dateStyle: 'long' })).toBe('November 13, 2026');
  });

  it('tiempo relativo en la unidad que tiene sentido', () => {
    const now = date.getTime();
    expect(formatRelative(now - 3 * 86_400_000, 'es', now)).toBe('hace 3 días');
    expect(formatRelative(now - 3 * 86_400_000, 'en', now)).toBe('3 days ago');
    expect(formatRelative(now - 86_400_000, 'es', now)).toBe('ayer');
    expect(formatRelative(now + 2 * 3_600_000, 'en', now)).toBe('in 2 hours');
  });
});
