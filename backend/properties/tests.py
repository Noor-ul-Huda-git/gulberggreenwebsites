from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Property


class PropertyApiTests(APITestCase):
    def setUp(self):
        self.published_property = Property.objects.create(
            title='Executive Block Plot',
            property_type=Property.PropertyType.PLOT,
            category=Property.Category.SALE,
            block='A Executive',
            size='10 Marla',
            location='Islamabad Expressway',
            short_description='Corner plot near the main boulevard.',
            is_published=True,
        )
        Property.objects.create(
            title='Hidden Listing',
            property_type=Property.PropertyType.HOUSE,
            category=Property.Category.SALE,
            block='B',
            size='1 Kanal',
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
