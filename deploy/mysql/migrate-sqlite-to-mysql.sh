#!/usr/bin/env bash
# Copy existing SQLite data into MySQL (run AFTER setup-mysql.sh).
# Usage: sudo ./deploy/mysql/migrate-sqlite-to-mysql.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND="${REPO_ROOT}/backend"
VENV="${BACKEND}/.venv/bin/python"
SQLITE="${BACKEND}/db.sqlite3"
DUMP="/tmp/gulberg-sqlite-dump.json"
BACKUP="${BACKEND}/db.sqlite3.bak.$(date +%Y%m%d%H%M%S)"

if [[ ! -f "${SQLITE}" ]]; then
  echo "No SQLite database at ${SQLITE}" >&2
  exit 1
fi

if ! grep -q '^DJANGO_DB_ENGINE=mysql' "${BACKEND}/.env" 2>/dev/null; then
  echo "backend/.env must have DJANGO_DB_ENGINE=mysql — run setup-mysql.sh first." >&2
  exit 1
fi

echo "==> Backing up SQLite to ${BACKUP}"
cp -a "${SQLITE}" "${BACKUP}"

echo "==> Exporting from SQLite..."
(
  cd "${BACKEND}"
  DJANGO_DB_ENGINE=sqlite "${VENV}" manage.py dumpdata \
    --natural-foreign --natural-primary \
    -e contenttypes -e auth.Permission \
    --indent 2 -o "${DUMP}"
)

echo "==> Creating MySQL schema..."
(
  cd "${BACKEND}"
  "${VENV}" manage.py migrate --noinput
)

echo "==> Importing data into MySQL..."
(
  cd "${BACKEND}"
  "${VENV}" manage.py loaddata "${DUMP}"
)

echo "==> Done. Verify admin login, then: pm2 restart gulberg-backend"
echo "    SQLite backup: ${BACKUP}"
