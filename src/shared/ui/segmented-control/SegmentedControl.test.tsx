import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '../theme';
import { themes } from '../theme/theme';
import { fitsInRow, SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'a', label: 'Uno' },
  { value: 'b', label: 'Dos' },
] as const;

async function renderControl(value: 'a' | 'b', onChange = jest.fn()) {
  await render(
    <ThemeProvider preference="light">
      <SegmentedControl
        accessibilityLabel="Elegir"
        options={options}
        value={value}
        onChange={onChange}
      />
    </ThemeProvider>,
  );
  return onChange;
}

describe('SegmentedControl', () => {
  it('se anuncia como grupo de opciones con la elegida marcada', async () => {
    await renderControl('b');
    // El grupo no es `accessible` (en iOS taparía sus opciones), pero lleva rol y nombre.
    expect(screen.getByLabelText('Elegir').props.accessibilityRole).toBe('radiogroup');
    expect(screen.getByRole('radio', { name: 'Uno' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Dos' })).toBeChecked();
  });

  it('avisa del valor al tocar un segmento', async () => {
    const onChange = await renderControl('a');
    await fireEvent.press(screen.getByRole('radio', { name: 'Dos' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('cada segmento mide al menos 44 pt y usa los tokens del tema', async () => {
    await renderControl('a');
    const style = StyleSheet.flatten(screen.getByRole('radio', { name: 'Uno' }).props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(screen.getByText('Dos')).toHaveStyle({ color: themes.light.components.chip.text });
  });
});

describe('fitsInRow', () => {
  const labels = ['Claro', 'Oscuro', 'Automático'];

  it('en fila con el texto normal de un teléfono', () => {
    expect(fitsInRow(labels, 390, 1)).toBe(true);
  });

  it('apila con el texto del sistema al máximo, para no partir palabras', () => {
    expect(fitsInRow(labels, 390, 3.1)).toBe(false);
  });
});
