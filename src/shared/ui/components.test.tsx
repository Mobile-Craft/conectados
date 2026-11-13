import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Avatar, initials } from './avatar/Avatar';
import { Button } from './button/Button';
import { Card } from './card/Card';
import { Chip } from './chip/Chip';
import { EmptyState } from './empty-state/EmptyState';
import { Input } from './input/Input';
import { Screen } from './screen/Screen';
import { Skeleton } from './skeleton/Skeleton';
import { renderWithTheme } from './test/render';
import { themes } from './theme/theme';
import { Text } from './text/Text';
import { Toast } from './toast/Toast';

const minHeight = (node: { props: { style?: unknown } }) =>
  StyleSheet.flatten(node.props.style as never)?.minHeight ?? 0;

describe.each(['light', 'dark'] as const)('componentes base · tema %s', (scheme) => {
  it('Button se anuncia como botón, mide 44 pt y avisa al tocarlo', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Siguiente" onPress={onPress} />, scheme);
    const button = screen.getByRole('button', { name: 'Siguiente' });
    expect(minHeight(button)).toBeGreaterThanOrEqual(44);
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('Button deshabilitado o cargando no responde y lo anuncia', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <>
        <Button label="Off" disabled onPress={onPress} />
        <Button label="Cargando" loading variant="secondary" onPress={onPress} />
      </>,
      scheme,
    );
    expect(screen.getByRole('button', { name: 'Off' })).toBeDisabled();
    const busy = screen.getByRole('button', { name: 'Cargando' });
    expect(busy).toBeBusy();
    await fireEvent.press(busy);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('Chip interruptor marca su estado; el informativo se lee como texto', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <>
        <Chip label="Confesión" selected onPress={onPress} />
        <Chip label="Intensa · 4" highlighted />
      </>,
      scheme,
    );
    const toggle = screen.getByRole('togglebutton', { name: 'Confesión' });
    expect(toggle.props.accessibilityState).toMatchObject({ checked: true });
    // 36 pt de alto más 8 pt de margen táctil por cada lado.
    expect(minHeight(toggle) + 16).toBeGreaterThanOrEqual(44);
    expect(screen.getByLabelText('Intensa · 4').props.accessibilityRole).toBe('text');
    expect(screen.getByText('Confesión')).toHaveStyle({
      color: themes[scheme].components.chip.selectedText,
    });
  });

  it('Card con acción es un botón con su resumen', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Card onPress={onPress} accessibilityLabel="Viejos amigos">
        <></>
      </Card>,
      scheme,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Viejos amigos' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('Avatar se lee con el nombre y muestra las iniciales', async () => {
    await renderWithTheme(<Avatar name="Ana María López" />, scheme);
    expect(screen.getByRole('image', { name: 'Ana María López' })).toBeOnTheScreen();
    expect(screen.getByText('AL')).toBeOnTheScreen();
  });

  it('Input lleva etiqueta, mide 48 pt y anuncia el error', async () => {
    await renderWithTheme(<Input label="Nombre" error="Escribe un nombre" />, scheme);
    const field = screen.getByLabelText('Nombre');
    expect(minHeight(field)).toBeGreaterThanOrEqual(48);
    expect(field.props.accessibilityHint).toBe('Escribe un nombre');
  });

  it('EmptyState lleva un título como encabezado y su acción', async () => {
    const onAction = jest.fn();
    await renderWithTheme(
      <EmptyState title="Aún no hay sets" actionLabel="Crear set" onAction={onAction} />,
      scheme,
    );
    expect(screen.getByRole('header', { name: 'Aún no hay sets' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Crear set' }));
    expect(onAction).toHaveBeenCalled();
  });

  it('Skeleton y la aurora se ocultan al lector de pantalla', async () => {
    await renderWithTheme(
      <Screen>
        <Skeleton />
      </Screen>,
      scheme,
    );
    for (const id of ['skeleton', 'aurora']) {
      // Para el lector de pantalla no existen: solo se encuentran incluyendo lo oculto.
      expect(screen.queryByTestId(id)).toBeNull();
      expect(screen.getByTestId(id, { includeHiddenElements: true })).toBeTruthy();
    }
  });
});

describe('Toast', () => {
  it('se anuncia como alerta y se oculta solo al acabar su tiempo', async () => {
    jest.useFakeTimers();
    const onHide = jest.fn();
    await renderWithTheme(<Toast visible message="Set guardado" onHide={onHide} />);
    expect(screen.getByRole('alert')).toBeOnTheScreen();
    expect(screen.getByText('Set guardado')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(4000));
    expect(onHide).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('su acción mide 44 pt, se ejecuta y cierra el aviso', async () => {
    const onHide = jest.fn();
    const onAction = jest.fn();
    await renderWithTheme(
      <Toast
        visible
        message="Pregunta saltada"
        actionLabel="Deshacer"
        onAction={onAction}
        onHide={onHide}
      />,
    );
    const action = screen.getByRole('button', { name: 'Deshacer' });
    expect(minHeight(action)).toBeGreaterThanOrEqual(44);
    await fireEvent.press(action);
    expect(onAction).toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });

  it('no pinta nada si nunca se mostró', async () => {
    await renderWithTheme(<Toast visible={false} message="x" onHide={() => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('initials', () => {
  it('toma la primera y la última palabra', () => {
    expect(initials('Ana María López')).toBe('AL');
    expect(initials('  ana ')).toBe('A');
    expect(initials('')).toBe('?');
  });
});

describe('Text y el tamaño del sistema', () => {
  it('la tipografía de pantalla tiene tope y la de interfaz crece libre', async () => {
    await renderWithTheme(
      <>
        <Text variant="questionL">Pregunta</Text>
        <Text variant="body">Cuerpo</Text>
      </>,
    );
    expect(screen.getByText('Pregunta').props.maxFontSizeMultiplier).toBe(1.3);
    expect(screen.getByText('Cuerpo').props.maxFontSizeMultiplier).toBeUndefined();
  });
});
