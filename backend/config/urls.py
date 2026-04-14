from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

admin.site.site_header = 'Gulberg Greens Admin'
admin.site.site_title = 'Gulberg Greens Admin'
admin.site.index_title = 'Property management'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('properties.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
