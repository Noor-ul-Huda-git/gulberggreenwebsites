# Gulberg Greens Backend

This backend uses Django, Django REST Framework, and the built-in Django admin panel.

## Features

- Admin-only content management for properties
- Read-only API for published properties
- Basic health check endpoint
- SQLite for local development

## Setup

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Static files

The **master plan PDF** for the public map is shipped with the **frontend**: `frontend/public/maps/gulberg-greens.pdf` → URL **`/maps/gulberg-greens.pdf`** (copied into `dist/` on build). Serve that path from **nginx** with `sendfile on` so large files are not streamed through Django/Gunicorn (which is slow for 40MB+ PDFs and can look like a 10+ minute load).

Optional copy under `static/maps/` is only needed if you intentionally serve it via `collectstatic`; prefer nginx `alias` to the file on disk or the SPA `dist/maps/` directory. Ensure **`Accept-Ranges: bytes`** works (default for nginx `location` static files) so the browser viewer can use range requests. Re-export the PDF with **“Save as optimized / Fast Web View”** in Acrobat (or similar) to shrink size and improve first-paint time.

## Security notes

- **Public PDF ≠ a vulnerability** — The map file is meant to be downloaded/viewed by visitors, like a brochure. “Exposure” here is intentional. **Do not** place secrets in `static/` or `media/` (no `.env`, database dumps, private keys, internal docs). Anything under `STATICFILES_DIRS` / `collectstatic` output can be requested by URL if someone guesses the path — keep that tree **public-only**.
- **Django staticfiles** only serves files from configured static directories; it does not expose arbitrary paths on disk. Use **nginx** (or similar) in production with **directory listing disabled** (`autoindex off`).
- **Production:** set `DJANGO_DEBUG=false`, a strong **`DJANGO_SECRET_KEY`**, and rely on the HTTPS/cookie/HSTS flags enabled in `settings.py` when `DEBUG` is off. Optional: `DJANGO_SECURE_HSTS_SECONDS=31536000` after HTTPS is verified.
- **CORS** uses an allowlist (`CORS_ALLOWED_ORIGINS`) — avoid `CORS_ALLOW_ALL_ORIGINS` in production.
- **Media:** With `DEBUG=True`, `/media/` is served for local dev. Do not store confidential uploads there without authentication or a private object store.

## Endpoints

- `/admin/`
- `/api/health/`
- `/api/properties/`

## Search Filters

The properties endpoint supports these optional query parameters:

- `search`
- `property_type`
- `category`
- `block`
- `featured=true`
