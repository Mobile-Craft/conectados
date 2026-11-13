/** Un set del catálogo con sus textos en un idioma. */
export interface PackSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  intensity: number;
  questionCount: number;
  coverUrl: string | null;
}
