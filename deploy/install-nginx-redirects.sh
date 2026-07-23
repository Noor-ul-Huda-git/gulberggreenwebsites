#!/usr/bin/env bash
set -euo pipefail

# Installs nginx SEO redirect snippets and prints the exact lines to add to your site config.
#
# Usage:
#   ./deploy/install-nginx-redirects.sh              # print instructions only
#   sudo ./deploy/install-nginx-redirects.sh --install # copy snippets to /etc/nginx/snippets/

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SNIPPETS=(
  "nginx-legacy-301-rewrites.conf:gulberg-legacy-301.conf"
  "nginx-legacy-block-redirects.conf:gulberg-legacy-block-redirects.conf"
  "nginx-trailing-slash.conf:gulberg-trailing-slash.conf"
)

if [[ "${1:-}" == "--install" ]]; then
  if [[ "${EUID:-}" -ne 0 ]]; then
    echo "Re-run with sudo for --install" >&2
    exit 1
  fi
  install -d -m 755 /etc/nginx/snippets
  for pair in "${SNIPPETS[@]}"; do
    src_name="${pair%%:*}"
    dest_name="${pair##*:}"
    install -m 644 "${REPO_ROOT}/deploy/${src_name}" "/etc/nginx/snippets/${dest_name}"
    echo "Installed: /etc/nginx/snippets/${dest_name}"
  done
  sed "s|__REPO_ROOT__|${REPO_ROOT}|g" "${REPO_ROOT}/deploy/nginx-static-cache.conf" \
    > /etc/nginx/snippets/gulberg-static-cache.conf
  echo "Installed: /etc/nginx/snippets/gulberg-static-cache.conf"
  echo
  echo "Inside the server { } block for gulberggreens.com.pk, ABOVE 'location /', add (in this order):"
  echo "  include snippets/gulberg-legacy-301.conf;"
  echo "  include snippets/gulberg-legacy-block-redirects.conf;"
  echo "  include snippets/gulberg-trailing-slash.conf;"
  echo "  include /etc/nginx/snippets/gulberg-static-cache.conf;"
  echo
  echo "Then: nginx -t && systemctl reload nginx"
  exit 0
fi

echo "Repo:   $REPO_ROOT"
echo "Snippet files (source of truth for nginx 301s):"
for pair in "${SNIPPETS[@]}"; do
  src_name="${pair%%:*}"
  echo "  ${REPO_ROOT}/deploy/${src_name}"
done
echo
echo "Option A — include by absolute path (inside server { }, before location /):"
for pair in "${SNIPPETS[@]}"; do
  src_name="${pair%%:*}"
  echo "  include ${REPO_ROOT}/deploy/${src_name};"
done
echo
echo "Option B — copy to /etc/nginx and include by short path:"
echo "  sudo ./deploy/install-nginx-redirects.sh --install"
echo
echo "After editing nginx: sudo nginx -t && sudo systemctl reload nginx"
