import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


def _load_env_file(path):
    if not path.exists():
        return
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


_load_env_file(BASE_DIR / '.env')


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'change-me-in-production')
# Hardening: set DJANGO_SECRET_KEY in the environment; use DJANGO_DEBUG=False in production
# once static/media are served by nginx (see deployment notes).
DEBUG = os.getenv('DJANGO_DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv(
        'DJANGO_ALLOWED_HOSTS',
        '127.0.0.1,localhost,gulberggreens.com.pk,www.gulberggreens.com.pk',
    ).split(',')
    if h.strip()
]

# nginx terminates TLS and forwards scheme; required for correct URLs and admin behind HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        'DJANGO_CSRF_TRUSTED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173,'
        'http://localhost:5174,http://127.0.0.1:5174,'
        'http://localhost:5175,http://127.0.0.1:5175,'
        'http://127.0.0.1:8000,'
        'http://gulberggreens.com.pk,http://www.gulberggreens.com.pk,'
        'https://gulberggreens.com.pk,https://www.gulberggreens.com.pk',
    ).split(',')
    if o.strip()
]


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_ckeditor_5',
    'corsheaders',
    'rest_framework',
    'properties',
    'news',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Karachi'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Admin uploads (news + property images): encode as WebP, cap longest edge for smaller files.
IMAGE_WEBP_MAX_EDGE = int(os.getenv('IMAGE_WEBP_MAX_EDGE', '2400'))
IMAGE_WEBP_QUALITY = int(os.getenv('IMAGE_WEBP_QUALITY', '82'))
# Used when WebP encoding fails (e.g. rare Pillow builds); CKEditor uploads still become JPEG, not raw PNG.
IMAGE_JPEG_QUALITY = int(os.getenv('IMAGE_JPEG_QUALITY', '85'))

# CKEditor 5 inline images (news/property rich text). Include "jpg" — widget default omitted it.
CKEDITOR_5_UPLOAD_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
CKEDITOR_5_MAX_FILE_SIZE = int(os.getenv('CKEDITOR_5_MAX_FILE_SIZE', '0'))  # MB; 0 = unlimited
# CKEditor inline images → WebP when possible, else optimized JPEG (see config/ckeditor_upload.py).
CKEDITOR_5_OPTIMIZE_TO_WEBP = os.getenv('CKEDITOR_5_OPTIMIZE_TO_WEBP', 'true').lower() == 'true'

CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173,'
        'http://localhost:5174,http://127.0.0.1:5174,'
        'http://localhost:5175,http://127.0.0.1:5175,'
        'http://gulberggreens.com.pk,http://www.gulberggreens.com.pk,'
        'https://gulberggreens.com.pk,https://www.gulberggreens.com.pk',
    ).split(',')
    if o.strip()
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# Production security — cookies, HTTPS, framing (when DEBUG is off)
# ---------------------------------------------------------------------------
if not DEBUG:
    if SECRET_KEY in ('change-me-in-production', '', 'changeme'):
        raise ValueError(
            'DJANGO_DEBUG is false but DJANGO_SECRET_KEY is missing or still the dev default. '
            'Set a long random secret in the environment before going live.'
        )

    # Behind nginx/HTTPS — redirect and mark cookies Secure
    SECURE_SSL_REDIRECT = os.getenv('DJANGO_SECURE_SSL_REDIRECT', 'true').lower() == 'true'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_REFERRER_POLICY = 'same-origin'

    # Enable HSTS only after HTTPS works end-to-end (seconds > 0 turns it on)
    _hsts = int(os.getenv('DJANGO_SECURE_HSTS_SECONDS', '0'))
    if _hsts > 0:
        SECURE_HSTS_SECONDS = _hsts
        SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv('DJANGO_HSTS_INCLUDE_SUBDOMAINS', 'true').lower() == 'true'
        SECURE_HSTS_PRELOAD = os.getenv('DJANGO_SECURE_HSTS_PRELOAD', 'false').lower() == 'true'

# django-jazzmin — admin UI (must stay after INSTALLED_APPS entry for jazzmin)
JAZZMIN_SETTINGS = {
    'site_title': 'Gulberg Admin',
    'site_header': 'Gulberg Admin',
    'site_brand': 'Gulberg Greens',
    # 'site_logo': 'admin/gulberg-admin-logo.svg',
    'site_logo_classes': 'img-circle elevation-3',
    # 'login_logo': 'admin/gulberg-admin-logo.svg',
    'welcome_sign': 'Sign in to manage Gulberg Greens',
    'copyright': 'Gulberg Greens · Islamabad',
    # One search bar so the top-right account menu (Log out lives in its dropdown) stays visible
    'search_model': 'properties.Property',
    'topmenu_links': [
        {
            'name': 'Public website',
            'url': 'https://gulberggreens.com.pk/',
            'new_window': True,
        },
    ],
    'order_with_respect_to': ['properties', 'news'],
    'hide_apps': ['auth'],
    'icons': {
        'properties.property': 'fas fa-city',
        'properties.propertyimage': 'fas fa-images',
        'news.newspost': 'fas fa-newspaper',
        'news.newsimage': 'fas fa-image',
    },
    'related_modal_active': True,
    'show_ui_builder': False,
    'show_theme_chooser': False,
    'changeform_format': 'horizontal_tabs',
    'language_chooser': False,
    'custom_css': 'admin/css/gulberg_jazzmin.css',
}

JAZZMIN_UI_TWEAKS = {
    'navbar_fixed': True,
    'sidebar_fixed': True,
    'navbar': 'navbar-dark',
    'sidebar': 'sidebar-dark-primary',
    'accent': 'accent-success',
    'brand_colour': 'navbar-success',
    'footer_small_text': False,
    'theme': 'default',
    'default_theme_mode': 'light',
}

# Rich text (news + property descriptions) — CKEditor 5 in Django admin.
CKEDITOR_5_CONFIGS = {
    'default': {
        'toolbar': [
            'heading', '|',
            'bold', 'italic', 'underline', 'strikethrough', 'link', '|',
            'bulletedList', 'numberedList', 'blockQuote', '|',
            'uploadImage',
            'insertTable', 'horizontalLine', '|',
            'undo', 'redo', 'sourceEditing',
        ],
        'image': {
            'toolbar': [
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'linkImage',
            ],
        },
        'table': {
            'contentToolbar': [
                'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
            ],
        },
        'heading': {
            'options': [
                {'model': 'paragraph', 'title': 'Paragraph', 'class': 'ck-heading_paragraph'},
                {'model': 'heading2', 'view': 'h2', 'title': 'Heading 2', 'class': 'ck-heading_heading2'},
                {'model': 'heading3', 'view': 'h3', 'title': 'Heading 3', 'class': 'ck-heading_heading3'},
                {'model': 'heading4', 'view': 'h4', 'title': 'Heading 4', 'class': 'ck-heading_heading4'},
            ],
        },
    },
}