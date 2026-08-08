#!/usr/bin/env bash
#
# Build the static site and publish it to the `gh-pages` branch, which GitHub
# Pages serves at https://patelgroup33.github.io/.
#
# Requirements: gh CLI authenticated (`gh auth status`).
# Usage: npm run deploy   (or: bash scripts/deploy.sh)
#
set -euo pipefail

REPO="patelgroup33/patelgroup33.github.io"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "▸ Building static export…"
npm run build

echo "▸ Publishing out/ to gh-pages…"
TMP="$(mktemp -d)"
cp -R out/. "$TMP/"
touch "$TMP/.nojekyll"          # ensure the _next/ folder is served verbatim
cd "$TMP"
git init -b gh-pages -q
git config credential.helper '!gh auth git-credential'
git remote add origin "https://github.com/$REPO.git"
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f origin gh-pages

echo "▸ Triggering Pages build…"
gh api -X POST "repos/$REPO/pages/builds" >/dev/null

rm -rf "$TMP"
echo "✓ Deployed. Live in ~30s at https://patelgroup33.github.io/"
