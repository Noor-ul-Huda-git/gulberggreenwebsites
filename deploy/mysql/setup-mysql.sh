#!/usr/bin/env bash
# One-time MySQL install + database/users for Gulberg Django backend.
# Run on the production server as root:
#   sudo ./deploy/mysql/setup-mysql.sh
#
# Before running, copy whitelist IPs (optional, for remote dev access):
#   cp deploy/mysql/whitelist-ips.example deploy/mysql/whitelist-ips.txt
#   nano deploy/mysql/whitelist-ips.txt

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MYSQL_DIR="${REPO_ROOT}/deploy/mysql"
CREDS_FILE="${MYSQL_DIR}/credentials.env"
WHITELIST_FILE="${MYSQL_DIR}/whitelist-ips.txt"
BACKEND_ENV="${REPO_ROOT}/backend/.env"

DB_NAME="${MYSQL_DATABASE:-gulberg}"
APP_USER="${MYSQL_APP_USER:-gulberg_app}"
DEV_USER="${MYSQL_DEV_USER:-gulberg_dev}"

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

gen_pass() {
  openssl rand -base64 32 | tr -d '/+=' | head -c 32
}

echo "==> Installing MySQL server and client libraries..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq mysql-server default-libmysqlclient-dev build-essential pkg-config

echo "==> Generating passwords..."
APP_PASS="$(gen_pass)"
DEV_PASS="$(gen_pass)"
ROOT_PASS="$(gen_pass)"

echo "==> Creating database and users..."
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${APP_USER}'@'localhost' IDENTIFIED BY '${APP_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${APP_USER}'@'localhost';"

# Remote dev user — one MySQL account, host restricted per whitelisted IP below
mysql -e "DROP USER IF EXISTS '${DEV_USER}'@'%';" 2>/dev/null || true

if [[ -f "${WHITELIST_FILE}" ]]; then
  while IFS= read -r line || [[ -n "${line}" ]]; do
    line="${line%%#*}"
    line="$(echo "${line}" | xargs)"
    [[ -z "${line}" ]] && continue
    echo "    Whitelisting dev access from ${line}"
    mysql -e "CREATE USER IF NOT EXISTS '${DEV_USER}'@'${line}' IDENTIFIED BY '${DEV_PASS}';"
    mysql -e "GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES ON \`${DB_NAME}\`.* TO '${DEV_USER}'@'${line}';"
  done < "${WHITELIST_FILE}"
else
  echo "    No ${WHITELIST_FILE} — skipping remote dev users (create file and run add-dev-ip.sh later)."
fi

mysql -e "FLUSH PRIVILEGES;"

echo "==> Allowing remote connections (firewall still restricts by IP)..."
CONF="/etc/mysql/mysql.conf.d/99-gulberg-bind.cnf"
cat > "${CONF}" <<'EOF'
[mysqld]
bind-address = 0.0.0.0
mysqlx-bind-address = 127.0.0.1
EOF
systemctl restart mysql

echo "==> Configuring UFW for MySQL (port 3306, whitelisted IPs only)..."
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH >/dev/null 2>&1 || true
  ufw allow 80/tcp >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
  # Remove broad 3306 if present (grep may match nothing — do not fail under set -e)
  while IFS= read -r line; do
    num="${line%%]*}"
    num="${num#[}"
    [[ -z "${num}" ]] && continue
    ufw --force delete "${num}" >/dev/null 2>&1 || true
  done < <(ufw status numbered 2>/dev/null | grep -E '3306' | tac || true)
  if [[ -f "${WHITELIST_FILE}" ]]; then
    while IFS= read -r line || [[ -n "${line}" ]]; do
      line="${line%%#*}"
      line="$(echo "${line}" | xargs)"
      [[ -z "${line}" ]] && continue
      ufw allow from "${line}" to any port 3306 proto tcp comment "MySQL dev ${line}" >/dev/null 2>&1 || true
    done < "${WHITELIST_FILE}"
  fi
  ufw --force enable >/dev/null 2>&1 || true
  echo "    UFW updated (3306 only from whitelisted IPs)."
else
  echo "    UFW not installed — ensure cloud firewall allows 3306 only from dev IPs."
fi

SERVER_IP="$(hostname -I | awk '{print $1}')"

mkdir -p "${MYSQL_DIR}"
cat > "${CREDS_FILE}" <<EOF
# Gulberg MySQL credentials — share with developers securely (NOT in git).
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

SERVER_IP=${SERVER_IP}
MYSQL_PORT=3306
MYSQL_DATABASE=${DB_NAME}

# Django on this server (localhost only)
MYSQL_APP_USER=${APP_USER}
MYSQL_APP_PASSWORD=${APP_PASS}

# Remote developers (MySQL client / GUI — IP must be whitelisted)
MYSQL_DEV_USER=${DEV_USER}
MYSQL_DEV_PASSWORD=${DEV_PASS}

# Example connection string for devs:
# mysql -h ${SERVER_IP} -P 3306 -u ${DEV_USER} -p ${DB_NAME}
EOF
chmod 600 "${CREDS_FILE}"

echo "==> Updating backend/.env for Django (MySQL)..."
touch "${BACKEND_ENV}"
if grep -q '^DJANGO_DB_ENGINE=' "${BACKEND_ENV}" 2>/dev/null; then
  sed -i "s/^DJANGO_DB_ENGINE=.*/DJANGO_DB_ENGINE=mysql/" "${BACKEND_ENV}"
else
  echo "DJANGO_DB_ENGINE=mysql" >> "${BACKEND_ENV}"
fi
for var in MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD MYSQL_HOST MYSQL_PORT; do
  case "${var}" in
    MYSQL_DATABASE) val="${DB_NAME}" ;;
    MYSQL_USER) val="${APP_USER}" ;;
    MYSQL_PASSWORD) val="${APP_PASS}" ;;
    MYSQL_HOST) val="127.0.0.1" ;;
    MYSQL_PORT) val="3306" ;;
  esac
  if grep -q "^${var}=" "${BACKEND_ENV}" 2>/dev/null; then
    sed -i "s|^${var}=.*|${var}=${val}|" "${BACKEND_ENV}"
  else
    echo "${var}=${val}" >> "${BACKEND_ENV}"
  fi
done

echo "==> Installing Python MySQL driver..."
"${REPO_ROOT}/backend/.venv/bin/pip" install -q 'mysqlclient>=2.2,<3'

echo
echo "=============================================="
echo " MySQL setup complete"
echo "=============================================="
echo " Credentials saved to: ${CREDS_FILE}"
echo " Share that file with devs over a secure channel."
echo
echo " Next steps:"
echo "   1. Migrate SQLite data:  sudo ./deploy/mysql/migrate-sqlite-to-mysql.sh"
echo "   2. Restart backend:      pm2 restart gulberg-backend"
echo "   3. Add another dev IP:   sudo ./deploy/mysql/add-dev-ip.sh <PUBLIC_IP>"
echo
