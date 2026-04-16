from django.urls import path

from .views import NewsPostDetailAPIView, NewsPostListAPIView

urlpatterns = [
    path('news/', NewsPostListAPIView.as_view(), name='news-list'),
    path('news/<slug:slug>/', NewsPostDetailAPIView.as_view(), name='news-detail'),
]
