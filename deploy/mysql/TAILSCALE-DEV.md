# Developer MySQL access via Tailscale

No server SSH. No IP whitelisting. Connect only when you are logged into the Gulberg Tailscale network.

---

## One-time setup (each developer)

1. Install **Tailscale** on your laptop: https://tailscale.com/download/windows  
2. Ask the admin for a **Tailscale invite** (email link).  
3. Sign in and turn Tailscale **ON**.

---

## MySQL connection (Workbench / DBeaver / CLI)

Get these from the admin (in `credentials.env` on the server):

| Field | Value |
|--------|--------|
| **Host** | `gulberg-greens-db` or the Tailscale hostname admin sends (ends in `.ts.net`) |
| **Port** | `3306` |
| **Database** | `gulberg` |
| **User** | `gulberg_editor` |
| **Password** | `MYSQL_EDITOR_PASSWORD` |
| **SSL** | Off / None |

**MySQL Workbench:** Standard TCP/IP connection — **not** SSH.

**Django local `.env`:** copy `backend/.env.example` → `backend/.env` and fill in the password.  
File must live at `backend/.env` (not the repo root). Restart the terminal after editing.

**Verify Django sees the right host:**
```powershell
cd backend
py manage.py shell -c "from django.conf import settings; print(settings.DATABASES['default']['HOST'])"
```
Must print `100.96.37.12` (not `127.0.0.1` or `161.97.109.149`).

**CLI test (Tailscale ON, if mysql client installed):**
```bash
mysql -h gulberg-greens-db -P 3306 -u gulberg_editor -p gulberg -e "SELECT COUNT(*) FROM properties_property;"
```

**PowerShell port test (Tailscale ON):**
```powershell
Test-NetConnection gulberg-greens-db -Port 3306
```

---

## What you can do

| Action | Allowed? |
|--------|----------|
| View all tables (SELECT) | Yes |
| Add/edit properties & news (INSERT/UPDATE) | Yes |
| Delete rows | No |
| Change database structure (DROP/ALTER) | No |
| Django admin / server shell | No |

---

## Troubleshooting

**Connection refused**
- Tailscale must be **Connected** on your machine.
- Host must be the Tailscale name (not `161.97.109.149`).

**Access denied**
- User is `gulberg_editor` (not `gulberg_dev`).
- Password from admin’s `MYSQL_EDITOR_PASSWORD`.

**Works on phone hotspot but not office WiFi**
- Some networks block Tailscale UDP — try another network or Tailscale’s “Use Tailscale DNS” off/on in app settings.

---

## Admin: invite a new developer

1. https://login.tailscale.com/admin/machines  
2. **Invite external user** → enter their email  
3. Send them this file + `MYSQL_EDITOR_PASSWORD` over a secure channel  

No need to ask for their public IP anymore.
