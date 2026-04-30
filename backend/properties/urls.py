from django.urls import path

from .views import (
    HealthCheckAPIView,
    PropertyDetailAPIView,
    PropertyListingEmailCreateAPIView,
    PropertyListAPIView,
)

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view(), name='health-check'),
    path('properties/<int:property_id>/listing-emails/', PropertyListingEmailCreateAPIView.as_view(), name='property-listing-email-create'),
    path('properties/', PropertyListAPIView.as_view(), name='property-list'),
    path('properties/<slug:category_slug>/<str:block>/<slug:slug>/', PropertyDetailAPIView.as_view(), name='property-detail'),
    path('properties/<slug:slug>/', PropertyDetailAPIView.as_view(), name='property-detail-legacy'),
]
