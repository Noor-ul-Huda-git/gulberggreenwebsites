# Local development (after pulling `local-db-development` or `main`)

## Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate   # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env — SQLite (default) or Tailscale MySQL (see deploy/mysql/TAILSCALE-DEV.md)
python manage.py migrate
python manage.py runserver
```

**SQLite:** leave `DJANGO_DB_ENGINE` unset or set `DJANGO_DB_ENGINE=sqlite`.  
**Prod data:** use Tailscale + `gulberg_editor` credentials from admin (not public IP).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to Django when configured in `vite.config.js`.

## Branch notes

- Property listings API returns **all** filtered results in one response (no pagination) — matches the redesigned Properties page.
- News API: `/api/news/` and `/api/news/<slug>/`
- Optional: `YOUTUBE_API_KEY` in `.env` for `/api/youtube/videos/` (homepage also uses YouTube RSS)
