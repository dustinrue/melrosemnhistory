#!/usr/bin/env bash
# Build the site and upload it to Cloudflare Pages (Direct Upload). No git integration needed.
#
#   scripts/deploy.sh preview      noindex build -> https://preview.melrosemnhistory.pages.dev
#                                  (set PREVIEW_BRANCH=pr-12 to deploy to https://pr-12.melrosemnhistory.pages.dev instead)
#   scripts/deploy.sh production   LIVE: indexable build -> https://www.melrosemnhistory.com (and melrosemnhistory.pages.dev)
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
  preview)    BRANCH=${PREVIEW_BRANCH:-preview}; export PUBLIC_NOINDEX=true; export SITE_URL=https://$BRANCH.$PROJECT.pages.dev ;;
  production) BRANCH=main;    unset PUBLIC_NOINDEX;       export SITE_URL=${SITE_URL:-https://www.melrosemnhistory.com}
              # Self-hosted Umami analytics (public values, same as the old site). Production only, so staging
              # and preview visits are not counted. Override by exporting the variables before running.
              export PUBLIC_UMAMI_SRC=${PUBLIC_UMAMI_SRC:-https://umami.dustinrue.com/umami}
              export PUBLIC_UMAMI_ID=${PUBLIC_UMAMI_ID:-7bdeb488-e18a-4538-a73a-c84dc6eda37f} ;;
  *) echo "usage: $0 [preview|production]" >&2; exit 1 ;;
esac

cd "$(dirname "$0")/.."
npm run verify
npx --yes wrangler@4 pages deploy dist --project-name="$PROJECT" --branch="$BRANCH" \
  --commit-dirty=true --commit-message="$TARGET deploy $(git rev-parse --short HEAD 2>/dev/null || echo local)"
