"""
warehouses/urls.py
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import WarehouseViewSet

router = DefaultRouter()
router.register(r"", WarehouseViewSet, basename="warehouse")

urlpatterns = [
    path("", include(router.urls)),
]
