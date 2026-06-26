"""
stock/views.py
"""

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response

from accounts.permissions import CanPerformStockTransaction, ReadOnlyOrAdminWarehouseManager
from .models import StockItem, StockTransaction
from .serializers import StockItemSerializer, StockTransactionSerializer


class StockItemViewSet(viewsets.ModelViewSet):
    """
    Read-mostly endpoint for current stock levels per (product, warehouse).
    Direct quantity edits are disabled (current_stock is read-only in the
    serializer) — quantities only change through StockTransaction.
    Editing here is limited to minimum_stock_level / reserved_stock,
    which is why this still uses ReadOnlyOrAdminWarehouseManager.
    """

    queryset = StockItem.objects.select_related("product", "warehouse").all()
    serializer_class = StockItemSerializer
    permission_classes = [ReadOnlyOrAdminWarehouseManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["warehouse", "product"]
    search_fields = ["product__name", "product__sku"]
    ordering_fields = ["current_stock", "updated_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        low_stock = self.request.query_params.get("low_stock")
        if low_stock == "true":
            qs = qs.filter(current_stock__lte=F("minimum_stock_level"))
        return qs


class StockTransactionViewSet(viewsets.ModelViewSet):
    """
    Records Stock In / Stock Out / Adjustment / Transfer movements.
    - All authenticated roles (incl. Staff) can create transactions.
    - Only Admin / Warehouse Manager can delete a transaction record
      (handled inside CanPerformStockTransaction).
    - Transactions are otherwise immutable: no update endpoint is
      meaningfully supported (http_method_names excludes PUT/PATCH).
    """

    queryset = StockTransaction.objects.select_related(
        "product", "warehouse", "destination_warehouse", "performed_by"
    ).all()
    serializer_class = StockTransactionSerializer
    permission_classes = [CanPerformStockTransaction]
    http_method_names = ["get", "post", "delete", "head", "options"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["transaction_type", "warehouse", "product"]
    search_fields = ["product__sku", "product__name", "reference_note"]
    ordering_fields = ["created_at", "quantity"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
        except DjangoValidationError as exc:
            # Convert Django's ValidationError (raised inside
            # StockTransaction.apply()) into a proper DRF 400 response.
            raise DRFValidationError({"detail": exc.messages if hasattr(exc, "messages") else str(exc)})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
