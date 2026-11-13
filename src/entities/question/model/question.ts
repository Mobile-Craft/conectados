export type QuestionType = 'open' | 'choice' | 'vote' | 'dare';

/** Una pregunta de un set, ya escrita en un idioma. */
export interface Question {
  id: string;
  order: number;
  type: QuestionType;
  intensity: number;
  body: string;
}
