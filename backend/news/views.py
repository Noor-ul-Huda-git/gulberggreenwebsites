import os

import requests
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

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
        return NewsPost.objects.filter(
            is_published=True
        ).prefetch_related('images')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class NewsPostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = NewsPostDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return NewsPost.objects.filter(
            is_published=True
        ).prefetch_related('images')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class YouTubeVideosAPIView(APIView):
    """
    Return the latest 6 videos from the official Gulberg Greens
    YouTube channel.
    """

    CHANNEL_HANDLE = '@gulberggreens_ibechs'
    VIDEO_LIMIT = 6

    def get(self, request):
        api_key = os.getenv('YOUTUBE_API_KEY', '').strip()

        if not api_key:
            return Response(
                {
                    'results': [],
                    'error': 'YouTube API key is not configured.',
                },
                status=503,
            )

        try:
            channel_response = requests.get(
                'https://www.googleapis.com/youtube/v3/channels',
                params={
                    'part': 'contentDetails',
                    'forHandle': self.CHANNEL_HANDLE,
                    'key': api_key,
                },
                timeout=10,
            )
            channel_response.raise_for_status()

            channel_data = channel_response.json()
            channel_items = channel_data.get('items', [])

            if not channel_items:
                return Response(
                    {
                        'results': [],
                        'error': 'Official YouTube channel was not found.',
                    },
                    status=404,
                )

            uploads_playlist_id = (
                channel_items[0]
                .get('contentDetails', {})
                .get('relatedPlaylists', {})
                .get('uploads')
            )

            if not uploads_playlist_id:
                return Response(
                    {
                        'results': [],
                        'error': 'YouTube uploads playlist was not found.',
                    },
                    status=404,
                )

            videos_response = requests.get(
                'https://www.googleapis.com/youtube/v3/playlistItems',
                params={
                    'part': 'snippet,contentDetails',
                    'playlistId': uploads_playlist_id,
                    'maxResults': self.VIDEO_LIMIT,
                    'key': api_key,
                },
                timeout=10,
            )
            videos_response.raise_for_status()

            videos_data = videos_response.json()
            results = []

            for item in videos_data.get('items', []):
                snippet = item.get('snippet', {})
                content_details = item.get('contentDetails', {})

                video_id = (
                    content_details.get('videoId')
                    or snippet.get('resourceId', {}).get('videoId')
                )

                if not video_id:
                    continue

                thumbnails = snippet.get('thumbnails', {})

                thumbnail = (
                    thumbnails.get('high', {}).get('url')
                    or thumbnails.get('medium', {}).get('url')
                    or thumbnails.get('default', {}).get('url')
                    or f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg'
                )

                results.append(
                    {
                        'video_id': video_id,
                        'title': snippet.get('title', ''),
                        'description': snippet.get('description', ''),
                        'published_at': snippet.get('publishedAt'),
                        'thumbnail': thumbnail,
                        'watch_url': (
                            f'https://www.youtube.com/watch?v={video_id}'
                        ),
                        'embed_url': (
                            f'https://www.youtube.com/embed/{video_id}'
                        ),
                    }
                )

            return Response(
                {
                    'results': results[:self.VIDEO_LIMIT],
                    'channel': self.CHANNEL_HANDLE,
                }
            )

        except requests.RequestException:
            return Response(
                {
                    'results': [],
                    'error': 'Unable to fetch YouTube videos.',
                },
                status=502,
            )

        except (KeyError, TypeError, ValueError):
            return Response(
                {
                    'results': [],
                    'error': 'Invalid YouTube response.',
                },
                status=502,
            )