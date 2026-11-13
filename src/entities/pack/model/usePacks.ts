import { useLanguageQuery } from '@/shared/lib';
import { fetchCatalogPacks, fetchPackBySlug } from '../api/catalog';

/** El catálogo en el idioma activo; se vuelve a pedir al cambiar de idioma. */
export function useCatalogPacks() {
  return useLanguageQuery('packs', fetchCatalogPacks);
}

/** Un set en el idioma activo; se vuelve a pedir al cambiar de idioma. */
export function usePack(slug: string) {
  return useLanguageQuery(`pack:${slug}`, (language) => fetchPackBySlug(slug, language));
}
