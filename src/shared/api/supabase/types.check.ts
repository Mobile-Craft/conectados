import type { Tables, TablesInsert } from '../index';

// Prueba de compilación: los tipos generados reflejan el esquema.
const pack: Pick<Tables<'packs'>, 'slug' | 'min_age' | 'status'> = {
  slug: 'demo',
  min_age: 18,
  status: 'published',
};
// @ts-expect-error -- 'title' no es columna de packs (vive en pack_translations).
const invalid: TablesInsert<'packs'> = { slug: 'x', title: 'no existe' };

export const typesCheck = [pack, invalid];
