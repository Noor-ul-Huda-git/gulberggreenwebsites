import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'change-me-in-production')
DEBUG = os.getenv('DJANGO_DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ckeditor',
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

CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173',
).split(',')

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

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

# Rich text (news article body) — WYSIWYG in Django admin
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'blog',
        'toolbar_blog': [
            ['Bold', 'Italic', 'Underline', 'Strike'],
            ['Subscript', 'Superscript'],
            ['Format', 'RemoveFormat'],
            ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote'],
            ['Link', 'Unlink'],
            ['HorizontalRule', 'SpecialChar'],
            ['Maximize', 'ShowBlocks', 'Source'],
        ],
        'format_tags': 'p;h2;h3;h4;pre',
        'height': 420,
        'width': '100%',
        'removeDialogTabs': 'link:advanced;image:advanced',
    },
}
