#!/usr/bin/env bash
# Falla si encuentra cualquier carácter emoji / pictográfico Unicode en el código.
set -uo pipefail
PATTERN='[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE00}-\x{FE0F}\x{2300}-\x{23FF}\x{2190}-\x{21FF}]'
MATCHES=$(grep -rPno --include='*.ts' --include='*.tsx' --include='*.css' "$PATTERN" app components 2>/dev/null || true)
if [ -n "$MATCHES" ]; then
  echo "ERROR anti-emojis: caracteres pictograficos prohibidos encontrados."
  echo "Usa iconos Lucide, no caracteres. Coincidencias:"
  echo "$MATCHES"
  exit 1
fi
echo "OK anti-emojis: sin emojis en app/ ni components/."
