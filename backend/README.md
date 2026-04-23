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

The Gulberg Greens **master plan PDF** lives at `static/maps/gulberg-greens.pdf` and is served at `/static/maps/gulberg-greens.pdf` (Django `runserver` or `collectstatic` + nginx). The Vite dev server proxies `/static` to Django so the map page can load this file during local development.

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
