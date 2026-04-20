from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from .models import NewsPost
from .serializers import NewsPostDetailSerializer, NewsPostListSerializer


class NewsPagination(PageNumberPagination):
    page_size = 20
    page_query_param = 'page'
    max_page_size = 50

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)
        response.data['page_size'] = self.get_page_size(self.request)
        return response


class NewsPostListAPIView(generics.ListAPIView):
    serializer_class = NewsPostListSerializer
    pagination_class = NewsPagination

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
