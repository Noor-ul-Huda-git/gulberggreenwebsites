from decimal import Decimal, InvalidOperation

from django.db.models import Prefetch, Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Property, PropertyImage
from .serializers import PropertySerializer


class HealthCheckAPIView(APIView):
    def get(self, request):
        return Response({'status': 'ok', 'service': 'gulberg-greens-api'})


def _decimal_param(raw):
    if raw is None or raw == '':
        return None
    try:
        return Decimal(str(raw))
    except (InvalidOperation, ValueError, TypeError):
        return None


class PropertyListAPIView(generics.ListAPIView):
    serializer_class = PropertySerializer

    def get_queryset(self):
        queryset = (
            Property.objects.filter(is_published=True)
            .select_related('primary_agent', 'secondary_agent')
            .prefetch_related(
                Prefetch('images', queryset=PropertyImage.objects.order_by('sort_order', 'id')),
            )
            .order_by('-is_featured', '-created_at')
        )

        search = self.request.query_params.get('search')
        listing_type = self.request.query_params.get('listing_type')
        block = self.request.query_params.get('block')
        featured = self.request.query_params.get('featured')
        min_price = _decimal_param(self.request.query_params.get('min_price'))
        max_price = _decimal_param(self.request.query_params.get('max_price'))
        min_marlas = _decimal_param(self.request.query_params.get('min_marlas'))
        max_marlas = _decimal_param(self.request.query_params.get('max_marlas'))
        bedrooms = self.request.query_params.get('bedrooms')
        baths = self.request.query_params.get('baths')
        agent_phone = self.request.query_params.get('agent_phone')
        agent_mobile = self.request.query_params.get('agent_mobile')

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(location__icontains=search)
                | Q(block__icontains=search)
                | Q(short_description__icontains=search)
                | Q(description__icontains=search)
            )

        if listing_type:
            queryset = queryset.filter(listing_type=listing_type)

        if block:
            queryset = queryset.filter(block__iexact=block)

        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)

        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        if min_marlas is not None:
            queryset = queryset.filter(area_marlas__gte=min_marlas)

        if max_marlas is not None:
            queryset = queryset.filter(area_marlas__lte=max_marlas)

        if bedrooms not in (None, ''):
            try:
                queryset = queryset.filter(bedrooms=int(bedrooms))
            except (TypeError, ValueError):
                pass

        if baths not in (None, ''):
            try:
                queryset = queryset.filter(baths=int(baths))
            except (TypeError, ValueError):
                pass

        if agent_phone not in (None, ''):
            queryset = queryset.filter(primary_agent__phone__iexact=str(agent_phone).strip())

        if agent_mobile not in (None, ''):
            queryset = queryset.filter(secondary_agent__phone__iexact=str(agent_mobile).strip())

        return queryset


class PropertyDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PropertySerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Property.objects.filter(is_published=True)
            .select_related('primary_agent', 'secondary_agent')
            .prefetch_related(
                Prefetch('images', queryset=PropertyImage.objects.order_by('sort_order', 'id')),
            )
        )
