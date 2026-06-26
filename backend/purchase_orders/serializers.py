"""
purchase_orders/serializers.py
"""

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import PurchaseOrder, PurchaseOrderLine


class PurchaseOrderLineSerializer(serializers.ModelSerializer):
    product_sku = serializers.CharField(source="product.sku", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = PurchaseOrderLine
        fields = ["id", "product", "product_sku", "product_name", "quantity", "unit_cost", "line_total"]
        read_only_fields = ["id", "line_total"]


class PurchaseOrderSerializer(serializers.ModelSerializer):
    """
    Supports nested writes: POSTing a purchase order can include a
    `lines` array to create the PO and its line items in one request,
    which is what the 'Create Purchase Order' + 'Add Products' frontend
    flow needs (the UI combines them into a single submit).
    """

    lines = PurchaseOrderLineSerializer(many=True, required=False)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)
    warehouse_name = serializers.CharField(source="warehouse.name", read_only=True)
    created_by_username = serializers.CharField(source="created_by.username", read_only=True, default=None)
    approved_by_username = serializers.CharField(source="approved_by.username", read_only=True, default=None)
    received_by_username = serializers.CharField(source="received_by.username", read_only=True, default=None)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "po_number",
            "supplier",
            "supplier_name",
            "warehouse",
            "warehouse_name",
            "date",
            "status",
            "lines",
            "total_amount",
            "created_by",
            "created_by_username",
            "approved_by",
            "approved_by_username",
            "received_by",
            "received_by_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "po_number",
            "status",
            "created_by",
            "approved_by",
            "received_by",
            "created_at",
            "updated_at",
        ]

    def get_total_amount(self, obj):
        return obj.total_amount

    def create(self, validated_data):
        lines_data = validated_data.pop("lines", [])
        request = self.context.get("request")
        validated_data["created_by"] = request.user if request else None
        po = PurchaseOrder.objects.create(**validated_data)
        for line_data in lines_data:
            PurchaseOrderLine.objects.create(purchase_order=po, **line_data)
        return po

    def update(self, instance, validated_data):
        # Only DRAFT purchase orders may have their line items modified.
        if instance.status != PurchaseOrder.Status.DRAFT and "lines" in validated_data:
            raise serializers.ValidationError(
                "Cannot modify line items on a purchase order that is not in DRAFT status."
            )
        lines_data = validated_data.pop("lines", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if lines_data is not None:
            instance.lines.all().delete()
            for line_data in lines_data:
                PurchaseOrderLine.objects.create(purchase_order=instance, **line_data)
        return instance


class PurchaseOrderActionSerializer(serializers.Serializer):
    """
    Empty-bodied serializer used purely as a hook for approve/receive/
    cancel actions; the actual state transition + validation lives in
    the PurchaseOrder model methods, which raise DjangoValidationError
    on invalid transitions (caught and translated to 400 in the view).
    """

    def save(self, **kwargs):
        action = self.context["action"]
        user = self.context["request"].user
        po = self.context["purchase_order"]
        try:
            if action == "approve":
                po.approve(user)
            elif action == "receive":
                po.receive(user)
            elif action == "cancel":
                po.cancel()
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages if hasattr(exc, "messages") else str(exc))
        return po
