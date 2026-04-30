from django.urls import include, path

from .ckeditor_upload import upload_file as ckeditor5_upload_file

urlpatterns = [
    path('ckeditor5/image_upload/', ckeditor5_upload_file, name='ck_editor_5_upload_file'),
    path('', include('properties.urls')),
    path('', include('news.urls')),
]
