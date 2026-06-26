"""
stock/serializers.py
"""

from rest_framework import serializers

from .models import StockItem, StockTransaction


class StockItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_sku = serializers.CharField(source="product.sku", read_only=True)
    warehouse_name = serializers.CharField(source="warehouse.name", read_only=True)
    available_stock = serializers.IntegerField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = StockItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_sku",
            "warehouse",
            "warehouse_name",
            "current_stock",
            "reserved_stock",
            "minimum_stock_level",
            "available_stock",
            "is_low_stock",
            "updated_at",
        ]
        read_only_fields = ["id", "current_stock", "available_stock", "is_low_stock", "updated_at"]
        # current_stock is intentionally read-only here: it must only be
        # changed via StockTransaction.apply(), never edited directly,
        # so the transaction ledger always matches reality.


class StockTransactionSerializer(serializers.ModelSerializer):
    product_sku = serializers.CharField(source="product.sku", read_only=True)
    warehouse_name = serializers.CharField(source="warehouse.name", read_only=True)
    destination_warehouse_name = serializers.CharField(
        source="destination_warehouse.name", read_only=True, default=None
    )
    performed_by_username = serializers.CharField(source="performed_by.username", read_only=True)

    class Meta:
        model = StockTransaction
        fields = [
            "id",
            "product",
            "product_sku",
            "warehouse",
            "warehouse_name",
            "destination_warehouse",
            "destination_warehouse_name",
            "transaction_type",
            "quantity",
            "adjustment_delta",
            "reference_note",
            "performed_by",
            "performed_by_username",
            "created_at",
        ]
        read_only_fields = ["id", "performed_by", "created_at"]

    def validate(self, attrs):
        ttype = attrs.get("transaction_type")
        if ttype == StockTransaction.TransactionType.TRANSFER and not attrs.get("destination_warehouse"):
            raise serializers.ValidationError(
                {"destination_warehouse": "Required for TRANSFER transactions."}
            )
        if ttype == StockTransaction.TransactionType.TRANSFER and attrs.get("destination_warehouse") == attrs.get("warehouse"):
            raise serializers.ValidationError(
                {"destination_warehouse": "Source and destination warehouse cannot be the same."}
            )
        if ttype == StockTransaction.TransactionType.ADJUSTMENT and attrs.get("adjustment_delta") in (None,):
            raise serializers.ValidationError(
                {"adjustment_delta": "Required for ADJUSTMENT transactions."}
            )
        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["performed_by"] = request.user if request else None
        instance = super().create(validated_data)
        # Applying the transaction's effect on the StockItem ledger may
        # raise django.core.exceptions.ValidationError (e.g. insufficient
        # stock); the view translates that into a 400 response.
        instance.apply()
        return instance
