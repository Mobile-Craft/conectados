import { supabase } from '@/shared/api';
import type { Language } from '@/shared/lib';
import type { Question, QuestionType } from '../model/question';

/**
 * Las preguntas de un set en el idioma pedido, en su orden. Cada idioma tiene sus propias filas:
 * no se traducen al vuelo (D-06). Si el set no tiene ese idioma, la lista sale vacía.
 */
export async function fetchPackQuestions(packId: string, language: Language): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('id, order_index, type, intensity, body')
    .eq('pack_id', packId)
    .eq('locale', language)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    order: row.order_index,
    type: row.type as QuestionType,
    intensity: row.intensity,
    body: row.body,
  }));
}
