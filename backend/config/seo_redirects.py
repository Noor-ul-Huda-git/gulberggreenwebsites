"""HTTP 301 redirects for legacy indexed URLs.

Matched when Django handles the request. For the usual setup (SPA `dist/` served by nginx with
try_files … /index.html), also include `deploy/nginx-legacy-301-rewrites.conf` and
`deploy/nginx-legacy-block-redirects.conf` in nginx `server {}` above `location /` so bots get
real 301s before the SPA shell.

Path-based listing URLs (`/properties/all/{blockSlug}`, `/properties/{category}/{blockSlug}`, etc.)
and query cleanup for filters are handled in the SPA; only static legacy paths are listed here.
"""

from django.http import Http404, HttpResponsePermanentRedirect
from django.urls import path, re_path
from django.views.generic import RedirectView

from .legacy_block_redirect_data import LEGACY_BLOCK_SHORT_TO_SLUG, PROPERTY_CATEGORY_SLUGS


def _slash(url: str) -> str:
    """Canonical trailing slash for redirect targets (home stays `/`)."""
    if not url or url == '/':
        return url
    return url if url.endswith('/') else f'{url}/'


def _p(route: str, target: str, name: str):
    return path(route, RedirectView.as_view(url=_slash(target), permanent=True), name=name)


def _legacy_block_target(category: str, short_code: str, property_slug: str | None = None) -> str:
    block_slug = LEGACY_BLOCK_SHORT_TO_SLUG.get(short_code) or LEGACY_BLOCK_SHORT_TO_SLUG.get(
        short_code.lower(),
    )
    if not block_slug or block_slug == short_code or block_slug.lower() == short_code.lower():
        raise Http404
    base = _slash(f'/properties/{category}/{block_slug}')
    return _slash(f'{base.rstrip("/")}/{property_slug}') if property_slug else base


def legacy_property_block_listing_redirect(request, category, short_code):
    if category not in PROPERTY_CATEGORY_SLUGS:
        raise Http404
    return HttpResponsePermanentRedirect(_legacy_block_target(category, short_code))


def legacy_property_block_detail_redirect(request, category, short_code, property_slug):
    if category not in PROPERTY_CATEGORY_SLUGS:
        raise Http404
    return HttpResponsePermanentRedirect(_legacy_block_target(category, short_code, property_slug))


_CATEGORY_PATTERN = '|'.join(sorted(PROPERTY_CATEGORY_SLUGS, key=len, reverse=True))

# Order: longest / most specific first (shared prefix routes).
urlpatterns = [
    re_path(
        rf'^properties/(?P<category>{_CATEGORY_PATTERN})/(?P<short_code>[^/]+)/(?P<property_slug>[^/]+)/?$',
        legacy_property_block_detail_redirect,
        name='seo-legacy-block-detail',
    ),
    re_path(
        rf'^properties/(?P<category>{_CATEGORY_PATTERN})/(?P<short_code>[^/]+)/?$',
        legacy_property_block_listing_redirect,
        name='seo-legacy-block-listing',
    ),
    _p(
        'property/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m/',
        '/properties/plots/block-m',
        'seo-property-block-m-slash',
    ),
    _p(
        'property/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m',
        '/properties/plots/block-m',
        'seo-property-block-m',
    ),
    _p(
        'properties/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m/',
        '/properties/plots/block-m',
        'seo-props-intermediate-block-m-slash',
    ),
    _p(
        'properties/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m',
        '/properties/plots/block-m',
        'seo-props-intermediate-block-m',
    ),
    _p(
        'properties/7-marla-possession-able-plot-for-sale-in-gulberg-islamabad-block-a/',
        '/properties/plots/block-a',
        'seo-props-legacy-block-a-slash',
    ),
    _p(
        'properties/7-marla-possession-able-plot-for-sale-in-gulberg-islamabad-block-a',
        '/properties/plots/block-a',
        'seo-props-legacy-block-a',
    ),
    path(
        'poperties/<path:path>',
        RedirectView.as_view(url='/properties/%(path)s/', permanent=True),
        name='seo-poperties-path',
    ),
    _p('poperties/', '/properties', 'seo-poperties-slash'),
    _p('poperties', '/properties', 'seo-poperties'),
    _p('farmhouse-for-sale/', '/properties/farm-house', 'seo-farmhouse-slash'),
    _p('farmhouse-for-sale', '/properties/farm-house', 'seo-farmhouse'),
    _p('farmhouses-for-sale/', '/properties/farm-house', 'seo-farmhouses-slash'),
    _p('farmhouses-for-sale', '/properties/farm-house', 'seo-farmhouses'),
    _p(
        'gulberggreen-farmhouses/',
        '/properties/farm-house',
        'seo-gulberggreen-farmhouses-slash',
    ),
    _p('gulberggreen-farmhouses', '/properties/farm-house', 'seo-gulberggreen-farmhouses'),
    _p('houses-for-sale/', '/properties/house', 'seo-houses-for-sale-slash'),
    _p('houses-for-sale', '/properties/house', 'seo-houses-for-sale'),
    _p('plots-for-sale/', '/properties/plots', 'seo-plots-for-sale-slash'),
    _p('plots-for-sale', '/properties/plots', 'seo-plots-for-sale'),
    _p('apartment-for-sale/', '/properties/flat', 'seo-apartment-for-sale-slash'),
    _p('apartment-for-sale', '/properties/flat', 'seo-apartment-for-sale'),
    _p(
        'apartments-for-rent-in-gulberg/',
        '/properties/flat',
        'seo-apartments-rent-slash',
    ),
    _p('apartments-for-rent-in-gulberg', '/properties/flat', 'seo-apartments-rent'),
    _p('properties/apartment-for-rent/', '/properties/flat', 'seo-props-apartment-rent-slash'),
    _p('properties/apartment-for-rent', '/properties/flat', 'seo-props-apartment-rent'),
    _p('properties/house-for-sale/', '/properties/house', 'seo-props-house-sale-slash'),
    _p('properties/house-for-sale', '/properties/house', 'seo-props-house-sale'),
    path(
        'properties/block-<path:rest>/',
        RedirectView.as_view(url='/properties/', permanent=True),
        name='seo-props-block-prefix-slash',
    ),
    path(
        'properties/block-<path:rest>',
        RedirectView.as_view(url='/properties/', permanent=True),
        name='seo-props-block-prefix',
    ),
    path(
        'properties/gulberg-<path:rest>/',
        RedirectView.as_view(url='/properties/', permanent=True),
        name='seo-props-gulberg-prefix-slash',
    ),
    path(
        'properties/gulberg-<path:rest>',
        RedirectView.as_view(url='/properties/', permanent=True),
        name='seo-props-gulberg-prefix',
    ),
    _p('instalment-plan/', '/installment-plan', 'seo-instalment-slash'),
    _p('instalment-plan', '/installment-plan', 'seo-instalment'),
    _p('maps/', '/gulberg-map', 'seo-maps-slash'),
    _p('maps', '/gulberg-map', 'seo-maps'),
    _p('listing-form/', '/properties', 'seo-listing-form-slash'),
    _p('listing-form', '/properties', 'seo-listing-form'),
    _p('listing-category/plot-for-sale/', '/properties/plots', 'seo-lc-plot-slash'),
    _p('listing-category/plot-for-sale', '/properties/plots', 'seo-lc-plot'),
    _p('listing-category/plot/', '/properties/plots', 'seo-lc-plot-short-slash'),
    _p('listing-category/plot', '/properties/plots', 'seo-lc-plot-short'),
    _p('listing-category/house-for-sale/', '/properties/house', 'seo-lc-house-slash'),
    _p('listing-category/house-for-sale', '/properties/house', 'seo-lc-house'),
    _p(
        'listing-category/<slug:slug>/',
        '/properties',
        'seo-lc-catchall-slash',
    ),
    _p(
        'listing-category/<slug:slug>',
        '/properties',
        'seo-lc-catchall',
    ),
    _p('property/page/<int:page>/', '/properties', 'seo-prop-page-slash'),
    _p('property/page/<int:page>', '/properties', 'seo-prop-page'),
    _p('listing/', '/properties', 'seo-listing-index-slash'),
    _p('listing', '/properties', 'seo-listing-index'),
    path(
        'listing/<path:rest>/',
        RedirectView.as_view(url='/properties/', permanent=True),
        name='seo-listing-path-slash',
    ),
    path(
        'listing/<path:rest>',
        RedirectView.as_view(url='/properties/', permanent=True),
        name='seo-listing-path',
    ),
    path(
        'property/<slug:slug>/',
        RedirectView.as_view(url='/properties/%(slug)s/', permanent=True),
        name='seo-property-old-slash',
    ),
    path(
        'property/<slug:slug>',
        RedirectView.as_view(url='/properties/%(slug)s/', permanent=True),
        name='seo-property-old',
    ),
    _p('agent/', '/', 'seo-agent-slash'),
    _p('agent', '/', 'seo-agent'),
    _p('commercial/', '/properties/commercial-plots', 'seo-commercial-slash'),
    _p('commercial', '/properties/commercial-plots', 'seo-commercial'),
    path(
        'es_amenity/<slug:slug>/',
        RedirectView.as_view(url='/', permanent=True),
        name='seo-es-amenity-slash',
    ),
    path(
        'es_amenity/<slug:slug>',
        RedirectView.as_view(url='/', permanent=True),
        name='seo-es-amenity',
    ),
    _p('news/', '/latest-updates', 'seo-news-index-slash'),
    _p('news', '/latest-updates', 'seo-news-index'),
    _p('how-to-get-plot/', '/latest-updates', 'seo-how-to-get-plot-slash'),
    _p('how-to-get-plot', '/latest-updates', 'seo-how-to-get-plot'),
    _p('latest-updates-of-gulberg/', '/latest-updates', 'seo-latest-updates-of-gulberg-slash'),
    _p('latest-updates-of-gulberg', '/latest-updates', 'seo-latest-updates-of-gulberg'),
    _p(
        'latest-meeting-of-society-gulberg-green-islamabad/',
        '/latest-updates',
        'seo-latest-meeting-slash',
    ),
    _p(
        'latest-meeting-of-society-gulberg-green-islamabad',
        '/latest-updates',
        'seo-latest-meeting',
    ),
    _p('house-for-sale-in-gulberg-gre/', '/properties/house', 'seo-house-gulberg-gre-slash'),
    _p('house-for-sale-in-gulberg-gre', '/properties/house', 'seo-house-gulberg-gre'),
    _p('favorite-properties/', '/properties', 'seo-favorite-properties-slash'),
    _p('favorite-properties', '/properties', 'seo-favorite-properties'),
    _p('home/', '/', 'seo-home-slash'),
    _p('home', '/', 'seo-home'),
    _p('contact-us/', '/contact', 'seo-contact-us-slash'),
    _p('contact-us', '/contact', 'seo-contact-us'),
]
