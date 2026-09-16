# MySQL setup for Gulberg Greens (production server)

Replace SQLite with **local MySQL** on the server. Django uses MySQL on `127.0.0.1`.

**Remote developers:** use **Tailscale** (no IP whitelist, no SSH). See [TAILSCALE-DEV.md](./TAILSCALE-DEV.md).

Server IP: **161.97.109.149** (public site only — not for MySQL)

---

## Developer database access (Tailscale — recommended)

```bash
sudo ./deploy/mysql/setup-tailscale-mysql.sh
```

1. Open the Tailscale login URL in your browser when prompted.
2. Invite devs at https://login.tailscale.com/admin/machines
3. Share `TAILSCALE-DEV.md` + `MYSQL_EDITOR_PASSWORD` from `credentials.env`.

MySQL is **not** exposed on the public internet. Devs use user **`gulberg_editor`** (read all; insert/update properties & news only — no delete, no DDL).

---

## Legacy: IP whitelist (deprecated)

Previously used `add-dev-ip.sh` + `gulberg_dev`. Removed in favour of Tailscale. Do not re-open port 3306 publicly.

---

## Quick start (on the server — first-time MySQL)

```bash
cd /root/gulbergGreenWebsite

# 1. Optional: add developer public IPs (one per line)
cp deploy/mysql/whitelist-ips.example deploy/mysql/whitelist-ips.txt
nano deploy/mysql/whitelist-ips.txt

# 2. Install MySQL, create DB/users, update backend/.env
sudo chmod +x deploy/mysql/*.sh
sudo ./deploy/mysql/setup-mysql.sh

# 3. Move SQLite data into MySQL
sudo ./deploy/mysql/migrate-sqlite-to-mysql.sh

# 4. Restart Django
pm2 restart gulberg-backend
pm2 logs gulberg-backend --lines 20
```

Credentials for you and devs are written to:

`deploy/mysql/credentials.env` (gitignored — share securely, not via email/Slack in plain text if avoidable)

---

## What gets created

| Item | Purpose |
|------|---------|
| Database `gulberg` | utf8mb4, all Django tables |
| User `gulberg_editor@100.%` | Remote devs via Tailscale (limited) |
| User `gulberg_app@localhost` | Django/Gunicorn on this server only |
| `backend/.env` | `DJANGO_DB_ENGINE=mysql` + app credentials |

---

## Share with another developer

1. Add their **public IP** (not office LAN IP unless that's what exits to the internet):

   ```bash
   sudo ./deploy/mysql/add-dev-ip.sh 203.0.113.50
   ```

   They can check IP with: `curl -4 ifconfig.me`

2. Send them (secure channel):

   - Host: `161.97.109.149`
   - Port: `3306`
   - Database: `gulberg`
   - User: `gulberg_dev`
   - Password: from `deploy/mysql/credentials.env` → `MYSQL_DEV_PASSWORD`

3. **Connection examples**

   CLI:

   ```bash
   mysql -h 161.97.109.149 -P 3306 -u gulberg_dev -p gulberg
   ```

   MySQL Workbench / DBeaver / TablePlus:

   - Connection method: Standard TCP/IP
   - Hostname: `161.97.109.149`
   - Port: `3306`
   - Username: `gulberg_dev`
   - Default schema: `gulberg`

   Django local `.env` (if they run backend against prod DB — **read-only recommended for safety**):

   ```env
   DJANGO_DB_ENGINE=mysql
   MYSQL_DATABASE=gulberg
   MYSQL_USER=gulberg_dev
   MYSQL_PASSWORD=<from credentials.env>
   MYSQL_HOST=161.97.109.149
   MYSQL_PORT=3306
   ```

---

## Remove a developer IP

```bash
sudo mysql -e "DROP USER 'gulberg_dev'@'203.0.113.50';"
sudo ufw delete allow from 203.0.113.50 to any port 3306
# Edit deploy/mysql/whitelist-ips.txt and remove the line
```

---

## Local development (without remote MySQL)

Keep SQLite — do **not** set `DJANGO_DB_ENGINE` or set:

```env
DJANGO_DB_ENGINE=sqlite
```

Copy `backend/.env.example` to `backend/.env` for a template.

---

## Environment variables (Django)

| Variable | Example | Notes |
|----------|---------|--------|
| `DJANGO_DB_ENGINE` | `mysql` or `sqlite` | Default `sqlite` if unset |
| `MYSQL_DATABASE` | `gulberg` | |
| `MYSQL_USER` | `gulberg_app` | App user on server |
| `MYSQL_PASSWORD` | *(secret)* | |
| `MYSQL_HOST` | `127.0.0.1` | App on server uses localhost |
| `MYSQL_PORT` | `3306` | |

---

## Troubleshooting

**Can't connect from dev machine**

- Confirm IP whitelisted: `sudo ./deploy/mysql/add-dev-ip.sh <their-ip>`
- Their IP may change (home ISP) — re-add after `curl -4 ifconfig.me`
- Cloud provider firewall: allow **3306** from same IPs (Contabo/Vultr panel)

**Django errors after switch**

```bash
cd backend && .venv/bin/python manage.py migrate --noinput
pm2 restart gulberg-backend
```

**Rollback to SQLite (emergency)**

1. In `backend/.env`: `DJANGO_DB_ENGINE=sqlite` (or remove MySQL vars)
2. Restore `db.sqlite3` from `db.sqlite3.bak.*` if needed
3. `pm2 restart gulberg-backend`

---

## Security notes

- Never commit `credentials.env` or real `whitelist-ips.txt`
- Do not open port 3306 to `0.0.0.0/0` in cloud firewall
- Rotate passwords if a dev leaves: recreate users in MySQL and update `credentials.env`
- Production app user (`gulberg_app`) is **localhost only** — not for remote devs
