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
