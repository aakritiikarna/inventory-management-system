"""
stock/admin.py
"""

from django.contrib import admin

from .models import StockItem, StockTransaction


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ("product", "warehouse", "current_stock", "reserved_stock", "minimum_stock_level")
    list_filter = ("warehouse",)
    search_fields = ("product__name", "product__sku")


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "warehouse",
        "destination_warehouse",
        "transaction_type",
        "quantity",
        "performed_by",
        "created_at",
    )
    list_filter = ("transaction_type", "warehouse")
    search_fields = ("product__name", "product__sku", "reference_note")
    readonly_fields = [f.name for f in StockTransaction._meta.fields]

    def has_change_permission(self, request, obj=None):
        # Transactions are an immutable audit log; even superusers
        # should not edit them after the fact via the admin site.
        return False
