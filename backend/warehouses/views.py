"""
warehouses/views.py
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from accounts.permissions import ReadOnlyOrAdminWarehouseManager
from .models import Warehouse
from .serializers import WarehouseSerializer


class WarehouseViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for warehouses.
    - All authenticated roles can list/retrieve.
    - Only Admin / Warehouse Manager can create/update/delete.
    """

    queryset = Warehouse.objects.select_related("manager").all()
    serializer_class = WarehouseSerializer
    permission_classes = [ReadOnlyOrAdminWarehouseManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["manager"]
    search_fields = ["name", "location"]
    ordering_fields = ["name", "capacity", "created_at"]
