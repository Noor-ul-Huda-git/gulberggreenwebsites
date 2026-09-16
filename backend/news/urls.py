from django.urls import path

from .views import NewsPostDetailAPIView, NewsPostListAPIView, YouTubeVideosAPIView

urlpatterns = [
    path('news/', NewsPostListAPIView.as_view(), name='news-list'),
    path('news/<slug:slug>/', NewsPostDetailAPIView.as_view(), name='news-detail'),
    path('youtube/videos/', YouTubeVideosAPIView.as_view(), name='youtube-videos'),
]
