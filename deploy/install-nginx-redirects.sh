#!/usr/bin/env bash
set -euo pipefail

# Installs the legacy 301 rewrite snippet for nginx and prints the exact line to add to your site.
#
# Usage:
#   ./deploy/install-nginx-redirects.sh              # print instructions only
#   sudo ./deploy/install-nginx-redirects.sh --install # copy snippet to /etc/nginx/snippets/

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SNIPPET_SRC="${REPO_ROOT}/deploy/nginx-legacy-301-rewrites.conf"
TARGET="/etc/nginx/snippets/gulberg-legacy-301.conf"

if [[ ! -f "$SNIPPET_SRC" ]]; then
  echo "Missing: $SNIPPET_SRC" >&2
  exit 1
fi

if [[ "${1:-}" == "--install" ]]; then
  if [[ "${EUID:-}" -ne 0 ]]; then
    echo "Re-run with sudo for --install" >&2
    exit 1
  fi
  install -d -m 755 /etc/nginx/snippets
  install -m 644 "$SNIPPET_SRC" "$TARGET"
  echo "Installed: $TARGET"
  echo
  echo "Inside the server { } block for gulberggreens.com.pk, ABOVE 'location /', add:"
  echo "  include snippets/gulberg-legacy-301.conf;"
  echo
  echo "Then: nginx -t && systemctl reload nginx"
  exit 0
fi

echo "Repo:   $REPO_ROOT"
echo "Snippet file (source of truth for nginx 301s):"
echo "  $SNIPPET_SRC"
echo
echo "Option A — one line in your site config (inside server { }, before location /):"
echo "  include ${SNIPPET_SRC};"
echo
echo "Option B — copy to /etc/nginx and include by short path:"
echo "  sudo ./deploy/install-nginx-redirects.sh --install"
echo "  # then add inside server { }:  include snippets/gulberg-legacy-301.conf;"
echo
echo "After editing nginx: sudo nginx -t && sudo systemctl reload nginx"
