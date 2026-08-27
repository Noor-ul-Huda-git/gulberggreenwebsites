#!/usr/bin/env bash
# Enable UFW with web + SSH only; open MySQL (3306) for whitelisted dev IPs.
# Run once on the server: sudo ./deploy/mysql/enable-ufw.sh
#
# Add dev IPs first (one per line) in deploy/mysql/whitelist-ips.txt, or run:
#   sudo ./deploy/mysql/add-dev-ip.sh <PUBLIC_IP>

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WHITELIST_FILE="${REPO_ROOT}/deploy/mysql/whitelist-ips.txt"

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

if ! command -v ufw >/dev/null 2>&1; then
  echo "UFW not installed. Install with: apt-get install -y ufw" >&2
  exit 1
fi

echo "==> Allowing SSH, HTTP, HTTPS..."
ufw allow OpenSSH >/dev/null 2>&1 || ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP' >/dev/null 2>&1 || true
ufw allow 443/tcp comment 'HTTPS' >/dev/null 2>&1 || true

echo "==> Removing broad MySQL (3306) rules if any..."
while IFS= read -r line; do
  num="${line%%]*}"
  num="${num#[}"
  [[ -z "${num}" ]] && continue
  ufw --force delete "${num}" >/dev/null 2>&1 || true
done < <(ufw status numbered 2>/dev/null | grep -E '3306' | tac || true)

if [[ -f "${WHITELIST_FILE}" ]]; then
  echo "==> Whitelisting MySQL for IPs in ${WHITELIST_FILE}..."
  while IFS= read -r line || [[ -n "${line}" ]]; do
    line="${line%%#*}"
    line="$(echo "${line}" | xargs)"
    [[ -z "${line}" ]] && continue
    if ! [[ "${line}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "    Skipping invalid IP: ${line}" >&2
      continue
    fi
    ufw allow from "${line}" to any port 3306 proto tcp comment "MySQL dev ${line}" >/dev/null 2>&1 || true
    echo "    Allowed 3306 from ${line}"
  done < "${WHITELIST_FILE}"
else
  echo "    No whitelist file — MySQL port stays closed remotely (localhost only)."
fi

echo "==> Enabling UFW (default deny incoming)..."
ufw --force enable

echo
ufw status verbose
echo
echo "Done. Add another dev: sudo ./deploy/mysql/add-dev-ip.sh <PUBLIC_IP>"
