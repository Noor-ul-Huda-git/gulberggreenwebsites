from django.db.models import Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Property
from .serializers import PropertySerializer


class HealthCheckAPIView(APIView):
    def get(self, request):
        return Response({'status': 'ok', 'service': 'gulberg-greens-api'})


class PropertyListAPIView(generics.ListAPIView):
    serializer_class = PropertySerializer

    def get_queryset(self):
        queryset = Property.objects.filter(is_published=True)
        search = self.request.query_params.get('search')
        property_type = self.request.query_params.get('property_type')
        category = self.request.query_params.get('category')
        block = self.request.query_params.get('block')
        featured = self.request.query_params.get('featured')

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(location__icontains=search)
                | Q(block__icontains=search)
                | Q(size__icontains=search)
                | Q(short_description__icontains=search)
            )

        if property_type:
            queryset = queryset.filter(property_type=property_type)

        if category:
            queryset = queryset.filter(category=category)

        if block:
            queryset = queryset.filter(block__iexact=block)

        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset
