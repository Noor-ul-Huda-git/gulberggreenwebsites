from django.urls import include, path

urlpatterns = [
    path('', include('properties.urls')),
    path('', include('news.urls')),
]
