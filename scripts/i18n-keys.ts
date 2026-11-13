// Validación de claves de i18n (HU-2.1): compara los archivos de idioma entre sí y con el código.
// Función pura para poder probarla; la ejecuta scripts/check-i18n.mjs.

export type LocaleTree = { [key: string]: string | LocaleTree };

export interface I18nProblems {
  /** Una clave que un idioma tiene y otro no. */
  missing: { language: string; key: string }[];
  /** Una clave que el código usa y no está en ningún idioma. */
  undefinedKeys: string[];
  /** Una clave de los archivos que el código nunca usa. */
  orphans: string[];
}

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

export function flatten(tree: LocaleTree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [`${prefix}${key}`] : flatten(value, `${prefix}${key}.`),
  );
}

/** La clave que escribe el código: sin el sufijo de plural ("pack.questions_one" → "pack.questions"). */
function baseKey(key: string): string {
  return key.replace(PLURAL_SUFFIX, '');
}

/**
 * Las claves que usa el código: `t('a.b')`, `i18n.t("a.b")` y, con una plantilla como
 * `t(\`theme.${value}\`)`, todo lo que empieza por "theme." (el prefijo fijo).
 */
export function usedKeys(source: string): { exact: string[]; prefixes: string[] } {
  const exact = [...source.matchAll(/\bt\(\s*['"]([\w.]+)['"]/g)].map((m) => m[1] as string);
  const prefixes = [...source.matchAll(/\bt\(\s*`([\w.]+)\$\{/g)].map((m) => m[1] as string);
  return { exact, prefixes };
}

export function findI18nProblems(
  locales: Record<string, LocaleTree>,
  sources: string[],
): I18nProblems {
  const keysByLanguage = Object.entries(locales).map(([language, tree]) => ({
    language,
    keys: new Set(flatten(tree)),
  }));
  const allKeys = new Set(keysByLanguage.flatMap(({ keys }) => [...keys]));

  const missing = keysByLanguage.flatMap(({ language, keys }) =>
    [...allKeys].filter((key) => !keys.has(key)).map((key) => ({ language, key })),
  );

  const bases = new Set([...allKeys].map(baseKey));
  const used = sources.map(usedKeys);
  const exact = new Set(used.flatMap((u) => u.exact));
  const prefixes = used.flatMap((u) => u.prefixes);

  const undefinedKeys = [...exact].filter((key) => !bases.has(key)).sort();
  const orphans = [...bases]
    .filter((key) => !exact.has(key) && !prefixes.some((p) => key.startsWith(p)))
    .sort();

  return { missing, undefinedKeys, orphans };
}
