from rest_framework import generics

from .models import NewsPost
from .serializers import NewsPostDetailSerializer, NewsPostListSerializer


class NewsPostListAPIView(generics.ListAPIView):
    serializer_class = NewsPostListSerializer
    pagination_class = None

    def get_queryset(self):
        return NewsPost.objects.filter(is_published=True).prefetch_related('images')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class NewsPostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = NewsPostDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return NewsPost.objects.filter(is_published=True).prefetch_related('images')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx
