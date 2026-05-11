"""HTTP 301 redirects for legacy public URLs (root level — requires reverse-proxy to Django for these paths)."""

from django.urls import path
from django.views.generic import RedirectView

urlpatterns = [
    path(
        'poperties/<path:path>',
        RedirectView.as_view(url='/properties/%(path)s', permanent=True),
        name='seo-redirect-poperties-path',
    ),
    path(
        'poperties/',
        RedirectView.as_view(url='/properties', permanent=True),
        name='seo-redirect-poperties-slash',
    ),
    path(
        'poperties',
        RedirectView.as_view(url='/properties', permanent=True),
        name='seo-redirect-poperties',
    ),
    path(
        'plots-for-sale/',
        RedirectView.as_view(url='/properties/plots', permanent=True),
        name='seo-redirect-plots-for-sale-slash',
    ),
    path(
        'plots-for-sale',
        RedirectView.as_view(url='/properties/plots', permanent=True),
        name='seo-redirect-plots-for-sale',
    ),
    path(
        'houses-for-sale/',
        RedirectView.as_view(url='/properties/house', permanent=True),
        name='seo-redirect-houses-for-sale-slash',
    ),
    path(
        'houses-for-sale',
        RedirectView.as_view(url='/properties/house', permanent=True),
        name='seo-redirect-houses-for-sale',
    ),
    path(
        'apartment-for-sale/',
        RedirectView.as_view(url='/properties/flat', permanent=True),
        name='seo-redirect-apartment-for-sale-slash',
    ),
    path(
        'apartment-for-sale',
        RedirectView.as_view(url='/properties/flat', permanent=True),
        name='seo-redirect-apartment-for-sale',
    ),
    path(
        'farmhouse-for-sale/',
        RedirectView.as_view(url='/properties/farm-house', permanent=True),
        name='seo-redirect-farmhouse-for-sale-slash',
    ),
    path(
        'farmhouse-for-sale',
        RedirectView.as_view(url='/properties/farm-house', permanent=True),
        name='seo-redirect-farmhouse-for-sale',
    ),
    path(
        'listing/<slug:slug>/',
        RedirectView.as_view(url='/properties/%(slug)s', permanent=True),
        name='seo-redirect-listing-slash',
    ),
    path(
        'listing/<slug:slug>',
        RedirectView.as_view(url='/properties/%(slug)s', permanent=True),
        name='seo-redirect-listing',
    ),
    path(
        'contact-us/',
        RedirectView.as_view(url='/contact', permanent=True),
        name='seo-redirect-contact-us-slash',
    ),
    path(
        'contact-us',
        RedirectView.as_view(url='/contact', permanent=True),
        name='seo-redirect-contact-us',
    ),
]
