"""
suppliers/views.py
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from accounts.permissions import ReadOnlyOrAdminWarehouseManager
from .models import Supplier
from .serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for suppliers.
    - All authenticated roles can list/retrieve.
    - Only Admin / Warehouse Manager can create/update/delete.
    """

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [ReadOnlyOrAdminWarehouseManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["name", "contact_person", "email", "phone"]
    ordering_fields = ["name", "created_at"]
