"""
purchase_orders/views.py
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import CanApprovePurchaseOrder, ReadOnlyOrAdminWarehouseManager
from .models import PurchaseOrder
from .serializers import PurchaseOrderActionSerializer, PurchaseOrderSerializer


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """
    CRUD + workflow actions for purchase orders.
    - All authenticated roles can list/retrieve.
    - Only Admin / Warehouse Manager can create/update/delete drafts.
    - approve/receive/cancel are further gated by CanApprovePurchaseOrder.
    """

    queryset = PurchaseOrder.objects.select_related(
        "supplier", "warehouse", "created_by", "approved_by", "received_by"
    ).prefetch_related("lines").all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [ReadOnlyOrAdminWarehouseManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "supplier", "warehouse"]
    search_fields = ["po_number"]
    ordering_fields = ["date", "created_at"]

    def get_permissions(self):
        if self.action in ["approve", "receive", "cancel"]:
            return [CanApprovePurchaseOrder()]
        return super().get_permissions()

    def _do_action(self, request, pk, action_name):
        po = self.get_object()
        serializer = PurchaseOrderActionSerializer(
            data={},
            context={"request": request, "purchase_order": po, "action": action_name},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        po.refresh_from_db()
        return Response(PurchaseOrderSerializer(po).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        """POST /api/purchase-orders/{id}/approve/"""
        return self._do_action(request, pk, "approve")

    @action(detail=True, methods=["post"])
    def receive(self, request, pk=None):
        """
        POST /api/purchase-orders/{id}/receive/
        Marks goods as received and creates STOCK_IN transactions for
        every line item, increasing stock at the PO's warehouse.
        """
        return self._do_action(request, pk, "receive")

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """POST /api/purchase-orders/{id}/cancel/"""
        return self._do_action(request, pk, "cancel")
