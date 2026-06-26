"""
purchase_orders/admin.py
"""

from django.contrib import admin

from .models import PurchaseOrder, PurchaseOrderLine


class PurchaseOrderLineInline(admin.TabularInline):
    model = PurchaseOrderLine
    extra = 1


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ("po_number", "supplier", "warehouse", "status", "date", "created_by")
    list_filter = ("status", "supplier", "warehouse")
    search_fields = ("po_number",)
    inlines = [PurchaseOrderLineInline]
    readonly_fields = ("po_number", "created_by", "approved_by", "received_by")
