#!/usr/bin/env bash
# Rebuild Vite frontend + prerender SEO HTML (property/news meta + schema).
# Called manually or automatically ~90s after admin saves a property/news post.
#
# Usage: ./deploy/rebuild-frontend-seo.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="${REPO_ROOT}/frontend"
LOCK_FILE="/tmp/gulberg-seo-rebuild.lock"
LOG_FILE="${REPO_ROOT}/logs/seo-rebuild.log"

mkdir -p "${REPO_ROOT}/logs"

exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") rebuild already running — skip" >> "${LOG_FILE}"
  exit 0
fi

{
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") starting SEO rebuild"
  cd "${FRONTEND}"
  npm run build
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") SEO rebuild complete"
} >> "${LOG_FILE}" 2>&1
