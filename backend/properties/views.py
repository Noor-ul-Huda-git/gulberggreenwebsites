from decimal import Decimal, InvalidOperation

from django.db import IntegrityError, transaction
from django.db.models import Prefetch, Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ListingEmail, Property, PropertyImage
from .serializers import ListingEmailCreateSerializer, PropertySerializer


class HealthCheckAPIView(APIView):
    def get(self, request):
        return Response({'status': 'ok', 'service': 'gulberg-greens-api'})


class AllPropertiesSitemapAPIView(APIView):
    """
    Published listings as URL segments for sitemap builders (see SEO implementation guide).
    `type` is the public category path segment (e.g. plots, farm-house), not the raw DB value.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        rows = (
            Property.objects.filter(is_published=True)
            .only('slug', 'listing_type', 'block', 'updated_at')
            .order_by('id')
            .iterator(chunk_size=500)
        )
        data = [
            {
                'type': p.category_slug,
                'block_slug': p.block_slug,
                'slug': p.slug,
                'updated_at': p.updated_at.isoformat() if p.updated_at else None,
            }
            for p in rows
        ]
        return Response(data)


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

    def get_object(self):
        obj = super().get_object()
        category_slug = (self.kwargs.get('category_slug') or '').strip()
        block_kw = (self.kwargs.get('block') or '').strip()

        if category_slug and obj.category_slug != category_slug:
            raise Http404

        if block_kw:
            obj_block = (obj.block or '').strip()
            expected_slug = (obj.block_slug or '').strip()
            if obj_block.lower() != block_kw.lower() and expected_slug.lower() != block_kw.lower():
                raise Http404

        return obj


def _client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()[:45]
    return (request.META.get('REMOTE_ADDR') or '')[:45] or None


class PropertyListingEmailCreateAPIView(APIView):
    """
    Store a listing inquiry from the website form.
    At most one stored inquiry per (published listing, sender email).
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, property_id):
        prop = get_object_or_404(Property.objects.filter(is_published=True), pk=property_id)
        ser = ListingEmailCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        phone_digits = data.get('phone') or ''
        phone_display = f'+92 {phone_digits}' if phone_digits else ''
        body = (data.get('message') or '').strip() or f'I would like to inquire about {prop.title}.'
        if ListingEmail.objects.filter(property_listing=prop, sender_email=data['email']).exists():
            return Response(
                {
                    'detail': 'You have already submitted an inquiry for this listing using this email address.',
                    'code': 'duplicate',
                },
                status=status.HTTP_409_CONFLICT,
            )
        try:
            with transaction.atomic():
                ListingEmail.objects.create(
                    property_listing=prop,
                    sender_name=data['name'],
                    sender_email=data['email'],
                    sender_phone=phone_display,
                    message=body,
                    submitted_ip=_client_ip(request),
                    user_agent=(request.META.get('HTTP_USER_AGENT') or '')[:512],
                )
        except IntegrityError:
            return Response(
                {
                    'detail': 'You have already submitted an inquiry for this listing using this email address.',
                    'code': 'duplicate',
                },
                status=status.HTTP_409_CONFLICT,
            )
        return Response({'detail': 'Your inquiry has been received.', 'ok': True}, status=status.HTTP_201_CREATED)
