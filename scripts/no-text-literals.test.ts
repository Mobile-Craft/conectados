/**
 * @jest-environment node
 */
/// <reference types="node" />
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// ESLint corre como proceso aparte, con la configuración real del proyecto.
const ESLINT_BIN = path.join(process.cwd(), 'node_modules', '.bin', 'eslint');

function textErrors(code: string, filePath: string) {
  const run = spawnSync(ESLINT_BIN, ['--stdin', '--stdin-filename', filePath, '--format', 'json'], {
    input: code,
    encoding: 'utf8',
  });
  const [result] = JSON.parse(run.stdout) as { messages: { message: string; line: number }[] }[];
  return (result?.messages ?? [])
    .filter((m) => m.message.startsWith('Texto visible escrito a mano'))
    .map((m) => m.line);
}

const CODE = [
  "import { Alert, Text } from 'react-native';",
  "import { Button } from '@/shared/ui';",
  'export const A = () => <Text>Hola</Text>;',
  'export const B = () => <Button label="Jugar" />;',
  'export const C = () => <Button label={\'Jugar\'} accessibilityHint="Abre" />;',
  "export const D = () => Alert.alert('¿Salir?');",
  'export const E = ({ t }: { t: (k: string) => string }) => <Button label={t(\'game.start\')} variant="primary" />;',
  'export const F = () => <Text>{3}</Text>;',
].join('\n');

describe('regla: sin textos visibles escritos a mano', () => {
  it('marca texto JSX, props de texto y Alert.alert; deja pasar t() y props que no son texto', () => {
    expect(textErrors(CODE, 'src/screens/example/ui/Example.tsx')).toEqual([3, 4, 5, 5, 6]);
  }, 30000);

  it('no aplica al catálogo interno ni a las pruebas', () => {
    expect(textErrors(CODE, 'src/screens/dev-components/ui/Example.tsx')).toEqual([]);
    expect(textErrors(CODE, 'src/screens/example/ui/Example.test.tsx')).toEqual([]);
  }, 30000);
});
