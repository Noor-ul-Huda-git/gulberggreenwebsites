from django.urls import path

from .views import HealthCheckAPIView, PropertyDetailAPIView, PropertyListAPIView

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view(), name='health-check'),
    path('properties/', PropertyListAPIView.as_view(), name='property-list'),
    path('properties/<slug:slug>/', PropertyDetailAPIView.as_view(), name='property-detail'),
]
