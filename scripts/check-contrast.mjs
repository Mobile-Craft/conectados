// Verifica el contraste AA (4.5:1) de todos los pares texto/fondo de ambos temas.
// Ejecuta la prueba de contraste con Jest, imprime el informe y sale con error si algún par falla.
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const out = path.join(tmpdir(), `contrast-${process.pid}.json`);
const jest = path.join(process.cwd(), 'node_modules', '.bin', 'jest');
const run = spawnSync(
  jest,
  ['src/shared/ui/theme/contrast.test.ts', '--json', `--outputFile=${out}`],
  { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' },
);

let report;
try {
  report = JSON.parse(readFileSync(out, 'utf8'));
} finally {
  rmSync(out, { force: true });
}

const rows = report.testResults
  .flatMap((file) => file.assertionResults)
  .filter((t) => t.ancestorTitles[0]?.startsWith('contraste AA'));

let failed = 0;
for (const scheme of ['light', 'dark']) {
  const mine = rows.filter((t) => t.ancestorTitles[0].endsWith(scheme));
  console.log(`\nTema ${scheme === 'light' ? 'claro' : 'oscuro'} (${mine.length} pares)`);
  for (const t of mine) {
    const ok = t.status === 'passed';
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'OK   ' : 'FALLA'}  ${t.title}`);
  }
}

if (rows.length === 0 || !report.success) {
  if (failed === 0) console.error(run.stderr);
  console.error(`\n${failed || 'Algún'} par(es) bajo 4.5:1 o la prueba falló.`);
  process.exit(1);
}
console.log(`\nTodos los pares (${rows.length}) cumplen 4.5:1.`);
