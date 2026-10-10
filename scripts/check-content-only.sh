#!/usr/bin/env bash
# Fails if a change touches the locked "design zone" (see AGENTS.md section 2).
# usage: scripts/check-content-only.sh <base-ref>     e.g. origin/main
# CI runs this on pull requests labelled "content". Content edits belong in src/data, src/content,
# src/assets/photos and public/ only.
set -euo pipefail
BASE=${1:?base ref, e.g. origin/main}
DESIGN='^(src/(layouts|components|styles|pages|lib|scripts)/|src/content\.config\.ts$|astro\.config\.mjs$|package(-lock)?\.json$|scripts/|\.github/|tools/|tsconfig\.json$)'
CHANGED=$(git diff --name-only "$BASE"...HEAD)
BAD=$(printf '%s\n' "$CHANGED" | grep -E "$DESIGN" || true)
if [ -n "$BAD" ]; then
  echo "This change is labelled 'content' but touches design/infrastructure files:" >&2
  printf '  %s\n' $BAD >&2
  echo "Remove those changes, or drop the 'content' label and ask the owner to review." >&2
  exit 1
fi
echo "ok: only content files changed ($(printf '%s\n' "$CHANGED" | grep -c . || true) files)"
