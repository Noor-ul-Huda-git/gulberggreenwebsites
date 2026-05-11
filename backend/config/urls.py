from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

import config.admin_site  # noqa: F401 — unregister auth models from admin
from .seo import robots_txt, sitemap_xml
from .seo_redirects import urlpatterns as seo_redirect_urlpatterns

admin.site.site_header = 'Gulberg Admin'
admin.site.site_title = 'Gulberg Admin'
admin.site.index_title = 'Gulberg Greens — listings & news'

urlpatterns = [
    *seo_redirect_urlpatterns,
    path('robots.txt', robots_txt, name='robots-txt'),
    path('sitemap.xml', sitemap_xml, name='sitemap-xml'),
    path('admin/', admin.site.urls),
    # CKEditor upload lives under /api/ so reverse proxies that only forward /api/* still reach Django.
    path('api/', include('config.api_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
