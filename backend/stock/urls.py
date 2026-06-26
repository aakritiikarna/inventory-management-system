"""
stock/urls.py
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import StockItemViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register(r"items", StockItemViewSet, basename="stock-item")
router.register(r"transactions", StockTransactionViewSet, basename="stock-transaction")

urlpatterns = [
    path("", include(router.urls)),
]
