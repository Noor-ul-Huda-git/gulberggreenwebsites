#!/usr/bin/env bash
# Add a developer's public IP to MySQL + UFW whitelist.
# Usage: sudo ./deploy/mysql/add-dev-ip.sh 203.0.113.50

set -euo pipefail

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "Run with sudo" >&2
  exit 1
fi

IP="${1:-}"
if [[ -z "${IP}" ]]; then
  echo "Usage: sudo $0 <PUBLIC_IPV4>" >&2
  exit 1
fi

if ! [[ "${IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid IPv4: ${IP}" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CREDS_FILE="${REPO_ROOT}/deploy/mysql/credentials.env"
WHITELIST_FILE="${REPO_ROOT}/deploy/mysql/whitelist-ips.txt"
DB_NAME="${MYSQL_DATABASE:-gulberg}"
DEV_USER="${MYSQL_DEV_USER:-gulberg_dev}"

if [[ ! -f "${CREDS_FILE}" ]]; then
  echo "Run setup-mysql.sh first." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "${CREDS_FILE}"

mysql -e "CREATE USER IF NOT EXISTS '${DEV_USER}'@'${IP}' IDENTIFIED BY '${MYSQL_DEV_PASSWORD}';"
mysql -e "GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES ON \`${DB_NAME}\`.* TO '${DEV_USER}'@'${IP}';"
mysql -e "FLUSH PRIVILEGES;"

grep -qxF "${IP}" "${WHITELIST_FILE}" 2>/dev/null || echo "${IP}" >> "${WHITELIST_FILE}"

if command -v ufw >/dev/null 2>&1; then
  ufw allow from "${IP}" to any port 3306 proto tcp comment "MySQL dev ${IP}" >/dev/null 2>&1 || true
fi

echo "Whitelisted ${IP} for ${DEV_USER}@${DB_NAME}"
