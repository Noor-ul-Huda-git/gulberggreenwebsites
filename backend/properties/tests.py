from decimal import Decimal
from urllib.parse import urlparse

from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Property


@override_settings(SECURE_SSL_REDIRECT=False)
class PropertyApiTests(APITestCase):
    def setUp(self):
        self.published_property = Property.objects.create(
            title='Executive Block Plot',
            listing_type=Property.ListingType.PLOTS,
            block='A Executive',
            area_marlas=Decimal('10.00'),
            location='Islamabad Expressway',
            short_description='Corner plot near the main boulevard.',
            is_published=True,
        )
        Property.objects.create(
            title='Hidden Listing',
            listing_type=Property.ListingType.HOUSE,
            block='B',
            area_marlas=Decimal('20.00'),
            is_published=False,
        )

    def test_health_check(self):
        response = self.client.get(reverse('health-check'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')

    def test_properties_endpoint_only_returns_published_items(self):
        response = self.client.get(reverse('property-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.published_property.id)

    def test_property_detail_accepts_block_slug_segment(self):
        response = self.client.get(
            reverse(
                'property-detail',
                kwargs={
                    'category_slug': self.published_property.category_slug,
                    'block': self.published_property.block_slug,
                    'slug': self.published_property.slug,
                },
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_property_api_exposes_generated_seo_fields(self):
        response = self.client.get(
            reverse(
                'property-detail',
                kwargs={
                    'category_slug': self.published_property.category_slug,
                    'block': self.published_property.block,
                    'slug': self.published_property.slug,
                },
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('meta_title', response.data)
        self.assertIn('meta_description', response.data)
        self.assertIn('seo_h1', response.data)
        self.assertEqual(response.data['category_slug'], 'plots')
        self.assertEqual(
            response.data['canonical_url'],
            f'https://gulberggreens.com.pk/properties/plots/A%20Executive/{self.published_property.slug}',
        )

    def test_properties_all_sitemap_endpoint_lists_only_published(self):
        response = self.client.get(reverse('property-list-all-sitemap'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        row = response.data[0]
        self.assertEqual(row['type'], 'plots')
        self.assertEqual(row['slug'], self.published_property.slug)
        self.assertIn('updated_at', row)
        self.assertIn('block_slug', row)

    def test_seo_redirect_poperties_typo(self):
        response = self.client.get('/poperties/plots', follow=False)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        loc = response.headers.get('Location', '')
        self.assertEqual(urlparse(loc).path.rstrip('/') or '/', '/properties/plots')

    def test_seo_redirect_listing_legacy(self):
        response = self.client.get('/listing/block-a-7-marla/', follow=False)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        loc = response.headers.get('Location', '')
        self.assertEqual(urlparse(loc).path.rstrip('/') or '/', '/properties')

    def test_seo_redirect_properties_block_prefix(self):
        response = self.client.get('/properties/block-a-7-marla/', follow=False)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        loc = response.headers.get('Location', '')
        self.assertEqual(urlparse(loc).path.rstrip('/') or '/', '/properties')

    def test_seo_redirect_how_to_get_plot(self):
        response = self.client.get('/how-to-get-plot/', follow=False)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        loc = response.headers.get('Location', '')
        self.assertEqual(urlparse(loc).path.rstrip('/') or '/', '/latest-updates')

    def test_seo_redirect_home(self):
        response = self.client.get('/home/', follow=False)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        loc = response.headers.get('Location', '')
        self.assertEqual(urlparse(loc).path.rstrip('/') or '/', '/')

    def test_seo_redirect_property_block_m_to_plots_block_m(self):
        for path in (
            '/property/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m/',
            '/property/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m',
        ):
            response = self.client.get(path, follow=False)
            self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY, msg=path)
            loc = response.headers.get('Location', '')
            self.assertEqual(
                urlparse(loc).path.rstrip('/') or '/',
                '/properties/plots/block-m',
                msg=path,
            )

    def test_seo_redirect_properties_intermediate_block_m_slug(self):
        for path in (
            '/properties/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m/',
            '/properties/7-marla-developed-possession-plot-for-sale-in-gulberg-greens-block-m',
        ):
            response = self.client.get(path, follow=False)
            self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY, msg=path)
            loc = response.headers.get('Location', '')
            self.assertEqual(
                urlparse(loc).path.rstrip('/') or '/',
                '/properties/plots/block-m',
                msg=path,
            )

    def test_seo_redirect_properties_legacy_slug_to_block_a(self):
        response = self.client.get(
            '/properties/7-marla-possession-able-plot-for-sale-in-gulberg-islamabad-block-a/',
            follow=False,
        )
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        loc = response.headers.get('Location', '')
        self.assertEqual(urlparse(loc).path.rstrip('/') or '/', '/properties/plots/block-a')
