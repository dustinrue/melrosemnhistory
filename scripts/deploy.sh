#!/usr/bin/env bash
# Build the site and upload it to Cloudflare Pages (Direct Upload). No git integration needed.
#
#   scripts/deploy.sh preview      noindex build -> https://preview.melrosemnhistory.pages.dev
#   scripts/deploy.sh production   indexable build -> the project's production deployment
#                                  (melrosemnhistory.pages.dev and any custom domain attached to the project)
#
# Auth: set CLOUDFLARE_API_TOKEN (or CF_MUSEUM) to an API token with "Cloudflare Pages: Edit" on the account.
# Never commit the token. Requires Node 22+ and network access; wrangler runs via npx (not a project dependency).
set -euo pipefail

TARGET=${1:-preview}
PROJECT=melrosemnhistory
ACCOUNT_ID=c94f892ddb2cabe404ae40dd35d380c9

export CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:-${CF_MUSEUM:-}}
[ -n "$CLOUDFLARE_API_TOKEN" ] || { echo "Set CLOUDFLARE_API_TOKEN (or CF_MUSEUM) first." >&2; exit 1; }
export CLOUDFLARE_ACCOUNT_ID=$ACCOUNT_ID CI=true WRANGLER_SEND_METRICS=false

case "$TARGET" in
  preview)    BRANCH=preview; export PUBLIC_NOINDEX=true; export SITE_URL=https://preview.$PROJECT.pages.dev ;;
  production) BRANCH=main;    unset PUBLIC_NOINDEX;       export SITE_URL=${SITE_URL:-https://www.melrosemnhistory.com} ;;
  *) echo "usage: $0 [preview|production]" >&2; exit 1 ;;
esac

cd "$(dirname "$0")/.."
npm run verify
npx --yes wrangler pages deploy dist --project-name="$PROJECT" --branch="$BRANCH" \
  --commit-dirty=true --commit-message="$TARGET deploy $(git rev-parse --short HEAD 2>/dev/null || echo local)"
