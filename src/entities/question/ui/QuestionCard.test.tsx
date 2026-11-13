import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/shared/ui';
import { questionSize } from '../model/question-size';
import { QuestionCard } from './QuestionCard';

describe('questionSize', () => {
  it('la pregunta corta va más grande que la larga', () => {
    expect(questionSize('¿Café o té?')).toBe('questionL');
    expect(questionSize('¿Qué secreto nunca le contaste a nadie de esta mesa?')).toBe('questionM');
    expect(questionSize('x'.repeat(120))).toBe('questionS');
  });
});

describe('QuestionCard', () => {
  it('se lee de una vez: categoría, pregunta, intensidad con número y etiquetas', async () => {
    await render(
      <ThemeProvider preference="dark">
        <QuestionCard
          category="Confesión"
          text="¿Qué secreto nunca le contaste a nadie?"
          intensity={{ level: 4, label: 'Intensa' }}
          tags={['Todos']}
        />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole('text', {
        name: 'Confesión. ¿Qué secreto nunca le contaste a nadie?. Intensidad: Intensa · 4. Todos',
      }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Intensa · 4')).toBeOnTheScreen();
  });
});

describe('questionSize con palabras largas', () => {
  it('una palabra larga baja el tamaño aunque la pregunta sea corta', () => {
    expect(questionSize('¿Extraordinario?')).toBe('questionS');
    expect(questionSize('¿Recuerdos?')).toBe('questionM');
  });
});
