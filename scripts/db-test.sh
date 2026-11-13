#!/usr/bin/env bash
# Corre las pruebas de base de datos (pgTAP) de supabase/tests/database contra conectados-dev.
# Cada archivo abre una transacción y la deshace al final: no deja datos.
# En CI: SUPABASE_DB_URL y PGPASSWORD por variables de entorno.
set -euo pipefail
cd "$(dirname "$0")/.."

PSQL="$(command -v psql || echo /opt/homebrew/opt/libpq/bin/psql)"
if [[ ! -x "$PSQL" ]]; then
  echo "Falta psql. En macOS: brew install libpq" >&2
  exit 1
fi

DB_URL="${SUPABASE_DB_URL:-$(cat supabase/.temp/pooler-url 2>/dev/null || true)}"
if [[ -z "$DB_URL" ]]; then
  echo "Falta la URL de la base. Vincula el proyecto (README, Supabase) o define SUPABASE_DB_URL." >&2
  exit 1
fi

if [[ -z "${PGPASSWORD:-}" ]]; then
  PGPASSWORD="$(security find-generic-password -a conectados -s supabase-db-conectados-dev -w 2>/dev/null)" || {
    echo "Falta la contraseña de la base en el llavero (supabase-db-conectados-dev). Ver README." >&2
    exit 1
  }
fi
export PGPASSWORD

failed=0
total=0
for file in supabase/tests/database/*.test.sql; do
  echo "▶ $file"
  if ! output="$("$PSQL" "$DB_URL" -X -q -A -t -v ON_ERROR_STOP=1 -f "$file" 2>&1)"; then
    echo "$output"
    echo "  ✗ el archivo no terminó" >&2
    failed=$((failed + 1))
    continue
  fi
  # Solo las líneas de TAP: los set_config y demás devuelven filas que no interesan.
  tap="$(grep -E '^(ok|not ok|# |[0-9]+\.\.[0-9]+)' <<<"$output" || true)"
  echo "$tap" | grep -E '^(not ok|# )' || true
  passed=$(grep -c '^ok' <<<"$tap" || true)
  total=$((total + passed))
  if grep -qE '^(not ok|# Looks like)' <<<"$tap" || ! grep -qE '^1\.\.[0-9]+' <<<"$tap"; then
    echo "  ✗ $passed pasaron, hay fallos" >&2
    failed=$((failed + 1))
  else
    echo "  ✓ $passed pruebas"
  fi
done

if [[ $failed -gt 0 ]]; then
  echo "$failed archivo(s) de pruebas de base de datos fallaron." >&2
  exit 1
fi
echo "Pruebas de base de datos: $total pasaron."
