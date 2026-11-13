#!/usr/bin/env bash
# Ejecuta el CLI de Supabase con la cuenta de Conectados, sin tocar la sesión global del CLI.
# El token vive en el llavero de macOS (servicio supabase-access-token, cuenta conectados).
set -euo pipefail
if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  SUPABASE_ACCESS_TOKEN="$(security find-generic-password -a conectados -s supabase-access-token -w 2>/dev/null)" || {
    echo "Falta el token de Supabase en el llavero. Ver README (Supabase)." >&2
    exit 1
  }
fi
export SUPABASE_ACCESS_TOKEN
exec supabase "$@"
