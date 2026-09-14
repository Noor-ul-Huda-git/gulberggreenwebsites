from django.urls import include, path

from config.ckeditor_upload import upload_file as ckeditor5_upload_file
from news.views import YouTubeVideosAPIView


urlpatterns = [
    path(
        'ckeditor5/image_upload/',
        ckeditor5_upload_file,
        name='ck_editor_5_upload_file',
    ),

    path(
        'youtube/videos/',
        YouTubeVideosAPIView.as_view(),
        name='youtube-videos',
    ),

    path('', include('properties.urls')),
]