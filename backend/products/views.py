"""
products/views.py
"""

from django_filters import rest_framework as df_filters
from rest_framework import viewsets, filters

from accounts.permissions import ReadOnlyOrAdminWarehouseManager
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductFilter(df_filters.FilterSet):
    """
    Supports filtering products by category, supplier, active status,
    and a price range — used by the frontend's Product Filter UI.
    """

    min_price = df_filters.NumberFilter(field_name="selling_price", lookup_expr="gte")
    max_price = df_filters.NumberFilter(field_name="selling_price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["category", "supplier", "is_active"]


class ProductViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for products.
    - All authenticated roles can list/retrieve/search/filter.
    - Only Admin / Warehouse Manager can create/update/delete.
    """

    queryset = Product.objects.select_related("category", "supplier").all()
    serializer_class = ProductSerializer
    permission_classes = [ReadOnlyOrAdminWarehouseManager]
    filter_backends = [df_filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["sku", "name", "barcode", "description"]
    ordering_fields = ["name", "cost_price", "selling_price", "created_at"]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [ReadOnlyOrAdminWarehouseManager]
    search_fields = ["name"]
