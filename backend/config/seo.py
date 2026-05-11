from html import escape

from django.http import HttpResponse
from django.utils import timezone

from properties.models import Property


SITE_ORIGIN = 'https://gulberggreens.com.pk'

FIXED_SITEMAP_URLS = (
    ('/', 'weekly', '1.0'),
    ('/properties/', 'daily', '0.9'),
    ('/properties/plots/', 'daily', '0.9'),
    ('/properties/flat/', 'daily', '0.8'),
    ('/properties/house/', 'daily', '0.8'),
    ('/properties/farm-house/', 'weekly', '0.8'),
    ('/properties/commercial-plots/', 'weekly', '0.7'),
    ('/properties/office/', 'weekly', '0.7'),
    ('/properties/shop/', 'weekly', '0.7'),
    ('/latest-updates/', 'daily', '0.8'),
    ('/gulberg-map/', 'monthly', '0.6'),
    ('/contact/', 'monthly', '0.6'),
)


def _url(path):
    return f'{SITE_ORIGIN}{path}'


def _sitemap_entry(loc, lastmod=None, changefreq='weekly', priority='0.5'):
    parts = ['  <url>', f'    <loc>{escape(loc)}</loc>']
    if lastmod:
        parts.append(f'    <lastmod>{lastmod}</lastmod>')
    parts.extend(
        [
            f'    <changefreq>{changefreq}</changefreq>',
            f'    <priority>{priority}</priority>',
            '  </url>',
        ]
    )
    return '\n'.join(parts)


def robots_txt(request):
    body = '\n'.join(
        [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin/',
            'Disallow: /api/',
            'Disallow: /properties/*?sort=',
            'Disallow: /properties/*?page=',
            'Disallow: /properties/*?filter=',
            '',
            f'Sitemap: {SITE_ORIGIN}/sitemap.xml',
            '',
        ]
    )
    return HttpResponse(body, content_type='text/plain; charset=utf-8')


def sitemap_xml(request):
    today = timezone.now().date().isoformat()
    entries = [_sitemap_entry(_url(path), today, changefreq, priority) for path, changefreq, priority in FIXED_SITEMAP_URLS]

    block_urls = set()
    properties = Property.objects.filter(is_published=True).only(
        'slug',
        'listing_type',
        'block',
        'updated_at',
    )
    for prop in properties.iterator():
        if prop.block_slug:
            block_urls.add(f'/properties/{prop.category_slug}/{prop.block_slug}/')
        entries.append(
            _sitemap_entry(
                prop.canonical_url,
                prop.updated_at.date().isoformat() if prop.updated_at else today,
                'weekly',
                '0.8',
            )
        )

    for path in sorted(block_urls):
        entries.append(_sitemap_entry(_url(path), today, 'weekly', '0.7'))

    xml = '\n'.join(
        [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            *entries,
            '</urlset>',
            '',
        ]
    )
    return HttpResponse(xml, content_type='application/xml; charset=utf-8')
