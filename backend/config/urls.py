from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

import config.admin_site  # noqa: F401 — unregister auth models from admin

admin.site.site_header = 'Gulberg Admin'
admin.site.site_title = 'Gulberg Admin'
admin.site.index_title = 'Gulberg Greens — listings & news'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('config.api_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
