import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fetchCatalogPacks, fetchPackBySlug } from './catalog';

const mockDb = {
  response: { data: null as unknown, error: null as unknown },
  calls: [] as unknown[][],
};
jest.mock('@/shared/api', () => {
  const builder: Record<string, unknown> = {};
  for (const method of ['select', 'eq', 'order']) {
    builder[method] = (...args: unknown[]) => {
      mockDb.calls.push([method, ...args]);
      return builder;
    };
  }
  builder.maybeSingle = () => Promise.resolve(mockDb.response);
  builder.then = (ok: (v: unknown) => unknown, ko?: (e: unknown) => unknown) =>
    Promise.resolve(mockDb.response).then(ok, ko);
  return {
    supabase: {
      from: (table: string) => {
        mockDb.calls.push(['from', table]);
        return builder;
      },
    },
  };
});

const row = {
  id: 'p1',
  slug: 'primera-cita',
  intensity: 2,
  question_count: 24,
  cover_url: null,
  pack_translations: [{ title: 'First date', description: 'Break the ice' }],
};

describe('consultas del catálogo', () => {
  beforeEach(() => {
    mockDb.calls = [];
    mockDb.response = { data: [row], error: null };
  });

  it('el catálogo pide los textos del idioma activo y solo sets publicados y públicos', async () => {
    const packs = await fetchCatalogPacks('en');
    expect(mockDb.calls).toContainEqual(['from', 'packs']);
    expect(mockDb.calls).toContainEqual(['eq', 'pack_translations.locale', 'en']);
    expect(mockDb.calls).toContainEqual(['eq', 'status', 'published']);
    expect(mockDb.calls).toContainEqual(['eq', 'visibility', 'public']);
    const select = mockDb.calls.find((c) => c[0] === 'select')?.[1];
    expect(select).toContain('pack_translations!inner(');
    expect(packs).toEqual([
      {
        id: 'p1',
        slug: 'primera-cita',
        title: 'First date',
        description: 'Break the ice',
        intensity: 2,
        questionCount: 24,
        coverUrl: null,
      },
    ]);
  });

  it('un set sin ese idioma no se cuela con los textos de otro', async () => {
    mockDb.response = { data: [{ ...row, pack_translations: [] }], error: null };
    expect(await fetchCatalogPacks('es')).toEqual([]);
  });

  it('un set por slug también va en el idioma pedido', async () => {
    mockDb.response = { data: row, error: null };
    const pack = await fetchPackBySlug('primera-cita', 'es');
    expect(mockDb.calls).toContainEqual(['eq', 'slug', 'primera-cita']);
    expect(mockDb.calls).toContainEqual(['eq', 'pack_translations.locale', 'es']);
    expect(pack?.title).toBe('First date');
  });

  it('si no está en ese idioma, no hay set', async () => {
    mockDb.response = { data: null, error: null };
    expect(await fetchPackBySlug('primera-cita', 'es')).toBeNull();
  });

  it('un error de la base se propaga para mostrarlo', async () => {
    mockDb.response = { data: null, error: new Error('sin red') };
    await expect(fetchCatalogPacks('es')).rejects.toThrow('sin red');
  });
});
