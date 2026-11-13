// Corre TODAS las comprobaciones del proyecto, una tras otra, y al final dice cuáles pasaron.
// Es lo que corre la CI (`npm run check`). Si hace falta una comprobación nueva, se añade a STEPS.
import { spawnSync } from 'node:child_process';

const STEPS = [
  { name: 'Formato (Prettier)', cmd: 'npx prettier --check .' },
  { name: 'Tipos (tsc)', cmd: 'npx tsc --noEmit' },
  { name: 'Lint (ESLint)', cmd: 'npx eslint . --max-warnings 0' },
  { name: 'Arquitectura (Steiger)', cmd: 'npx steiger ./src' },
  { name: 'Claves de i18n', cmd: 'npm run --silent check:i18n' },
  { name: 'Contraste AA', cmd: 'npm run --silent check:contrast' },
  { name: 'Pruebas (Jest)', cmd: 'npx jest' },
];

// `npm run check -- i18n pruebas` corre solo los pasos cuyo nombre contenga esas palabras.
const filters = process.argv.slice(2).map((f) => f.toLowerCase());
const steps = filters.length
  ? STEPS.filter((s) => filters.some((f) => s.name.toLowerCase().includes(f)))
  : STEPS;

const results = [];
for (const step of steps) {
  console.log(`\n▶ ${step.name}`);
  const started = Date.now();
  const run = spawnSync(step.cmd, { shell: true, stdio: 'inherit' });
  results.push({ ...step, ok: run.status === 0, seconds: (Date.now() - started) / 1000 });
}

console.log('\nResumen');
for (const r of results) {
  console.log(`  ${r.ok ? 'OK   ' : 'FALLA'}  ${r.name}  (${r.seconds.toFixed(1)} s)`);
}
const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} de ${results.length} comprobaciones fallaron.`);
  process.exit(1);
}
console.log(`\nLas ${results.length} comprobaciones pasaron.`);
