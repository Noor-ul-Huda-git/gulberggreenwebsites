# Deployment checklist — Gulberg Greens production server

Server: **161.97.109.149** · Site: **https://gulberggreens.com.pk/**

---

## After code pull / backend changes

```bash
cd /root/gulbergGreenWebsite/backend
.venv/bin/pip install -r requirements.txt   # if requirements changed
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput   # if static/admin changed
pm2 restart gulberg-backend
```

---

## After frontend changes (or when SEO must refresh)

Nginx serves **`frontend/dist`** — you must rebuild for changes to go live.

```bash
cd /root/gulbergGreenWebsite
./deploy/rebuild-frontend-seo.sh
```

Or:

```bash
cd frontend && npm run build
```

**Automatic:** Saving or deleting a **property** or **news** post in Django admin queues a rebuild (~90s debounce). Log: `logs/seo-rebuild.log`.

---

## After adding/editing properties or news (admin)

1. Save in Django admin — auto-rebuild runs after ~90 seconds, **or**
2. Run `./deploy/rebuild-frontend-seo.sh` manually if you need it immediately

Rebuild regenerates prerendered `index.html` per route (title, canonical, JSON-LD) for all properties and news articles.

---

## MySQL remote dev access

```bash
# One-time firewall (SSH + web + whitelisted MySQL only)
sudo ./deploy/mysql/enable-ufw.sh

# Per developer public IP
sudo ./deploy/mysql/add-dev-ip.sh 203.0.113.50
```

Share credentials from `deploy/mysql/credentials.env` securely (not in git).

---

## Full deploy (typical)

```bash
cd /root/gulbergGreenWebsite
git pull
cd backend && .venv/bin/pip install -r requirements.txt && .venv/bin/python manage.py migrate --noinput
pm2 restart gulberg-backend
cd .. && ./deploy/rebuild-frontend-seo.sh
curl -sI https://gulberggreens.com.pk/ | head -5
```

---

## Verify SEO after rebuild

```bash
curl -sL -H "User-Agent: Googlebot" "https://gulberggreens.com.pk/properties/plots/" | grep -E 'canonical|title'
curl -sL "https://gulberggreens.com.pk/sitemap.xml" | grep -c '<loc>'
```

Property and news URLs should appear in the sitemap; property pages should have their own canonical (not homepage).

---

## Rollback

- **Backend DB:** see `deploy/mysql/README.md` (SQLite backup under `backend/db.sqlite3.bak.*`)
- **Frontend:** redeploy previous `frontend/dist` from git or re-run build on prior commit
