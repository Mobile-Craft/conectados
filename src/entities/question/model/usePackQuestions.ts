import { useLanguageQuery } from '@/shared/lib';
import { fetchPackQuestions } from '../api/questions';

/** Las preguntas de un set en el idioma activo; se vuelven a pedir al cambiar de idioma. */
export function usePackQuestions(packId: string) {
  return useLanguageQuery(`questions:${packId}`, (language) =>
    fetchPackQuestions(packId, language),
  );
}
