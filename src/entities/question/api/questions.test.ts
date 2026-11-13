import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fetchPackQuestions } from './questions';

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

describe('preguntas de un set', () => {
  beforeEach(() => {
    mockDb.calls = [];
  });

  it('pide las filas del idioma activo, en su orden', async () => {
    mockDb.response = {
      data: [{ id: 'q1', order_index: 0, type: 'open', intensity: 3, body: 'What scares you?' }],
      error: null,
    };
    const questions = await fetchPackQuestions('p1', 'en');
    expect(mockDb.calls).toContainEqual(['from', 'questions']);
    expect(mockDb.calls).toContainEqual(['eq', 'pack_id', 'p1']);
    expect(mockDb.calls).toContainEqual(['eq', 'locale', 'en']);
    expect(mockDb.calls).toContainEqual(['order', 'order_index', { ascending: true }]);
    expect(questions).toEqual([
      { id: 'q1', order: 0, type: 'open', intensity: 3, body: 'What scares you?' },
    ]);
  });

  it('un error de la base se propaga', async () => {
    mockDb.response = { data: null, error: new Error('sin red') };
    await expect(fetchPackQuestions('p1', 'es')).rejects.toThrow('sin red');
  });
});
