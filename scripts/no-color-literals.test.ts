/**
 * @jest-environment node
 */
/// <reference types="node" />
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// ESLint corre como proceso aparte, con la configuración real del proyecto.
const ESLINT_BIN = path.join(process.cwd(), 'node_modules', '.bin', 'eslint');

interface LintMessage {
  ruleId: string | null;
  line: number;
}

async function colorErrors(code: string, filePath = 'src/shared/ui/example/Example.tsx') {
  const run = spawnSync(ESLINT_BIN, ['--stdin', '--stdin-filename', filePath, '--format', 'json'], {
    input: code,
    encoding: 'utf8',
  });
  const [result] = JSON.parse(run.stdout) as { messages: LintMessage[] }[];
  return (result?.messages ?? [])
    .filter((m) => m.ruleId === 'no-restricted-syntax')
    .map((m) => m.line);
}

describe('regla: sin colores literales', () => {
  it('marca hex, rgb/hsl, plantillas, nombres en props de color y props JSX', async () => {
    const code = [
      "import { Text, TextInput } from 'react-native';",
      "export const a = '#fff';",
      "export const b = 'rgba(0, 0, 0, 0.5)';",
      'export const c = `1px solid #a0a0a0`;',
      "export const d = { color: 'red' };",
      'export const E = () => <TextInput placeholderTextColor="gray" />;',
      'export const F = () => <Text>ok</Text>;',
    ].join('\n');
    await expect(colorErrors(code)).resolves.toEqual([2, 3, 4, 5, 6]);
  }, 30000);

  it('no marca texto normal ni transparent', async () => {
    const code = [
      "export const t = 'Bienvenido #1 a la fiesta';",
      "export const l = { label: 'red' };",
      "export const s = { backgroundColor: 'transparent' };",
    ].join('\n');
    await expect(colorErrors(code)).resolves.toEqual([]);
  }, 30000);

  it('los primitivos son el único archivo exento', async () => {
    const code = "export const palette = { white: '#FFFFFF' };";
    await expect(colorErrors(code, 'src/shared/ui/theme/primitives.ts')).resolves.toEqual([]);
    await expect(colorErrors(code, 'src/shared/ui/theme/semantic.ts')).resolves.toEqual([1]);
  }, 30000);
});
