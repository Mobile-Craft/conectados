import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/shared/ui';
import { PackCard, questionCountText } from './PackCard';

describe('PackCard', () => {
  it('cuenta las preguntas en singular y plural', () => {
    expect(questionCountText(1)).toBe('1 pregunta');
    expect(questionCountText(24)).toBe('24 preguntas');
  });

  it('es un botón con el título y el resumen', async () => {
    const onPress = jest.fn();
    await render(
      <ThemeProvider preference="light">
        <PackCard
          title="Viejos amigos"
          questionCount={24}
          intensityText="Intensa · 4"
          onPress={onPress}
        />
      </ThemeProvider>,
    );
    const card = screen.getByRole('button', { name: 'Viejos amigos. 24 preguntas · Intensa · 4' });
    expect(card.props.accessibilityHint).toBe('Abre el set');
    await fireEvent.press(card);
    expect(onPress).toHaveBeenCalled();
  });
});
