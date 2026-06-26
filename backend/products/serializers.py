"""
products/serializers.py
"""

from rest_framework import serializers

from suppliers.models import Supplier
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True, default=None)
    margin = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "sku",
            "name",
            "category",
            "category_name",
            "description",
            "cost_price",
            "selling_price",
            "supplier",
            "supplier_name",
            "barcode",
            "is_active",
            "margin",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "margin", "created_at", "updated_at"]

    def validate(self, attrs):
        cost_price = attrs.get("cost_price", getattr(self.instance, "cost_price", None))
        selling_price = attrs.get("selling_price", getattr(self.instance, "selling_price", None))
        if cost_price is not None and selling_price is not None and selling_price < cost_price:
            raise serializers.ValidationError(
                {"selling_price": "Selling price cannot be lower than cost price."}
            )
        return attrs

    def validate_supplier(self, value):
        if value and value.status != Supplier.Status.ACTIVE:
            raise serializers.ValidationError(
                "Cannot assign an inactive supplier to a product."
            )
        return value
