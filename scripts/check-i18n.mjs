// Comprueba las claves de i18n: que es.json y en.json tengan las mismas, que el código no use
// ninguna que no exista y que no sobre ninguna. Sale con error si algo falla (se usa en CI).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { findI18nProblems } from './i18n-keys.ts';

const root = process.cwd();
const localesDir = path.join(root, 'src/shared/lib/i18n/locales');
const locales = Object.fromEntries(
  readdirSync(localesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [
      path.basename(f, '.json'),
      JSON.parse(readFileSync(path.join(localesDir, f), 'utf8')),
    ]),
);

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === 'node_modules' ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) && !name.endsWith('.d.ts')
      ? [full]
      : [];
  });
}
const sources = ['src', 'app']
  .flatMap((d) => sourceFiles(path.join(root, d)))
  .map((f) => readFileSync(f, 'utf8'));

const { missing, undefinedKeys, orphans } = findI18nProblems(locales, sources);
const total = missing.length + undefinedKeys.length + orphans.length;

for (const { language, key } of missing) console.error(`  Falta en ${language}.json: ${key}`);
for (const key of undefinedKeys) console.error(`  El código usa una clave que no existe: ${key}`);
for (const key of orphans) console.error(`  Clave huérfana (nadie la usa): ${key}`);

if (total > 0) {
  console.error(`\ni18n: ${total} problema(s).`);
  process.exit(1);
}
console.log(
  `i18n: ${Object.keys(locales).join(', ')} con las mismas claves; todas usadas y definidas.`,
);
