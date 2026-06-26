"""
warehouses/admin.py
"""

from django.contrib import admin

from .models import Warehouse


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "capacity", "manager")
    search_fields = ("name", "location")
    list_filter = ("manager",)
