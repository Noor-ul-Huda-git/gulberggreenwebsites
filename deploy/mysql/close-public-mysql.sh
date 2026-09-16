#!/usr/bin/env bash
# Close MySQL on the public internet — localhost only (Tailscale serve exposes it privately).
# Run as root: sudo ./deploy/mysql/close-public-mysql.sh

set -euo pipefail

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

CONF="/etc/mysql/mysql.conf.d/zz-gulberg-bind.cnf"
cat > "${CONF}" <<'EOF'
[mysqld]
bind-address = 127.0.0.1
mysqlx-bind-address = 127.0.0.1
EOF

systemctl restart mysql

echo "==> Removing public UFW rules for MySQL port 3306..."
while IFS= read -r line; do
  num="${line%%]*}"
  num="${num#[}"
  [[ -z "${num}" ]] && continue
  ufw --force delete "${num}" >/dev/null 2>&1 || true
done < <(ufw status numbered 2>/dev/null | grep -E '3306' | tac || true)

echo "==> Dropping legacy per-IP dev users (optional cleanup)..."
mysql -N -e "SELECT CONCAT(user, '@', host) FROM mysql.user WHERE user='gulberg_dev' AND host NOT LIKE '100.%';" 2>/dev/null | while IFS= read -r account; do
  [[ -z "${account}" ]] && continue
  user="${account%%@*}"
  host="${account#*@}"
  mysql -e "DROP USER IF EXISTS '${user}'@'${host}';"
  echo "    Dropped ${user}@${host}"
done
mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true

echo "MySQL is now localhost-only. Use Tailscale to reach it remotely."
