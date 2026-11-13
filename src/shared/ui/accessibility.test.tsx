import { describe, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Avatar } from './avatar/Avatar';
import { Button } from './button/Button';
import { Card } from './card/Card';
import { Chip } from './chip/Chip';
import { EmptyState } from './empty-state/EmptyState';
import { Input } from './input/Input';
import { SegmentedControl } from './segmented-control/SegmentedControl';
import { Sheet } from './sheet/Sheet';
import { renderWithTheme } from './test/render';
import { Text } from './text/Text';
import { Toast } from './toast/Toast';

// Auditoría de accesibilidad de la librería (HU-1.3): todo lo que se toca tiene rol, nombre y
// un área táctil de al menos 44 pt. La pasada con VoiceOver y TalkBack en un teléfono la
// completa a mano.

const noop = () => {};
const INTERACTIVE = ['button', 'togglebutton', 'radio'] as const;

function touchHeight(node: { props: { style?: unknown; hitSlop?: unknown } }) {
  const style = StyleSheet.flatten(node.props.style as never) ?? {};
  const slop = typeof node.props.hitSlop === 'number' ? node.props.hitSlop * 2 : 0;
  return Math.max(Number(style.minHeight ?? 0), Number(style.height ?? 0)) + slop;
}

function Library() {
  return (
    <>
      <Text variant="title1" accessibilityRole="header">
        Catálogo
      </Text>
      <Button label="Principal" onPress={noop} />
      <Button label="Secundario" variant="secondary" onPress={noop} />
      <Button label="Fantasma" variant="ghost" onPress={noop} />
      <Button label="Peligro" variant="danger" onPress={noop} />
      <Chip label="Elegible" onPress={noop} />
      <Chip label="Informativo" />
      <Card onPress={noop} accessibilityLabel="Tarjeta con acción">
        <Text>Contenido</Text>
      </Card>
      <Card accessibilityLabel="Tarjeta informativa">
        <Text>Contenido</Text>
      </Card>
      <Avatar name="Ana López" />
      <Input label="Nombre" />
      <SegmentedControl
        accessibilityLabel="Tema"
        options={[
          { value: 'a', label: 'Claro' },
          { value: 'b', label: 'Oscuro' },
        ]}
        value="a"
        onChange={noop}
      />
      <EmptyState title="Vacío" actionLabel="Crear" onAction={noop} />
      <Toast visible message="Guardado" actionLabel="Deshacer" onAction={noop} onHide={noop} />
    </>
  );
}

describe.each(['light', 'dark'] as const)('accesibilidad · tema %s', (scheme) => {
  it('todo lo que se toca tiene nombre y mide al menos 44 pt', async () => {
    await renderWithTheme(<Library />, scheme);
    const touchables = INTERACTIVE.flatMap((role) => screen.queryAllByRole(role));
    // 4 botones, chip, tarjeta, 2 opciones del segmentado, acción del vacío y del aviso.
    expect(touchables).toHaveLength(10);
    for (const node of touchables) {
      expect(node.props.accessibilityLabel).toEqual(expect.any(String));
      expect(node.props.accessibilityLabel.length).toBeGreaterThan(0);
      expect(touchHeight(node)).toBeGreaterThanOrEqual(44);
    }
  });

  it('lo informativo se lee con nombre: chip, tarjeta, avatar, encabezados y aviso', async () => {
    await renderWithTheme(<Library />, scheme);
    expect(screen.getByLabelText('Informativo').props.accessibilityRole).toBe('text');
    expect(screen.getByLabelText('Tarjeta informativa').props.accessibilityRole).toBe('text');
    expect(screen.getByRole('image', { name: 'Ana López' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Catálogo' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Vacío' })).toBeOnTheScreen();
    expect(screen.getByRole('alert', { name: 'Guardado' })).toBeOnTheScreen();
  });

  it('la hoja tiene un solo "Cerrar", su título es encabezado y atrapa el foco', async () => {
    await renderWithTheme(
      <Sheet visible title="Opciones" onClose={noop}>
        <Text>Dentro</Text>
      </Sheet>,
      scheme,
    );
    expect(screen.getAllByRole('button', { name: 'Cerrar' })).toHaveLength(1);
    const header = screen.getByRole('header', { name: 'Opciones' });
    let node = header.parent;
    while (node && !node.props.accessibilityViewIsModal) node = node.parent;
    expect(node?.props.accessibilityViewIsModal).toBe(true);
  });
});
