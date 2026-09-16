#!/usr/bin/env bash
# Create limited MySQL user for Tailscale developers (read + insert/update on content tables only).
# Run as root after Tailscale is connected: sudo ./deploy/mysql/create-editor-user.sh
#
# Grants for 100.%, localhost, and 127.0.0.1 — Tailscale Serve forwards to 127.0.0.1,
# so MySQL sees remote dev connections as localhost.

set -euo pipefail

DB_NAME="${MYSQL_DATABASE:-gulberg}"
EDITOR_USER="${MYSQL_EDITOR_USER:-gulberg_editor}"
HOSTS=("100.%" "localhost" "127.0.0.1")

gen_pass() {
  openssl rand -base64 32 | tr -d '/+=' | head -c 32
}

grant_editor() {
  local host="$1"
  mysql -e "CREATE USER IF NOT EXISTS '${EDITOR_USER}'@'${host}' IDENTIFIED BY '${EDITOR_PASS}';"
  mysql -e "ALTER USER '${EDITOR_USER}'@'${host}' IDENTIFIED BY '${EDITOR_PASS}';"
  mysql -e "REVOKE ALL PRIVILEGES, GRANT OPTION FROM '${EDITOR_USER}'@'${host}';" 2>/dev/null || true
  mysql -e "GRANT SELECT ON \`${DB_NAME}\`.* TO '${EDITOR_USER}'@'${host}';"
  mysql -e "GRANT INSERT, UPDATE ON \`${DB_NAME}\`.properties_property TO '${EDITOR_USER}'@'${host}';"
  mysql -e "GRANT INSERT, UPDATE ON \`${DB_NAME}\`.properties_propertyimage TO '${EDITOR_USER}'@'${host}';"
  mysql -e "GRANT INSERT, UPDATE ON \`${DB_NAME}\`.properties_agent TO '${EDITOR_USER}'@'${host}';"
  mysql -e "GRANT INSERT, UPDATE ON \`${DB_NAME}\`.news_newspost TO '${EDITOR_USER}'@'${host}';"
  mysql -e "GRANT INSERT, UPDATE ON \`${DB_NAME}\`.news_newsimage TO '${EDITOR_USER}'@'${host}';"
}

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CREDS_FILE="${REPO_ROOT}/deploy/mysql/credentials.env"

EDITOR_PASS="${MYSQL_EDITOR_PASSWORD:-}"
if [[ -z "${EDITOR_PASS}" ]] && [[ -f "${CREDS_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${CREDS_FILE}" 2>/dev/null || true
  EDITOR_PASS="${MYSQL_EDITOR_PASSWORD:-}"
fi
EDITOR_PASS="${EDITOR_PASS:-$(gen_pass)}"

for host in "${HOSTS[@]}"; do
  grant_editor "${host}"
done

mysql -e "FLUSH PRIVILEGES;"

touch "${CREDS_FILE}"
for var in MYSQL_EDITOR_USER MYSQL_EDITOR_PASSWORD; do
  case "${var}" in
    MYSQL_EDITOR_USER) val="${EDITOR_USER}" ;;
    MYSQL_EDITOR_PASSWORD) val="${EDITOR_PASS}" ;;
  esac
  if grep -q "^${var}=" "${CREDS_FILE}" 2>/dev/null; then
    sed -i "s|^${var}=.*|${var}=${val}|" "${CREDS_FILE}"
  else
    echo "${var}=${val}" >> "${CREDS_FILE}"
  fi
done

chmod 600 "${CREDS_FILE}"

echo "Created ${EDITOR_USER} for hosts: ${HOSTS[*]}"
echo "Password saved to ${CREDS_FILE} → MYSQL_EDITOR_PASSWORD"
