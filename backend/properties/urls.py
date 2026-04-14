from django.urls import path

from .views import HealthCheckAPIView, PropertyListAPIView

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view(), name='health-check'),
    path('properties/', PropertyListAPIView.as_view(), name='property-list'),
]
