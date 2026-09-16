#!/usr/bin/env bash
# Tailscale + limited MySQL for developers (no public IP whitelist, no SSH).
# Run on server as root after you have a Tailscale account.
#
# 1. sudo ./deploy/mysql/setup-tailscale-mysql.sh
# 2. Open the auth URL in browser (if shown) and log in
# 3. Invite devs at https://login.tailscale.com/admin/machines

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "Run with sudo: sudo $0" >&2
  exit 1
fi

if ! command -v tailscale >/dev/null 2>&1; then
  echo "Installing Tailscale..."
  curl -fsSL https://tailscale.com/install.sh | sh
fi

echo "==> Connecting server to Tailscale (complete login in browser if prompted)..."
tailscale up --hostname=gulberg-greens-db --accept-routes=false --accept-dns=false || true

if ! tailscale status >/dev/null 2>&1; then
  echo "Tailscale not connected yet. Run: tailscale up" >&2
  exit 1
fi

TS_IP="$(tailscale ip -4 2>/dev/null || true)"
TS_DNS="$(tailscale status --json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('Self',{}).get('DNSName','').rstrip('.'))" 2>/dev/null || true)"

echo "==> Closing public MySQL access..."
bash "${REPO_ROOT}/deploy/mysql/close-public-mysql.sh"

echo "==> Creating limited editor MySQL user..."
bash "${REPO_ROOT}/deploy/mysql/create-editor-user.sh"

echo "==> Exposing MySQL on Tailscale only (TCP 3306 → localhost)..."
tailscale serve reset 2>/dev/null || true
tailscale serve --bg --yes --tcp=3306 tcp://127.0.0.1:3306

# Persist serve across reboots via systemd if available
if [[ ! -f /etc/systemd/system/tailscale-serve-mysql.service ]]; then
  cat > /etc/systemd/system/tailscale-serve-mysql.service <<'UNIT'
[Unit]
Description=Tailscale Serve MySQL (tailnet only)
After=tailscaled.service mysql.service
Requires=tailscaled.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/tailscale serve --bg --yes --tcp=3306 tcp://127.0.0.1:3306
ExecStop=/usr/bin/tailscale serve reset

[Install]
WantedBy=multi-user.target
UNIT
  systemctl daemon-reload
  systemctl enable tailscale-serve-mysql.service
fi

echo
echo "=============================================="
echo " Tailscale MySQL ready"
echo "=============================================="
echo " Tailscale IP:   ${TS_IP:-see: tailscale ip -4}"
echo " Tailscale DNS:  ${TS_DNS:-see: tailscale status}"
echo " MySQL host:     ${TS_DNS:-$TS_IP}"
echo " MySQL port:     3306"
echo " MySQL user:     gulberg_editor (limited — see create-editor-user.sh)"
echo " Password:       deploy/mysql/credentials.env → MYSQL_EDITOR_PASSWORD"
echo
echo " Next: invite devs at https://login.tailscale.com/admin/machines"
echo " Dev guide: deploy/mysql/TAILSCALE-DEV.md"
echo
