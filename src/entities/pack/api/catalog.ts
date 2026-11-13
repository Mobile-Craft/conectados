import { supabase } from '@/shared/api';
import type { Language } from '@/shared/lib';
import type { PackSummary } from '../model/pack';

/**
 * Los textos del set van en `pack_translations`, uno por idioma. El `!inner` con el filtro por
 * `locale` deja fuera los sets que no tienen ese idioma: nunca se muestran en otro (D-06).
 */
const PACK_COLUMNS =
  'id, slug, intensity, question_count, cover_url, pack_translations!inner(title, description)';

interface PackRow {
  id: string;
  slug: string;
  intensity: number;
  question_count: number;
  cover_url: string | null;
  pack_translations: { title: string; description: string | null }[];
}

function toSummary(row: PackRow): PackSummary | null {
  const text = row.pack_translations[0];
  if (!text) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: text.title,
    description: text.description,
    intensity: row.intensity,
    questionCount: row.question_count,
    coverUrl: row.cover_url,
  };
}

const isSummary = (pack: PackSummary | null): pack is PackSummary => pack !== null;

/** Los sets publicados del catálogo, en el idioma pedido, del más reciente al más antiguo. */
export async function fetchCatalogPacks(language: Language): Promise<PackSummary[]> {
  const { data, error } = await supabase
    .from('packs')
    .select(PACK_COLUMNS)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('pack_translations.locale', language)
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data as PackRow[]).map(toSummary).filter(isSummary);
}

/** Un set por su slug, en el idioma pedido; null si no existe o no está en ese idioma. */
export async function fetchPackBySlug(
  slug: string,
  language: Language,
): Promise<PackSummary | null> {
  const { data, error } = await supabase
    .from('packs')
    .select(PACK_COLUMNS)
    .eq('slug', slug)
    .eq('pack_translations.locale', language)
    .maybeSingle();
  if (error) throw error;
  return data ? toSummary(data as PackRow) : null;
}
